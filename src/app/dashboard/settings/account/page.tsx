"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Save,
  UploadCloud,
  User,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { parseApiError } from "@/services/api/errors";
import { updateProfileRequest, uploadAvatarRequest } from "@/services/auth";
import { queryKeys } from "@/services/queries";
import { useAuthStore } from "@/store/authStore";

const accountSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  avatar: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || z.string().url().safeParse(value).success,
      "Avatar must be a valid URL."
    ),
});

type AccountFormValues = z.infer<typeof accountSchema>;

async function optimizeAvatarImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const maxSide = 512;
  const scale = Math.min(maxSide / bitmap.width, maxSide / bitmap.height, 1);
  const targetWidth = Math.max(1, Math.round(bitmap.width * scale));
  const targetHeight = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not optimize image");

  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", 0.82);
  });
  bitmap.close();

  if (!blob) throw new Error("Could not process image");
  const name = file.name.replace(/\.[^.]+$/, "") || "avatar";
  return new File([blob], `${name}.webp`, { type: "image/webp" });
}

export default function EditAccountInfoPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      avatar: user?.avatar ?? "",
    },
  });

  const watchedAvatar = useWatch({ control: form.control, name: "avatar" });
  const avatarPreview = watchedAvatar?.trim() || user?.avatar || "";

  useEffect(() => {
    form.reset({
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      avatar: user?.avatar ?? "",
    });
  }, [user, form]);

  const updateMutation = useMutation({
    mutationFn: updateProfileRequest,
    onSuccess: async (updated) => {
      setUser(updated);
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      toast.success("Account information updated.");
    },
    onError: (error) => {
      toast.error(parseApiError(error, "Could not update account information."));
    },
  });

  const avatarUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const optimized = await optimizeAvatarImage(file);
      return uploadAvatarRequest(optimized);
    },
    onSuccess: async (updated) => {
      setUser(updated);
      form.setValue("avatar", updated.avatar ?? "", { shouldDirty: true });
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      toast.success("Avatar uploaded successfully.");
    },
    onError: (error) => {
      toast.error(parseApiError(error, "Could not upload avatar."));
    },
  });

  function onSubmit(values: AccountFormValues) {
    updateMutation.mutate({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      avatar: values.avatar?.trim() ? values.avatar.trim() : null,
    });
  }

  async function onAvatarFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setSelectedFileName(file.name);
    avatarUploadMutation.mutate(file);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            href={ROUTES.dashboard.settings}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-primary transition-colors mb-3"
          >
            <ArrowLeft size={16} />
            Back to Settings
          </Link>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Edit Account Information
          </h1>
          <p className="text-gray-500 font-medium">Update all profile fields you can control.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="John Doe"
                          className="pl-11 h-12 rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="name@example.com"
                          className="pl-11 h-12 rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-gray-700">Avatar URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="https://example.com/avatar.png"
                          className="pl-11 h-12 rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20"
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-gray-500 font-medium">
                      Leave empty to remove your avatar.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 p-5">
                <p className="text-sm font-bold text-gray-700 mb-1">Upload avatar image</p>
                <p className="text-xs text-gray-500 mb-4">
                  Image is optimized in your browser (max 512px, compressed) before upload.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:text-brand-primary cursor-pointer transition-colors">
                  <UploadCloud size={16} />
                  {avatarUploadMutation.isPending ? "Optimizing and uploading..." : "Choose Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onAvatarFileChange}
                    disabled={avatarUploadMutation.isPending}
                  />
                </label>
                {selectedFileName ? (
                  <p className="text-xs text-gray-500 mt-3">Selected: {selectedFileName}</p>
                ) : null}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={
                    updateMutation.isPending ||
                    avatarUploadMutation.isPending ||
                    !form.formState.isDirty
                  }
                  className="h-12 px-6 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold"
                >
                  {updateMutation.isPending ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Save size={16} />
                      Save Changes
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
            <h3 className="font-black text-gray-900 mb-4">Avatar Preview</h3>
            {avatarPreview ? (
              <div
                className="w-24 h-24 rounded-2xl border border-gray-200 bg-cover bg-center"
                style={{ backgroundImage: `url("${avatarPreview}")` }}
                aria-label="Avatar preview"
                role="img"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                <User size={28} />
              </div>
            )}
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
            <h3 className="font-black text-gray-900 mb-4">Current Account Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 font-semibold">Role</span>
                <span className="font-black text-gray-900">{user?.role ?? "user"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 font-semibold">Status</span>
                <span className="font-black text-gray-900">{user?.status ?? "active"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500 font-semibold">Email verified</span>
                <span className="font-black text-gray-900">{user?.isVerified ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6">
            <div className="inline-flex w-10 h-10 items-center justify-center rounded-xl bg-white text-emerald-600 mb-3">
              <CheckCircle2 size={18} />
            </div>
            <h4 className="font-black text-emerald-700 mb-1">Everything editable is here</h4>
            <p className="text-sm text-emerald-600 font-medium">
              You can update your name, email, and avatar from this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
