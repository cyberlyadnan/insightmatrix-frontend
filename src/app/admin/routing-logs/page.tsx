"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Activity, Loader2, Webhook } from "lucide-react";

import {
  listGatewayRoutingLogs,
  listWebhookDeliveryLogs,
} from "@/services/routing-logs/routing-logs-api";
import { queryKeys } from "@/services/queries";

type TabId = "webhooks" | "gateway";

function StatusPill({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border leading-none ${
        ok
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-rose-50 text-rose-700 border-rose-200"
      }`}
    >
      {ok ? "Success" : "Failed"}
    </span>
  );
}

export default function AdminRoutingLogsPage() {
  const [tab, setTab] = useState<TabId>("webhooks");
  const [deliveryFilter, setDeliveryFilter] = useState<"" | "success" | "failed">("");

  const webhookQuery = useQuery({
    queryKey: queryKeys.routingLogs.webhooks({ status: deliveryFilter }),
    queryFn: () =>
      listWebhookDeliveryLogs({
        pageSize: 50,
        deliveryStatus: deliveryFilter || undefined,
      }),
    enabled: tab === "webhooks",
  });

  const gatewayQuery = useQuery({
    queryKey: queryKeys.routingLogs.gateway({}),
    queryFn: () => listGatewayRoutingLogs({ pageSize: 50 }),
    enabled: tab === "gateway",
  });

  const tabs: { id: TabId; label: string; icon: typeof Webhook }[] = [
    { id: "webhooks", label: "Webhook deliveries", icon: Webhook },
    { id: "gateway", label: "Gateway logs", icon: Activity },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Routing logs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Vendor callback forwarding, response codes, and gateway routing activity.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`h-11 px-5 rounded-2xl text-xs font-black uppercase tracking-widest inline-flex items-center gap-2 transition-all ${
                active
                  ? "bg-gray-900 text-white shadow-md shadow-gray-900/10"
                  : "bg-white text-gray-500 border border-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "webhooks" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500 mr-2">Filter status:</span>
            {(["", "success", "failed"] as const).map((s) => (
              <button
                key={s || "all"}
                type="button"
                onClick={() => setDeliveryFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                  deliveryFilter === s
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s || "All"}
              </button>
            ))}
          </div>

          {webhookQuery.isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar rounded-xl border border-slate-200/90 bg-white shadow-sm">
              <table className="w-full min-w-[850px] text-xs text-slate-800">
                <thead className="bg-[#091428] text-white">
                  <tr className="text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-100">
                    <th className="px-3 py-2 whitespace-nowrap">Time</th>
                    <th className="px-3 py-2 whitespace-nowrap">Vendor</th>
                    <th className="px-3 py-2 whitespace-nowrap">Survey</th>
                    <th className="px-3 py-2 whitespace-nowrap">Type</th>
                    <th className="px-3 py-2 whitespace-nowrap">HTTP</th>
                    <th className="px-3 py-2 whitespace-nowrap">Status</th>
                    <th className="px-3 py-2 whitespace-nowrap">Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(webhookQuery.data?.items ?? []).map((row) => (
                    <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-3 py-1.5 text-xs text-slate-500 whitespace-nowrap align-middle">
                        {row.attemptedAt
                          ? format(new Date(row.attemptedAt), "MMM d HH:mm:ss")
                          : "—"}
                      </td>
                      <td className="px-3 py-1.5 max-w-[180px] align-middle">
                        <p
                          className="font-bold text-slate-900 truncate text-xs"
                          title={row.vendorCompanyName ?? ""}
                        >
                          {row.vendorCompanyName ?? "—"}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {row.vendorCode}
                        </span>
                      </td>
                      <td
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 max-w-[180px] truncate whitespace-nowrap align-middle"
                        title={row.surveyName ?? row.surveyCode ?? ""}
                      >
                        {row.surveyName ?? row.surveyCode ?? row.panelSurveyId.slice(-6)}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-xs text-slate-600 whitespace-nowrap align-middle">
                        {row.callbackType}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-xs font-bold text-slate-800 whitespace-nowrap align-middle">
                        {row.responseStatus ?? "—"}
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap align-middle">
                        <StatusPill ok={row.deliveryStatus === "success"} />
                      </td>
                      <td
                        className="px-3 py-1.5 text-xs text-rose-600 font-medium max-w-[200px] truncate whitespace-nowrap align-middle"
                        title={row.errorMessage || ""}
                      >
                        {row.errorMessage || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(webhookQuery.data?.items?.length ?? 0) === 0 && (
                <p className="text-center text-xs text-gray-500 py-8">No webhook deliveries yet.</p>
              )}
            </div>
          )}
        </div>
      )}

      {tab === "gateway" && (
        <>
          {gatewayQuery.isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar rounded-xl border border-slate-200/90 bg-white shadow-sm">
              <table className="w-full min-w-[750px] text-xs text-slate-800">
                <thead className="bg-[#091428] text-white">
                  <tr className="text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-100">
                    <th className="px-3 py-2 whitespace-nowrap">Time</th>
                    <th className="px-3 py-2 whitespace-nowrap">Channel</th>
                    <th className="px-3 py-2 whitespace-nowrap">Action</th>
                    <th className="px-3 py-2 whitespace-nowrap">Result</th>
                    <th className="px-3 py-2 whitespace-nowrap">Session</th>
                    <th className="px-3 py-2 whitespace-nowrap">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(gatewayQuery.data?.items ?? []).map((row) => (
                    <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-3 py-1.5 text-xs text-slate-500 whitespace-nowrap align-middle">
                        {row.createdAt ? format(new Date(row.createdAt), "MMM d HH:mm:ss") : "—"}
                      </td>
                      <td className="px-3 py-1.5 capitalize text-xs font-bold text-slate-900 whitespace-nowrap align-middle">
                        {row.channel}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-xs text-slate-700 whitespace-nowrap align-middle">
                        {row.action}
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap align-middle">
                        <StatusPill ok={row.success} />
                      </td>
                      <td
                        className="px-3 py-1.5 font-mono text-[10px] text-slate-500 max-w-[140px] truncate whitespace-nowrap align-middle"
                        title={row.sessionToken || ""}
                      >
                        {row.sessionToken || "—"}
                      </td>
                      <td
                        className="px-3 py-1.5 text-xs text-slate-600 max-w-[180px] truncate whitespace-nowrap align-middle"
                        title={row.failureReason || ""}
                      >
                        {row.failureReason || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(gatewayQuery.data?.items?.length ?? 0) === 0 && (
                <p className="text-center text-xs text-gray-500 py-8">No gateway events yet.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
