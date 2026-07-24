"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminRoleGate } from "@/components/auth/admin-role-gate";
import { ImxLogo } from "@/components/brand";
import { UniversalSearch } from "@/components/crm/universal-search";
import { useLogout } from "@/hooks/use-logout";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  User,
  ListChecks,
  Building2,
  Store,
  ClipboardList,
  Receipt,
  BookOpen,
  Activity,
  Share2,
  Users,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function isSidebarActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const sidebarLinks = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Survey Providers", icon: Building2, href: "/admin/companies" },
  { name: "Vendors", icon: Store, href: "/admin/vendors" },
  { name: "Surveys", icon: ClipboardList, href: "/admin/surveys" },
  { name: "Vendor Allocations", icon: Share2, href: "/admin/vendor-allocations" },
  { name: "Survey Respondents", icon: Users, href: "/admin/survey-respondents" },
  { name: "Respondent Analytics", icon: Activity, href: "/admin/respondent-analytics" },
  { name: "Export Center", icon: Share2, href: "/admin/respondent-exports" },
  { name: "Security Logs", icon: Shield, href: "/admin/security-logs" },
  { name: "Company Payments", icon: Receipt, href: "/admin/company-payments" },
  { name: "Queries", icon: MessageSquare, href: "/admin/queries" },
  { name: "Panel Book", icon: BookOpen, href: "/admin/panel-book" },
  { name: "Prescreening", icon: ListChecks, href: "/admin/prescreen" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useUIStore((s) => s.adminSidebarExpanded);
  const setAdminSidebarExpanded = useUIStore((s) => s.setAdminSidebarExpanded);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <AdminRoleGate>
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col bg-gray-900 text-white transition-all duration-300 border-r border-white/5 min-h-0 ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <div className="p-6 flex items-center min-h-[4.5rem]">
            <ImxLogo
              href="/admin"
              size={isSidebarOpen ? "sm" : "xs"}
              surface="dark"
              className={isSidebarOpen ? undefined : "mx-auto"}
            />
          </div>

          <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-6 space-y-2">
            {sidebarLinks.map((link) => {
              const isActive = isSidebarActive(pathname, link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                    isActive
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      isActive ? "text-white" : "group-hover:scale-110 transition-transform"
                    }
                  />
                  {isSidebarOpen && (
                    <span className="font-bold text-sm tracking-tight">{link.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="flex items-center gap-4 px-4 py-3 w-full text-gray-400 hover:text-red-400 transition-colors uppercase text-[10px] font-black tracking-widest disabled:opacity-60"
            >
              <LogOut size={18} />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Menu Button - Removed from bottom and moved to header */}

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                className="fixed top-0 left-0 bottom-0 w-72 bg-gray-950 text-white z-[60] p-6 lg:hidden flex flex-col min-h-0"
              >
                <div className="flex items-center justify-between mb-10">
                  <ImxLogo href="/admin" size="sm" surface="dark" />
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400">
                    <X />
                  </button>
                </div>
                <nav className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
                  {sidebarLinks.map((link) => {
                    const isActive = isSidebarActive(pathname, link.href);
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                          isActive ? "bg-brand-primary text-white" : "text-gray-400"
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-bold">{link.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden w-full">
          <header className="h-20 bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30 w-full">
            <div className="flex items-center gap-4 lg:gap-8 flex-1">
              <button
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsMobileMenuOpen(true);
                  } else {
                    setAdminSidebarExpanded(!isSidebarOpen);
                  }
                }}
                className="flex w-10 h-10 rounded-xl bg-gray-50 items-center justify-center text-gray-400 hover:text-brand-primary transition-colors"
              >
                <Menu size={20} />
              </button>

              <ImxLogo href="/admin" size="sm" surface="light" />
              <UniversalSearch className="hidden md:block" />
            </div>

            <div className="flex items-center gap-4">
              <button className="relative w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-brand-primary transition-colors">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-primary rounded-full border-2 border-white" />
              </button>
              <div className="h-10 w-px bg-gray-100 mx-2 hidden sm:block" />
              <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-black text-gray-900 leading-none mb-1">
                    {user?.fullName ?? "Administrator"}
                  </div>
                  <div className="text-[10px] font-black text-brand-primary uppercase tracking-widest">
                    {user?.role ?? "admin"}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary overflow-hidden">
                  <User size={20} />
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 lg:p-10 flex-1 overflow-y-auto text-gray-900 [color-scheme:light]">
            {children}
          </div>
        </main>
      </div>
    </AdminRoleGate>
  );
}
