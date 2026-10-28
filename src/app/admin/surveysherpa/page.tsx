"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Coins,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  Globe,
  Key,
  Layers,
  ListFilter,
  Loader2,
  Lock,
  Percent,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
  surveySherpaApi,
  type SurveySherpaRemoteSurvey,
  type SurveySherpaSurveyDetails,
} from "@/services/surveysherpa/surveysherpa-api";
import { PageHeader } from "@/components/crm/page-help";
import { adminFilterSelectClass } from "@/components/crm/admin-table";
import { downloadCsv } from "@/utils/download-csv";

function formatCpi(val: unknown): string {
  const num = Number(val);
  return Number.isFinite(num) ? num.toFixed(2) : "0.00";
}

const STAT_TONES = {
  emerald: {
    cardBg: "bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white",
    cardBorder:
      "border-emerald-200/80 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10",
    iconBox:
      "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30",
    arrowColor: "text-emerald-400 group-hover:text-emerald-700",
    labelColor: "text-emerald-900/80",
    valueColor: "text-emerald-700",
    hintBadge: "text-emerald-700 bg-emerald-100/80 border border-emerald-200/70",
  },
  blue: {
    cardBg: "bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white",
    cardBorder: "border-blue-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10",
    iconBox:
      "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30",
    arrowColor: "text-blue-400 group-hover:text-blue-700",
    labelColor: "text-blue-900/80",
    valueColor: "text-blue-700",
    hintBadge: "text-blue-700 bg-blue-100/80 border border-blue-200/70",
  },
  amber: {
    cardBg: "bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white",
    cardBorder:
      "border-amber-200/80 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10",
    iconBox:
      "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30",
    arrowColor: "text-amber-400 group-hover:text-amber-700",
    labelColor: "text-amber-900/80",
    valueColor: "text-amber-700",
    hintBadge: "text-amber-700 bg-amber-100/80 border border-amber-200/70",
  },
  violet: {
    cardBg: "bg-gradient-to-br from-purple-50/90 via-violet-50/40 to-white",
    cardBorder:
      "border-purple-200/80 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/10",
    iconBox:
      "bg-gradient-to-br from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/30",
    arrowColor: "text-purple-400 group-hover:text-purple-700",
    labelColor: "text-purple-900/80",
    valueColor: "text-purple-700",
    hintBadge: "text-purple-700 bg-purple-100/80 border border-purple-200/70",
  },
};

