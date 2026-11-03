"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Code2,
  ExternalLink,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Store,
  User,
  Webhook,
  X,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { VendorRoleGate } from "@/components/auth/vendor-role-gate";
import { ImxLogo } from "@/components/brand";
import { ROUTES } from "@/constants/routes";
import { vendorLogoutRequest } from "@/services/vendor-auth";
import { useVendorAuthStore } from "@/store/vendorAuthStore";
import { cn } from "@/lib/utils";
import { VendorIntegrationModal } from "@/components/vendor/vendor-integration-modal";

type NavSection = {
  title: string;
  items: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
    exact?: boolean;
    onClick?: () => void;
  }[];
};

export default function VendorPanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const vendor = useVendorAuthStore((s) => s.vendor);
  const clearVendor = useVendorAuthStore((s) => s.clearVendor);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  const logout = async () => {
    try {
      await vendorLogoutRequest();
    } catch {
      /* ignore */
    }
    clearVendor();
    window.location.href = ROUTES.vendor.login;
  };

  const navSections: NavSection[] = [
    {
      title: "Core & Analytics",
      items: [
        {
          href: ROUTES.vendor.dashboard,
          label: "Dashboard",
          icon: LayoutDashboard,
          exact: true,
        },
      ],
    },
    {
      title: "Campaigns & Traffic",
      items: [
        {
          href: ROUTES.vendor.surveys,
          label: "Assigned Surveys",
          icon: ClipboardList,
          badge: "Live",
          badgeColor: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
        },
      ],
    },
    {
      title: "Integration & Setup",
      items: [
        {
          href: `${ROUTES.vendor.profile}#callbacks`,
          label: "Postbacks & Relays",
          icon: Webhook,
          badge: "Webhooks",
          badgeColor: "bg-blue-500/15 text-blue-700 border-blue-500/20",
        },
        {
          href: "#docs",
          label: "Integration Specs",
          icon: Code2,
          onClick: () => setIsDocsOpen(true),
        },
      ],
    },
    {
      title: "Account & Security",
      items: [
        {
          href: ROUTES.vendor.profile,
          label: "Vendor Profile",
          icon: User,
          exact: true,
        },
      ],
    },
  ];

  const getBreadcrumbs = () => {
    if (pathname === ROUTES.vendor.dashboard) return ["Vendor Hub", "Dashboard"];
    if (pathname === ROUTES.vendor.surveys) return ["Vendor Hub", "Assigned Surveys"];
    if (pathname.startsWith("/vendor/surveys/"))
      return ["Vendor Hub", "Surveys", "Allocation Details"];
    if (pathname === ROUTES.vendor.profile) return ["Vendor Hub", "Profile & Settings"];
    return ["Vendor Hub"];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <VendorRoleGate>
      <div className="min-h-screen bg-slate-50/70 text-gray-900 [color-scheme:light] antialiased flex flex-col lg:flex-row">
        {/* Mobile Backdrop */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar Container */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 ease-in-out lg:static lg:z-auto",
            isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            isCollapsed ? "lg:w-20" : "lg:w-64",
            "w-72 shadow-xl lg:shadow-none"
          )}
        >
          {/* Brand & Workspace Header */}
          <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-slate-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <ImxLogo
                href={ROUTES.vendor.dashboard}
                size="sm"
                surface="light"
                className={isCollapsed ? "hidden" : "block"}
              />
              {isCollapsed && (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white font-black text-sm shadow-md shadow-brand-primary/20">
                  IM
                </div>
              )}
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden rounded-lg p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Partner Status Pill Banner (when expanded) */}
          {!isCollapsed && (
            <div className="px-4 py-3 mx-3 my-2 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100/70 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="flex h-2 w-2 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[11px] font-black uppercase tracking-wider text-gray-700 truncate">
                  {vendor?.vendorCode ?? "VENDOR"}
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200/60 shrink-0">
                Supply Partner
              </span>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4 scrollbar-thin">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                {!isCollapsed && (
                  <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                    {section.title}
                  </p>
                )}
                {section.items.map((item) => {
                  const active = item.exact
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  if (item.onClick) {
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={item.onClick}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-150 text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 group",
                          isCollapsed && "justify-center px-2"
                        )}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <item.icon className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-brand-primary transition-colors" />
                        {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-150 group",
                        active
                          ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
                        isCollapsed && "justify-center px-2"
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          active ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                        )}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                "text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border",
                                active
                                  ? "bg-white/20 text-white border-white/30"
                                  : item.badgeColor ||
                                      "bg-slate-100 text-slate-600 border-slate-200"
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer: Vendor Account Profile & Sign Out */}
          <div className="shrink-0 p-3 border-t border-slate-100 bg-slate-50/50">
            <div
              className={cn(
                "flex items-center justify-between gap-2 rounded-2xl bg-white border border-slate-200/70 p-2.5 shadow-2xs",
                isCollapsed && "flex-col justify-center p-2"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white font-black text-xs shadow-xs">
                  {vendor?.companyName?.slice(0, 2).toUpperCase() ?? "VN"}
                </div>
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {vendor?.companyName ?? "Partner Vendor"}
                    </p>
                    <p className="font-mono text-[10px] text-gray-400 truncate">
                      {vendor?.contactPerson || vendor?.email || vendor?.vendorCode}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={logout}
                className={cn(
                  "p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors",
                  isCollapsed && "w-full flex justify-center"
                )}
                title="Sign out of vendor portal"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Sticky Bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Trigger */}
              <button
                type="button"
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 text-gray-600 hover:bg-slate-100"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Desktop Sidebar Collapse Toggle */}
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-1.5 rounded-lg border border-slate-200 text-gray-400 hover:text-gray-700 hover:bg-slate-50 transition"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>

              {/* Breadcrumb Path */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={crumb}>
                    {idx > 0 && <span className="text-slate-300">/</span>}
                    <span
                      className={
                        idx === breadcrumbs.length - 1
                          ? "font-bold text-gray-900"
                          : "text-slate-500 font-medium"
                      }
                    >
                      {crumb}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-2.5">
              {/* Integration Specs Pill Button */}
              <button
                type="button"
                onClick={() => setIsDocsOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition"
              >
                <Code2 className="h-3.5 w-3.5 text-brand-primary" />
                <span className="hidden sm:inline">Integration Specs</span>
              </button>

              {/* Live Status Pill */}
              <div className="hidden md:flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Exchange Live</span>
              </div>

              {/* Vendor Code Pill */}
              <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 border border-slate-200/80 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-800">
                <Store className="h-3.5 w-3.5 text-brand-primary" />
                {vendor?.vendorCode ?? "VENDOR"}
              </span>
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {children}
          </main>
        </div>

        {/* Integration Documentation Modal */}
        <VendorIntegrationModal
          isOpen={isDocsOpen}
          onClose={() => setIsDocsOpen(false)}
          vendorCode={vendor?.vendorCode}
        />
      </div>
    </VendorRoleGate>
  );
}
