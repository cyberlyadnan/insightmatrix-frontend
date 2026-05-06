"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
import { getPostLoginDestination } from "@/lib/auth/redirect";
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
        setUser(hydrated);
        toast.success("Account ready");
        router.replace(getPostLoginDestination(hydrated, null));
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-3xl shadow-xl shadow-black/5 border border-gray-100"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-500">Join our community of creators today</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="John Doe"
                      className="pl-11 h-12 rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 transition-all font-medium"
                      {...field}
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
                <FormLabel className="text-gray-700 font-semibold">Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="name@example.com"
                      className="pl-11 h-12 rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 transition-all font-medium"
                      {...field}
                    />
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
                <FormLabel className="text-gray-700 font-semibold">Password</FormLabel>
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
                <div className="flex items-center gap-2 mt-1">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <p className="text-[10px] text-gray-500 font-bold">Encrypted and secure</p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold">Confirm Password</FormLabel>
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

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold text-lg shadow-lg shadow-brand-primary/20 transition-all active:scale-[0.98]"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Sign Up <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-6 pt-6 border-t border-gray-100 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-brand-primary hover:text-brand-hover transition-colors"
          >
            Log in here
          </Link>
        </p>
      </div>

      <p className="mt-6 text-[11px] text-center text-gray-400 px-4">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="underline font-bold">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline font-bold">
          Privacy Policy
        </Link>
        .
      </p>
    </motion.div>
  );
}
