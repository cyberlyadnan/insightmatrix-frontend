"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { contactFormSchema, type ContactFormValues } from "@/validations";

export default function ContactForm() {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: ContactFormValues) {
    // Replace with mutation hook when `/contact` API exists
    console.log(values);
    setTimeout(() => {
      toast.success("Message sent", {
        description: "Our team will respond within one business day.",
      });
      setIsSubmitSuccessful(true);
      form.reset();
    }, 600);
  }

  if (isSubmitSuccessful) {
    return (
      <div className="bg-green-50 rounded-xl p-8 border border-green-100 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
        <p className="text-gray-600 mb-6">
          We have received your inquiry and our team will contact you within 24 business hours.
        </p>
        <Button variant="outline" onClick={() => setIsSubmitSuccessful(false)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    className="bg-gray-50 focus:bg-white transition-colors"
                  />
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
                <FormLabel className="text-gray-700">Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@company.com"
                    {...field}
                    className="bg-gray-50 focus:bg-white transition-colors"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">How can we help?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your project, panel requirements, or integration needs..."
                    className="min-h-[150px] bg-gray-50 focus:bg-white transition-colors resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-6 transition-all"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
