"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
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
import { resendVerificationRequest } from "@/services/auth";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function VerifyEmailPage() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const resendMutation = useMutation({
    mutationFn: resendVerificationRequest,
    onSuccess: () => {
      toast.success("If this account exists and is unverified, a new email was sent.");
    },
    onError: (err) => {
      toast.error(parseApiError(err, "Could not resend verification"));
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    resendMutation.mutate(values.email);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white px-6 py-7 sm:px-7 rounded-2xl shadow-sm border border-gray-100/90"
    >
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Verify your email</h1>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          Open the link we sent you, or request a new verification email below.
        </p>
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
                    <Input
                      placeholder="name@company.com"
                      className="pl-10 h-10 rounded-lg border-gray-200 bg-white text-sm focus:border-brand-primary focus:ring-brand-primary/15 transition-all"
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
            disabled={resendMutation.isPending}
          >
            {resendMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Resend verification <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-5 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
        Already verified?{" "}
        <Link
          href={ROUTES.login}
          className="font-semibold text-brand-primary hover:text-brand-hover"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
