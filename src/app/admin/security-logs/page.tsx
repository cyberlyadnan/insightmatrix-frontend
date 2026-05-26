"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Shield } from "lucide-react";

import { getSecurityAnalytics, listSecurityLogs } from "@/services/security-logs/security-logs-api";

export default function AdminSecurityLogsPage() {
  const [decision, setDecision] = useState("");

  const logsQuery = useQuery({
    queryKey: ["security-logs", { decision }],
    queryFn: () =>
      listSecurityLogs({
        pageSize: 50,
        validationDecision: decision || undefined,
      }),
  });

  const analyticsQuery = useQuery({
    queryKey: ["security-analytics", {}],
    queryFn: () => getSecurityAnalytics({}),
  });

  const stats = analyticsQuery.data;
  const items = logsQuery.data?.items ?? [];

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Shield className="h-7 w-7 text-brand-primary" />
          Security audit
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Blocked traffic, captcha failures, geo mismatches, and bot signals.
        </p>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Total checks", stats.total],
            ["Blocked", stats.blocked],
            ["Block rate %", stats.blockRate],
            ["Captcha fail %", stats.captchaFailureRate],
            ["Bot signals %", stats.botTrafficRate],
          ].map(([label, val]) => (
            <div key={String(label)} className="rounded-2xl border bg-white p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                {label}
              </p>
              <p className="text-xl font-black mt-1">{val}</p>
            </div>
          ))}
        </div>
      )}

      <select
        value={decision}
        onChange={(e) => setDecision(e.target.value)}
        className="rounded-xl border px-3 py-2 text-sm"
      >
        <option value="">All decisions</option>
        <option value="allow">Allow</option>
        <option value="block">Block</option>
        <option value="review">Review</option>
      </select>

      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-[10px] font-black uppercase text-gray-500">
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">IP</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Decision</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Flags</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row._id} className="border-b border-gray-50">
                <td className="px-4 py-3 text-xs whitespace-nowrap">
                  {row.createdAt ? format(new Date(row.createdAt), "MMM d HH:mm") : "—"}
                </td>
                <td className="px-4 py-3">{row.channel}</td>
                <td className="px-4 py-3 font-mono text-xs">{row.ipAddress}</td>
                <td className="px-4 py-3">{row.country || "—"}</td>
                <td className="px-4 py-3 font-semibold">{row.validationDecision}</td>
                <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px] truncate">
                  {row.blockedReason || row.reasonCode}
                </td>
                <td className="px-4 py-3 text-xs">
                  {row.botDetected ? "bot " : ""}
                  {row.vpnDetected ? "vpn " : ""}
                  {row.captchaPassed === false ? "captcha✗" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
