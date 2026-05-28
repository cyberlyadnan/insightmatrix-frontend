"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { exportSurveyRespondents } from "@/services/survey-respondent-profile/survey-respondent-profile-api";

export default function RespondentExportsPage() {
  const [format, setFormat] = useState<"csv" | "xlsx">("csv");
  const [vendorId, setVendorId] = useState("");
  const [panelSurveyId, setPanelSurveyId] = useState("");
  const [surveyStatus, setSurveyStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
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
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `respondents-${Date.now()}.${format === "xlsx" ? "xls" : "csv"}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export started");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Download className="h-7 w-7 text-brand-primary" />
          Export center
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Streamed CSV export (memory-safe). XLSX capped at 10,000 rows.
        </p>
      </div>

      <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 space-y-5 shadow-sm">
        <label className="block text-sm">
          <span className="font-bold text-gray-700">Format</span>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as "csv" | "xlsx")}
            className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="csv">CSV</option>
            <option value="xlsx">XLSX</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-bold text-gray-700">Vendor ID (optional)</span>
          <input
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-mono text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </label>
        <label className="block text-sm">
          <span className="font-bold text-gray-700">Survey ID (optional)</span>
          <input
            value={panelSurveyId}
            onChange={(e) => setPanelSurveyId(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 font-mono text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </label>
        <label className="block text-sm">
          <span className="font-bold text-gray-700">Status</span>
          <select
            value={surveyStatus}
            onChange={(e) => setSurveyStatus(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="">Any</option>
            <option value="complete">Complete</option>
            <option value="terminate">Terminate</option>
            <option value="quota_full">Quota full</option>
            <option value="quality_reject">Quality reject</option>
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="font-bold text-gray-700">From</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </label>
          <label className="block text-sm">
            <span className="font-bold text-gray-700">To</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </label>
        </div>
        <button
          type="button"
          disabled={exporting}
          onClick={handleExport}
          className="w-full h-11 rounded-xl bg-gray-900 text-white text-sm font-black disabled:opacity-60 hover:bg-black transition-colors"
        >
          {exporting ? "Exporting…" : "Download export"}
        </button>
      </div>
    </div>
  );
}
