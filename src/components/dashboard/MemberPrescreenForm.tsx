"use client";

import { useMemo, useState } from "react";
import { Loader2, Lock, CheckCircle2, ShieldCheck, ArrowRight, Globe } from "lucide-react";
import Link from "next/link";

import { CountrySearchSelect } from "@/components/dashboard/country-search-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PANEL_COUNTRY_OPTIONS } from "@/constants/panel-targeting-options";
import { COUNTRY_ISO_BY_NAME } from "@/constants/country-iso-codes";
import { ROUTES } from "@/constants/routes";
import type { PrescreenForm, PrescreenQuestion } from "@/types/prescreen";

type Props = {
  form: PrescreenForm;
  initialAnswers?: Record<string, unknown> | null;
  readOnly?: boolean;
  onSubmit: (answers: Record<string, unknown>) => Promise<void>;
  isSubmitting: boolean;
};

function sortedQuestions(form: PrescreenForm): PrescreenQuestion[] {
  return [...(form.questions ?? [])].sort((a, b) => a.order - b.order);
}

function isCountryQuestion(q: PrescreenQuestion): boolean {
  const id = (q.id || "").toLowerCase();
  const title = (q.title || "").toLowerCase();
  const desc = (q.description || "").toLowerCase();
  const helper = (q.helperText || "").toLowerCase();
  return (
    id.includes("country") ||
    title.includes("country") ||
    title.includes("residence") ||
    desc.includes("iso code") ||
    helper.includes("iso code") ||
    /country/i.test(title) ||
    /residence/i.test(title)
  );
}

function normalizeCountryCode(val: unknown): string {
  if (typeof val !== "string" || !val.trim()) return "";
  const raw = val.trim();
  const upper = raw.toUpperCase();
  if (upper === "UK" || upper === "GBR") return "GB";
  if (COUNTRY_ISO_BY_NAME[raw]) return COUNTRY_ISO_BY_NAME[raw];
  return upper;
}

function formatCountryLabel(val: unknown): string {
  const code = normalizeCountryCode(val);
  if (!code) return "—";
  const found = PANEL_COUNTRY_OPTIONS.find((c) => c.value.toUpperCase() === code);
  return found ? found.label : code;
}

