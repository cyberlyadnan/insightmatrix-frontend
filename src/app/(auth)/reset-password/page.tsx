"use client";

import { Suspense, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { parseApiError } from "@/services/api/errors";
import { resetPasswordRequest } from "@/services/auth";

const resetSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetMutation = useMutation({
    mutationFn: (password: string) => resetPasswordRequest({ token, password }),
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("Password updated");
    },
    onError: (err) => {
      toast.error(parseApiError(err, "Could not reset password"));
    },
  });

  function onSubmit(values: z.infer<typeof resetSchema>) {
    if (!token) {
      toast.error("Missing reset token. Open the link from your email.");
      return;
    }
    resetMutation.mutate(values.password);
  }

  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl shadow-black/5 border border-gray-100 text-center space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-900">Invalid reset link</h1>
        <p className="text-gray-500">
          Use the reset link from your email, or request a new one from the forgot password page.
        </p>
        <Link
          href="/forgot-password"
          className={cn(buttonVariants({ variant: "default" }), "inline-flex h-12 px-8 rounded-xl")}
        >
          Forgot password
        </Link>
      </motion.div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl shadow-black/5 border border-gray-100 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful</h1>
        <p className="text-gray-500 mb-8">
          Your password has been updated. You can now log in with your new password.
        </p>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full h-12 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold flex items-center justify-center"
          )}
        >
          Go to Login
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-3xl shadow-xl shadow-black/5 border border-gray-100"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Set New Password</h1>
        <p className="text-gray-500">Choose a strong, unique password for your account.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-11 pr-11 h-12 rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 transition-all font-medium"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
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
                <FormLabel className="text-gray-700 font-semibold">Confirm New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-11 h-12 rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 transition-all font-medium"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold text-lg shadow-lg shadow-brand-primary/20 transition-all active:scale-[0.98]"
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                Update Password <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
