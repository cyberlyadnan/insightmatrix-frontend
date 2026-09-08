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
import { ROUTES } from "@/constants/routes";
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

const fieldClass =
  "pl-10 h-10 rounded-lg border-gray-200 bg-white text-sm focus:border-brand-primary focus:ring-brand-primary/15 transition-all";

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
        className="bg-white px-6 py-7 sm:px-7 rounded-2xl shadow-sm border border-gray-100/90 text-center space-y-4"
      >
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Invalid reset link</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Use the reset link from your email, or request a new one.
        </p>
        <Link
          href={ROUTES.forgotPassword}
          className={cn(
            buttonVariants({ variant: "default" }),
            "inline-flex h-10 px-6 rounded-lg bg-brand-primary hover:bg-brand-hover text-sm font-semibold"
          )}
        >
          Forgot password
        </Link>
      </motion.div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white px-6 py-7 sm:px-7 rounded-2xl shadow-sm border border-gray-100/90 text-center"
      >
        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1.5">Password updated</h1>
        <p className="text-sm text-gray-500 mb-6">You can now sign in with your new password.</p>
        <Link
          href={ROUTES.login}
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full h-10 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-sm font-semibold flex items-center justify-center"
          )}
        >
          Go to sign in
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white px-6 py-7 sm:px-7 rounded-2xl shadow-sm border border-gray-100/90"
    >
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Set new password</h1>
        <p className="text-sm text-gray-500 mt-1">Choose a strong password for your account.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-gray-600">New password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      className={`${fieldClass} pr-10`}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                <FormLabel className="text-xs font-semibold text-gray-600">
                  Confirm password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Repeat password"
                      className={fieldClass}
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
            className="w-full h-10 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-sm font-semibold shadow-sm shadow-brand-primary/20 transition-all active:scale-[0.99]"
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Update password <ArrowRight className="w-4 h-4" />
              </span>
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
        <div className="bg-white px-6 py-12 rounded-2xl shadow-sm border border-gray-100 flex justify-center">
          <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
