"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, Mail, Store } from "lucide-react";
import { toast } from "sonner";

import { ImxLogo } from "@/components/brand";
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
import {
  vendorFormLabelClass,
  vendorInputClass,
  vendorPrimaryButtonClass,
} from "@/constants/vendor-ui";
import { parseApiError } from "@/services/api/errors";
import { vendorLoginRequest } from "@/services/vendor-auth";
import { queryKeys } from "@/services/queries";
import { useVendorAuthStore } from "@/store/vendorAuthStore";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function VendorLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const qc = useQueryClient();
  const setVendor = useVendorAuthStore((s) => s.setVendor);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: vendorLoginRequest,
    onSuccess: async (vendor) => {
      setVendor(vendor);
      await qc.invalidateQueries({ queryKey: queryKeys.vendorAuth.profile });
      toast.success("Welcome back");
      const redirect = searchParams.get("redirect");
      const dest =
        redirect && redirect.startsWith("/vendor") && !redirect.startsWith(ROUTES.vendor.login)
          ? redirect
          : ROUTES.vendor.dashboard;
      router.replace(dest);
    },
    onError: (err) => toast.error(parseApiError(err, "Could not sign in")),
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-brand-subtle via-white to-slate-50">
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-white p-8 shadow-xl shadow-brand-primary/5 md:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <ImxLogo href={ROUTES.home} size="lg" surface="light" />
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-subtle px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-primary">
            <Store className="h-3.5 w-3.5" />
            Vendor portal
          </span>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-brand-accent1">
            Partner sign in
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            B2B subpanel access — separate from panel member accounts
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) =>
              loginMutation.mutate({
                email: v.email.trim().toLowerCase(),
                password: v.password.trim(),
              })
            )}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={vendorFormLabelClass}>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        className={`pl-10 ${vendorInputClass}`}
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
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
                  <FormLabel className={vendorFormLabelClass}>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        className={`pl-10 pr-10 ${vendorInputClass}`}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className={`w-full ${vendorPrimaryButtonClass}`}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Panel members use{" "}
          <Link href={ROUTES.login} className="font-semibold text-brand-primary hover:underline">
            member login
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default function VendorLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <VendorLoginForm />
    </Suspense>
  );
}
