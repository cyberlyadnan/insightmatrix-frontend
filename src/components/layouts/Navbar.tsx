"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  ArrowRight,
  ShoppingCart,
  Landmark,
  Film,
  Cross,
  Building,
  Users,
  Shirt,
  Cpu,
  Plane,
  FileText,
  CalendarCheck,
  BookOpen,
  Folder,
  BarChart3,
  Stethoscope,
  PhoneCall,
  Code,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImxLogo } from "@/components/brand";
import { ROUTES, isAuthRoute } from "@/constants";
import { useAuthStore } from "@/store/authStore";

interface CategoryItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const PUBLIC_DATA_CATEGORIES: CategoryItem[] = [
  { title: "Consumer & retail", href: "/services/b2c-market-research", icon: ShoppingCart },
  { title: "Economy & business", href: "/services/b2b-market-research", icon: Landmark },
  { title: "Entertainment, arts, & media", href: "/research", icon: Film },
  { title: "Health & pharma", href: "/services/healthcare-market-research", icon: Cross },
  { title: "Politics & current affairs", href: "/research", icon: Building },
  { title: "Society & lifestyle", href: "/services/b2c-market-research", icon: Users },
  { title: "Sports & esports", href: "/research", icon: Shirt },
  { title: "Technology & digital", href: "/services/b2b-market-research", icon: Cpu },
  { title: "Travel & transport", href: "/research", icon: Plane },
];

const PUBLIC_DATA_TYPES: CategoryItem[] = [
  { title: "Articles & Insights", href: "/research", icon: FileText },
  { title: "Events & Webinars", href: "/contact", icon: CalendarCheck },
  { title: "Reports & Panel Book", href: "/panel-book", icon: BookOpen },
  { title: "All publications", href: "/services", icon: Folder },
];

const SOLUTIONS_CATEGORIES: CategoryItem[] = [
  { title: "Online CAWI Surveys", href: "/services/online-data-collection", icon: BarChart3 },
  { title: "Global Panel Provider", href: "/panel-book", icon: Globe },
  { title: "B2B Executive Panels", href: "/services/b2b-market-research", icon: Landmark },
  {
    title: "Healthcare & Life Sciences",
    href: "/services/healthcare-market-research",
    icon: Stethoscope,
  },
  { title: "Qualitative (IDIs & FGDs)", href: "/services/qualitative-research", icon: FileText },
  {
    title: "CATI Interviewing",
    href: "/services/cati-computer-assisted-telephone-interviewing",
    icon: PhoneCall,
  },
  {
    title: "Survey Programming & Hosting",
    href: "/services/survey-programming-hosting",
    icon: Code,
  },
  {
    title: "Data Processing & Tabulation",
    href: "/services/translation-localization-services",
    icon: Layers,
  },
];

const SOLUTIONS_TYPES: CategoryItem[] = [
  { title: "Sample Feasibility Estimator", href: "/contact", icon: CalendarCheck },
  { title: "Global Panel Specs 2026", href: "/panel-book", icon: BookOpen },
  { title: "Methodology Documentation", href: "/about#process", icon: FileText },
  { title: "Explore All Services", href: "/services", icon: Folder },
];

const COMPANY_CATEGORIES: CategoryItem[] = [
  { title: "Why InsightMatrix", href: "/about", icon: Sparkles },
  { title: "9-Stage Quality Controls", href: "/about#quality", icon: ShieldCheck },
  { title: "Our 5-Step Process", href: "/about#process", icon: CheckCircle2 },
  { title: "Contact Sales & Feasibility", href: "/contact", icon: ArrowRight },
  { title: "Privacy Policy & GDPR", href: "/privacy", icon: HelpCircle },
  { title: "Terms of Service", href: "/terms", icon: FileText },
];

