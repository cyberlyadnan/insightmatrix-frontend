"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Building2,
  Stethoscope,
  BarChart3,
  Users,
  PhoneCall,
  Code,
  FileText,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEARCH_ITEMS = [
  {
    title: "Global Online Panel & Data Collection",
    category: "Services",
    slug: "/services/online-data-collection",
    description: "CAWI online surveys across 80+ countries with 1M+ vetted respondents.",
    icon: BarChart3,
  },
  {
    title: "B2B Market Research",
    category: "Services",
    slug: "/services/b2b-market-research",
    description: "Connect with verified executive decision-makers & industry leaders.",
    icon: Building2,
  },
  {
    title: "Healthcare & Life Sciences Research",
    category: "Services",
    slug: "/services/healthcare-market-research",
    description: "Physicians, specialists, nurses, pharmacists, and patient panels.",
    icon: Stethoscope,
  },
  {
    title: "B2C Consumer Market Research",
    category: "Services",
    slug: "/services/b2c-market-research",
    description: "Targeted consumer demographics across global markets.",
    icon: Users,
  },
  {
    title: "Qualitative Research (IDIs & FGDs)",
    category: "Services",
    slug: "/services/qualitative-research",
    description: "In-depth interviews, focus groups, and online bulletin boards.",
    icon: FileText,
  },
  {
    title: "CATI (Telephone Interviewing)",
    category: "Services",
    slug: "/services/cati-computer-assisted-telephone-interviewing",
    description: "Trained telephone interviewers for hard-to-reach audiences.",
    icon: PhoneCall,
  },
  {
    title: "Survey Programming & Hosting",
    category: "Services",
    slug: "/services/survey-programming-hosting",
    description: "Responsive survey scripting, logic testing, and multi-device hosting.",
    icon: Code,
  },
  {
    title: "Global Panel Book 2026",
    category: "Panel",
    slug: "/panel-book",
    description: "Detailed sample feasibility and country breakdown.",
    icon: Globe,
  },
  {
    title: "Why InsightMatrix & Quality Controls",
    category: "About",
    slug: "/about",
    description: "9-stage fraud prevention, digital fingerprinting, and global coverage.",
    icon: Sparkles,
  },
  {
    title: "Request Feasibility & Contact Sales",
    category: "Contact",
    slug: "/contact",
    description: "Get custom project quotes within 2 hours.",
    icon: ArrowRight,
  },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (!isOpen) return null;

  const filteredItems = SEARCH_ITEMS.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  const categories = ["All", "Services", "Panel", "About", "Contact"];

  const handleSelect = (slug: string) => {
    handleClose();
    router.push(slug);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100"
        >
          {/* Input Header */}
          <div className="relative flex items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <Search className="w-6 h-6 text-brand-primary mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services, panel specs, research solutions..."
              className="w-full bg-transparent text-gray-900 text-lg font-medium placeholder-gray-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 mr-2"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="px-2.5 py-1 rounded-lg bg-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-300"
            >
              ESC
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="px-6 py-3 bg-white border-b border-gray-100 flex items-center gap-2 overflow-x-auto custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-brand-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Results list */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => handleSelect(item.slug)}
                    className="w-full flex items-center gap-4 p-3.5 rounded-2xl text-left transition-all hover:bg-brand-subtle/60 group border border-transparent hover:border-brand-primary/20"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 text-brand-primary flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-gray-900 text-sm group-hover:text-brand-primary transition-colors truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-brand-primary bg-brand-subtle px-2 py-0.5 rounded-full shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{item.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                );
              })
            ) : (
              <div className="py-12 text-center text-gray-400">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-sm">
                  No research services matching &quot;{query}&quot;
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try searching for B2B, Healthcare, Panel, or Quantitative.
                </p>
              </div>
            )}
          </div>

          {/* Footer inside modal */}
          <div className="px-6 py-3 bg-gray-50 text-xs text-gray-400 flex justify-between items-center border-t border-gray-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              InsightMatrix Intelligence Index
            </span>
            <span>Press ESC to exit</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
