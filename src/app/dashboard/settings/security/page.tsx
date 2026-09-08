"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import {
  ArrowLeft,
  KeyRound,
  Mail,
  Shield,
  ShieldCheck,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

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
import { changePasswordRequest, forgotPasswordRequest } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function SecuritySettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [forgotEmail, setForgotEmail] = useState(user?.email ?? "");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePasswordRequest,
    onSuccess: () => {
      form.reset();
      toast.success("Password updated successfully.");
    },
    onError: (error) => toast.error(parseApiError(error, "Could not update password.")),
  });

  const forgotMutation = useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: () => toast.success("If this email exists, reset instructions were sent."),
    onError: (error) => toast.error(parseApiError(error, "Could not start forgot-password flow.")),
  });

  function onSubmit(values: FormValues) {
    changePasswordMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
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
          Security & Authentication
        </h1>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          Update your account password or initiate secure recovery.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Update Password Form */}
        <div className="lg:col-span-7 rounded-2xl border border-gray-100 bg-white p-5 sm:p-7 space-y-5 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center font-bold">
              <KeyRound size={17} />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900">Change Password</h3>
              <p className="text-[11px] text-gray-500 font-medium">
                Set a strong password containing at least 8 characters.
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-gray-700">
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter current password"
                        className="h-10 text-xs rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-gray-700">New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password (min. 8 chars)"
                        className="h-10 text-xs rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-gray-700">
                      Confirm New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your new password"
                        className="h-10 text-xs rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="h-10 px-5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  {changePasswordMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Forgot Password Recovery Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 space-y-3.5 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Mail size={16} />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-900">Reset Link Recovery</h3>
                <p className="text-[10px] text-gray-500 font-medium">Send password reset email</p>
              </div>
            </div>

            <Input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="name@example.com"
              className="h-10 text-xs rounded-xl border-gray-200"
            />

            <Button
              type="button"
              variant="outline"
              className="h-9 px-4 w-full border-gray-200 bg-gray-50 hover:bg-white text-gray-800 text-xs font-bold rounded-xl transition-all shadow-2xs"
              disabled={forgotMutation.isPending || !forgotEmail.trim()}
              onClick={() => forgotMutation.mutate(forgotEmail.trim())}
            >
              {forgotMutation.isPending ? "Sending Link..." : "Send Reset Email"}
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#081225] p-5 text-white shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-xs">
              <ShieldCheck size={16} />
              <span>Encrypted Session Guard</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
              Your panel account credentials and prescreen responses are encrypted using enterprise
              TLS and salted hashing standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