function isEmptyAnswer(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function validateRequiredBeforeSubmit(
  form: PrescreenForm,
  answers: Record<string, unknown>
): string | null {
  for (const q of sortedQuestions(form)) {
    if (!q.required) continue;
    if (q.type === "checkbox") {
      if (!Array.isArray(answers[q.id]) || (answers[q.id] as unknown[]).length === 0) {
        return `Please complete: ${q.title}`;
      }
      continue;
    }
    if (isEmptyAnswer(answers[q.id])) {
      return `Please complete: ${q.title}`;
    }
  }
  return null;
}

export function MemberPrescreenForm({
  form,
  initialAnswers,
  readOnly = false,
  onSubmit,
  isSubmitting,
}: Props) {
  const questions = useMemo(() => sortedQuestions(form), [form]);

  const [clientError, setClientError] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    for (const q of sortedQuestions(form)) {
      if (initialAnswers && initialAnswers[q.id] !== undefined && initialAnswers[q.id] !== null) {
        let value = initialAnswers[q.id];
        if (isCountryQuestion(q)) {
          value = normalizeCountryCode(value);
        }
        initial[q.id] = value;
      } else if (q.defaultValue !== null && q.defaultValue !== undefined) {
        initial[q.id] = q.defaultValue as unknown;
      } else if (q.type === "checkbox") {
        initial[q.id] = [];
      }
    }
    return initial;
  });

  const setVal = (id: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const toggleCheckbox = (qid: string, optionValue: string, checked: boolean) => {
    setAnswers((prev) => {
      const cur = Array.isArray(prev[qid]) ? [...(prev[qid] as string[])] : [];
      if (checked) {
        if (!cur.includes(optionValue)) cur.push(optionValue);
      } else {
        const idx = cur.indexOf(optionValue);
        if (idx >= 0) cur.splice(idx, 1);
      }
      return { ...prev, [qid]: cur };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    const validationError = validateRequiredBeforeSubmit(form, answers);
    if (validationError) {
      setClientError(validationError);
      return;
    }
    setClientError(null);
    await onSubmit(answers);
  };

  // If already completed and read-only, render a locked verified display
  if (readOnly) {
    return (
      <div className="space-y-4">
        {questions.map((q) => {
          const rawAnswer = answers[q.id];
          const isCountry = isCountryQuestion(q);

          let displayAnswer: React.ReactNode = "—";

          if (isCountry) {
            displayAnswer = (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-xs">
                <Globe size={14} className="text-emerald-600" />
                <span>{formatCountryLabel(rawAnswer)}</span>
                <CheckCircle2 size={13} className="text-emerald-600 ml-1" />
              </div>
            );
          } else if (q.type === "checkbox") {
            const arr = Array.isArray(rawAnswer) ? (rawAnswer as string[]) : [];
            displayAnswer =
              arr.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {arr.map((val) => {
                    const opt = (q.options ?? []).find((o) => o.value === val);
                    return (
                      <span
                        key={val}
                        className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200"
                      >
                        {opt ? opt.label : val}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <span className="text-xs text-gray-400 italic">No selection</span>
              );
          } else if (q.type === "radio" || q.type === "dropdown") {
            const opt = (q.options ?? []).find((o) => o.value === rawAnswer);
            displayAnswer = (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-900 font-bold text-xs border border-gray-200">
                {opt ? opt.label : String(rawAnswer ?? "—")}
              </span>
            );
          } else if (q.type === "yes_no") {
            displayAnswer = (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                  rawAnswer === true
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : rawAnswer === false
                      ? "bg-gray-100 text-gray-700 border border-gray-200"
                      : "text-gray-400"
                }`}
              >
                {rawAnswer === true ? "Yes" : rawAnswer === false ? "No" : "—"}
              </span>
            );
          } else {
            displayAnswer = (
              <span className="text-xs font-bold text-gray-900">
                {rawAnswer ? String(rawAnswer) : "—"}
              </span>
            );
          }

          return (
            <div
              key={q.id}
              className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 flex flex-col justify-between gap-2"
            >
              <div>
                <p className="text-xs sm:text-sm font-black text-gray-900 leading-snug">
                  {q.title}
                </p>
                {q.description ? (
                  <p className="text-[11px] text-gray-500 mt-0.5">{q.description}</p>
                ) : null}
              </div>

              <div className="pt-1">{displayAnswer}</div>
            </div>
          );
        })}

        {/* Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
          <Link
            href={ROUTES.dashboard.surveys}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-sm hover:bg-brand-hover active:scale-95 transition-all"
          >
            <span>Explore Matched Surveys</span>
            <ArrowRight size={14} />
          </Link>

          <Link
            href={ROUTES.dashboard.help}
            className="text-[11px] font-bold text-gray-400 hover:text-brand-primary transition-colors"
          >
            Need to update demographics? Contact Support
          </Link>
        </div>
      </div>
    );
  }

  // Interactive Form for Initial Profile Completion
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((q) => {
        const isCountry = isCountryQuestion(q);

        return (
          <div key={q.id} className="space-y-2 p-4 rounded-xl bg-gray-50/70 border border-gray-100">
            <div>
              <p className="text-xs sm:text-sm font-black text-gray-900 leading-snug">
                {q.title}
                {q.required ? <span className="text-rose-500 ml-1">*</span> : null}
              </p>
              {q.description ? (
                <p className="text-[11px] text-gray-500 mt-0.5">{q.description}</p>
              ) : null}
              {q.helperText ? (
                <p className="text-[10px] text-gray-400 mt-0.5">{q.helperText}</p>
              ) : null}
            </div>

            {/* Country Question with Full ISO List and Search */}
            {isCountry ? (
              <CountrySearchSelect
                value={String(answers[q.id] ?? "")}
                onChange={(v) => setVal(q.id, v)}
                placeholder="Search and select your country…"
                required={q.required}
              />
            ) : null}

            {!isCountry && (q.type === "short_text" || q.type === "email") ? (
              <Input
                type={q.type === "email" ? "email" : "text"}
                value={String(answers[q.id] ?? "")}
                onChange={(e) => setVal(q.id, e.target.value)}
                placeholder={q.placeholder || undefined}
                className="text-xs text-gray-900 border-gray-200 bg-white h-9 rounded-lg"
                required={q.required}
              />
            ) : null}

            {!isCountry && q.type === "paragraph" ? (
              <textarea
                value={String(answers[q.id] ?? "")}
                onChange={(e) => setVal(q.id, e.target.value)}
                placeholder={q.placeholder || undefined}
                className="w-full min-h-20 rounded-lg border border-gray-200 p-2.5 text-xs text-gray-900 placeholder:text-gray-400 bg-white outline-none focus:ring-2 focus:ring-brand-primary/20"
                required={q.required}
              />
            ) : null}

            {!isCountry && q.type === "number" ? (
              <Input
                type="number"
                value={
                  answers[q.id] === undefined || answers[q.id] === null ? "" : String(answers[q.id])
                }
                onChange={(e) => {
                  const v = e.target.value;
                  setVal(q.id, v === "" ? null : Number(v));
                }}
                placeholder={q.placeholder || undefined}
                min={q.validation?.minValue ?? undefined}
                max={q.validation?.maxValue ?? undefined}
                className="text-xs text-gray-900 border-gray-200 bg-white h-9 rounded-lg"
                required={q.required}
              />
            ) : null}

            {!isCountry && q.type === "date" ? (
              <Input
                type="date"
                value={String(answers[q.id] ?? "")}
                onChange={(e) => setVal(q.id, e.target.value)}
                className="text-xs text-gray-900 border-gray-200 bg-white h-9 rounded-lg"
                required={q.required}
              />
            ) : null}

            {!isCountry && q.type === "dropdown" ? (
              <select
                value={String(answers[q.id] ?? "")}
                onChange={(e) => setVal(q.id, e.target.value)}
                className="w-full h-9 rounded-lg border border-gray-200 px-3 text-xs text-gray-900 bg-white"
                required={q.required}
              >
                <option value="">{q.placeholder || "Select…"}</option>
                {(q.options ?? []).map((opt) => (
                  <option key={opt.id} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : null}

            {!isCountry && q.type === "radio" ? (
              <fieldset className="space-y-1.5 pt-1">
                {(q.options ?? []).map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-2 text-xs text-gray-800 cursor-pointer font-medium"
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt.value}
                      checked={answers[q.id] === opt.value}
                      onChange={() => setVal(q.id, opt.value)}
                      className="text-brand-primary"
                    />
                    {opt.label}
                  </label>
                ))}
              </fieldset>
            ) : null}

            {!isCountry && q.type === "checkbox" ? (
              <fieldset className="space-y-1.5 pt-1">
                {(q.options ?? []).map((opt) => {
                  const arr = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
                  return (
                    <label
                      key={opt.id}
                      className="flex items-center gap-2 text-xs text-gray-800 cursor-pointer font-medium"
                    >
                      <input
                        type="checkbox"
                        checked={arr.includes(opt.value)}
                        onChange={(e) => toggleCheckbox(q.id, opt.value, e.target.checked)}
                        className="rounded border-gray-300 text-brand-primary"
                      />
                      {opt.label}
                    </label>
                  );
                })}
              </fieldset>
            ) : null}

            {!isCountry && q.type === "yes_no" ? (
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setVal(q.id, true)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    answers[q.id] === true
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setVal(q.id, false)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    answers[q.id] === false
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  No
                </button>
              </div>
            ) : null}
          </div>
        );
      })}

      {clientError ? (
        <p role="alert" className="text-xs font-semibold text-rose-600">
          {clientError}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-black uppercase tracking-wider text-xs shadow-md shadow-brand-primary/20 transition-all active:scale-95"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
            Saving Profile…
          </>
        ) : (
          "Save & Submit Profile"
        )}
      </Button>
    </form>
  );
}
