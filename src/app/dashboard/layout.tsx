"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ImxLogo } from "@/components/brand";
import { DashboardRoleGate } from "@/components/auth/dashboard-role-gate";
import { PanelPrescreenGate } from "@/components/auth/panel-prescreen-gate";
import { ROUTES } from "@/constants/routes";
import { useLogout } from "@/hooks/use-logout";
import { getPanelWallet } from "@/services/member-panel";
import { queryKeys } from "@/services/queries";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store";
import {
  Compass,
  ClipboardList,
  HelpCircle,
  Wallet,
  Bell,
  User,
  TrendingUp,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Coins,
  Sparkles,
  History,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function isNavActive(pathname: string, href: string) {
  if (href === ROUTES.dashboard.root) return pathname === ROUTES.dashboard.root;
  return pathname === href || pathname.startsWith(`${href}/`);
}

type PanelNavItem = {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  href: string;
  badge?: string;
  badgeColor?: string;
};

type PanelNavSection = {
  title: string;
  items: PanelNavItem[];
};

const panelSections: PanelNavSection[] = [
  {
    title: "Panel Main",
    items: [
      { name: "Explore", icon: Compass, href: ROUTES.dashboard.root },
      {
        name: "Surveys",
        icon: ClipboardList,
        href: ROUTES.dashboard.surveys,
        badge: "Earn",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      },
      { name: "Survey History", icon: History, href: ROUTES.dashboard.history },
      { name: "Points & Wallet", icon: Wallet, href: ROUTES.dashboard.wallet },
      { name: "Profile Prescreen", icon: ShieldCheck, href: ROUTES.dashboard.prescreen },
    ],
  },
  {
    title: "Account & Support",
    items: [
      { name: "Help Center", icon: HelpCircle, href: ROUTES.dashboard.help },
      { name: "Settings", icon: Settings, href: ROUTES.dashboard.settings },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useUIStore((s) => s.panelSidebarExpanded);
  const setPanelSidebarExpanded = useUIStore((s) => s.setPanelSidebarExpanded);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const { data: walletData } = useQuery({
    queryKey: queryKeys.memberPanel.wallet,
    queryFn: getPanelWallet,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  const pointsBalance = walletData?.balance ?? user?.panelPoints ?? 0;
  const displayName = user?.fullName?.trim() || "Member";
  const avatarUrl = user?.avatar?.trim() || "";

  return (
    <DashboardRoleGate>
      <PanelPrescreenGate>
        <div className="h-screen bg-slate-50/70 flex overflow-hidden">
          {/* Desktop Sidebar */}
          <aside
            className={`hidden lg:flex flex-col bg-[#080F1D] text-slate-200 transition-all duration-300 border-r border-slate-800/80 shadow-2xl min-h-0 relative select-none ${
              isSidebarOpen ? "w-64" : "w-20"
            }`}
          >
            {/* Ambient Radial Glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-primary/15 via-blue-600/5 to-transparent blur-xl" />

            {/* Header / Brand */}
            <div className="p-4 flex items-center justify-between min-h-[4.75rem] border-b border-slate-800/80 bg-[#0A1325]/80 backdrop-blur-md relative z-10">
              {isSidebarOpen ? (
                <>
                  <ImxLogo href={ROUTES.dashboard.root} size="sm" surface="dark" />
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-black tracking-widest text-brand-light bg-brand-primary/20 border border-brand-primary/30 px-2 py-0.5 rounded-full uppercase shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Panel
                  </span>
                </>
              ) : (
                <ImxLogo
                  href={ROUTES.dashboard.root}
                  size="xs"
                  surface="dark"
                  className="mx-auto"
                />
              )}
            </div>

            {/* Member Tier Card */}
            {isSidebarOpen && (
              <div className="px-3.5 pt-4 pb-1 relative z-10">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0D182E] to-[#0B1528] border border-slate-800/90 shadow-md relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-xs">
                        <Sparkles size={14} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block leading-tight">
                          Platinum Tier
                        </span>
                        <span className="text-[9px] font-bold text-slate-500">Verified Member</span>
                      </div>
                    </div>
                    <Link
                      href={ROUTES.dashboard.wallet}
                      className="text-[11px] font-black text-amber-400 tabular-nums hover:underline"
                    >
                      {pointsBalance.toLocaleString()} pts
                    </Link>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-amber-400 to-brand-primary rounded-full shadow-xs" />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Menu */}
            <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-slate-800">
              {panelSections.map((section, sIdx) => (
                <div key={section.title} className="space-y-1">
                  {isSidebarOpen ? (
                    <div className="px-3 pt-2 pb-1 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 select-none">
                      <span>{section.title}</span>
                    </div>
                  ) : (
                    sIdx > 0 && <div className="my-2 mx-auto w-6 h-px bg-slate-800/80" />
                  )}

                  {section.items.map((link) => {
                    const isActive = isNavActive(pathname, link.href);
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
                                : "text-slate-400 group-hover:text-sky-400 group-hover:scale-110 transition-transform duration-200"
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
                            size={18}
                            className={`shrink-0 ${
                              isActive
                                ? "text-white"
                                : "text-slate-400 group-hover:text-sky-400 group-hover:scale-110 transition-transform duration-200"
                            } `}
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

            {/* Bottom User Card */}
            <div className="p-3 border-t border-slate-800/80 bg-[#070D18]/90 backdrop-blur-md relative z-10">
              {isSidebarOpen ? (
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-brand-primary/25 shrink-0 overflow-hidden">
                    {avatarUrl ? (
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url("${avatarUrl}")` }}
                        aria-label="Avatar"
                      />
                    ) : (
                      displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-white truncate">{displayName}</div>
                    <div className="text-[9px] font-extrabold text-brand-light uppercase tracking-wider truncate">
                      Panelist
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => logout.mutate()}
                    disabled={logout.isPending}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                    title="Log out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-brand-primary/25"
                    title={displayName}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <button
                    type="button"
                    onClick={() => logout.mutate()}
                    disabled={logout.isPending}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Log out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Mobile Sidebar Overlay Drawer */}
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
                    <ImxLogo href={ROUTES.dashboard.root} size="sm" surface="dark" />
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <nav className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                    {panelSections.map((section) => (
                      <div key={section.title} className="space-y-1">
                        <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                          {section.title}
                        </div>
                        {section.items.map((link) => {
                          const isActive = isNavActive(pathname, link.href);
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
                                    link.badgeColor ||
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
                      onClick={() => logout.mutate()}
                      disabled={logout.isPending}
                      className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-xs font-black uppercase tracking-wider"
                    >
                      <LogOut size={16} />
                      <span>Log out</span>
                    </button>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Main Area */}
          <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-50/70 w-full">
            <header className="h-20 px-4 sm:px-6 lg:px-10 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 w-full">
              <div className="flex items-center gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setIsMobileMenuOpen(true);
                    } else {
                      setPanelSidebarExpanded(!isSidebarOpen);
                    }
                  }}
                  className="flex w-10 h-10 rounded-xl bg-gray-50 items-center justify-center text-gray-500 hover:text-brand-primary hover:bg-brand-subtle transition-colors"
                >
                  <Menu size={20} />
                </button>

                <ImxLogo
                  href={ROUTES.dashboard.root}
                  size="sm"
                  surface="light"
                  className="lg:hidden"
                />

                <div className="hidden sm:block">
                  <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight leading-none mb-1">
                    Welcome back, <span className="text-brand-primary">{displayName}</span>
                  </h2>
                  <p className="text-[11px] font-bold text-gray-400">
                    Participate in matched research studies & earn reward points
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                {/* Wallet Balance Pill */}
                <Link
                  href={ROUTES.dashboard.wallet}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs shadow-xs hover:border-amber-300 hover:shadow-sm transition-all"
                  title="View your points wallet"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                    <Coins size={12} />
                  </div>
                  <span className="tabular-nums font-black">{pointsBalance.toLocaleString()}</span>
                  <span className="text-[10px] text-amber-700/80 uppercase font-black tracking-wider">
                    pts
                  </span>
                </Link>

                <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />

                {/* Profile Pill */}
                <Link
                  href={ROUTES.dashboard.settings}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-subtle to-white border border-brand-primary/20 flex items-center justify-center text-brand-primary overflow-hidden cursor-pointer hover:shadow-md transition-all active:scale-95"
                  title="Account Settings"
                >
                  {avatarUrl ? (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url("${avatarUrl}")` }}
                      aria-label="Profile avatar"
                      role="img"
                    />
                  ) : (
                    <User size={18} />
                  )}
                </Link>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-6 text-gray-900 [color-scheme:light]">
              <div className="max-w-6xl mx-auto space-y-8">{children}</div>
            </div>
          </main>
        </div>
      </PanelPrescreenGate>
    </DashboardRoleGate>
  );
}
