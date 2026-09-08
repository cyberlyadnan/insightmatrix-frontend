"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getPostLoginDestination } from "@/lib/auth/redirect";
import { completeMemberLogin } from "@/lib/auth/complete-login";
import { parseApiError } from "@/services/api/errors";
import { fetchProfileOptional, registerRequest } from "@/services/auth";
import { queryKeys } from "@/services/queries";
import { useAuthStore } from "@/store/authStore";

const registerSchema = z
  .object({
    fullName: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.auth.profile });
      const hydrated = await fetchProfileOptional();
      if (hydrated) {
        try {
          await completeMemberLogin(qc, setUser, hydrated, getPostLoginDestination(hydrated, null));
          toast.success("Account ready");
        } catch (err) {
          useAuthStore.getState().clearSession();
          toast.error(
            parseApiError(
              err,
              "Account created, but the session cookie was not saved. Restart the Next.js app so BACKEND_URL points at your local API."
            )
          );
          router.replace("/login");
        }
      } else {
        toast.success("Check your email to verify your account, then sign in.");
        router.replace("/login");
      }
    },
    onError: (err) => {
      toast.error(parseApiError(err, "Could not register"));
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    registerMutation.mutate({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white px-6 py-7 sm:px-7 rounded-2xl shadow-sm border border-gray-100/90"
    >
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Create account</h1>
        <p className="text-sm text-gray-500 mt-1">Join the InsightMatrix panel</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-gray-600">Full name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Jane Doe" className={fieldClass} {...field} />
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
                <FormLabel className="text-xs font-semibold text-gray-600">Password</FormLabel>
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
            className="w-full h-10 rounded-lg bg-brand-primary hover:bg-brand-hover text-white text-sm font-semibold shadow-sm shadow-brand-primary/20 transition-all active:scale-[0.99] mt-1"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Create account <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-5 pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500">
          Already have an account?{" "}
          <Link
            href={ROUTES.login}
            className="font-semibold text-brand-primary hover:text-brand-hover transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>

      <p className="mt-4 text-[10px] text-center text-gray-400 leading-relaxed px-1">
        By continuing you agree to our{" "}
        <Link
          href={ROUTES.terms}
          className="underline font-medium text-gray-500 hover:text-gray-700"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href={ROUTES.privacy}
          className="underline font-medium text-gray-500 hover:text-gray-700"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </motion.div>
  );
}
