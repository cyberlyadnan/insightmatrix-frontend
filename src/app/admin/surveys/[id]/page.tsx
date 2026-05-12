"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  ClipboardList,
  ExternalLink,
  Globe,
  Layers,
  Link2,
  Pencil,
  Pause,
  Play,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Modal } from "@/components/shared/Modal";
import {
  PANEL_QUOTA_GROUP_STATUS_LABELS,
  PANEL_SURVEY_DEVICE_TYPES,
  PANEL_GENDER_LABELS,
  PANEL_SURVEY_STATUS_LABELS,
  type PanelSurveyStatus,
} from "@/constants/panel-survey";
import { ROUTES } from "@/constants/routes";
import { parseApiError } from "@/services/api/errors";
import { deletePanelSurvey, getPanelSurvey, patchPanelSurveyStatus } from "@/services/panel-survey";
import { queryKeys } from "@/services/queries";

type TabId = "overview" | "provider" | "targeting" | "quotas" | "metrics" | "url" | "notes";

function StatusBadge({ status }: { status: PanelSurveyStatus }) {
  const styles: Record<PanelSurveyStatus, string> = {
    draft: "bg-gray-100 text-gray-700",
    active: "bg-emerald-50 text-emerald-700",
    paused: "bg-amber-50 text-amber-700",
    completed: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}
    >
      {PANEL_SURVEY_STATUS_LABELS[status]}
    </span>
  );
}

const tabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "provider", label: "Provider" },
  { id: "targeting", label: "Targeting" },
  { id: "quotas", label: "Quotas" },
  { id: "metrics", label: "Metrics" },
  { id: "url", label: "URL config" },
  { id: "notes", label: "Notes" },
];

