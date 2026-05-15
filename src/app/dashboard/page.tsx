"use client";

import React from "react";
import {
  Zap,
  Star,
  Clock,
  ArrowRight,
  TrendingUp,
  Gift,
  ShieldCheck,
  ChevronRight,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/authStore";

const missions = [
  {
    id: 1,
    title: "Coffee Consumption Habits",
    rewardPts: 450,
    time: "12m",
    category: "Lifestyle",
    color: "from-amber-400 to-orange-500",
  },
  {
    id: 2,
    title: "Future of EV Mobility",
    rewardPts: 1200,
    time: "25m",
    category: "Technology",
    color: "from-blue-400 to-indigo-600",
  },
  {
    id: 3,
    title: "Workplace Wellness Audit",
    rewardPts: 320,
    time: "8m",
    category: "Corporate",
    color: "from-emerald-400 to-teal-600",
  },
];

export default function DashboardHome() {
  const user = useAuthStore((s) => s.user);
  const avatarUrl = user?.avatar?.trim() || "";

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3 text-sm text-gray-600">
        {avatarUrl ? (
          <div
            className="w-10 h-10 rounded-xl bg-cover bg-center border border-gray-200"
            style={{ backgroundImage: `url("${avatarUrl}")` }}
            aria-label="User avatar"
            role="img"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-brand-subtle flex items-center justify-center text-brand-primary font-black">
            {(user?.fullName?.trim()?.charAt(0) || "M").toUpperCase()}
          </div>
        )}
        <p>
          Signed in as <span className="font-bold text-gray-900">{user?.fullName ?? "Member"}</span>
          {user?.email ? <span className="text-gray-400 font-normal"> · {user.email}</span> : null}
        </p>
      </div>

      {/* Hero Mission */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[350px] rounded-[3rem] overflow-hidden group cursor-pointer"
      >
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          alt="Featured Mission"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6">
            <span className="px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-brand-primary text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/40 text-center">
              Premium Mission
            </span>
            <span className="flex items-center gap-2 text-white/80 text-[10px] md:text-xs font-bold backdrop-blur-md bg-white/10 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/10">
              <Clock size={12} className="text-brand-primary" /> 15 mins remaining
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-[1.1] mb-6 max-w-2xl">
            Global Tech Trends <br />
            <span className="text-brand-light">2024 Audit.</span>
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[9px] md:text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">
                  Points
                </p>
                <p className="text-xl md:text-2xl font-black text-white tabular-nums">1,550 pts</p>
              </div>
              <div className="w-px h-8 md:h-10 bg-white/20" />
              <div>
                <p className="text-[9px] md:text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">
                  XP Points
                </p>
                <p className="text-xl md:text-2xl font-black text-white">+250</p>
              </div>
            </div>
            <button className="w-full sm:w-auto px-6 md:px-8 py-3.5 md:py-4 bg-white text-gray-900 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-brand-primary hover:text-white transition-all group/btn active:scale-95 shadow-lg shadow-black/20">
              Start Mission{" "}
              <ArrowRight
                size={18}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Missions Feed */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900">Recommended for You</h2>
            <Link
              href={ROUTES.dashboard.surveys}
              className="text-sm font-black text-brand-primary hover:underline flex items-center gap-1"
            >
              View All Surveys <ChevronRight size={16} />
            </Link>
          </div>

          <div className="space-y-4">
            {missions.map((mission, i) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-white rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-brand-primary/5 hover:border-brand-primary/20 transition-all group cursor-pointer relative"
              >
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${mission.color} flex items-center justify-center text-white shrink-0 shadow-lg`}
                >
                  <Star size={24} fill="currentColor" />
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">
                      {mission.category}
                    </span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {mission.time}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 truncate group-hover:text-brand-primary transition-colors">
                    {mission.title}
                  </h3>
                  <div className="mt-2 sm:hidden flex justify-between items-end">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        Points
                      </p>
                      <p className="text-lg font-black text-gray-900 tabular-nums">
                        {mission.rewardPts.toLocaleString()} pts
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xl font-black text-gray-900 tabular-nums">
                    {mission.rewardPts.toLocaleString()} pts
                  </p>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    On completion
                  </p>
                </div>
                <div className="hidden sm:flex w-10 h-10 rounded-full bg-gray-50 items-center justify-center text-gray-300 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all">
                  <ArrowRight size={18} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-gray-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-[60px]" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-light">
                  <Target size={20} />
                </div>
                <h3 className="text-lg font-black tracking-tight">Weekly Goal</h3>
              </div>
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-3xl font-black tabular-nums">4,250 pts</span>
                  <span className="text-sm font-bold text-gray-400 tabular-nums">/ 10,000 pts</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "42.5%" }}
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-accent2 rounded-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                    Rank
                  </p>
                  <p className="text-sm font-black">Top 12%</p>
                </div>
                <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                    Level
                  </p>
                  <p className="text-sm font-black">Elite</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm relative group overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                <Gift size={24} />
              </div>
              <div>
                <h4 className="font-black text-gray-900">Unlock more points</h4>
                <p className="text-xs font-medium text-gray-500">
                  Complete more surveys to grow your balance.
                </p>
              </div>
            </div>
            <Link
              href={ROUTES.dashboard.wallet}
              className="block w-full py-4 rounded-2xl bg-gray-50 text-gray-900 font-black text-sm hover:bg-gray-100 transition-colors text-center"
            >
              View points wallet
            </Link>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-brand-subtle/30 border border-brand-primary/5 flex flex-col items-center text-center">
            <ShieldCheck className="text-brand-primary mb-4" size={32} />
            <h4 className="font-black text-gray-900 mb-2">Verified Identity</h4>
            <p className="text-xs font-medium text-gray-500 leading-relaxed">
              Your profile is verified. You can access matched panel surveys and earn points.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
