"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PrescreenForm, PrescreenQuestion } from "@/types/prescreen";

type Props = {
  form: PrescreenForm;
  onSubmit: (answers: Record<string, unknown>) => Promise<void>;
  isSubmitting: boolean;
};

function sortedQuestions(form: PrescreenForm): PrescreenQuestion[] {
  return [...form.questions].sort((a, b) => a.order - b.order);
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

export function MemberPrescreenForm({ form, onSubmit, isSubmitting }: Props) {
  const questions = useMemo(() => sortedQuestions(form), [form]);

  const [clientError, setClientError] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    for (const q of sortedQuestions(form)) {
      if (q.defaultValue !== null && q.defaultValue !== undefined) {
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
    const validationError = validateRequiredBeforeSubmit(form, answers);
    if (validationError) {
      setClientError(validationError);
      return;
    }
    setClientError(null);
    await onSubmit(answers);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {questions.map((q) => (
        <div key={q.id} className="space-y-2">
          <div>
            <p className="text-sm font-black text-gray-900">
              {q.title}
              {q.required ? <span className="text-rose-500 ml-1">*</span> : null}
            </p>
            {q.description ? <p className="text-xs text-gray-500 mt-1">{q.description}</p> : null}
            {q.helperText ? <p className="text-[11px] text-gray-400 mt-1">{q.helperText}</p> : null}
          </div>

          {q.type === "short_text" || q.type === "email" ? (
            <Input
              type={q.type === "email" ? "email" : "text"}
              value={String(answers[q.id] ?? "")}
              onChange={(e) => setVal(q.id, e.target.value)}
              placeholder={q.placeholder || undefined}
              className="text-gray-900 border-gray-200"
              required={q.required}
            />
          ) : null}

          {q.type === "paragraph" ? (
            <textarea
              value={String(answers[q.id] ?? "")}
              onChange={(e) => setVal(q.id, e.target.value)}
              placeholder={q.placeholder || undefined}
              className="w-full min-h-24 rounded-xl border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400"
              required={q.required}
            />
          ) : null}

          {q.type === "number" ? (
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
              min={q.validation.minValue ?? undefined}
              max={q.validation.maxValue ?? undefined}
              className="text-gray-900 border-gray-200"
              required={q.required}
            />
          ) : null}

          {q.type === "date" ? (
            <Input
              type="date"
              value={String(answers[q.id] ?? "")}
              onChange={(e) => setVal(q.id, e.target.value)}
              className="text-gray-900 border-gray-200"
              required={q.required}
            />
          ) : null}

          {q.type === "dropdown" ? (
            <select
              value={String(answers[q.id] ?? "")}
              onChange={(e) => setVal(q.id, e.target.value)}
              className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white"
              required={q.required}
            >
              <option value="">{q.placeholder || "Select…"}</option>
              {q.options.map((opt) => (
                <option key={opt.id} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : null}

          {q.type === "radio" ? (
            <fieldset className="space-y-2">
              {q.options.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer"
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

          {q.type === "checkbox" ? (
            <fieldset className="space-y-2">
              {q.options.map((opt) => {
                const arr = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
                return (
                  <label
                    key={opt.id}
                    className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer"
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

          {q.type === "yes_no" ? (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setVal(q.id, true)}
                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
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
                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
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
      ))}

      {clientError ? (
        <p role="alert" className="text-sm font-semibold text-rose-600">
          {clientError}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
            Saving…
          </>
        ) : (
          "Submit profile"
        )}
      </Button>
    </form>
  );
}
