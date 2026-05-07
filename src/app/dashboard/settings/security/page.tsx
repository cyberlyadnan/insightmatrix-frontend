"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { ArrowLeft, KeyRound, Mail, Shield } from "lucide-react";
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
    <div className="space-y-8">
      <div>
        <Link
          href={ROUTES.dashboard.settings}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-primary transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Back to Settings
        </Link>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Security & Privacy</h1>
        <p className="text-gray-500 font-medium">
          Update your password or trigger forgot-password flow.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-subtle text-brand-primary flex items-center justify-center">
              <KeyRound size={20} />
            </div>
            <div>
              <h3 className="font-black text-gray-900">Update Password</h3>
              <p className="text-xs text-gray-500">
                Change password directly from this settings tab.
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
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Current password" {...field} />
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
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="New password" {...field} />
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
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="rounded-xl"
              >
                {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-black text-gray-900">Forgot Password</h3>
                <p className="text-xs text-gray-500">Send password reset instructions to email.</p>
              </div>
            </div>
            <Input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="name@example.com"
            />
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={forgotMutation.isPending || !forgotEmail.trim()}
              onClick={() => forgotMutation.mutate(forgotEmail.trim())}
            >
              {forgotMutation.isPending ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-6">
            <div className="inline-flex w-10 h-10 items-center justify-center rounded-xl bg-white text-indigo-600 mb-3">
              <Shield size={18} />
            </div>
            <h4 className="font-black text-indigo-700 mb-1">Secure flow enabled</h4>
            <p className="text-sm text-indigo-600 font-medium">
              You can now update password here, or run forgot-password without leaving settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
