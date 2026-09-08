"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Search,
  MessageCircle,
  FileText,
  Zap,
  ArrowRight,
  PlayCircle,
  Mail,
  LifeBuoy,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const categories = [
  {
    name: "Getting Started",
    icon: Zap,
    count: "6 Guides",
    color: "from-blue-500 to-indigo-600",
    desc: "Account verification, profile setup, and device requirements.",
  },
  {
    name: "Points & Rewards",
    icon: LifeBuoy,
    count: "8 Articles",
    color: "from-amber-500 to-orange-600",
    desc: "Earning points, payout thresholds, redemption options.",
  },
  {
    name: "Security & Verification",
    icon: ShieldCheck,
    count: "5 Articles",
    color: "from-emerald-500 to-teal-600",
    desc: "Prescreen data privacy, fraud prevention, study matching.",
  },
];

const faqs = [
  {
    q: "How are survey points calculated and credited?",
    a: "Points are credited immediately when a research session registers a validated 'complete' status from the sponsor vendor. The point value is displayed on each survey card before you start.",
  },
  {
    q: "What is the Platinum Tier status?",
    a: "Platinum Tier is awarded to panelists with verified prescreen profiles and high completion integrity. It unlocks priority invitations to high-incentive B2B studies.",
  },
  {
    q: "Why was a survey session terminated early (Screenout/Quota Full)?",
    a: "Market research studies often have strict target quotas. If your demographic profile is outside the specific study requirements, or if the quota was reached, the system redirects you safely back.",
  },
  {
    q: "Can I participate on multiple devices?",
    a: "Yes, you can log in on mobile, tablet, and desktop. However, concurrent participation on multiple devices for the same study is prohibited by quality assurance systems.",
  },
  {
    q: "How do I update my demographic prescreen information?",
    a: "You can update your demographic answers anytime by navigating to 'Profile Prescreen' in the sidebar menu.",
  },
];

export default function PanelHelp() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredFaqs = faqs.filter(
    (f) =>
      !search.trim() ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Hero Banner */}
      <div className="relative p-8 sm:p-10 lg:p-12 rounded-[2.25rem] bg-gradient-to-br from-[#081225] via-[#0A1A36] to-[#040A15] text-white overflow-hidden border border-slate-800/90 shadow-2xl shadow-blue-950/20">
        <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 bg-brand-primary/20 rounded-full blur-[90px]" />
        <div className="pointer-events-none absolute bottom-0 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]" />

        <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-brand-light text-[10px] font-black uppercase tracking-widest shadow-xs">
            <HelpCircle size={12} />
            Member Support & Knowledge Base
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            How can we help you today?
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg mx-auto leading-relaxed">
            Find immediate answers on survey participation, reward points, eligibility, and account
            settings.
          </p>

          <div className="relative max-w-xl mx-auto pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search help topics, questions, points guides..."
              className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/15 rounded-2xl text-sm text-white placeholder:text-slate-400 outline-none focus:bg-white/15 focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all backdrop-blur-md shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* 3 Categories Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-[1.75rem] bg-white border border-gray-100 shadow-2xs hover:shadow-lg hover:border-brand-primary/30 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <Icon size={22} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                    {cat.count}
                  </span>
                </div>
                <h3 className="text-base font-black text-gray-900 group-hover:text-brand-primary transition-colors mb-1.5">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{cat.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between text-xs font-black text-brand-primary">
                <span>Browse articles</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQs & Contact Support Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Interactive FAQ Accordion */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                Instant answers to common member inquiries
              </p>
            </div>
            <span className="text-xs font-bold text-gray-400">
              {filteredFaqs.length} {filteredFaqs.length === 1 ? "answer" : "answers"}
            </span>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-gray-100 shadow-2xs overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-black text-xs sm:text-sm text-gray-900 hover:text-brand-primary transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-gray-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-brand-primary" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed border-t border-gray-50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Contact & Quick Links */}
        <div className="lg:col-span-4 space-y-6">
          {/* Direct Support Card */}
          <div className="p-6 sm:p-7 rounded-[2rem] bg-gradient-to-br from-[#081225] to-[#0D1C38] text-white border border-slate-800 shadow-lg relative overflow-hidden space-y-4">
            <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/20 rounded-full blur-2xl" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/20 border border-brand-primary/30 text-brand-light flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Need Personal Help?</h3>
                <p className="text-[11px] font-bold text-slate-400">Support desk available 24/7</p>
              </div>
            </div>

            <p className="relative z-10 text-xs text-slate-300 font-medium leading-relaxed">
              If you have inquiries regarding study completion tracking or point balance
              discrepancies, our team is standing by.
            </p>

            <div className="relative z-10 space-y-2.5 pt-2">
              <a
                href="mailto:support@insightmatrix.io"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-brand-primary/25 hover:opacity-95 transition-all"
              >
                <Mail size={15} />
                <span>Email Support Desk</span>
              </a>

              <Link
                href={ROUTES.dashboard.prescreen}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-all text-center"
              >
                <ShieldCheck size={15} />
                <span>Review Prescreen</span>
              </Link>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-black text-xs text-emerald-800">
              <CheckCircle2 size={16} />
              <span>Pro Panelist Tip</span>
            </div>
            <p className="text-xs text-emerald-800/90 font-medium leading-relaxed">
              Keep your profile prescreen updated whenever your employment or location changes to
              maximize matching rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
