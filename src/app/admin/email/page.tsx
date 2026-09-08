"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Mail, RefreshCw, Send, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { PageHelp } from "@/components/crm/page-help";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_PAGE_HELP } from "@/constants/admin-page-help";
import { parseApiError } from "@/services/api/errors";
import { getEmailDeliveryStatus, sendAdminTestEmail } from "@/services/email";
import { queryKeys } from "@/services/queries";
import { useAuthStore } from "@/store/authStore";

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
        ok
          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
          : "bg-rose-50 text-rose-700 border border-rose-100"
      }`}
    >
      {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}

export default function AdminEmailDeliveryPage() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [to, setTo] = useState(user?.email ?? "");

  const statusQuery = useQuery({
    queryKey: queryKeys.admin.emailStatus,
    queryFn: getEmailDeliveryStatus,
    refetchOnWindowFocus: false,
  });

  const status = statusQuery.data;

  const sendMutation = useMutation({
    mutationFn: () => sendAdminTestEmail(to.trim()),
    onSuccess: (res) => {
      toast.success(res.message || "Test email sent");
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.emailStatus });
    },
    onError: (err) => {
      toast.error(parseApiError(err, "Could not send test email"));
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.emailStatus });
    },
  });

  const rows = useMemo(
    () => [
      { label: "Host", value: status?.host ?? "—" },
      { label: "Port", value: status ? String(status.port) : "—" },
      { label: "Secure (465)", value: status ? (status.secure ? "Yes" : "No (STARTTLS)") : "—" },
      { label: "SMTP user", value: status?.user ?? "—" },
      { label: "From", value: status?.from ?? "—" },
      { label: "Reply-To", value: status?.replyTo || "—" },
      { label: "Client URL", value: status?.clientUrl ?? "—" },
      { label: "API public URL", value: status?.apiPublicUrl ?? "—" },
    ],
    [status]
  );

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Mail className="h-7 w-7 text-brand-primary" />
            Email delivery
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Diagnose SMTP, send a test message, and confirm password-reset mail can leave the
            server.
          </p>
        </div>
        <PageHelp content={ADMIN_PAGE_HELP.emailDelivery} />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">SMTP health</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Live check against the API mailer configuration
            </p>
          </div>
          <div className="flex items-center gap-2">
            {status ? (
              <>
                <StatusPill
                  ok={status.configured}
                  label={status.configured ? "Configured" : "Incomplete"}
                />
                <StatusPill
                  ok={status.verified}
                  label={status.verified ? "Connected" : "Not connected"}
                />
              </>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-gray-200"
              disabled={statusQuery.isFetching}
              onClick={() => void statusQuery.refetch()}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-1.5 ${statusQuery.isFetching ? "animate-spin" : ""}`}
              />
              Recheck
            </Button>
          </div>
        </div>

        {statusQuery.isLoading ? (
          <p className="text-sm text-gray-500">Checking SMTP…</p>
        ) : statusQuery.isError ? (
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {parseApiError(statusQuery.error, "Could not load email status")}
          </div>
        ) : (
          <>
            {status?.verifyError ? (
              <div className="mb-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold">Connection error</p>
                  <p className="mt-1 leading-relaxed break-words">{status.verifyError}</p>
                </div>
              </div>
            ) : null}

            <dl className="grid gap-3 sm:grid-cols-2">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3"
                >
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900 break-all">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Send test email</h2>
        <p className="text-xs text-gray-500 mt-0.5 mb-5">
          Uses the same transporter as password reset and verification emails.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="test-email" className="text-xs font-semibold text-gray-600">
              Recipient
            </Label>
            <Input
              id="test-email"
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="you@company.com"
              className="h-10 rounded-lg border-gray-200"
            />
          </div>
          <Button
            type="button"
            className="h-10 rounded-lg bg-brand-primary hover:bg-brand-hover text-white font-semibold"
            disabled={!to.trim() || sendMutation.isPending}
            onClick={() => sendMutation.mutate()}
          >
            {sendMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending…
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Send className="h-4 w-4" />
                Send test
              </span>
            )}
          </Button>
        </div>

        {sendMutation.isSuccess ? (
          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Sent to <strong>{sendMutation.data.data.to}</strong>
            {sendMutation.data.data.messageId ? (
              <span className="block mt-1 text-xs font-mono break-all opacity-80">
                Message-ID: {sendMutation.data.data.messageId}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Inbox placement</h2>
        {status?.inboxTips ? (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-relaxed ${
              status.inboxTips.clientUrlHttps
                ? "border-emerald-100 bg-emerald-50 text-emerald-900"
                : "border-amber-200 bg-amber-50 text-amber-950"
            }`}
          >
            {status.inboxTips.recommendation}
          </div>
        ) : null}
        <ul className="mt-4 space-y-2.5">
          {(status?.guidance ?? []).map((tip) => (
            <li key={tip} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-primary shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-gray-500 leading-relaxed">
          After updating <code className="rounded bg-gray-100 px-1 py-0.5">SMTP_*</code> or{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5">CLIENT_URL</code> in the backend{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5">.env</code>, restart the API server,
          then use Recheck / Send test here. Ask recipients to mark the first message as Not spam.
        </p>
      </div>
    </div>
  );
}
