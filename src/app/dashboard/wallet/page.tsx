"use client";

import {
  Wallet,
  ArrowUpRight,
  History,
  Award,
  ShieldCheck,
  ChevronRight,
  Gift,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { getPanelWallet } from "@/services/member-panel";
import { queryKeys } from "@/services/queries";

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function PanelWallet() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.memberPanel.wallet,
    queryFn: getPanelWallet,
    staleTime: 20_000,
    refetchOnWindowFocus: true,
  });

  const balance = data?.balance ?? 0;
  const lifetime = data?.lifetimeEarned ?? 0;
  const entries = data?.entries ?? [];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Points wallet</h1>
          <p className="text-gray-500 font-medium">
            Points are earned when a survey complete is recorded for your session (tracking id).
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled
            className="flex-1 sm:flex-none px-6 py-3.5 bg-gray-200 text-gray-500 font-black text-xs rounded-xl cursor-not-allowed text-center"
            title="Redemption coming soon"
          >
            Redeem points
          </button>
          <button
            type="button"
            disabled
            className="flex-1 sm:flex-none px-6 py-3.5 bg-white border border-gray-100 text-gray-400 font-black text-xs rounded-xl cursor-not-allowed text-center"
          >
            Statements
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
          <p className="text-sm text-gray-500">Loading wallet…</p>
        </div>
      ) : isError ? (
        <p className="text-sm text-rose-600">
          Could not load wallet.{" "}
          <button type="button" className="underline font-bold" onClick={() => refetch()}>
            Retry
          </button>
        </p>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-gradient-to-br from-brand-primary to-violet-600 text-white relative overflow-hidden shadow-2xl shadow-brand-primary/20">
              <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full blur-[60px] md:blur-[80px] -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-12 md:mb-16">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">
                      Available points
                    </p>
                    <p className="text-4xl sm:text-5xl md:text-6xl font-black truncate leading-tight">
                      {balance.toLocaleString()} pts
                    </p>
                  </div>
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/20 shrink-0">
                    <Wallet size={24} className="md:w-8 md:h-8" />
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
                      Lifetime earned
                    </p>
                    <p className="text-lg md:text-xl font-black truncate">
                      {lifetime.toLocaleString()} pts
                    </p>
                  </div>
                  <div className="min-w-0 col-span-2 md:col-span-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
                      Last activity
                    </p>
                    <p className="text-sm font-bold truncate">
                      {entries[0] ? formatWhen(entries[0].createdAt) : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 rounded-[3rem] bg-white border border-gray-100 flex flex-col justify-between group hover:border-brand-primary/20 transition-all">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Award size={24} />
                  </div>
                  <p className="text-sm font-black text-gray-900">Member rewards</p>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Points only</h3>
                <p className="text-xs font-bold text-gray-400 leading-relaxed">
                  Cash rewards are not used on this panel. Complete matched surveys to grow your
                  balance; redemption options will appear here when enabled.
                </p>
              </div>
              <div className="mt-8 space-y-3">
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, balance > 0 ? 35 + Math.min(50, balance / 200) : 8)}%`,
                    }}
                    className="h-full bg-brand-primary rounded-full transition-all"
                  />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-right text-gray-400">
                  Keep completing surveys to earn more
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">Recent activity</h2>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <History size={14} />
                  Newest first
                </span>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                {entries.length === 0 ? (
                  <div className="p-10 text-center text-sm text-gray-500">
                    No point transactions yet. Finish a survey (complete) to see your first credit.
                  </div>
                ) : (
                  entries.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 md:gap-5 w-full sm:w-auto min-w-0">
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            tx.points >= 0
                              ? "bg-emerald-50 text-emerald-500"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <ArrowUpRight size={18} className="md:w-5 md:h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-gray-900 truncate">
                            {tx.description || tx.type}
                          </p>
                          <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">
                            {tx.type} · {formatWhen(tx.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                        <p className="text-sm font-black text-emerald-600">
                          +{tx.points.toLocaleString()} pts
                        </p>
                        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Balance {tx.balanceAfter.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <h2 className="text-xl font-black text-gray-900 px-4">Redeem</h2>
              <div className="space-y-4">
                {[
                  { name: "Gift cards", pts: "Coming soon", color: "bg-gray-900" },
                  { name: "Cash out", pts: "Coming soon", color: "bg-brand-primary" },
                  { name: "Donations", pts: "Coming soon", color: "bg-blue-600" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-[2rem] bg-white border border-gray-100 flex items-center justify-between opacity-60 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-white`}
                      >
                        <Gift size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-900">{item.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{item.pts}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-[2rem] bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center py-10">
                <ShieldCheck className="text-gray-300 mb-3" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  Session tracking
                </p>
                <p className="text-xs font-medium text-gray-500 max-w-[200px]">
                  Each start creates a unique attempt id echoed to the supplier so completes can
                  match your account.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
