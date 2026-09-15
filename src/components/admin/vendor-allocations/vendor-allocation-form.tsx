"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Shield, TrendingUp } from "lucide-react";
import type { CreateVendorAllocationPayload } from "@/services/vendor-allocation/vendor-allocation-api";
import { FormActionBar, getFormSubmitIntent } from "@/components/crm/form-action-bar";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { PanelSurvey } from "@/services/panel-survey/panel-survey-api";
import type { Vendor } from "@/types/vendor";
import { SurveySearchSelect } from "./survey-search-select";
import { VendorSearchSelect } from "./vendor-search-select";

export type VendorAllocationFormValues = {
  panelSurveyIds: string[];
  vendorId: string;
  allocatedQuota: number;
  vendorCpi: number;
  clientCpi: number;
  startDate: string;
  endDate: string;
  notes: string;
};

type Props = {
  surveys: PanelSurvey[];
  vendors: Vendor[];
  initialValues?: Partial<VendorAllocationFormValues> & { panelSurveyId?: string };
  surveyLocked?: boolean;
  maxQuota?: number;
  isSubmitting?: boolean;
  cancelHref?: string;
  onSubmit: (
    payloads: CreateVendorAllocationPayload[],
    options: { continueEditing: boolean }
  ) => void;
};

const defaultValues: VendorAllocationFormValues = {
  panelSurveyIds: [],
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
  // Support legacy panelSurveyId if passed in initialValues
  const initialSurveyIds: string[] =
    initialValues?.panelSurveyIds && initialValues.panelSurveyIds.length > 0
      ? initialValues.panelSurveyIds
      : initialValues?.panelSurveyId
        ? [initialValues.panelSurveyId]
        : [];

  const [values, setValues] = useState<VendorAllocationFormValues>({
    ...defaultValues,
    ...initialValues,
    panelSurveyIds: initialSurveyIds,
  });

  const [formErrors, setFormErrors] = useState<{
    panelSurveyIds?: string;
    vendorId?: string;
    allocatedQuota?: string;
  }>({});

  const selectedSurveys = useMemo(
    () => surveys.filter((s) => values.panelSurveyIds.includes(s.id)),
    [surveys, values.panelSurveyIds]
  );

  // Minimum remaining quota across all selected surveys for safe default capping
  const minRemainingQuota = useMemo(() => {
    if (selectedSurveys.length === 0) return 999999;
    return Math.min(...selectedSurveys.map((s) => s.remainingQuota ?? 999999));
  }, [selectedSurveys]);

  const quotaCap = maxQuota ?? minRemainingQuota;

  // Commercial / Margin Calculations
  const clientCpi = Number(values.clientCpi) || 0;
  const vendorCpi = Number(values.vendorCpi) || 0;
  const quotaPerSurvey = Number(values.allocatedQuota) || 0;
  const totalCompletesAllSurveys = quotaPerSurvey * (values.panelSurveyIds.length || 0);

  const marginPerComplete = clientCpi - vendorCpi;
  const marginPercent = clientCpi > 0 ? (marginPerComplete / clientCpi) * 100 : 0;
  const totalClientRevenue = totalCompletesAllSurveys * clientCpi;
  const totalVendorCost = totalCompletesAllSurveys * vendorCpi;
  const totalNetProfit = totalCompletesAllSurveys * marginPerComplete;

  const handleSurveysChange = (panelSurveyIds: string[], newlySelectedSurveys?: PanelSurvey[]) => {
    setFormErrors((prev) => ({ ...prev, panelSurveyIds: undefined }));

    // If only 1 survey selected and clientCpi is not set yet, auto-suggest from that survey
    const firstSurvey =
      newlySelectedSurveys?.[0] || surveys.find((s) => s.id === panelSurveyIds[0]);
    const suggestedClientCpi =
      firstSurvey?.revenuePerComplete || firstSurvey?.companyBillingAmount || 0;

    setValues((v) => ({
      ...v,
      panelSurveyIds,
      clientCpi: v.clientCpi === 0 && suggestedClientCpi > 0 ? suggestedClientCpi : v.clientCpi,
    }));
  };

  const handleVendorChange = (vendorId: string) => {
    setFormErrors((prev) => ({ ...prev, vendorId: undefined }));
    setValues((v) => ({ ...v, vendorId }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: typeof formErrors = {};
    if (values.panelSurveyIds.length === 0) {
      errors.panelSurveyIds = "Please select at least one survey to allocate";
    }
    if (!values.vendorId) {
      errors.vendorId = "Please select a vendor partner";
    }
    if (values.allocatedQuota < 1) {
      errors.allocatedQuota = "Allocated quota must be at least 1";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const continueEditing = getFormSubmitIntent(e) === "continue";

    // Prepare individual payload for each selected survey
    const payloads: CreateVendorAllocationPayload[] = values.panelSurveyIds.map((surveyId) => {
      const survey = surveys.find((s) => s.id === surveyId);
      const cap = survey?.remainingQuota ?? 999999;
      return {
        panelSurveyId: surveyId,
        vendorId: values.vendorId,
        allocatedQuota: Math.min(values.allocatedQuota, cap > 0 ? cap : values.allocatedQuota),
        vendorCpi: values.vendorCpi || undefined,
        clientCpi: values.clientCpi || undefined,
        startDate: values.startDate || null,
        endDate: values.endDate || null,
        notes: values.notes.trim() || undefined,
      };
    });

    onSubmit(payloads, { continueEditing });
  };

  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-gray-200 h-11 px-3.5 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition";

  const numSurveys = values.panelSurveyIds.length;
  const saveLabel = numSurveys > 1 ? `Create ${numSurveys} Allocations` : "Create Allocation";
  const continueLabel =
    numSurveys > 1 ? `Create ${numSurveys} Allocations & Continue` : "Create & View Details";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* SECTION 1: Survey & Vendor Selection */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white text-xs font-bold">
            1
          </span>
          <h2 className="text-base font-bold text-gray-900">Survey & Partner Selection</h2>
          <span className="text-xs text-gray-400 font-normal">
            ({surveys.length} surveys · {vendors.length} vendors available)
          </span>
        </div>

        {/* Multi-Survey Picker */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-800">
              Panel Surveys <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-indigo-600 font-medium">
              Multi-selection enabled (select multiple surveys at once)
            </span>
          </div>
          <SurveySearchSelect
            values={values.panelSurveyIds}
            onChange={handleSurveysChange}
            surveys={surveys}
            locked={surveyLocked}
            required
            error={formErrors.panelSurveyIds}
          />
        </div>

        {/* Vendor Picker */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-800">
              Vendor Partner <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-gray-500">
              Searchable by company name, vendor code, or contact email
            </span>
          </div>
          <VendorSearchSelect
            value={values.vendorId}
            onChange={handleVendorChange}
            vendors={vendors}
            required
            error={formErrors.vendorId}
          />
        </div>
      </div>

      {/* SECTION 2: Quota & Commercial Terms */}
      <div className="space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white text-xs font-bold">
              2
            </span>
            <h2 className="text-base font-bold text-gray-900">Quota & Commercial Terms</h2>
          </div>
          {numSurveys > 1 && (
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              Applied to each of the {numSurveys} selected surveys
            </span>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {/* Allocated Quota per survey */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-800">
                Quota per Survey <span className="text-rose-500">*</span>
              </label>
              {minRemainingQuota < 999999 && minRemainingQuota > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setValues((v) => ({
                      ...v,
                      allocatedQuota: minRemainingQuota,
                    }))
                  }
                  className="text-[11px] font-bold text-brand-primary hover:underline"
                >
                  Set to min rem ({minRemainingQuota})
                </button>
              )}
            </div>
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
            <div className="text-xs text-gray-500 mt-1.5 space-y-0.5">
              <p>Target completes assigned per survey</p>
              {numSurveys > 1 && (
                <p className="font-semibold text-indigo-600">
                  Total completes: {totalCompletesAllSurveys.toLocaleString()} (
                  {values.allocatedQuota} × {numSurveys} surveys)
                </p>
              )}
            </div>
            {formErrors.allocatedQuota && (
              <p className="text-xs font-medium text-rose-600 mt-1">{formErrors.allocatedQuota}</p>
            )}
          </div>

          {/* Client CPI ($) */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">Client CPI ($)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                $
              </span>
              <input
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                className={cn(fieldClass, "pl-7")}
                value={values.clientCpi || ""}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    clientCpi: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5">Price client pays us per complete</p>
          </div>

          {/* Vendor CPI ($) */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">Vendor CPI ($)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                $
              </span>
              <input
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                className={cn(fieldClass, "pl-7")}
                value={values.vendorCpi || ""}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    vendorCpi: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5">Payout due to vendor per complete</p>
          </div>
        </div>

        {/* Live Commercial Profit & Margin Card */}
        {(clientCpi > 0 || vendorCpi > 0) && (
          <div
            className={cn(
              "rounded-2xl border p-4.5 transition-all",
              marginPerComplete < 0
                ? "bg-rose-50/50 border-rose-200"
                : "bg-gradient-to-br from-emerald-50/40 via-white to-slate-50/40 border-emerald-200/70"
            )}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp
                  className={cn(
                    "h-4 w-4",
                    marginPerComplete < 0 ? "text-rose-600" : "text-emerald-600"
                  )}
                />
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Commercial Margin Overview{" "}
                  {numSurveys > 1 ? `(${numSurveys} Surveys Combined)` : ""}
                </h4>
              </div>

              {marginPerComplete < 0 ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Negative Margin Warning
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Positive Margin: +{marginPercent.toFixed(1)}%
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">
                  Margin / Complete
                </span>
                <span
                  className={cn(
                    "text-base font-extrabold mt-0.5 block",
                    marginPerComplete < 0 ? "text-rose-600" : "text-emerald-600"
                  )}
                >
                  {marginPerComplete >= 0 ? "+" : ""}${marginPerComplete.toFixed(2)}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">
                  Total Projected Revenue
                </span>
                <span className="text-base font-bold text-gray-900 mt-0.5 block">
                  ${totalClientRevenue.toFixed(2)}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">
                  Total Vendor Cost
                </span>
                <span className="text-base font-bold text-gray-700 mt-0.5 block">
                  ${totalVendorCost.toFixed(2)}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">
                  Total Net Profit
                </span>
                <span
                  className={cn(
                    "text-base font-extrabold mt-0.5 block",
                    totalNetProfit < 0 ? "text-rose-600" : "text-emerald-600"
                  )}
                >
                  {totalNetProfit >= 0 ? "+" : ""}${totalNetProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: Schedule & Timeline */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white text-xs font-bold">
            3
          </span>
          <h2 className="text-base font-bold text-gray-900">Schedule & Timeline (Optional)</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-gray-800">Start Date</label>
            <input
              type="date"
              className={fieldClass}
              value={values.startDate}
              onChange={(e) => setValues((v) => ({ ...v, startDate: e.target.value }))}
            />
            <p className="text-xs text-gray-500 mt-1.5">When vendor traffic starts routing</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800">End Date</label>
            <input
              type="date"
              className={fieldClass}
              value={values.endDate}
              onChange={(e) => setValues((v) => ({ ...v, endDate: e.target.value }))}
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Allocation automatically expires after this date
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: Internal Notes & Gateway Notice */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white text-xs font-bold">
            4
          </span>
          <h2 className="text-base font-bold text-gray-900">Internal Notes & Security Gateway</h2>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800">
            Internal Allocation Notes
          </label>
          <textarea
            className="mt-1.5 w-full rounded-xl border border-gray-200 min-h-[96px] p-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition"
            value={values.notes}
            onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))}
            placeholder="Commercial terms, PO number, targeting constraints, or special vendor agreements…"
          />
        </div>

        {/* Security Notice */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
            <Shield className="h-4 w-4" />
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-gray-900">
              Automated Gateway Security Routing (ALLOC-xxxx)
            </p>
            <p className="leading-relaxed">
              {numSurveys > 1
                ? `A separate, isolated routing link (ALLOC-xxxx) with dedicated tracking token will be generated sequentially in the background for each of the ${numSurveys} selected surveys.`
                : "Upon creation, an isolated routing link will be generated with SHA-256 session token masking."}{" "}
              The vendor partner receives only the secure routing gateway links and never has
              visibility into raw supplier URLs or redirect parameters.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <FormActionBar
        isSubmitting={isSubmitting}
        cancelHref={cancelHref}
        saveLabel={saveLabel}
        continueLabel={continueLabel}
        sticky={false}
      />
    </form>
  );
}
