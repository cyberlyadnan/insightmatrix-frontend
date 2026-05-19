"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, Users } from "lucide-react";

import { listVendorRespondentSessions } from "@/services/vendor-respondent-tracking/vendor-respondent-tracking-api";
import { queryKeys } from "@/services/queries";
import { VENDOR_RESPONDENT_SESSION_STATUSES } from "@/constants/vendor-allocation";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    started: "bg-slate-100 text-slate-600",
    redirected: "bg-blue-50 text-blue-700",
    complete: "bg-emerald-50 text-emerald-700",
    terminate: "bg-amber-50 text-amber-800",
    quota_full: "bg-orange-50 text-orange-800",
    quality_reject: "bg-rose-50 text-rose-700",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
        styles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default function VendorRespondentTrackingPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [callbackForwarded, setCallbackForwarded] = useState<"" | "true" | "false">("");

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.vendorRespondentSessions.list({ search, status, callbackForwarded }),
    queryFn: () =>
      listVendorRespondentSessions({
        pageSize: 50,
        search: search || undefined,
        status: status || undefined,
        callbackForwarded: callbackForwarded || undefined,
      }),
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Users className="h-7 w-7 text-brand-primary" />
          Vendor respondent tracking
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Vendor toid ↔ internal token mapping, callback status, and session lifecycle.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Vendor toid, internal token, supplier pid…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
        >
          <option value="">All statuses</option>
          {VENDOR_RESPONDENT_SESSION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={callbackForwarded}
          onChange={(e) => setCallbackForwarded(e.target.value as "" | "true" | "false")}
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
        >
          <option value="">Callback: any</option>
          <option value="true">Forwarded</option>
          <option value="false">Not forwarded</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500 py-12 text-center">Loading sessions…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500 py-12 text-center rounded-2xl border border-dashed border-gray-200">
          No vendor respondent sessions match your filters.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-[10px] font-black uppercase tracking-widest text-gray-500">
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Survey</th>
                <th className="px-4 py-3">Vendor toid</th>
                <th className="px-4 py-3">Internal token</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Callback</th>
                <th className="px-4 py-3">Started</th>
                <th className="px-4 py-3">Completed</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-900">{row.vendor?.companyName}</p>
                    <p className="text-xs text-gray-500">{row.vendor?.vendorCode}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium line-clamp-1">{row.panelSurvey?.surveyName}</p>
                    <p className="text-xs text-gray-500 font-mono">{row.allocation?.routingSlug}</p>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs font-bold text-brand-primary">
                    {row.vendorRespondentToid || "—"}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs">{row.internalSessionToken}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-4">
                    {row.callbackForwarded ? (
                      <span className="text-xs font-semibold text-emerald-700">Yes</span>
                    ) : (
                      <span className="text-xs text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500 whitespace-nowrap">
                    {row.startedAt ? format(new Date(row.startedAt), "MMM d, HH:mm") : "—"}
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500 whitespace-nowrap">
                    {row.completedAt ? format(new Date(row.completedAt), "MMM d, HH:mm") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
