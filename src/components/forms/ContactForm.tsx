"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { parseApiError } from "@/services/api/errors";
import { listContactSubjects, submitContactQuery } from "@/services/contact-query";
import { queryKeys } from "@/services/queries";
import { contactFormSchema, type ContactFormValues } from "@/validations";

export default function ContactForm() {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const { data: subjects = [] } = useQuery({
    queryKey: queryKeys.contactQueries.subjects,
    queryFn: listContactSubjects,
  });

  const submitMutation = useMutation({
    mutationFn: submitContactQuery,
    onSuccess: () => {
      toast.success("Message sent", {
        description: "Our team will respond within one business day.",
      });
      setIsSubmitSuccessful(true);
      form.reset();
    },
    onError: (error) => {
      toast.error(parseApiError(error, "Could not send message"));
    },
  });

  function onSubmit(values: ContactFormValues) {
    submitMutation.mutate(values);
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
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Subject</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full h-10 rounded-md border border-input bg-gray-50 px-3 text-sm text-gray-900 focus:bg-white transition-colors"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
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
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
