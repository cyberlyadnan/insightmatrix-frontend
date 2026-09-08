"use client";

import { use } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Coins,
  Mail,
  Shield,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes";
import { parseApiError } from "@/services/api/errors";
import { getUser, updateUser } from "@/services/users";
import { queryKeys } from "@/services/queries";
import { formatNumber } from "@/utils/format";

function StatPill({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: string | number;
  tone?: "slate" | "amber" | "emerald" | "sky";
}) {
  const tones = {
    slate: "from-slate-50 to-white border-slate-200 text-slate-900",
    amber: "from-amber-50 to-white border-amber-200 text-amber-800",
    emerald: "from-emerald-50 to-white border-emerald-200 text-emerald-800",
    sky: "from-sky-50 to-white border-sky-200 text-sky-800",
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-4 ${tones[tone]}`}>
      <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-black tabular-nums">{value}</p>
    </div>
  );
}

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const qc = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => getUser(id),
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => updateUser(id, { status }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      await qc.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("Status updated");
    },
    onError: (e) => toast.error(parseApiError(e, "Could not update status")),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-gray-500">
        Loading member profile…
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="space-y-4 py-10">
        <Link
          href={ROUTES.admin.users}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          All users
        </Link>
        <p className="text-sm text-rose-600">User not found or could not be loaded.</p>
      </div>
    );
  }

  const answers = user.panelPrescreen?.answers ?? [];
  const history = user.surveyHistory;

  return (
    <div className="w-full space-y-6">
      <Link
        href={ROUTES.admin.users}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        All users
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-brand-subtle text-brand-primary flex items-center justify-center text-xl font-black shrink-0 overflow-hidden border border-brand-primary/10">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              (user.fullName?.[0] || "?").toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-2">
              <UserRound className="w-3.5 h-3.5" />
              Panel member
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 truncate">
              {user.fullName}
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              {user.email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {user.status === "active" ? (
            <button
              type="button"
              disabled={statusMutation.isPending}
              onClick={() => statusMutation.mutate("suspended")}
              className="h-9 px-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-bold hover:bg-amber-100 disabled:opacity-50"
            >
              Suspend
            </button>
          ) : user.status === "suspended" ? (
            <button
              type="button"
              disabled={statusMutation.isPending}
              onClick={() => statusMutation.mutate("active")}
              className="h-9 px-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 disabled:opacity-50"
            >
              Reactivate
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatPill label="Points balance" value={formatNumber(user.panelPoints ?? 0)} tone="amber" />
        <StatPill
          label="Lifetime points"
          value={formatNumber(user.panelLifetimePoints ?? 0)}
          tone="amber"
        />
        <StatPill
          label="Surveys completed"
          value={formatNumber(user.panelCompletedSurveys ?? 0)}
          tone="emerald"
        />
        <StatPill
          label="Attempts"
          value={formatNumber(history?.summary.totalAttempts ?? 0)}
          tone="sky"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-primary" />
            Account
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <dt className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Role
              </dt>
              <dd className="font-semibold text-gray-800 capitalize mt-0.5">
                {user.role.replace("_", " ")}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Status
              </dt>
              <dd className="font-semibold text-gray-800 capitalize mt-0.5">{user.status}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Email verified
              </dt>
              <dd className="font-semibold text-gray-800 mt-0.5">
                {user.isVerified ? "Yes" : "No"}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Joined
              </dt>
              <dd className="font-semibold text-gray-800 mt-0.5">
                {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy HH:mm") : "—"}
              </dd>
            </div>
            {user.deletionRequested ? (
              <div className="sm:col-span-2 rounded-xl border border-rose-200 bg-rose-50 p-3">
                <p className="text-xs font-bold text-rose-800">Deletion requested</p>
                <p className="text-xs text-rose-700 mt-1">
                  {user.deletionRequestReason || "No reason provided"}
                </p>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <Coins className="w-4 h-4 text-brand-primary" />
            Panel activity
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <dt className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Prescreen
              </dt>
              <dd className="font-semibold text-gray-800 mt-0.5">
                {user.panelPrescreen?.notConfigured
                  ? "Not configured"
                  : user.panelPrescreen?.needsCompletion
                    ? "Incomplete"
                    : "Complete"}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Completed at
              </dt>
              <dd className="font-semibold text-gray-800 mt-0.5">
                {user.panelPrescreenCompletedAt
                  ? format(new Date(user.panelPrescreenCompletedAt), "MMM d, yyyy")
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Completes
              </dt>
              <dd className="font-semibold text-gray-800 mt-0.5">
                {history?.summary.completed ?? 0}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Not qualified
              </dt>
              <dd className="font-semibold text-gray-800 mt-0.5">
                {history?.summary.notQualified ?? 0}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-brand-primary" />
              Demographic prescreen
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {user.panelPrescreen?.formTitle
                ? `Form: ${user.panelPrescreen.formTitle}`
                : "No required panel form configured"}
            </p>
          </div>
          {answers.length > 0 ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              {answers.length} answers
            </span>
          ) : null}
        </div>

        {answers.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center border border-dashed border-gray-200 rounded-xl">
            No prescreen answers on file for this member.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {answers.map((row) => (
              <div
                key={row.questionId}
                className="rounded-xl border border-gray-100 bg-slate-50/60 px-4 py-3"
              >
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                  {row.title}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900 break-words">
                  {row.displayValue}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-black text-gray-900">Recent survey attempts</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Latest panel survey activity for this member
          </p>
        </div>
        {(history?.items?.length ?? 0) === 0 ? (
          <p className="text-sm text-gray-500 py-10 text-center">No survey attempts yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">Survey</th>
                  <th className="px-4 py-3">Outcome</th>
                  <th className="px-4 py-3 text-right">Points</th>
                  <th className="px-4 py-3">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 line-clamp-1">{item.surveyName}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{item.surveyCode}</p>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-700">
                      {item.outcomeLabel}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold text-amber-600">
                      {item.pointsAwarded > 0 ? `+${item.pointsAwarded}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {item.startedAt ? format(new Date(item.startedAt), "MMM d, yyyy HH:mm") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
