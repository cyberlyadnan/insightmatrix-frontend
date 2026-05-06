"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import {
  Users,
  FileText,
  MessageCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Clock,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    label: "Total Surveys",
    value: "2,456",
    change: "+12.5%",
    isUp: true,
    icon: FileText,
    color: "brand-primary",
  },
  {
    label: "Panel Members",
    value: "148.2k",
    change: "+5.2%",
    isUp: true,
    icon: Users,
    color: "violet-500",
  },
  {
    label: "Pending Queries",
    value: "42",
    change: "-12.5%",
    isUp: false,
    icon: MessageCircle,
    color: "amber-500",
  },
  {
    label: "Insights Generated",
    value: "8,920",
    change: "+18.3%",
    isUp: true,
    icon: Zap,
    color: "emerald-500",
  },
];

export default function AdminOverview() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">System Overview</h1>
        <p className="text-gray-500 font-medium">
          Welcome back, {user?.fullName ?? "Administrator"}. Here{"'"}s what{"'"}s happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-${stat.color} group-hover:scale-110 transition-transform`}
              >
                <stat.icon size={24} />
              </div>
              <div
                className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.isUp ? "text-emerald-500" : "text-rose-500"}`}
              >
                {stat.change}{" "}
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <div>
              <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">
                {stat.label}
              </div>
              <div className="text-3xl font-black text-gray-900">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm min-w-0">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900">Recent Reseach Leads</h2>
            <button className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="px-4 py-4">Client</th>
                  <th className="px-4 py-4">Topic</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  {
                    client: "Global-X Retail",
                    topic: "Consumer Habit Audit",
                    status: "Active",
                    date: "2h ago",
                  },
                  {
                    client: "TechStream",
                    topic: "B2B SaaS Penetration",
                    status: "Pending",
                    date: "5h ago",
                  },
                  {
                    client: "BioCorp",
                    topic: "European Market Entry",
                    status: "Completed",
                    date: "1d ago",
                  },
                  {
                    client: "FinEdge",
                    topic: "Wealth Management UX",
                    status: "Review",
                    date: "2d ago",
                  },
                ].map((item, i) => (
                  <tr key={i} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-5">
                      <div className="font-bold text-gray-900">{item.client}</div>
                    </td>
                    <td className="px-4 py-5 text-sm font-medium text-gray-500">{item.topic}</td>
                    <td className="px-4 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          item.status === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : item.status === "Pending"
                              ? "bg-amber-50 text-amber-600"
                              : item.status === "Review"
                                ? "bg-brand-primary/10 text-brand-primary"
                                : "bg-gray-50 text-gray-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-right">
                      <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-brand-primary transition-colors">
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Growth Sidebar */}
        <div className="space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-gray-900 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-[60px]" />
            <h3 className="text-xl font-black mb-6 border-b border-white/5 pb-6">
              Platform Health
            </h3>
            <div className="space-y-8">
              {[
                { label: "Data Quality Score", value: 98 },
                { label: "API Uptime", value: 99.9 },
                { label: "Processing Speed", value: 92 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {item.label}
                    </span>
                    <span className="text-lg font-black">{item.value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      className="h-full bg-brand-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-brand-primary text-white shadow-xl shadow-brand-primary/20 relative group cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-2">New Insights Core</h4>
              <p className="text-white/70 text-sm font-medium leading-relaxed mb-6">
                Upgrade your analytics engine to the latest v4.2 for 40% faster rendering.
              </p>
              <button className="w-full py-4 bg-white text-brand-primary font-black rounded-2xl shadow-xl shadow-black/10">
                Update System
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
