"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  Clock,
  Star,
  Zap,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Smartphone,
  Laptop,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const surveyCategories = ["All", "Consumer", "Technology", "Fashion", "Lifestyle", "Strategic"];

const surveys = [
  {
    id: 1,
    title: "Next-Gen Smartphone Features",
    reward: "$6.50",
    time: "18m",
    category: "Technology",
    platform: "Mobile",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Luxury Fashion Brand Audit",
    reward: "$15.00",
    time: "30m",
    category: "Fashion",
    platform: "Any",
    rating: 5.0,
  },
  {
    id: 3,
    title: "Daily Snacking Habits 2024",
    reward: "$2.20",
    time: "5m",
    category: "Consumer",
    platform: "Any",
    rating: 4.5,
  },
  {
    id: 4,
    title: "B2B SaaS Pricing Research",
    reward: "25.00",
    time: "45m",
    category: "Technology",
    platform: "Desktop",
    rating: 4.9,
  },
  {
    id: 5,
    title: "Urban Commuter Psychology",
    reward: "$8.40",
    time: "20m",
    category: "Lifestyle",
    platform: "Mobile",
    rating: 4.7,
  },
  {
    id: 6,
    title: "Ethical Skincare Preferences",
    reward: "$4.10",
    time: "10m",
    category: "Lifestyle",
    platform: "Any",
    rating: 4.6,
  },
];

export default function PanelSurveys() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="text-brand-primary" size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary/60">
              Live Feed
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Available Missions
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto scrollbar-hide max-w-full lg:max-w-none">
          <div className="flex items-center gap-1 min-w-max">
            {surveyCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-5 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black transition-all ${
                  activeCategory === cat
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surveys.map((survey, i) => (
          <motion.div
            key={survey.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group bg-white rounded-[2.5rem] border border-gray-100 p-8 hover:shadow-2xl hover:shadow-brand-primary/5 hover:border-brand-primary/20 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full">
                <Star size={12} className="text-amber-400" fill="currentColor" />
                <span className="text-[10px] font-black text-gray-600">{survey.rating}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Reward
                </p>
                <p className="text-xl font-black text-brand-primary">{survey.reward}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                {survey.title}
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Clock size={14} />
                  <span className="text-xs font-bold">{survey.time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  {survey.platform === "Mobile" ? (
                    <Smartphone size={14} />
                  ) : survey.platform === "Desktop" ? (
                    <Laptop size={14} />
                  ) : (
                    <Zap size={14} />
                  )}
                  <span className="text-xs font-bold">{survey.platform}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {survey.category}
              </span>
              <button className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/10 group-hover:scale-110 transition-transform">
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Hover Background Accent */}
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}

        {/* Load More Mockup */}
        <div className="md:col-span-2 lg:col-span-3 py-10 flex justify-center">
          <button className="px-10 py-5 bg-white border border-gray-100 rounded-[2rem] text-gray-400 font-bold hover:text-brand-primary hover:border-brand-primary/20 transition-all flex items-center gap-3">
            <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
            Searching for more missions...
          </button>
        </div>
      </div>
    </div>
  );
}
