"use client";

import { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Store } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
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
import { getPostLoginDestination } from "@/lib/auth/redirect";
import { completeMemberLogin } from "@/lib/auth/complete-login";
import { parseApiError } from "@/services/api/errors";
import { loginRequest } from "@/services/auth";
import { queryKeys } from "@/services/queries";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const fieldClass =
  "pl-10 h-10 rounded-lg border-gray-200 bg-white text-sm focus:border-brand-primary focus:ring-brand-primary/15 transition-all";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (searchParams.get("verified") === "1") {
      toast.success("Email verified. You can sign in.");
    }
    if (searchParams.get("verifyError") === "1") {
      toast.error("Verification link is invalid or expired.");
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: async (user) => {
      const redirect = searchParams.get("redirect");
      try {
        await completeMemberLogin(qc, setUser, user, getPostLoginDestination(user, redirect));
        toast.success("Welcome back");
      } catch (err) {
        useAuthStore.getState().clearSession();
        qc.setQueryData(queryKeys.auth.profile, null);
        toast.error(
          parseApiError(
            err,
            "Signed in, but the session cookie was not saved. Restart the Next.js app so BACKEND_URL points at your local API."
          )
        );
      }
    },
    onError: (err) => {
      toast.error(parseApiError(err, "Could not sign in"));
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(values);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white px-6 py-7 sm:px-7 rounded-2xl shadow-sm border border-gray-100/90"
    >
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Sign in</h1>
        <p className="text-sm text-gray-500 mt-1">Access your InsightMatrix account</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-gray-600">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="name@company.com" className={fieldClass} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-semibold text-gray-600">Password</FormLabel>
                  <Link
                    href={ROUTES.forgotPassword}
                    className="text-xs font-semibold text-brand-primary hover:text-brand-hover transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
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

          <Button
            type="submit"
            className="w-full h-10 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-sm font-semibold shadow-sm shadow-brand-primary/20 transition-all active:scale-[0.99]"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Sign in <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">
        <Link
          href={ROUTES.vendor.login}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-800 transition hover:border-brand-primary/40 hover:bg-brand-subtle/40"
        >
          <Store className="h-3.5 w-3.5 text-brand-primary" />
          Vendor partner login
        </Link>
        <p className="text-center text-xs text-gray-500">
          New here?{" "}
          <Link
            href={ROUTES.register}
            className="font-semibold text-brand-primary hover:text-brand-hover transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white px-6 py-12 rounded-2xl shadow-sm border border-gray-100 flex justify-center">
          <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
