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
      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
        ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
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
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Routing logs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Vendor callback forwarding, response codes, and gateway routing activity.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-xl border-b-2 transition ${
              tab === t.id
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "webhooks" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {(["", "success", "failed"] as const).map((s) => (
              <button
                key={s || "all"}
                type="button"
                onClick={() => setDeliveryFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  deliveryFilter === s
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s === "" ? "All" : s}
              </button>
            ))}
          </div>

          {webhookQuery.isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-gray-100">
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Vendor</th>
                    <th className="px-4 py-3">Survey</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">HTTP</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {(webhookQuery.data?.items ?? []).map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/80">
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {row.attemptedAt
                          ? format(new Date(row.attemptedAt), "MMM d HH:mm:ss")
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">
                          {row.vendorCompanyName ?? "—"}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">{row.vendorCode}</p>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {row.surveyName ?? row.surveyCode ?? row.panelSurveyId.slice(-6)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{row.callbackType}</td>
                      <td className="px-4 py-3 font-mono text-xs">{row.responseStatus ?? "—"}</td>
                      <td className="px-4 py-3">
                        <StatusPill ok={row.deliveryStatus === "success"} />
                      </td>
                      <td className="px-4 py-3 text-xs text-rose-600 max-w-[200px] truncate">
                        {row.errorMessage || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(webhookQuery.data?.items?.length ?? 0) === 0 && (
                <p className="text-center text-sm text-gray-500 py-12">
                  No webhook deliveries yet.
                </p>
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
            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-gray-100">
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Channel</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Result</th>
                    <th className="px-4 py-3">Session</th>
                    <th className="px-4 py-3">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {(gatewayQuery.data?.items ?? []).map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/80">
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {row.createdAt ? format(new Date(row.createdAt), "MMM d HH:mm:ss") : "—"}
                      </td>
                      <td className="px-4 py-3 capitalize text-xs font-bold">{row.channel}</td>
                      <td className="px-4 py-3 font-mono text-xs">{row.action}</td>
                      <td className="px-4 py-3">
                        <StatusPill ok={row.success} />
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-gray-500 max-w-[120px] truncate">
                        {row.sessionToken || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px] truncate">
                        {row.failureReason || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(gatewayQuery.data?.items?.length ?? 0) === 0 && (
                <p className="text-center text-sm text-gray-500 py-12">No gateway events yet.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
