"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, CheckCircle2, Download, Globe2, Loader2, Shield, Sparkles } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { PANEL_BOOK_ORG_LABELS, PANEL_BOOK_ORG_TYPES } from "@/constants/panel-book";
import { getCountrySelectOptions } from "@/lib/country-options";
import { parseApiError } from "@/services/api/errors";
import { downloadPanelBookPdf, submitPanelBookLead } from "@/services/panel-book-api";
import {
  panelBookLeadFormSchema,
  type PanelBookLeadFormValues,
} from "@/validations/panel-book-lead.schema";

const countryOptions = getCountrySelectOptions();

const selectClassName =
  "flex h-11 w-full min-w-0 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

export default function PanelBookPage() {
  const [step, setStep] = useState<"form" | "done">("form");
  const [downloadAvailable, setDownloadAvailable] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const form = useForm<PanelBookLeadFormValues>({
    resolver: zodResolver(panelBookLeadFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      workEmail: "",
      companyName: "",
      organizationType: "media_publisher",
      jobTitle: "",
      country: "",
      acceptedTerms: false,
    },
  });

  async function onSubmit(values: PanelBookLeadFormValues) {
    try {
      const res = await submitPanelBookLead({
        ...values,
        country: values.country.toUpperCase(),
        acceptedTerms: true,
      });
      setDownloadAvailable(res.downloadAvailable);
      setStep("done");
      toast.success("Thank you. You can download the Panel Book below.");
    } catch (e) {
      toast.error(parseApiError(e, "Something went wrong. Please try again."));
    }
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadPanelBookPdf();
    } catch (e) {
      toast.error(parseApiError(e, "Download failed. The file may not be available yet."));
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-w-0 bg-white text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200/80">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-20%,rgba(59,130,246,0.12),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-brand-primary/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl sm:h-80 sm:w-80"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-2xl lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-700 shadow-sm backdrop-blur-sm sm:text-xs">
              <BookOpen className="h-4 w-4 text-brand-primary" aria-hidden />
              Resource
            </div>
            <h1 className="mt-6 text-[2rem] font-black leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Panel Book — reach, profiling &amp; quality
            </h1>
            <p className="mt-5 text-base font-medium leading-relaxed text-gray-600 sm:text-lg lg:text-xl">
              Download our overview of how InsightMatrix connects verified people with
              research—method notes, coverage, and the safeguards that keep your data
              decision-ready.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start">
              {[
                { icon: Globe2, label: "Global coverage" },
                { icon: Shield, label: "Privacy-first" },
                { icon: Sparkles, label: "Quality at scale" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-2xl border border-gray-200/80 bg-white/90 px-4 py-2 text-xs font-bold text-gray-700 shadow-sm backdrop-blur-sm sm:text-sm"
                >
                  <Icon className="h-4 w-4 shrink-0 text-brand-primary" aria-hidden />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content + form */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid min-w-0 grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16">
          {/* Left column — story */}
          <div className="min-w-0 lg:col-span-5">
            <div className="relative overflow-hidden rounded-[2rem] border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm sm:p-10">
              <div
                className="absolute right-0 top-0 h-32 w-32 translate-x-1/3 -translate-y-1/3 rounded-full bg-brand-primary/5 blur-2xl"
                aria-hidden
              />
              <h2 className="relative text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                Built for teams who need confident sample
              </h2>
              <p className="relative mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                Whether you run trackers, concept tests, or niche audience work, the Panel Book
                walks through how we recruit, verify, and support fieldwork—so stakeholders see the
                same picture you do.
              </p>
              <ul className="relative mt-8 space-y-4">
                {[
                  "How we think about representivity and feasibility",
                  "Profiling dimensions and sample design guardrails",
                  "Participant experience, incentives, and compliance",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex gap-3 text-sm font-semibold leading-snug text-gray-800 sm:text-base"
                  >
                    <span
                      className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-brand-primary"
                      aria-hidden
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form / success card */}
          <div className="min-w-0 lg:col-span-7">
            <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.15)] sm:p-8 lg:p-10">
              <div
                className="absolute -right-px -top-px h-28 w-28 rounded-bl-[2rem] bg-gradient-to-bl from-brand-primary/10 to-transparent sm:h-36 sm:w-36"
                aria-hidden
              />

              {step === "form" ? (
                <>
                  <div className="relative">
                    <h3 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                      Get your copy today
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base">
                      Tell us a bit about you—we&apos;ll keep this for follow-up and analytics.
                      Fields marked * are required.
                    </p>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="relative mt-8">
                      <div className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-6 lg:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem className="min-w-0 space-y-2">
                              <FormLabel className="text-xs font-black uppercase tracking-wider text-gray-500">
                                First name *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-11 min-w-0 rounded-xl border-gray-200 shadow-sm"
                                  autoComplete="given-name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem className="min-w-0 space-y-2">
                              <FormLabel className="text-xs font-black uppercase tracking-wider text-gray-500">
                                Last name *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-11 min-w-0 rounded-xl border-gray-200 shadow-sm"
                                  autoComplete="family-name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="workEmail"
                          render={({ field }) => (
                            <FormItem className="min-w-0 space-y-2">
                              <FormLabel className="text-xs font-black uppercase tracking-wider text-gray-500">
                                Work email *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  className="h-11 min-w-0 rounded-xl border-gray-200 shadow-sm"
                                  autoComplete="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem className="min-w-0 space-y-2">
                              <FormLabel className="text-xs font-black uppercase tracking-wider text-gray-500">
                                Company name *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-11 min-w-0 rounded-xl border-gray-200 shadow-sm"
                                  autoComplete="organization"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="organizationType"
                          render={({ field }) => (
                            <FormItem className="min-w-0 space-y-2">
                              <FormLabel className="text-xs font-black uppercase tracking-wider text-gray-500">
                                Organization type *
                              </FormLabel>
                              <FormControl>
                                <select className={selectClassName} {...field}>
                                  {PANEL_BOOK_ORG_TYPES.map((v) => (
                                    <option key={v} value={v}>
                                      {PANEL_BOOK_ORG_LABELS[v]}
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
                          name="jobTitle"
                          render={({ field }) => (
                            <FormItem className="min-w-0 space-y-2">
                              <FormLabel className="text-xs font-black uppercase tracking-wider text-gray-500">
                                Job title *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-11 min-w-0 rounded-xl border-gray-200 shadow-sm"
                                  autoComplete="organization-title"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem className="min-w-0 space-y-2">
                              <FormLabel className="text-xs font-black uppercase tracking-wider text-gray-500">
                                Country / region *
                              </FormLabel>
                              <FormControl>
                                <select
                                  className={selectClassName}
                                  value={field.value}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  onBlur={field.onBlur}
                                >
                                  <option value="">Select country…</option>
                                  {countryOptions.map((c) => (
                                    <option key={c.value} value={c.value}>
                                      {c.label}
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
                          name="acceptedTerms"
                          render={({ field }) => (
                            <FormItem className="min-w-0 space-y-2 lg:col-span-2">
                              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50/90 p-4 sm:gap-4 sm:p-5">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-brand-primary focus:ring-2 focus:ring-brand-primary/25 focus:ring-offset-0"
                                    checked={field.value === true}
                                    onChange={(e) =>
                                      field.onChange(e.target.checked ? true : false)
                                    }
                                  />
                                </FormControl>
                                <div className="min-w-0">
                                  <FormLabel className="!block w-full min-w-0 cursor-pointer text-left text-sm font-normal !leading-relaxed text-gray-800 sm:text-[15px]">
                                    <span className="inline">
                                      I have read and agree to InsightMatrix&apos;s{" "}
                                    </span>
                                    <Link
                                      href={ROUTES.terms}
                                      className="inline whitespace-nowrap font-bold text-brand-primary underline decoration-2 underline-offset-2 hover:text-brand-hover"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Terms of Service
                                    </Link>
                                    <span className="inline"> and </span>
                                    <Link
                                      href={ROUTES.privacy}
                                      className="inline whitespace-nowrap font-bold text-brand-primary underline decoration-2 underline-offset-2 hover:text-brand-hover"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Privacy Policy
                                    </Link>
                                    <span className="inline">
                                      .{" "}
                                      <span className="whitespace-nowrap text-brand-primary">
                                        *
                                      </span>
                                    </span>
                                  </FormLabel>
                                  <FormMessage className="mt-2" />
                                </div>
                              </div>
                            </FormItem>
                          )}
                        />
                        <div className="min-w-0 pt-2 lg:col-span-2">
                          <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className={cn(
                              "h-12 w-full rounded-xl bg-gray-900 text-base font-black uppercase tracking-wider text-white shadow-lg shadow-gray-900/15 transition hover:bg-black sm:text-sm lg:max-w-xs"
                            )}
                          >
                            {form.formState.isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting…
                              </>
                            ) : (
                              "Request Panel Book"
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </Form>
                </>
              ) : (
                <div className="relative text-center sm:text-left">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 sm:mx-0">
                    <CheckCircle2 className="h-9 w-9" aria-hidden />
                  </div>
                  <h3 className="mt-6 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                    You&apos;re all set
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
                    Thanks for your details. When the file is ready, use the button below to
                    download the Panel Book. If it&apos;s not live yet, we&apos;ll follow up at your
                    work email.
                  </p>
                  {downloadAvailable ? (
                    <Button
                      type="button"
                      onClick={handleDownload}
                      disabled={downloading}
                      className="mt-8 h-12 w-full rounded-xl bg-brand-primary px-8 text-base font-black uppercase tracking-wider text-white shadow-lg shadow-brand-primary/25 transition hover:bg-brand-hover sm:w-auto sm:min-w-[280px]"
                    >
                      {downloading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Download className="mr-2 h-5 w-5" />
                          Download Panel Book (PDF)
                        </>
                      )}
                    </Button>
                  ) : (
                    <p className="mt-8 rounded-2xl border border-amber-100 bg-amber-50/90 px-4 py-4 text-left text-sm font-medium leading-relaxed text-amber-950 sm:px-5">
                      The PDF is being prepared on our side. We&apos;ll email you at the work
                      address you provided as soon as it&apos;s available.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