export default function PanelSurveyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const qc = useQueryClient();
  const [tab, setTab] = useState<TabId>("overview");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    data: survey,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.panelSurveys.detail(id),
    queryFn: () => getPanelSurvey(id),
    enabled: Boolean(id),
  });

  const pauseResumeMutation = useMutation({
    mutationFn: (next: PanelSurveyStatus) => patchPanelSurveyStatus(id, next),
    onSuccess: async (_, next) => {
      toast.success(next === "paused" ? "Survey paused" : "Survey resumed");
      await qc.invalidateQueries({ queryKey: queryKeys.panelSurveys.all });
      await qc.invalidateQueries({ queryKey: queryKeys.panelSurveys.detail(id) });
    },
    onError: (e) => toast.error(parseApiError(e, "Could not update status")),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePanelSurvey(id),
    onSuccess: async () => {
      toast.success("Survey deleted");
      setDeleteOpen(false);
      await qc.invalidateQueries({ queryKey: queryKeys.panelSurveys.all });
      router.push(ROUTES.admin.surveys);
    },
    onError: (e) => toast.error(parseApiError(e, "Could not delete")),
  });

  if (!id) return <p className="text-sm text-gray-500">Invalid survey.</p>;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-gray-100 rounded-xl w-2/3" />
        <div className="h-48 bg-gray-100 rounded-[2rem]" />
      </div>
    );
  }

  if (isError || !survey) {
    return (
      <div className="max-w-5xl mx-auto">
        <p className="text-gray-600 font-medium">Survey not found.</p>
        <Link
          href={ROUTES.admin.surveys}
          className="text-brand-primary font-bold mt-2 inline-block"
        >
          Back to list
        </Link>
      </div>
    );
  }

  const startHref = ROUTES.surveyStart(survey.id);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <Link
            href={ROUTES.admin.surveys}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-primary mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Surveys
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {survey.surveyName}
            </h1>
            <StatusBadge status={survey.surveyStatus} />
          </div>
          <p className="text-sm font-mono text-gray-500 mt-1">{survey.surveyCode}</p>
          <a
            href={startHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-xs font-black uppercase tracking-widest text-brand-primary hover:underline"
          >
            Open participant landing <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {survey.surveyStatus === "active" ? (
            <button
              type="button"
              onClick={() => pauseResumeMutation.mutate("paused")}
              disabled={pauseResumeMutation.isPending}
              className="h-11 px-4 rounded-xl border border-amber-200 text-amber-800 font-bold text-sm hover:bg-amber-50 inline-flex items-center gap-2 disabled:opacity-60"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          ) : survey.surveyStatus === "paused" ? (
            <button
              type="button"
              onClick={() => pauseResumeMutation.mutate("active")}
              disabled={pauseResumeMutation.isPending}
              className="h-11 px-4 rounded-xl border border-emerald-200 text-emerald-800 font-bold text-sm hover:bg-emerald-50 inline-flex items-center gap-2 disabled:opacity-60"
            >
              <Play className="w-4 h-4" />
              Resume
            </button>
          ) : null}
          <Link
            href={ROUTES.admin.surveyAnalytics(id)}
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 font-bold text-sm hover:bg-gray-50 inline-flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Link>
          <Link
            href={ROUTES.admin.surveyEdit(id)}
            className="h-11 px-4 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-black inline-flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="h-11 px-4 rounded-xl border border-rose-200 text-rose-600 font-bold text-sm hover:bg-rose-50 inline-flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
              tab === t.id
                ? "bg-gray-900 text-white"
                : "bg-gray-50 text-gray-500 hover:text-gray-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Summary
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">External ID</dt>
                <dd className="font-mono text-gray-900 text-right break-all">
                  {survey.externalSurveyId || "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Priority</dt>
                <dd className="font-black text-gray-900">{survey.surveyPriority}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-800">
                  {survey.createdAt ? format(new Date(survey.createdAt), "MMM d, yyyy HH:mm") : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Updated</dt>
                <dd className="text-gray-800">
                  {survey.updatedAt ? format(new Date(survey.updatedAt), "MMM d, yyyy HH:mm") : "—"}
                </dd>
              </div>
            </dl>
          </div>
          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Field window
            </h2>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>
                  <span className="font-black text-gray-900 block">Start</span>
                  {survey.startDate ? format(new Date(survey.startDate), "PPp") : "—"}
                </span>
              </li>
              <li className="flex gap-2">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>
                  <span className="font-black text-gray-900 block">End</span>
                  {survey.endDate ? format(new Date(survey.endDate), "PPp") : "—"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {tab === "provider" && (
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
            Linked provider
          </h2>
          {survey.provider ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xl font-black text-gray-900">{survey.provider.companyName}</p>
                <p className="text-sm font-mono text-gray-500">{survey.provider.companyCode}</p>
              </div>
              <Link
                href={ROUTES.admin.company(survey.provider.id)}
                className="h-11 px-5 rounded-xl border border-gray-200 font-bold text-sm hover:bg-gray-50 inline-flex items-center justify-center"
              >
                View provider
              </Link>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Provider record unavailable.</p>
          )}
        </div>
      )}

      {tab === "targeting" && (
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Audience targeting
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Countries
              </p>
              <p className="text-gray-900 font-medium">
                {(survey.targetCountries ?? []).join(", ") || "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Gender
              </p>
              <p className="text-gray-900 font-medium">
                {PANEL_GENDER_LABELS[survey.targetGender]}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Age range
              </p>
              <p className="text-gray-900 font-medium">
                {survey.targetAgeMin != null || survey.targetAgeMax != null
                  ? `${survey.targetAgeMin ?? "…"} – ${survey.targetAgeMax ?? "…"}`
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Devices
              </p>
              <p className="text-gray-900 font-medium capitalize">
                {(survey.targetDevices ?? []).length ? survey.targetDevices.join(", ") : "—"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Languages
              </p>
              <p className="text-gray-900">{(survey.targetLanguages ?? []).join(", ") || "—"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Professions
              </p>
              <p className="text-gray-900 whitespace-pre-wrap">
                {(survey.targetProfessions ?? []).join(", ") || "—"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Industries
              </p>
              <p className="text-gray-900 whitespace-pre-wrap">
                {(survey.targetIndustries ?? []).join(", ") || "—"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Company sizes
              </p>
              <p className="text-gray-900">{(survey.targetCompanySizes ?? []).join(", ") || "—"}</p>
            </div>
          </div>
        </div>
      )}

      {tab === "quotas" && (
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm flex flex-wrap gap-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Total quota
              </p>
              <p className="text-2xl font-black text-gray-900">{survey.totalQuota}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Remaining
              </p>
              <p className="text-2xl font-black text-brand-primary">{survey.remainingQuota}</p>
            </div>
          </div>
          <div className="rounded-[2rem] border border-gray-100 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <th className="px-4 py-3">Group</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Remaining</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(survey.dynamicQuotaGroups ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">
                      No quota groups configured.
                    </td>
                  </tr>
                ) : (
                  survey.dynamicQuotaGroups.map((g) => (
                    <tr key={g.id}>
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900">{g.groupName}</p>
                        {g.groupDescription ? (
                          <p className="text-xs text-gray-500 mt-0.5">{g.groupDescription}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 font-mono">{g.totalQuota}</td>
                      <td className="px-4 py-3 font-mono">{g.remainingQuota}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                          {PANEL_QUOTA_GROUP_STATUS_LABELS[g.status]}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "metrics" && (
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Points & feasibility
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Rewards use panel <strong>points</strong> only (no cash). Values below configure study
            economics for routing.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-gray-400 text-[10px] font-black uppercase mb-1">Incidence rate</p>
              <p className="text-xl font-black text-gray-900">
                {survey.incidenceRate != null ? `${survey.incidenceRate}%` : "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-black uppercase mb-1">Est. LOI</p>
              <p className="text-xl font-black text-gray-900">
                {survey.estimatedLOI != null ? `${survey.estimatedLOI} min` : "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-black uppercase mb-1">
                Participant points / complete
              </p>
              <p className="text-xl font-black text-gray-900">
                {survey.payoutToUser != null ? `${survey.payoutToUser} pts` : "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-black uppercase mb-1">
                Internal reference pts / complete
              </p>
              <p className="text-xl font-black text-gray-900">
                {survey.revenuePerComplete != null ? `${survey.revenuePerComplete} pts` : "—"}
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === "url" && (
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Routing URL
          </h2>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
              External survey URL
            </p>
            <a
              href={survey.externalSurveyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-brand-primary font-mono text-sm hover:underline inline-flex items-start gap-2"
            >
              {survey.externalSurveyUrl}
              <ExternalLink className="w-4 h-4 shrink-0 mt-0.5" />
            </a>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Partner project ID (<span className="font-mono normal-case">pid</span>)
            </p>
            <code className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 font-mono text-sm text-gray-900">
              {survey.supplierProjectPid?.trim() ? survey.supplierProjectPid : "—"}
            </code>
            <p className="text-xs text-gray-500 mt-2">
              Parsed from <span className="font-mono">pid=</span> on the supplier URL (or set
              manually). Match supplier callbacks on this value to identify{" "}
              <strong>which survey</strong>; respondent completes use{" "}
              <span className="font-mono">toid</span> / <span className="font-mono">uid</span>.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Tracking parameter
            </p>
            <code className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 font-mono text-sm">
              {survey.trackingParameterName || "toid"}
            </code>
            <p className="text-xs text-gray-500 mt-2">
              Transaction IDs will be injected into this query key when the redirect engine is
              enabled.
            </p>
          </div>
        </div>
      )}

      {tab === "notes" && (
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Internal notes
          </h2>
          {survey.notes?.trim() ? (
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{survey.notes}</p>
          ) : (
            <p className="text-gray-500 text-sm">No notes.</p>
          )}
        </div>
      )}

      <Modal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete survey?"
        description={`Remove “${survey.surveyName}” permanently.`}
        footer={
          <div className="flex gap-2 justify-end w-full">
            <button
              type="button"
              className="h-10 px-4 rounded-xl border border-gray-200 font-bold"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleteMutation.isPending}
              className="h-10 px-4 rounded-xl bg-rose-600 text-white font-bold disabled:opacity-60"
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </button>
          </div>
        }
      >
        <p className="text-sm text-gray-600">This cannot be undone from the UI.</p>
      </Modal>
    </div>
  );
}
