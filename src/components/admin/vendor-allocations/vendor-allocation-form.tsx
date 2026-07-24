"use client";

import { useState } from "react";
import type { CreateVendorAllocationPayload } from "@/services/vendor-allocation/vendor-allocation-api";
import { FormActionBar, getFormSubmitIntent } from "@/components/crm/form-action-bar";
import { ROUTES } from "@/constants/routes";

export type VendorAllocationFormValues = {
  panelSurveyId: string;
  vendorId: string;
  allocatedQuota: number;
  vendorCpi: number;
  clientCpi: number;
  startDate: string;
  endDate: string;
  notes: string;
};

type SurveyOption = { id: string; label: string; remainingQuota: number };
type VendorOption = { id: string; label: string };

type Props = {
  surveys: SurveyOption[];
  vendors: VendorOption[];
  initialValues?: Partial<VendorAllocationFormValues>;
  surveyLocked?: boolean;
  maxQuota?: number;
  isSubmitting?: boolean;
  cancelHref?: string;
  onSubmit: (payload: CreateVendorAllocationPayload, options: { continueEditing: boolean }) => void;
};

const defaultValues: VendorAllocationFormValues = {
  panelSurveyId: "",
  vendorId: "",
  allocatedQuota: 10,
  vendorCpi: 0,
  clientCpi: 0,
  startDate: "",
  endDate: "",
  notes: "",
};

export function VendorAllocationForm({
  surveys,
  vendors,
  initialValues,
  surveyLocked = false,
  maxQuota,
  isSubmitting = false,
  cancelHref = ROUTES.admin.vendorAllocations,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<VendorAllocationFormValues>({
    ...defaultValues,
    ...initialValues,
  });

  const selectedSurvey = surveys.find((s) => s.id === values.panelSurveyId);
  const quotaCap = maxQuota ?? selectedSurvey?.remainingQuota ?? 999999;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const continueEditing = getFormSubmitIntent(e) === "continue";
    onSubmit(
      {
        panelSurveyId: values.panelSurveyId,
        vendorId: values.vendorId,
        allocatedQuota: Math.min(values.allocatedQuota, quotaCap),
        vendorCpi: values.vendorCpi || undefined,
        clientCpi: values.clientCpi || undefined,
        startDate: values.startDate || null,
        endDate: values.endDate || null,
        notes: values.notes.trim() || undefined,
      },
      { continueEditing }
    );
  };

  const fieldClass =
    "mt-1 w-full rounded-xl border border-gray-200 h-11 px-3 text-gray-900 bg-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block text-sm font-semibold text-gray-700">
        Panel survey
        <select
          className={fieldClass}
          value={values.panelSurveyId}
          onChange={(e) => {
            const panelSurveyId = e.target.value;
            const survey = surveys.find((s) => s.id === panelSurveyId);
            const cap = survey?.remainingQuota ?? 999999;
            setValues((v) => ({
              ...v,
              panelSurveyId,
              allocatedQuota: Math.min(Math.max(1, v.allocatedQuota), cap),
            }));
          }}
          required
          disabled={surveyLocked}
        >
          <option value="">Select survey…</option>
          {surveys.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label} ({s.remainingQuota} remaining)
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-semibold text-gray-700">
        Vendor partner
        <select
          className={fieldClass}
          value={values.vendorId}
          onChange={(e) => setValues((v) => ({ ...v, vendorId: e.target.value }))}
          required
        >
          <option value="">Select vendor…</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-gray-700">
          Allocated quota
          <input
            type="number"
            min={1}
            max={quotaCap}
            className={fieldClass}
            value={values.allocatedQuota}
            onChange={(e) => {
              const n = Number(e.target.value);
              setValues((v) => ({
                ...v,
                allocatedQuota: Math.min(Math.max(1, n), quotaCap),
              }));
            }}
            required
          />
          {selectedSurvey ? (
            <span className="text-xs text-gray-500 mt-1 block">
              Max {selectedSurvey.remainingQuota} (survey remaining)
            </span>
          ) : null}
        </label>
        <label className="block text-sm font-semibold text-gray-700">
          Vendor CPI ($)
          <input
            type="number"
            min={0}
            step="0.01"
            className={fieldClass}
            value={values.vendorCpi}
            onChange={(e) => setValues((v) => ({ ...v, vendorCpi: Number(e.target.value) }))}
          />
        </label>
        <label className="block text-sm font-semibold text-gray-700">
          Client CPI ($)
          <input
            type="number"
            min={0}
            step="0.01"
            className={fieldClass}
            value={values.clientCpi}
            onChange={(e) => setValues((v) => ({ ...v, clientCpi: Number(e.target.value) }))}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-gray-700">
          Start date
          <input
            type="date"
            className={fieldClass}
            value={values.startDate}
            onChange={(e) => setValues((v) => ({ ...v, startDate: e.target.value }))}
          />
        </label>
        <label className="block text-sm font-semibold text-gray-700">
          End date
          <input
            type="date"
            className={fieldClass}
            value={values.endDate}
            onChange={(e) => setValues((v) => ({ ...v, endDate: e.target.value }))}
          />
        </label>
      </div>

      <label className="block text-sm font-semibold text-gray-700">
        Notes
        <textarea
          className="mt-1 w-full rounded-xl border border-gray-200 min-h-[88px] p-3 text-gray-900"
          value={values.notes}
          onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))}
          placeholder="Internal notes for this allocation…"
        />
      </label>

      <p className="text-xs text-gray-500 rounded-xl bg-slate-50 border border-gray-100 px-4 py-3">
        Vendors receive only the generated routing link — never the raw supplier survey URL.
      </p>

      <FormActionBar isSubmitting={isSubmitting} cancelHref={cancelHref} sticky={false} />
    </form>
  );
}
