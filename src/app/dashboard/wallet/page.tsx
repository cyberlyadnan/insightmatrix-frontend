"use client";

import React from "react";
import {
  Wallet,
  ArrowUpRight,
  History,
  Award,
  ShieldCheck,
  Gift,
  Loader2,
  Coins,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import { getPanelWallet } from "@/services/member-panel";
import { queryKeys } from "@/services/queries";
import { useAuthStore } from "@/store/authStore";

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function PanelWallet() {
  const user = useAuthStore((s) => s.user);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.memberPanel.wallet,
    queryFn: getPanelWallet,
    staleTime: 20_000,
    refetchOnWindowFocus: true,
  });

  const balance = data?.balance ?? user?.panelPoints ?? 0;
  const lifetime = data?.lifetimeEarned ?? 0;
  const entries = data?.entries ?? [];
  const displayName = user?.fullName?.trim() || "Panelist Member";

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
              <Coins size={14} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">
              Rewards & Balances
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Points Wallet & Ledger
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5 max-w-xl leading-relaxed">
            Points are automatically credited upon successful completion of matched research
            surveys.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={ROUTES.dashboard.surveys}
            className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-black uppercase tracking-wider shadow-xs hover:bg-brand-hover active:scale-95 transition-all inline-flex items-center gap-1.5"
          >
            <span>Earn More Points</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2.5 bg-white rounded-2xl border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          <p className="text-xs font-bold text-gray-500">Loading your wallet ledger…</p>
        </div>
      ) : isError ? (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
          <p className="text-xs font-black text-rose-700">Could not retrieve wallet data.</p>
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Executive Digital Membership & Tier Stats */}
          <div className="grid lg:grid-cols-12 gap-4">
            {/* Left: Luxury Digital Platinum Card */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-gradient-to-br from-[#081225] via-[#0A1A36] to-[#040A15] text-white relative overflow-hidden shadow-lg shadow-blue-950/20 border border-slate-800/90 flex flex-col justify-between min-h-[220px]">
              {/* Background ambient glowing accents */}
              <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 bg-brand-primary/25 rounded-full blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl" />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[9px] font-black uppercase tracking-widest mb-2">
                    <Sparkles size={11} className="text-amber-400" />
                    Platinum Member
                  </div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    Available Balance
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-amber-400 shadow-inner">
                  <Wallet size={20} />
                </div>
              </div>

              <div className="relative z-10 my-2">
                <div className="text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tight">
                  {balance.toLocaleString()}{" "}
                  <span className="text-base sm:text-lg font-black text-amber-400">pts</span>
                </div>
              </div>

              <div className="relative z-10 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                    Cardholder
                  </div>
                  <div className="font-bold text-slate-200 text-xs">{displayName}</div>
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                    Lifetime Earned
                  </div>
                  <div className="font-bold text-emerald-400 tabular-nums text-xs">
                    +{lifetime.toLocaleString()} pts
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                    Security ID
                  </div>
                  <div className="font-mono text-slate-400 text-[10px]">
                    {user?.id ? `IMX-${user.id.slice(0, 6).toUpperCase()}` : "IMX-VERIFIED"}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Summary & Next Reward Milestones */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-gray-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-subtle text-brand-primary flex items-center justify-center font-black">
                    <Award size={17} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-gray-900">Milestone Rewards</h3>
                    <p className="text-[10px] font-bold text-gray-400">
                      Tier progression & benefits
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-4 font-medium">
                  Verified panelists receive direct credit points per completed study. Your balance
                  accumulates automatically.
                </p>

                <div className="space-y-2 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500">Next Milestone Level</span>
                    <span className="font-black text-brand-primary">5,000 pts</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-primary to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(8, (balance / 5000) * 100))}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                    <span>{balance.toLocaleString()} pts reached</span>
                    <span>{Math.max(0, 5000 - balance).toLocaleString()} pts to go</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-3 text-[10px] font-bold text-emerald-600">
                <CheckCircle2 size={13} className="shrink-0" />
                <span>Account verified & active for automatic credit payouts</span>
              </div>
            </div>
          </div>

          {/* Activity Ledger & Redemptions Grid */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left: Transaction History */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-gray-900 tracking-tight">
                    Transaction Activity
                  </h2>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Detailed record of points credited from research sessions
                  </p>
                </div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                  <History size={11} />
                  Live Ledger
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs divide-y divide-gray-100 overflow-hidden">
                {entries.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
                      <History size={20} />
                    </div>
                    <p className="text-xs font-black text-gray-900">No point transactions yet</p>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                      Complete your first research survey to see instant points credited here.
                    </p>
                    <Link
                      href={ROUTES.dashboard.surveys}
                      className="inline-flex px-3.5 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-black uppercase tracking-wider hover:bg-brand-hover transition-colors mt-1"
                    >
                      Browse Surveys
                    </Link>
                  </div>
                ) : (
                  entries.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors group"
                    >
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                            tx.points >= 0
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-105 transition-transform"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <ArrowUpRight size={17} />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <p className="text-xs font-black text-gray-900 group-hover:text-brand-primary transition-colors truncate max-w-md">
                            {tx.description || "Survey Completion Credit"}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400">
                            <span className="uppercase tracking-wider px-1 py-0.2 rounded bg-gray-100 text-gray-600 font-bold text-[9px]">
                              {tx.type}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={10} />
                              {formatWhen(tx.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <span className="text-xs sm:text-sm font-black text-emerald-600 tabular-nums">
                          +{tx.points.toLocaleString()} pts
                        </span>
                        <span className="text-[10px] font-medium text-gray-400">
                          Balance: {tx.balanceAfter.toLocaleString()} pts
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Redemption Preview & Security Assurance */}
            <div className="lg:col-span-4 space-y-4">
              <div>
                <h2 className="text-base font-black text-gray-900 tracking-tight mb-0.5">
                  Redeem Rewards
                </h2>
                <p className="text-[11px] text-gray-400 font-medium">
                  Catalog options unlock as milestone points accumulate
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    name: "Digital Gift Cards",
                    desc: "Amazon, Apple, Visa, Google Play",
                    status: "Catalog Launching Soon",
                    color: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
                  },
                  {
                    name: "Direct Transfer",
                    desc: "Instant payout to your bank or PayPal",
                    status: "Coming Soon",
                    color: "bg-gradient-to-br from-brand-primary to-blue-700 text-white",
                  },
                  {
                    name: "Charity Donation",
                    desc: "Support vetted international foundations",
                    status: "Coming Soon",
                    color: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-white border border-gray-100 shadow-2xs flex items-center justify-between opacity-80 hover:opacity-100 transition-all cursor-not-allowed group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center shrink-0 shadow-2xs`}
                      >
                        <Gift size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-gray-900 truncate">{item.name}</p>
                        <p className="text-[10px] font-medium text-gray-400 truncate">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Security & Tracking Callout */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-[#0C1527] text-white border border-slate-800 shadow-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-black text-xs">
                  <ShieldCheck size={14} />
                  <span>Fraud-Free Ledger Protection</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                  Every participation session assigns an encrypted tracking identifier verified by
                  enterprise market research vendors.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
