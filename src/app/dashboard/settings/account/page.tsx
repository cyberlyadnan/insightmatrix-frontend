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
  Loader2,
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
import { optimizeAvatarImage } from "@/lib/optimize-avatar-image";
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
    <div className="space-y-6">
      <div>
        <Link
          href={ROUTES.dashboard.settings}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-primary transition-colors mb-2"
        >
          <ArrowLeft size={14} />
          <span>Back to Settings</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          Edit Account Information
        </h1>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          Update your public profile name, contact email, and avatar photo.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 p-5 sm:p-7 shadow-2xs">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-gray-700">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="Your full name"
                          className="pl-9 h-10 text-xs rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20"
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
                    <FormLabel className="text-xs font-bold text-gray-700">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="name@example.com"
                          className="pl-9 h-10 text-xs rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20"
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
                    <FormLabel className="text-xs font-bold text-gray-700">
                      Avatar Image URL
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="https://example.com/avatar.png"
                          className="pl-9 h-10 text-xs rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Upload Drop Box */}
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/70 p-4 space-y-2">
                <div>
                  <p className="text-xs font-bold text-gray-800">Upload profile image directly</p>
                  <p className="text-[11px] text-gray-400">
                    Image is automatically optimized in browser (max 512px) before cloud upload.
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:text-brand-primary cursor-pointer transition-colors shadow-2xs">
                    <UploadCloud size={14} />
                    <span>{avatarUploadMutation.isPending ? "Uploading..." : "Select File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onAvatarFileChange}
                      disabled={avatarUploadMutation.isPending}
                    />
                  </label>
                  {selectedFileName ? (
                    <span className="text-xs text-gray-500 font-medium truncate">
                      {selectedFileName}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={
                    updateMutation.isPending ||
                    avatarUploadMutation.isPending ||
                    !form.formState.isDirty
                  }
                  className="h-10 px-5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save size={13} className="mr-1.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Right Column: Live Avatar Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center shadow-2xs h-fit space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-brand-subtle flex items-center justify-center text-brand-primary font-black text-xl border border-brand-primary/20 shadow-xs overflow-hidden">
            {avatarPreview ? (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url("${avatarPreview}")` }}
                aria-label="Preview avatar"
                role="img"
              />
            ) : (
              user?.fullName?.charAt(0).toUpperCase() || "M"
            )}
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900">
              {form.watch("fullName") || "Member Name"}
            </h3>
            <p className="text-[11px] text-gray-400 font-medium">
              {form.watch("email") || "member@example.com"}
            </p>
          </div>
          <div className="w-full pt-3 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
            Live preview of your profile identity across the panel.
          </div>
        </div>
      </div>
    </div>
  );
}