export default function SurveySherpaAdminPage() {
  const queryClient = useQueryClient();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [importFilter, setImportFilter] = useState<"all" | "imported" | "not_imported">("all");
  const [showConfig, setShowConfig] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [accessKeyInput, setAccessKeyInput] = useState("");
  const [baseUrlInput, setBaseUrlInput] = useState("https://api.surveysherpa.com");
  const [selectedSurveyForModal, setSelectedSurveyForModal] =
    useState<SurveySherpaSurveyDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // 1. Connection status query
  const {
    data: statusData,
    isLoading: isStatusLoading,
    refetch: refetchStatus,
  } = useQuery({
    queryKey: ["surveysherpa", "status"],
    queryFn: () => surveySherpaApi.getStatus(),
    staleTime: 60_000,
  });

  // 2. Remote surveys query
  const {
    data: remoteData,
    isLoading: isSurveysLoading,
    refetch: refetchSurveys,
  } = useQuery({
    queryKey: ["surveysherpa", "surveys"],
    queryFn: () => surveySherpaApi.getRemoteSurveys(),
    staleTime: 30_000,
  });

  // Update credentials mutation
  const credentialsMutation = useMutation({
    mutationFn: ({ key, url }: { key: string; url: string }) =>
      surveySherpaApi.updateCredentials(key, url),
    onSuccess: (data) => {
      if (data.validKey) {
        toast.success("SurveySherpa credentials updated and verified!");
      } else {
        toast.warning(data.message || "Key saved, but could not authenticate with live surveys.");
      }
      queryClient.invalidateQueries({ queryKey: ["surveysherpa"] });
      setShowConfig(false);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to update credentials";
      toast.error(msg);
    },
  });

  // Import single survey mutation
  const importMutation = useMutation({
    mutationFn: (surveyId: number) =>
      surveySherpaApi.importSurvey(surveyId, { autoActivate: true }),
    onSuccess: () => {
      toast.success("Survey imported into InsightMatrix PanelSurveys!");
      queryClient.invalidateQueries({ queryKey: ["surveysherpa"] });
      queryClient.invalidateQueries({ queryKey: ["panelSurveys"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to import survey";
      toast.error(msg);
    },
  });

  // Sync all surveys mutation
  const syncAllMutation = useMutation({
    mutationFn: () => surveySherpaApi.syncAll({ autoActivate: true, syncQualifications: true }),
    onSuccess: (data) => {
      toast.success(`Sync complete: ${data.created} created, ${data.updated} updated.`);
      queryClient.invalidateQueries({ queryKey: ["surveysherpa"] });
      queryClient.invalidateQueries({ queryKey: ["panelSurveys"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Sync failed";
      toast.error(msg);
    },
  });

  // Sync single stats mutation
  const statsMutation = useMutation({
    mutationFn: (surveyId: number) => surveySherpaApi.getSurveyStats(surveyId),
    onSuccess: (data) => {
      if (data.stats) {
        toast.success(
          `Stats updated! Entrances: ${data.stats.total_entrance}, Completes: ${data.stats.total_completes}`
        );
      } else {
        toast.info("No live stats available yet for this survey.");
      }
      queryClient.invalidateQueries({ queryKey: ["surveysherpa"] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to sync stats");
    },
  });

  // View survey details & screener criteria
  const handleViewQualifications = async (survey: SurveySherpaRemoteSurvey) => {
    setIsLoadingDetails(true);
    try {
      const details = await surveySherpaApi.getSurveyDetails(survey.survey_id);
      setSelectedSurveyForModal(details);
    } catch {
      setSelectedSurveyForModal({
        ...survey,
        qualifications: [],
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKeyInput.trim()) {
      toast.error("Please enter a valid SurveySherpa access key");
      return;
    }
    credentialsMutation.mutate({
      key: accessKeyInput.trim(),
      url: baseUrlInput.trim(),
    });
  };

  // Filtered surveys list
  const filteredSurveys = useMemo(() => {
    if (!remoteData?.surveys || !Array.isArray(remoteData.surveys)) return [];
    return remoteData.surveys.filter((s) => {
      const sAny = s as Record<string, unknown>;
      const name = String(s?.survey_name ?? sAny?.name ?? sAny?.surveyName ?? "").toLowerCase();
      const id = String(s?.survey_id ?? sAny?.id ?? "").toLowerCase();
      const desc = String(s?.description ?? "").toLowerCase();
      const term = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !term || name.includes(term) || id.includes(term) || desc.includes(term);

      const matchesLang =
        selectedLanguage === "all" || String(s?.lang_id ?? "") === selectedLanguage;

      const matchesImport =
        importFilter === "all" ||
        (importFilter === "imported" && Boolean(s?.isImported)) ||
        (importFilter === "not_imported" && !s?.isImported);

      return matchesSearch && matchesLang && matchesImport;
    });
  }, [remoteData?.surveys, searchTerm, selectedLanguage, importFilter]);

  const totalRemote = remoteData?.surveys?.length || 0;
  const totalImported = remoteData?.surveys?.filter((s) => Boolean(s?.isImported)).length || 0;
  const avgCpi =
    totalRemote > 0
      ? (
          remoteData!.surveys.reduce((acc, curr) => acc + (Number(curr?.cpi) || 0), 0) / totalRemote
        ).toFixed(2)
      : "0.00";
  const avgLoi =
    totalRemote > 0
      ? Math.round(
          remoteData!.surveys.reduce((acc, curr) => acc + (Number(curr?.loi) || 0), 0) / totalRemote
        )
      : 0;

  const handleExportCsv = () => {
    if (!filteredSurveys.length) return;
    const headers = [
      "Survey ID",
      "Name",
      "Language ID",
      "CPI (USD)",
      "LOI (Min)",
      "IR (%)",
      "Target Quota",
      "Imported",
      "Local Status",
    ];
    const rows = filteredSurveys.map((s) => [
      s.survey_id,
      s.survey_name,
      s.lang_id,
      formatCpi(s.cpi),
      Number(s.loi) || 0,
      Number(s.ir) || 0,
      Number(s.complete_required) || 0,
      s.isImported ? "Yes" : "No",
      s.localStatus || "Not in catalog",
    ]);
    downloadCsv(`surveysherpa-catalog-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="SurveySherpa Integration"
        description="Automated sample partner exchange: ingest live surveys, inspect screener qualifications & synchronize quotas."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="inline-flex h-10 px-4 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm items-center gap-2 transition-all"
            >
              <Key className="w-3.5 h-3.5 text-emerald-600" />
              <span>{showConfig ? "Hide Config" : "API Credentials"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                refetchStatus();
                refetchSurveys();
              }}
              disabled={isSurveysLoading}
              className="inline-flex h-10 px-4 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm items-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-blue-600 ${isSurveysLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => syncAllMutation.mutate()}
              disabled={syncAllMutation.isPending || isSurveysLoading}
              className="inline-flex h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-black text-white hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20 items-center gap-2 transition-all disabled:opacity-50"
            >
              {syncAllMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Sync All to Platform</span>
            </button>
          </div>
        }
      />

      {/* 2. Slide-Down API Credentials Configuration Box */}
      {showConfig && (
        <div className="rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-white p-5 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900">
                SurveySherpa Supplier Key Settings
              </h3>
              <p className="text-xs text-gray-500">
                Your credentials are stored securely in backend configuration and used to
                authenticate requests.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSaveCredentials}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2"
          >
            <div className="md:col-span-6 space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                Supplier Access Key (`access-key`)
              </label>
              <div className="relative">
                <input
                  type={showSecretKey ? "text" : "password"}
                  value={accessKeyInput}
                  onChange={(e) => setAccessKeyInput(e.target.value)}
                  placeholder="Enter SurveySherpa Access Key"
                  className="w-full h-10 pl-3 pr-10 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="md:col-span-4 space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                API Base URL
              </label>
              <input
                type="text"
                value={baseUrlInput}
                onChange={(e) => setBaseUrlInput(e.target.value)}
                placeholder="https://api.surveysherpa.com"
                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={credentialsMutation.isPending}
                className="w-full h-10 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
              >
                {credentialsMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>Verify & Save</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Luxury STAT_TONES Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Connection Status Card */}
        <div
          className={`group relative overflow-hidden rounded-[2rem] border ${
            statusData?.validKey ? STAT_TONES.emerald.cardBorder : STAT_TONES.amber.cardBorder
          } ${
            statusData?.validKey ? STAT_TONES.emerald.cardBg : STAT_TONES.amber.cardBg
          } p-5 shadow-xs transition-all duration-300`}
        >
          <div className="flex items-start justify-between gap-3">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider ${
                statusData?.validKey ? STAT_TONES.emerald.labelColor : STAT_TONES.amber.labelColor
              }`}
            >
              Exchange Link
            </span>
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                statusData?.validKey ? STAT_TONES.emerald.iconBox : STAT_TONES.amber.iconBox
              }`}
            >
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-2xl font-black tracking-tight ${
                statusData?.validKey ? STAT_TONES.emerald.valueColor : STAT_TONES.amber.valueColor
              }`}
            >
              {isStatusLoading
                ? "Connecting…"
                : statusData?.validKey
                  ? "Authorized"
                  : statusData?.connected
                    ? "Key Needed"
                    : "Offline"}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span
              className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                statusData?.validKey ? STAT_TONES.emerald.hintBadge : STAT_TONES.amber.hintBadge
              }`}
            >
              {statusData?.languageCount || 0} Languages
            </span>
            <span className="font-mono text-[10px] text-gray-500 truncate max-w-[120px]">
              {statusData?.baseUrl ? "api.surveysherpa.com" : "—"}
            </span>
          </div>
        </div>

        {/* Total Available Remote Card */}
        <div
          className={`group relative overflow-hidden rounded-[2rem] border ${STAT_TONES.blue.cardBorder} ${STAT_TONES.blue.cardBg} p-5 shadow-xs transition-all duration-300`}
        >
          <div className="flex items-start justify-between gap-3">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider ${STAT_TONES.blue.labelColor}`}
            >
              Available Remote
            </span>
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${STAT_TONES.blue.iconBox}`}
            >
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-black tracking-tight ${STAT_TONES.blue.valueColor}`}>
              {totalRemote}
            </span>
            <span className="text-xs font-semibold text-gray-400">studies</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span
              className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${STAT_TONES.blue.hintBadge}`}
            >
              Live on Sherpa
            </span>
            <span className="text-gray-500 font-medium text-[11px]">Assigned to IMX</span>
          </div>
        </div>

        {/* Platform Catalog Coverage Card */}
        <div
          className={`group relative overflow-hidden rounded-[2rem] border ${STAT_TONES.emerald.cardBorder} ${STAT_TONES.emerald.cardBg} p-5 shadow-xs transition-all duration-300`}
        >
          <div className="flex items-start justify-between gap-3">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider ${STAT_TONES.emerald.labelColor}`}
            >
              Imported into IMX
            </span>
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${STAT_TONES.emerald.iconBox}`}
            >
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-black tracking-tight ${STAT_TONES.emerald.valueColor}`}>
              {totalImported}
            </span>
            <span className="text-xs font-semibold text-gray-400">active</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span
              className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${STAT_TONES.emerald.hintBadge}`}
            >
              {totalRemote > 0
                ? `${Math.round((totalImported / totalRemote) * 100)}% Coverage`
                : "Ready"}
            </span>
            <span className="text-gray-500 font-medium text-[11px]">In Panel Survey</span>
          </div>
        </div>

        {/* Average Economics Card */}
        <div
          className={`group relative overflow-hidden rounded-[2rem] border ${STAT_TONES.violet.cardBorder} ${STAT_TONES.violet.cardBg} p-5 shadow-xs transition-all duration-300`}
        >
          <div className="flex items-start justify-between gap-3">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider ${STAT_TONES.violet.labelColor}`}
            >
              Economics (CPI / LOI)
            </span>
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${STAT_TONES.violet.iconBox}`}
            >
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-black tracking-tight ${STAT_TONES.violet.valueColor}`}>
              ${avgCpi}
            </span>
            <span className="text-xs font-semibold text-gray-400">/ {avgLoi} min</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span
              className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${STAT_TONES.violet.hintBadge}`}
            >
              Avg Return
            </span>
            <span className="text-gray-500 font-medium text-[11px]">per complete</span>
          </div>
        </div>
      </div>

      {/* 4. Main White Card Container with Table Toolbar */}
      <div className="rounded-[2rem] border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by campaign name, survey ID, topic…"
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-sm"
            />
          </div>

          {/* Filters & Export */}
          <div className="flex flex-wrap items-center gap-2.5 max-w-full">
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
              <Filter className="h-3 w-3" />
              Filters
            </span>

            {/* Language dropdown */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className={adminFilterSelectClass}
            >
              <option value="all">All Languages</option>
              {remoteData?.languages?.map((l) => (
                <option key={l.id} value={String(l.id)}>
                  {l.name}
                </option>
              ))}
            </select>

            {/* Import Status dropdown */}
            <select
              value={importFilter}
              onChange={(e) =>
                setImportFilter(e.target.value as "all" | "imported" | "not_imported")
              }
              className={adminFilterSelectClass}
            >
              <option value="all">All Statuses</option>
              <option value="imported">Imported in IMX</option>
              <option value="not_imported">Not In Catalog</option>
            </select>

            {/* Export CSV */}
            <button
              type="button"
              disabled={filteredSurveys.length === 0}
              onClick={handleExportCsv}
              className="h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 inline-flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 transition-colors shadow-sm"
              title="Export filtered surveys to CSV"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* 5. Desktop Data Table */}
        <div className="hidden lg:block overflow-x-auto custom-scrollbar rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <table className="w-full min-w-[840px] text-left text-xs text-slate-800">
            <thead className="bg-[#091428] text-white">
              <tr className="text-[10px] font-extrabold uppercase tracking-wider text-slate-100">
                <th className="py-2.5 px-3">Survey ID</th>
                <th className="py-2.5 px-3">Campaign / Name</th>
                <th className="py-2.5 px-3">CPI (USD)</th>
                <th className="py-2.5 px-3">LOI</th>
                <th className="py-2.5 px-3">IR</th>
                <th className="py-2.5 px-3">Quota</th>
                <th className="py-2.5 px-3">Catalog Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {isSurveysLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-600 mb-2" />
                    <p className="text-sm font-bold text-gray-800">
                      Connecting to SurveySherpa exchange…
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Retrieving latest survey allocations and quotas
                    </p>
                  </td>
                </tr>
              ) : filteredSurveys.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    {remoteData?.requiresValidKey ? (
                      <div className="max-w-md mx-auto space-y-3 p-4 bg-amber-50/60 rounded-2xl border border-amber-200/70">
                        <Key className="mx-auto h-8 w-8 text-amber-500" />
                        <p className="text-sm font-bold text-amber-900">
                          Valid Supplier Key Required
                        </p>
                        <p className="text-xs text-amber-700">
                          Click &quot;API Credentials&quot; at the top to enter your official
                          SurveySherpa access key to view your live assigned studies.
                        </p>
                      </div>
                    ) : (
                      <div className="py-6">
                        <Layers className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                        <p className="text-sm font-bold text-gray-700">No matching surveys found</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Try adjusting your search keyword or language filter.
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredSurveys.map((survey) => (
                  <tr key={survey.survey_id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Survey ID */}
                    <td className="py-2.5 px-3 font-mono text-xs font-bold text-slate-800 whitespace-nowrap align-middle">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 border border-slate-200">
                        #{survey.survey_id}
                      </span>
                    </td>

                    {/* Campaign Name & Description */}
                    <td className="py-2.5 px-3 max-w-sm align-middle">
                      <div className="font-bold text-gray-900 line-clamp-1">
                        {survey.survey_name ||
                          ((survey as Record<string, unknown>).name as string) ||
                          `Survey #${survey.survey_id}`}
                      </div>
                      {survey.description ? (
                        <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                          {survey.description}
                        </div>
                      ) : null}
                    </td>

                    {/* CPI */}
                    <td className="py-2.5 px-3 whitespace-nowrap align-middle">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ${formatCpi(survey.cpi)}
                      </span>
                    </td>

                    {/* LOI */}
                    <td className="py-2.5 px-3 text-xs text-gray-600 whitespace-nowrap align-middle">
                      <div className="inline-flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{Number(survey.loi) || 0} min</span>
                      </div>
                    </td>

                    {/* IR */}
                    <td className="py-2.5 px-3 text-xs text-gray-600 whitespace-nowrap align-middle">
                      <div className="inline-flex items-center gap-0.5 font-semibold">
                        <span>{Number(survey.ir) || 0}%</span>
                      </div>
                    </td>

                    {/* Quota */}
                    <td className="py-2.5 px-3 text-xs font-bold text-gray-800 whitespace-nowrap align-middle">
                      {Number(survey.complete_required) || 0}
                    </td>

                    {/* Catalog Status */}
                    <td className="py-2.5 px-3 whitespace-nowrap align-middle">
                      {survey.isImported ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Imported
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
                          Not In Catalog
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right align-middle whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Screener View */}
                        <button
                          type="button"
                          onClick={() => handleViewQualifications(survey)}
                          className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 shadow-xs transition-colors"
                          title="View Screener Criteria"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Live Stats */}
                        <button
                          type="button"
                          onClick={() => statsMutation.mutate(survey.survey_id)}
                          disabled={statsMutation.isPending}
                          className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white text-blue-600 hover:text-blue-700 hover:bg-blue-50 shadow-xs transition-colors"
                          title="Poll Live Stats (Entrances & Completes)"
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </button>

                        {/* Import / Manage */}
                        {survey.isImported ? (
                          <Link
                            href={`/admin/surveys/${survey.localSurveyId}`}
                            className="h-7 px-2.5 inline-flex items-center gap-1 rounded-lg bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 shadow-xs transition-colors"
                          >
                            <span>Manage</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => importMutation.mutate(survey.survey_id)}
                            disabled={importMutation.isPending}
                            className="h-7 px-2.5 inline-flex items-center gap-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 shadow-xs transition-colors disabled:opacity-50"
                          >
                            <span>Import</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 6. Mobile Card View */}
        <div className="lg:hidden space-y-3">
          {isSurveysLoading ? (
            <div className="py-8 text-center text-gray-500">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-600 mb-2" />
              <p className="text-xs">Loading surveys…</p>
            </div>
          ) : filteredSurveys.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs">No surveys found</div>
          ) : (
            filteredSurveys.map((survey) => (
              <div
                key={survey.survey_id}
                className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-gray-500">
                      #{survey.survey_id}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm mt-0.5">
                      {survey.survey_name || `Survey #${survey.survey_id}`}
                    </h4>
                  </div>
                  {survey.isImported ? (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                      Imported
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-gray-200 text-gray-700">
                      Unmapped
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-white rounded-xl border border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">CPI</span>
                    <span className="font-extrabold text-emerald-600">
                      ${formatCpi(survey.cpi)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">LOI</span>
                    <span className="font-bold text-gray-700">{Number(survey.loi) || 0}m</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Quota
                    </span>
                    <span className="font-bold text-gray-700">
                      {Number(survey.complete_required) || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleViewQualifications(survey)}
                    className="h-8 px-3 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Criteria</span>
                  </button>

                  {survey.isImported ? (
                    <Link
                      href={`/admin/surveys/${survey.localSurveyId}`}
                      className="h-8 px-3 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 inline-flex items-center gap-1"
                    >
                      <span>Manage</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => importMutation.mutate(survey.survey_id)}
                      disabled={importMutation.isPending}
                      className="h-8 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 inline-flex items-center gap-1"
                    >
                      <span>Import Survey</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 7. Screener Criteria & Qualifications Modal */}
      {selectedSurveyForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-[2rem] border border-gray-100 bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="font-mono text-[11px] font-bold text-emerald-600 uppercase">
                  SurveySherpa #{selectedSurveyForModal.survey_id}
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-0.5">
                  {selectedSurveyForModal.survey_name ||
                    `Survey #${selectedSurveyForModal.survey_id}`}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 font-semibold">
                  <span className="text-emerald-700 font-extrabold">
                    CPI: ${formatCpi(selectedSurveyForModal.cpi)}
                  </span>
                  <span>•</span>
                  <span>LOI: {Number(selectedSurveyForModal.loi) || 0} mins</span>
                  <span>•</span>
                  <span>
                    Quota: {Number(selectedSurveyForModal.complete_required) || 0} completes
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSurveyForModal(null)}
                className="h-8 w-8 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 inline-flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1 custom-scrollbar">
              {isLoadingDetails ? (
                <div className="py-12 text-center text-gray-500">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-600 mb-2" />
                  <p className="text-xs font-bold">Fetching screener questions from exchange…</p>
                </div>
              ) : selectedSurveyForModal.qualifications &&
                selectedSurveyForModal.qualifications.length > 0 ? (
                selectedSurveyForModal.qualifications.map((q, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-gray-900">
                        {q.questionKey || `Question ${idx + 1}`}
                      </span>
                      <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-800">
                        {q.questionType}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-700">{q.questionText}</p>
                    {q.options && q.options.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <span
                            key={oIdx}
                            className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-700 shadow-xs"
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-500 space-y-1">
                  <Sparkles className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                  <p className="text-sm font-bold text-gray-900">General Population Study</p>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    No restrictive screener criteria returned by SurveySherpa. Open to all matching
                    respondents.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedSurveyForModal(null)}
                className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {!selectedSurveyForModal.isImported && (
                <button
                  type="button"
                  onClick={() => {
                    importMutation.mutate(selectedSurveyForModal.survey_id);
                    setSelectedSurveyForModal(null);
                  }}
                  className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Import Survey</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
