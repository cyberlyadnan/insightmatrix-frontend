"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Code2,
  LayoutDashboard,
  LogOut,
  Menu,
  Store,
  User,
  Webhook,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { VendorRoleGate } from "@/components/auth/vendor-role-gate";
import { ImxLogo } from "@/components/brand";
import { ROUTES } from "@/constants/routes";
import { vendorLogoutRequest } from "@/services/vendor-auth";
import { useVendorAuthStore } from "@/store/vendorAuthStore";

function isSidebarActive(pathname: string, href: string) {
  if (href === ROUTES.vendor.dashboard) return pathname === ROUTES.vendor.dashboard;
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarItem = {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  href: string;
  badge?: string;
  badgeColor?: string;
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

const sidebarSections: SidebarSection[] = [
  {
    title: "Core & Analytics",
    items: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        href: ROUTES.vendor.dashboard,
      },
    ],
  },
  {
    title: "Campaigns & Traffic",
    items: [
      {
        name: "Assigned Surveys",
        icon: ClipboardList,
        href: ROUTES.vendor.surveys,
        badge: "Live",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      },
    ],
  },
  {
    title: "Integration & Setup",
    items: [
      {
        name: "Integration Specs",
        icon: Code2,
        href: ROUTES.vendor.integration,
        badge: "API",
        badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      },
      {
        name: "S2S Postbacks",
        icon: Webhook,
        href: ROUTES.vendor.profile,
        badge: "Webhooks",
        badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      },
    ],
  },
  {
    title: "Account & Security",
    items: [
      {
        name: "Profile & Settings",
        icon: User,
        href: ROUTES.vendor.profile,
      },
    ],
  },
];

