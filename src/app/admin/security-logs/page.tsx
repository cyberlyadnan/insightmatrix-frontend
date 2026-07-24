"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Shield } from "lucide-react";

import { PageHelp } from "@/components/crm/page-help";
import { ADMIN_PAGE_HELP } from "@/constants/admin-page-help";
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-2">
            <Shield className="h-7 w-7 text-brand-primary" />
            Security Logs
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Blocked traffic, captcha failures, geo mismatches, and bot signals.
          </p>
        </div>
        <PageHelp content={ADMIN_PAGE_HELP.securityLogs} />
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
            <div
              key={String(label)}
              className="rounded-[1.5rem] border border-gray-100 bg-white p-4 shadow-sm"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                {label}
              </p>
              <p className="text-xl font-black mt-1">{val}</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-[2rem] border border-gray-100 bg-white p-4 shadow-sm">
        <label className="block text-sm max-w-xs">
          <span className="font-bold text-gray-700">Decision</span>
          <select
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="">All decisions</option>
            <option value="allow">Allow</option>
            <option value="block">Block</option>
            <option value="review">Review</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-gray-100 bg-white shadow-sm">
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
