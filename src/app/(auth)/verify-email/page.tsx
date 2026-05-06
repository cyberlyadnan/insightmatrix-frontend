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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-3xl shadow-xl shadow-black/5 border border-gray-100"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify your email</h1>
        <p className="text-gray-500">
          Open the verification link we sent you. It redirects back to sign-in when successful.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold text-lg shadow-lg shadow-brand-primary/20 transition-all active:scale-[0.98]"
            disabled={resendMutation.isPending}
          >
            {resendMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Resend verification email <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Already verified?{" "}
        <Link href="/login" className="font-bold text-brand-primary hover:text-brand-hover">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
