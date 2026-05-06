"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminRoleGate } from "@/components/auth/admin-role-gate";
import { useLogout } from "@/hooks/use-logout";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  User,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { name: "Overview", icon: LayoutDashboard, href: "/admin" },
  { name: "Case Studies", icon: FileText, href: "/admin/case-studies" },
  { name: "Services", icon: Briefcase, href: "/admin/services" },
  { name: "Team", icon: Users, href: "/admin/team" },
  { name: "Testimonials", icon: MessageSquare, href: "/admin/testimonials" },
  { name: "Queries", icon: MessageSquare, href: "/admin/queries" },
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
          className={`hidden lg:flex flex-col bg-gray-900 text-white transition-all duration-300 border-r border-white/5 ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shrink-0 shadow-lg shadow-brand-primary/20">
              <span className="font-black text-white text-xl">I</span>
            </div>
            {isSidebarOpen && (
              <span className="font-black tracking-tighter text-xl">
                Insight<span className="text-brand-primary">Matrix</span>
              </span>
            )}
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
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
                className="fixed top-0 left-0 bottom-0 w-72 bg-gray-950 text-white z-[60] p-6 lg:hidden flex flex-col"
              >
                <div className="flex items-center justify-between mb-10">
                  <span className="font-black tracking-tighter text-2xl">
                    Insight<span className="text-brand-primary">Matrix</span>
                  </span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400">
                    <X />
                  </button>
                </div>
                <nav className="flex-1 space-y-4">
                  {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
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

              {/* Admin Home Logo */}
              <Link href="/admin">
                <span className="font-black tracking-tighter text-xl sm:text-2xl text-gray-900">
                  Insight<span className="text-brand-primary">Matrix</span>
                </span>
              </Link>
              <div className="relative max-w-md w-full hidden md:block">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Universal Search..."
                  className="w-full pl-12 pr-6 py-2.5 bg-gray-50 border-none rounded-xl text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                />
              </div>
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

          <div className="p-6 lg:p-10 flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </AdminRoleGate>
  );
}