export default function VendorPanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const vendor = useVendorAuthStore((s) => s.vendor);
  const clearVendor = useVendorAuthStore((s) => s.clearVendor);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logout = async () => {
    try {
      await vendorLogoutRequest();
    } catch {
      /* ignore */
    }
    clearVendor();
    window.location.href = ROUTES.vendor.login;
  };

  const getBreadcrumbs = () => {
    if (pathname === ROUTES.vendor.dashboard) return ["Vendor Portal", "Dashboard"];
    if (pathname === ROUTES.vendor.surveys) return ["Vendor Portal", "Assigned Surveys"];
    if (pathname.startsWith("/vendor/surveys/"))
      return ["Vendor Portal", "Surveys", "Allocation Details"];
    if (pathname === ROUTES.vendor.integration)
      return ["Vendor Portal", "Integration Specifications"];
    if (pathname === ROUTES.vendor.profile) return ["Vendor Portal", "Profile & Settings"];
    return ["Vendor Portal"];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <VendorRoleGate>
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        {/* Fixed Desktop Sidebar (Dark Admin Style) */}
        <aside
          className={`hidden lg:flex flex-col bg-[#080F1D] text-slate-200 transition-all duration-300 border-r border-slate-800/80 shadow-2xl min-h-0 relative select-none ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-primary/15 via-blue-600/5 to-transparent blur-xl" />

          {/* Sidebar Top Header */}
          <div className="p-4 flex items-center justify-between min-h-[4.75rem] border-b border-slate-800/80 bg-[#0A1325]/80 backdrop-blur-md relative z-10">
            {isSidebarOpen ? (
              <>
                <ImxLogo href={ROUTES.vendor.dashboard} size="sm" surface="dark" />
                <span className="inline-flex items-center gap-1.5 text-[9px] font-black tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Vendor
                </span>
              </>
            ) : (
              <ImxLogo
                href={ROUTES.vendor.dashboard}
                size="xs"
                surface="dark"
                className="mx-auto"
              />
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-slate-800">
            {sidebarSections.map((section, sIdx) => (
              <div key={section.title} className="space-y-1">
                {isSidebarOpen ? (
                  <div className="px-3 pt-2 pb-1 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 select-none">
                    <span>{section.title}</span>
                  </div>
                ) : (
                  sIdx > 0 && <div className="my-2 mx-auto w-6 h-px bg-slate-800/80" />
                )}

                {section.items.map((link) => {
                  const isActive = isSidebarActive(pathname, link.href);
                  const Icon = link.icon;

                  if (!isSidebarOpen) {
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        title={link.name}
                        className={`flex items-center justify-center w-11 h-11 mx-auto rounded-xl transition-all duration-200 group relative ${
                          isActive
                            ? "bg-gradient-to-br from-brand-primary to-indigo-600 text-white shadow-lg shadow-brand-primary/30 border border-white/20"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-brand-light rounded-r-full shadow-sm" />
                        )}
                        <Icon
                          size={19}
                          className={
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover:text-blue-400 group-hover:scale-110 transition-transform duration-200"
                          }
                        />
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative ${
                        isActive
                          ? "bg-gradient-to-r from-brand-primary via-[#0d59f2] to-[#1e6bf7] text-white font-extrabold shadow-lg shadow-brand-primary/25 border border-white/15"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700/50 hover:translate-x-0.5"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full shadow-sm shadow-white/60" />
                      )}
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          size={17}
                          className={`shrink-0 ${
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover:text-sky-400 group-hover:scale-110 transition-transform duration-200"
                          }`}
                        />
                        <span className="text-xs font-bold tracking-tight truncate">
                          {link.name}
                        </span>
                      </div>
                      {link.badge && (
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border shadow-2xs ${
                            isActive
                              ? "bg-white/20 text-white border-white/30"
                              : link.badgeColor || "bg-slate-800 text-slate-300 border-slate-700"
                          }`}
                        >
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* User Profile & Logout Bottom Footer */}
          <div className="p-3 border-t border-slate-800/80 bg-[#070D18]/90 backdrop-blur-md relative z-10">
            {isSidebarOpen ? (
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-brand-primary/25 shrink-0">
                  {vendor?.companyName?.slice(0, 2).toUpperCase() || "VN"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black text-white truncate">
                    {vendor?.companyName || "Vendor Partner"}
                  </div>
                  <div className="text-[9px] font-mono font-bold text-brand-light uppercase tracking-wider truncate">
                    {vendor?.vendorCode || "VENDOR"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-brand-primary/25"
                  title={vendor?.companyName || "Vendor Partner"}
                >
                  {vendor?.companyName?.slice(0, 2).toUpperCase() || "VN"}
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                className="fixed top-0 left-0 bottom-0 w-72 bg-[#080F1D] text-slate-200 z-[60] p-5 lg:hidden flex flex-col min-h-0 border-r border-slate-800/80 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
                  <ImxLogo href={ROUTES.vendor.dashboard} size="sm" surface="dark" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60"
                  >
                    <X size={20} />
                  </button>
                </div>
                <nav className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                  {sidebarSections.map((section) => (
                    <div key={section.title} className="space-y-1">
                      <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        {section.title}
                      </div>
                      {section.items.map((link) => {
                        const isActive = isSidebarActive(pathname, link.href);
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                              isActive
                                ? "bg-gradient-to-r from-brand-primary to-blue-600 text-white font-extrabold shadow-lg shadow-brand-primary/25"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon size={18} />
                              <span className="text-sm font-bold">{link.name}</span>
                            </div>
                            {link.badge && (
                              <span
                                className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${
                                  isActive
                                    ? "bg-white/20 text-white border-white/30"
                                    : link.badgeColor ||
                                      "bg-slate-800 text-slate-300 border-slate-700"
                                }`}
                              >
                                {link.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </nav>
                <div className="pt-4 mt-4 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-xs font-black uppercase tracking-wider"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area (Sidebar stays fixed while this scrolls!) */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden w-full">
          {/* Header Bar */}
          <header className="h-20 bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30 w-full shrink-0">
            <div className="flex items-center gap-4 lg:gap-6 flex-1">
              <button
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsMobileMenuOpen(true);
                  } else {
                    setIsSidebarOpen(!isSidebarOpen);
                  }
                }}
                className="flex w-10 h-10 rounded-xl bg-gray-50 items-center justify-center text-gray-400 hover:text-brand-primary transition-colors"
                title="Toggle sidebar"
              >
                <Menu size={20} />
              </button>

              {/* Breadcrumb Path */}
              <div className="hidden sm:flex items-center gap-2 text-xs">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={crumb}>
                    {idx > 0 && <span className="text-gray-300">/</span>}
                    <span
                      className={
                        idx === breadcrumbs.length - 1
                          ? "font-extrabold text-gray-900"
                          : "text-gray-500 font-medium"
                      }
                    >
                      {crumb}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              {/* Integration Specs Page Link */}
              <Link
                href={ROUTES.vendor.integration}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-2xs transition"
              >
                <Code2 className="h-3.5 w-3.5 text-brand-primary" />
                <span>Integration Specs</span>
              </Link>

              {/* Live Status Pill */}
              <div className="hidden md:flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Exchange Live</span>
              </div>

              {/* Vendor Code Pill */}
              <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 border border-slate-200 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-800">
                <Store className="h-3.5 w-3.5 text-brand-primary" />
                {vendor?.vendorCode ?? "VENDOR"}
              </span>

              <div className="h-8 w-px bg-gray-100 mx-1 hidden sm:block" />

              {/* Vendor Profile Mini Card */}
              <div className="flex items-center gap-2.5 pl-1">
                <div className="text-right hidden md:block">
                  <div className="text-xs font-black text-gray-900 leading-none mb-1">
                    {vendor?.companyName ?? "Partner Vendor"}
                  </div>
                  <div className="text-[10px] font-black text-brand-primary uppercase tracking-widest">
                    {vendor?.contactPerson || vendor?.vendorCode}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-black text-xs overflow-hidden">
                  {vendor?.companyName?.slice(0, 2).toUpperCase() || "VN"}
                </div>
              </div>
            </div>
          </header>

          {/* Page Body Container - This is what scrolls! */}
          <div className="p-6 lg:p-10 flex-1 overflow-y-auto text-gray-900 [color-scheme:light]">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </VendorRoleGate>
  );
}
