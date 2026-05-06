"use client";

import React from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { name: "Getting Started", icon: Zap, count: 12, color: "text-brand-primary" },
  { name: "Payment & Rewards", icon: LifeBuoy, count: 8, color: "text-emerald-500" },
  { name: "Account Safety", icon: FileText, count: 5, color: "text-blue-500" },
];

export default function PanelHelp() {
  return (
    <div className="space-y-12">
      {/* Help Hero */}
      <div className="relative p-8 md:p-12 lg:p-20 rounded-[2.5rem] md:rounded-[4rem] bg-gray-950 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-brand-primary/20 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-violet-600/20 rounded-full blur-[60px] md:blur-[100px]" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 md:mb-8 leading-tight">
            How can we <br />
            help you today?
          </h1>
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search articles, guides..."
              className="w-full pl-16 pr-8 py-5 md:py-6 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl text-base md:text-lg text-white placeholder:text-gray-500 outline-none focus:ring-4 focus:ring-brand-primary/20 focus:bg-white/10 transition-all shadow-2xl"
            />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] md:rounded-[3rem] bg-white border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/40 transition-all group cursor-pointer"
          >
            <div
              className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gray-50 flex items-center justify-center ${cat.color} mb-6 group-hover:scale-110 transition-transform`}
            >
              <cat.icon size={24} className="md:w-7 md:h-7" />
            </div>
            <h3 className="text-lg md:text-xl font-black text-gray-900 mb-2">{cat.name}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {cat.count} Articles
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-brand-subtle/30 border border-brand-primary/5 flex flex-col justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 font-black">
              Frequently Asked
            </h2>
            <div className="space-y-3 md:space-y-4">
              {[
                "How do I withdraw my earnings?",
                "What is the Platinum Tier?",
                "Why was my mission rejected?",
                "Can I use multiple devices?",
              ].map((q, i) => (
                <div
                  key={i}
                  className="p-4 md:p-5 rounded-xl md:rounded-2xl bg-white/50 border border-white/50 flex items-center justify-between hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                >
                  <span className="text-xs md:text-sm font-bold text-gray-700">{q}</span>
                  <ArrowRight
                    size={16}
                    className="text-gray-300 group-hover:text-brand-primary transition-colors shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-white border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-xl transition-all group cursor-pointer">
            <div className="flex items-center gap-4 md:gap-6 min-w-0">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-500 shrink-0">
                <PlayCircle size={24} className="md:w-8 md:h-8" />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-gray-900 mb-1 truncate">Video Tutorials</h3>
                <p className="text-[10px] md:text-xs font-medium text-gray-500 truncate">
                  Master the platform in 5 minutes.
                </p>
              </div>
            </div>
            <ArrowRight
              size={20}
              className="text-gray-300 group-hover:text-brand-primary transition-all shrink-0"
            />
          </div>

          <div className="p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-gray-900 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-[60px]" />
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-black mb-4">Still need help?</h3>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-8 max-w-[280px]">
                Our expert support team is available 24/7 for our verified members.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 py-4 bg-brand-primary text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-hover transition-colors shadow-lg shadow-brand-primary/20 active:scale-95">
                  <MessageCircle size={16} /> Live Chat
                </button>
                <button className="flex-1 py-4 bg-white/10 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-white/20 border border-white/10 transition-colors active:scale-95">
                  <Mail size={16} /> Email Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
