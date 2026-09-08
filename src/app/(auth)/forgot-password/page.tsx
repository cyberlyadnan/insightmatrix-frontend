"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
import { forgotPasswordRequest } from "@/services/auth";

const forgotSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotMutation = useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (err) => {
      toast.error(parseApiError(err, "Could not send reset email"));
    },
  });

  function onSubmit(values: z.infer<typeof forgotSchema>) {
    forgotMutation.mutate(values.email);
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white px-6 py-7 sm:px-7 rounded-2xl shadow-sm border border-gray-100/90 text-center"
      >
        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-1.5">Check your email</h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          If an account exists for{" "}
          <span className="font-semibold text-gray-800">{form.getValues("email")}</span>, you will
          receive reset instructions shortly.
        </p>
        <Link
          href={ROUTES.login}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full h-10 rounded-lg border-gray-200 text-sm font-semibold hover:bg-gray-50 flex items-center justify-center"
          )}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to sign in
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
        <Link
          href={ROUTES.login}
          className="inline-flex items-center text-xs font-semibold text-gray-400 hover:text-brand-primary transition-colors mb-3"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-0.5" /> Back to sign in
        </Link>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Reset password</h1>
        <p className="text-sm text-gray-500 mt-1">We&apos;ll email you a secure reset link.</p>
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
            disabled={forgotMutation.isPending}
          >
            {forgotMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Send reset link <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
