"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, RotateCcw } from "lucide-react";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { PageHelp } from "@/components/crm/page-help";
import { LoadingButton } from "@/components/crm/loading-button";
import { ADMIN_PAGE_HELP } from "@/constants/admin-page-help";
import {
  PanelSurveySearchSelect,
  type PanelSurveyPickerItem,
} from "@/components/admin/panel-survey-search-select";
import { listPanelSurveys } from "@/services/panel-survey";
import { exportSurveyRespondents } from "@/services/survey-respondent-profile/survey-respondent-profile-api";
import { listVendors } from "@/services/vendor";
import { queryKeys } from "@/services/queries";
import { cn } from "@/lib/utils";

type ExportFormat = "csv" | "xlsx" | "pdf";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "complete", label: "Complete" },
  { value: "terminate", label: "Terminate" },
  { value: "quota_full", label: "Quota Full" },
  { value: "quality_reject", label: "Security Fail" },
  { value: "redirected", label: "Redirected" },
  { value: "started", label: "Started" },
  { value: "prescreen_pending", label: "Prescreen Pending" },
];

const fieldClass =
  "mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20";

const labelClass = "text-sm font-bold text-gray-700";

async function readExportError(error: unknown): Promise<string> {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : "Failed to generate export";
  }
  const data = error.response?.data;
  if (data instanceof Blob) {
    try {
      const text = await data.text();
      const json = JSON.parse(text) as { message?: string };
      if (json.message) return json.message;
    } catch {
      /* ignore */
    }
  }
  if (data && typeof data === "object" && "message" in data) {
    const msg = (data as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return error.message || "Failed to generate export";
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">{title}</h2>
        {description ? <p className="text-sm text-gray-500 mt-1">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default function RespondentExportsPage() {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [vendorId, setVendorId] = useState("");
  const [panelSurveyId, setPanelSurveyId] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState<PanelSurveyPickerItem | null>(null);
  const [surveySearch, setSurveySearch] = useState("");
  const [debouncedSurveySearch, setDebouncedSurveySearch] = useState("");
  const [surveyStatus, setSurveyStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [exporting, setExporting] = useState(false);
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSurveySearch(surveySearch), 300);
    return () => window.clearTimeout(timer);
  }, [surveySearch]);

  const { data: surveysData, isLoading: surveysLoading } = useQuery({
    queryKey: queryKeys.panelSurveys.list({ search: debouncedSurveySearch, pageSize: 100 }),
    queryFn: () =>
      listPanelSurveys({
        page: 1,
        pageSize: 100,
        search: debouncedSurveySearch || undefined,
      }),
  });

  const { data: vendorsData, isLoading: vendorsLoading } = useQuery({
    queryKey: queryKeys.vendors.list({ page: 1, pageSize: 200, status: "active" }),
    queryFn: () => listVendors({ page: 1, pageSize: 200, status: "active" }),
  });

  const surveys = useMemo(() => {
    const items =
      surveysData?.items.map((s) => ({
        id: s.id,
        surveyName: s.surveyName,
        surveyCode: s.surveyCode,
        externalSurveyId: s.externalSurveyId,
        supplierProjectPid: s.supplierProjectPid,
      })) ?? [];
    if (selectedSurvey && !items.some((s) => s.id === selectedSurvey.id)) {
      return [selectedSurvey, ...items];
    }
    return items;
  }, [surveysData?.items, selectedSurvey]);

  const vendors = vendorsData?.items ?? [];
  const selectedVendor = vendors.find((v) => v.id === vendorId);

  const resetFilters = () => {
    setFormat("csv");
    setVendorId("");
    setPanelSurveyId("");
    setSelectedSurvey(null);
    setSurveySearch("");
    setSurveyStatus("");
    setDateFrom("");
    setDateTo("");
    setDateError("");
  };

  const validateDates = () => {
    if (dateFrom && dateTo && dateFrom > dateTo) {
      setDateError("Please select a valid date range.");
      return false;
    }
    setDateError("");
    return true;
  };

  const handleExport = async () => {
    if (!validateDates()) {
      toast.error("Please select a valid date range.");
      return;
    }

    setExporting(true);
    try {
      const blob = await exportSurveyRespondents({
        format,
        vendorId: vendorId || undefined,
        panelSurveyId: panelSurveyId || undefined,
        surveyStatus: surveyStatus || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });

      if (blob.type.includes("application/json")) {
        const text = await blob.text();
        const json = JSON.parse(text) as { message?: string };
        throw new Error(json.message || "No records found for the selected filters.");
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = format === "xlsx" ? "xlsx" : format;
      a.download = `survey-export-${Date.now()}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export generated successfully");
    } catch (e) {
      toast.error(await readExportError(e));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Download className="h-7 w-7 text-brand-primary" />
            Export Center
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Download respondent data as CSV, Excel, or PDF. CSV streams for large sets; Excel and
            PDF are capped at 10,000 rows.
          </p>
        </div>
        <PageHelp content={ADMIN_PAGE_HELP.respondentExports} />
      </div>

      <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm space-y-8">
        <Section
          title="Export Configuration"
          description="Choose the file format and optional filters before downloading."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>
                Export Format <span className="text-rose-500">*</span>
              </span>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ExportFormat)}
                className={fieldClass}
                required
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel (XLSX)</option>
                <option value="pdf">PDF</option>
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>Status</span>
              <select
                value={surveyStatus}
                onChange={(e) => setSurveyStatus(e.target.value)}
                className={fieldClass}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value || "all"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>From Date</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setDateError("");
                }}
                className={cn(fieldClass, dateError && "border-rose-300")}
              />
            </label>

            <label className="block">
              <span className={labelClass}>To Date</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setDateError("");
                }}
                className={cn(fieldClass, dateError && "border-rose-300")}
              />
            </label>
          </div>
          {dateError ? <p className="text-sm text-rose-600 font-medium">{dateError}</p> : null}
        </Section>

        <div className="border-t border-gray-100" />

        <Section
          title="Survey Selection"
          description="Search and optionally limit the export to one survey."
        >
          <div className="space-y-3">
            <div>
              <span className={labelClass}>Survey Search</span>
              <div className="mt-2">
                <PanelSurveySearchSelect
                  value={panelSurveyId}
                  onChange={(id) => {
                    setPanelSurveyId(id);
                    setSelectedSurvey(id ? (surveys.find((s) => s.id === id) ?? null) : null);
                  }}
                  surveys={surveys}
                  loading={surveysLoading}
                  onSearchQueryChange={setSurveySearch}
                />
              </div>
            </div>
            {selectedSurvey ? (
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  Selected Survey
                </p>
                <p className="font-semibold text-gray-900">{selectedSurvey.surveyName}</p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  {selectedSurvey.surveyCode}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No survey selected — all surveys will be included.
              </p>
            )}
          </div>
        </Section>

        <div className="border-t border-gray-100" />

        <Section
          title="Vendor Filter"
          description="Optionally limit results to a single vendor partner."
        >
          <label className="block">
            <span className={labelClass}>Vendor</span>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className={fieldClass}
              disabled={vendorsLoading}
            >
              <option value="">All vendors</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.companyName} ({v.vendorCode})
                </option>
              ))}
            </select>
          </label>
          {selectedVendor ? (
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm mt-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Selected Vendor
              </p>
              <p className="font-semibold text-gray-900">{selectedVendor.companyName}</p>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{selectedVendor.vendorCode}</p>
            </div>
          ) : null}
        </Section>

        <div className="border-t border-gray-100" />

        <Section title="Export Action">
          <div className="flex flex-col sm:flex-row gap-3">
            <LoadingButton
              type="button"
              loading={exporting}
              loadingText="Generating Export..."
              onClick={handleExport}
              className="h-11 flex-1 rounded-xl bg-gray-900 text-white text-sm font-black hover:bg-black disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Export
            </LoadingButton>
            <button
              type="button"
              disabled={exporting}
              onClick={resetFilters}
              className="h-11 px-5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filters
            </button>
          </div>
          {exporting ? (
            <p className="text-xs text-gray-500 flex items-center gap-2 mt-3">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Applying filters and generating your file…
            </p>
          ) : null}
        </Section>
      </div>
    </div>
  );
}