const COMPANY_TYPES: CategoryItem[] = [
  { title: "Global Panel Book", href: "/panel-book", icon: BookOpen },
  { title: "Feasibility Request", href: "/contact", icon: CalendarCheck },
  { title: "Quality Assurance Framework", href: "/about#quality", icon: ShieldCheck },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<"public-data" | "solutions" | "company" | null>(null);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isHomePage = pathname === "/";
  const isSignedIn = Boolean(user);

  const accountHref =
    user?.role === "admin" || user?.role === "survey_manager"
      ? ROUTES.admin.root
      : ROUTES.dashboard.root;

  const isAuthPage = isAuthRoute(pathname);
  const isAdminPage = pathname.startsWith("/admin");
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isSurveyStartPage = pathname.startsWith("/survey/start");
  const isSurveyCallbackPage = pathname.startsWith("/survey/callback");
  const isVendorPage = pathname.startsWith("/vendor");

  useEffect(() => {
    if (isAuthPage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAuthPage, pathname]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setActiveTab(null);
    setIsOpen(false);
  }, [pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (isSurveyStartPage || isSurveyCallbackPage) return null;
  if (isAuthPage || isAdminPage || isDashboardPage || isVendorPage) return null;

  const handleMouseEnter = (tab: "public-data" | "solutions" | "company") => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveTab(tab);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveTab(null);
    }, 200);
  };

  const isLightSurface = isScrolled || !isHomePage;

  return (
    <>
      {/* Sticky Header Wrapper: FIXED TOP-0 WITHOUT ANY BORDER LINES */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md text-gray-900 py-3.5"
            : isHomePage
              ? "bg-transparent text-white py-4"
              : "bg-white/95 backdrop-blur-md shadow-sm text-gray-900 py-3.5"
        }`}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-4">
              <ImxLogo href="/" size="md" priority surface={isLightSurface ? "light" : "dark"} />
            </div>

            {/* Navigation Pill Links in Brand Primary Theme */}
            <nav className="hidden lg:flex items-center space-x-2 relative">
              {/* Tab 1: Public data */}
              <div className="relative" onMouseEnter={() => handleMouseEnter("public-data")}>
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "public-data" ? null : "public-data")}
                  className={`px-6 py-2.5 rounded-full font-black text-sm transition-all ${
                    activeTab === "public-data"
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105"
                      : isLightSurface
                        ? "text-gray-800 hover:text-brand-primary hover:bg-brand-subtle"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Public data
                </button>
                {activeTab === "public-data" && (
                  <motion.div
                    layoutId="activeTabCaret"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white absolute -bottom-[18px] left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
                  />
                )}
              </div>

              {/* Tab 2: Solutions */}
              <div className="relative" onMouseEnter={() => handleMouseEnter("solutions")}>
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "solutions" ? null : "solutions")}
                  className={`px-6 py-2.5 rounded-full font-black text-sm transition-all ${
                    activeTab === "solutions"
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105"
                      : isLightSurface
                        ? "text-gray-800 hover:text-brand-primary hover:bg-brand-subtle"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Solutions
                </button>
                {activeTab === "solutions" && (
                  <motion.div
                    layoutId="activeTabCaret"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white absolute -bottom-[18px] left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
                  />
                )}
              </div>

              {/* Tab 3: Company */}
              <div className="relative" onMouseEnter={() => handleMouseEnter("company")}>
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "company" ? null : "company")}
                  className={`px-6 py-2.5 rounded-full font-black text-sm transition-all ${
                    activeTab === "company"
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105"
                      : isLightSurface
                        ? "text-gray-800 hover:text-brand-primary hover:bg-brand-subtle"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Company
                </button>
                {activeTab === "company" && (
                  <motion.div
                    layoutId="activeTabCaret"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white absolute -bottom-[18px] left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
                  />
                )}
              </div>
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {isSignedIn ? (
                <Link
                  href={accountHref}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${
                    isLightSurface
                      ? "border border-gray-200 text-gray-900 hover:bg-gray-50"
                      : "border border-white/20 text-white bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <User size={16} />
                  <span>Account</span>
                </Link>
              ) : (
                <>
                  <Link
                    href={ROUTES.login}
                    className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                      isLightSurface
                        ? "text-gray-800 hover:text-gray-900 hover:bg-gray-100"
                        : "text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    Log in
                  </Link>
                  <Link
                    href={ROUTES.register}
                    className="px-6 py-2 rounded-full font-bold text-sm text-white bg-brand-primary hover:bg-brand-hover shadow-md shadow-brand-primary/30 transition-all hover:scale-105 active:scale-95"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`p-2 focus:outline-none ${
                  isLightSurface ? "text-gray-900" : "text-white"
                }`}
              >
                <Menu size={26} />
              </button>
            </div>
          </div>
        </div>

        {/* YouGov Styled Mega Dropdown Menu - Brand Primary Colors */}
        <AnimatePresence>
          {activeTab && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onMouseEnter={() => {
                if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
              }}
              onMouseLeave={handleMouseLeave}
              className="absolute top-full left-0 right-0 pt-3 px-4 sm:px-6 lg:px-8 z-50 text-gray-900 pointer-events-auto"
            >
              <div className="max-w-6xl mx-auto relative">
                <div className="bg-white rounded-[28px] shadow-2xl border border-gray-100/90 p-8 text-gray-900 overflow-hidden">
                  {/* TAB 1: PUBLIC DATA */}
                  {activeTab === "public-data" && (
                    <div className="grid grid-cols-12 gap-8">
                      {/* Left Column */}
                      <div className="col-span-4 border-r border-gray-100 pr-6 space-y-4">
                        <h4 className="text-xs font-bold text-brand-primary tracking-wide uppercase">
                          Content highlights
                        </h4>

                        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-accent1 via-brand-primary to-brand-accent2 p-6 text-white shadow-md">
                          <div className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full inline-block mb-3">
                            / InsightMatrix Intelligence
                          </div>
                          <h5 className="text-lg font-black leading-tight mb-4 drop-shadow">
                            Most Recommended Brands 2026
                          </h5>
                          <Link
                            href="/panel-book"
                            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-white text-brand-primary hover:bg-gray-50 text-xs font-black shadow transition-all"
                          >
                            Download now
                          </Link>
                        </div>

                        <h5 className="font-bold text-sm text-gray-900">
                          Most recommended brands 2026
                        </h5>

                        <ul className="space-y-2 text-xs text-gray-700 pt-2 border-t border-gray-100">
                          <li>
                            <Link
                              href="/services/b2c-market-research"
                              className="hover:text-brand-primary transition-colors font-medium block"
                            >
                              Netherlands&apos; FMCG Brands of Summer 2026
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/services/b2b-market-research"
                              className="hover:text-brand-primary transition-colors font-medium block"
                            >
                              Hong Kong Advertisers of the Month 2026
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/research"
                              className="hover:text-brand-primary transition-colors font-medium block"
                            >
                              Finland Word of Mouth Risers 2026
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Middle Column */}
                      <div className="col-span-5 border-r border-gray-100 pr-6">
                        <h4 className="text-xs font-bold text-brand-primary tracking-wide uppercase mb-4">
                          By category
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {PUBLIC_DATA_CATEGORIES.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.title}
                                href={item.href}
                                className="flex items-center gap-3 group text-sm font-semibold text-gray-800 hover:text-brand-primary transition-colors p-1.5 rounded-xl hover:bg-brand-subtle"
                              >
                                <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center transition-all">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span>{item.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="col-span-3">
                        <h4 className="text-xs font-bold text-brand-primary tracking-wide uppercase mb-4">
                          By type
                        </h4>
                        <div className="space-y-3">
                          {PUBLIC_DATA_TYPES.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.title}
                                href={item.href}
                                className="flex items-center gap-3 group text-sm font-semibold text-gray-800 hover:text-brand-primary transition-colors p-2 rounded-xl hover:bg-brand-subtle"
                              >
                                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center transition-all">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span>{item.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: SOLUTIONS */}
                  {activeTab === "solutions" && (
                    <div className="grid grid-cols-12 gap-8">
                      <div className="col-span-4 border-r border-gray-100 pr-6 space-y-4">
                        <h4 className="text-xs font-bold text-brand-primary tracking-wide uppercase">
                          Featured Solutions
                        </h4>

                        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-accent1 via-brand-dark to-slate-900 p-6 text-white shadow-md">
                          <div className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full inline-block mb-3">
                            / Global Fieldwork
                          </div>
                          <h5 className="text-lg font-black leading-tight mb-3">
                            End-to-End Market Research Services
                          </h5>
                          <p className="text-xs text-white/80 mb-4">
                            Quantitative CAWI, Qualitative IDIs & FGDs, Healthcare & CATI
                            operations.
                          </p>
                          <Link
                            href="/services"
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-primary text-white hover:bg-brand-hover text-xs font-black shadow transition-all"
                          >
                            Explore Solutions <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>

                        <h5 className="font-bold text-sm text-gray-900">
                          Why Top Brands Choose InsightMatrix
                        </h5>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Verified respondent recruitment, strict 9-stage quality checks, and 2-hour
                          feasibility quotes.
                        </p>
                      </div>

                      <div className="col-span-5 border-r border-gray-100 pr-6">
                        <h4 className="text-xs font-bold text-brand-primary tracking-wide uppercase mb-4">
                          Research Services
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {SOLUTIONS_CATEGORIES.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.title}
                                href={item.href}
                                className="flex items-center gap-3 group text-sm font-semibold text-gray-800 hover:text-brand-primary transition-colors p-1.5 rounded-xl hover:bg-brand-subtle"
                              >
                                <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center transition-all">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span>{item.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      <div className="col-span-3">
                        <h4 className="text-xs font-bold text-brand-primary tracking-wide uppercase mb-4">
                          Resources & Tools
                        </h4>
                        <div className="space-y-3">
                          {SOLUTIONS_TYPES.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.title}
                                href={item.href}
                                className="flex items-center gap-3 group text-sm font-semibold text-gray-800 hover:text-brand-primary transition-colors p-2 rounded-xl hover:bg-brand-subtle"
                              >
                                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center transition-all">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span>{item.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: COMPANY */}
                  {activeTab === "company" && (
                    <div className="grid grid-cols-12 gap-8">
                      <div className="col-span-4 border-r border-gray-100 pr-6 space-y-4">
                        <h4 className="text-xs font-bold text-brand-primary tracking-wide uppercase">
                          About InsightMatrix
                        </h4>

                        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-dark via-slate-900 to-brand-accent1 p-6 text-white shadow-md">
                          <div className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full inline-block mb-3">
                            / Company Overview
                          </div>
                          <h5 className="text-lg font-black leading-tight mb-2">
                            Better Insights. Smarter Decisions.
                          </h5>
                          <p className="text-xs text-white/80 mb-4">
                            Global market research & data collection partner serving agencies,
                            consultancies, & brands worldwide.
                          </p>
                          <Link
                            href="/about"
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-primary hover:bg-brand-hover text-white text-xs font-black shadow transition-all"
                          >
                            About Us <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>

                      <div className="col-span-5 border-r border-gray-100 pr-6">
                        <h4 className="text-xs font-bold text-brand-primary tracking-wide uppercase mb-4">
                          Company & Quality
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {COMPANY_CATEGORIES.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.title}
                                href={item.href}
                                className="flex items-center gap-3 group text-sm font-semibold text-gray-800 hover:text-brand-primary transition-colors p-1.5 rounded-xl hover:bg-brand-subtle"
                              >
                                <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center transition-all">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span>{item.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      <div className="col-span-3">
                        <h4 className="text-xs font-bold text-brand-primary tracking-wide uppercase mb-4">
                          Support
                        </h4>
                        <div className="space-y-3">
                          {COMPANY_TYPES.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.title}
                                href={item.href}
                                className="flex items-center gap-3 group text-sm font-semibold text-gray-800 hover:text-brand-primary transition-colors p-2 rounded-xl hover:bg-brand-subtle"
                              >
                                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center transition-all">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span>{item.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[101] shadow-2xl lg:hidden flex flex-col"
            >
              <div className="p-5 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
                <ImxLogo href="/" size="sm" surface="light" />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="space-y-3">
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-xs font-bold text-brand-primary uppercase mb-2">
                      Public data
                    </h4>
                    {PUBLIC_DATA_CATEGORIES.slice(0, 5).map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block py-1.5 text-sm font-semibold text-gray-700 hover:text-brand-primary"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>

                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-xs font-bold text-brand-primary uppercase mb-2">
                      Solutions
                    </h4>
                    {SOLUTIONS_CATEGORIES.slice(0, 5).map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block py-1.5 text-sm font-semibold text-gray-700 hover:text-brand-primary"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>

                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-xs font-bold text-brand-primary uppercase mb-2">Company</h4>
                    {COMPANY_CATEGORIES.slice(0, 4).map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block py-1.5 text-sm font-semibold text-gray-700 hover:text-brand-primary"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <Link
                    href={ROUTES.register}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full py-3.5 rounded-2xl bg-brand-primary text-white font-black text-sm shadow-xl shadow-brand-primary/20"
                  >
                    Sign up
                  </Link>
                  <Link
                    href={ROUTES.login}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full py-3.5 rounded-2xl border-2 border-gray-200 text-gray-900 font-black text-sm hover:bg-gray-50"
                  >
                    Log in
                  </Link>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  &copy; {new Date().getFullYear()} InsightMatrix Research
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
