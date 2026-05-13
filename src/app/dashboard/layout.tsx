"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardRoleGate } from "@/components/auth/dashboard-role-gate";
import { PanelPrescreenGate } from "@/components/auth/panel-prescreen-gate";
import { ROUTES } from "@/constants/routes";
import { useLogout } from "@/hooks/use-logout";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store";
import {
  Compass,
  ClipboardList,
  HelpCircle,
  Wallet,
  Bell,
  Search,
  User,
  Zap,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { name: "Explore", icon: Compass, href: ROUTES.dashboard.root },
  { name: "Surveys", icon: ClipboardList, href: ROUTES.dashboard.surveys },
  { name: "Wallet", icon: Wallet, href: ROUTES.dashboard.wallet },
  { name: "Help Center", icon: HelpCircle, href: ROUTES.dashboard.help },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useUIStore((s) => s.panelSidebarExpanded);
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const displayName = user?.fullName?.trim() || "there";
  const avatarUrl = user?.avatar?.trim() || "";

  return (
    <DashboardRoleGate>
      <PanelPrescreenGate>
        <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
          <aside
            className={`hidden lg:flex flex-col bg-white transition-all duration-500 border-r border-brand-primary/5 relative z-40 ${
              isSidebarOpen ? "w-72" : "w-24"
            }`}
          >
            <div className="p-8 pb-12 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-primary to-violet-500 flex items-center justify-center shrink-0 shadow-xl shadow-brand-primary/20">
                <Zap className="text-white" size={20} fill="currentColor" />
              </div>
              {isSidebarOpen && (
                <span className="font-black tracking-tighter text-2xl text-gray-900">
                  Insight<span className="text-brand-primary">Matrix</span>
                </span>
              )}
            </div>

            <div className="px-5 mb-10 overflow-hidden">
              <div
                className={`p-4 rounded-3xl bg-gray-50 border border-gray-100 transition-all ${isSidebarOpen ? "opacity-100" : "opacity-0 invisible"}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <TrendingUp size={14} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Tier: Platinum
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-brand-primary rounded-full" />
                </div>
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative group ${
                      isActive
                        ? "bg-brand-primary text-white shadow-2xl shadow-brand-primary/20"
                        : "text-gray-500 hover:bg-brand-primary/5 hover:text-brand-primary"
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
                    {isActive && isSidebarOpen && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute right-4 w-1 h-1 bg-white rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-6 mt-auto space-y-1">
              <div
                className={`mb-6 p-4 rounded-3xl bg-brand-primary text-white relative overflow-hidden group cursor-pointer ${isSidebarOpen ? "block" : "hidden"}`}
              >
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">
                    Balance
                  </p>
                  <h4 className="text-2xl font-black">$124.50</h4>
                </div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
              </div>

              <Link
                href={ROUTES.dashboard.settings}
                className="flex items-center gap-4 px-5 py-4 w-full text-gray-400 hover:text-gray-900 transition-colors rounded-2xl"
              >
                <Settings size={20} />
                {isSidebarOpen && <span className="font-bold text-sm">Settings</span>}
              </Link>

              <button
                type="button"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="flex items-center gap-4 px-5 py-4 w-full text-gray-400 hover:text-red-600 transition-colors rounded-2xl disabled:opacity-60"
              >
                <LogOut size={20} />
                {isSidebarOpen && <span className="font-bold text-sm">Log out</span>}
              </button>
            </div>
          </aside>

          <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-50 w-full">
            <header className="h-24 px-4 sm:px-6 lg:px-12 flex items-center justify-between shrink-0 bg-white/40 backdrop-blur-md border-b border-slate-200/50 transition-all w-full">
              <div className="flex items-center gap-4 sm:gap-6">
                <Link href={ROUTES.dashboard.root} className="lg:hidden">
                  <span className="font-black tracking-tighter text-xl sm:text-2xl text-gray-900">
                    Insight<span className="text-brand-primary">Matrix</span>
                  </span>
                </Link>

                <h2 className="text-xl font-black text-gray-900 hidden lg:block">
                  Welcome back, <span className="text-brand-primary">{displayName}</span> 👋
                </h2>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative hidden md:block">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Find surveys..."
                    className="w-64 pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm text-gray-900 placeholder:text-gray-500 focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all"
                  />
                </div>
                <button className="relative w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 hover:text-brand-primary transition-all">
                  <Bell size={20} />
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-brand-primary rounded-full border-4 border-white" />
                </button>
                <button
                  type="button"
                  title="Log out"
                  onClick={() => logout.mutate()}
                  disabled={logout.isPending}
                  className="hidden sm:flex w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm items-center justify-center text-gray-400 hover:text-red-600 transition-all disabled:opacity-60"
                >
                  <LogOut size={20} />
                </button>
                <Link
                  href={ROUTES.dashboard.settings}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-subtle to-white border border-brand-primary/10 flex items-center justify-center text-brand-primary overflow-hidden cursor-pointer hover:shadow-lg transition-all active:scale-95"
                >
                  {avatarUrl ? (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url("${avatarUrl}")` }}
                      aria-label="Profile avatar"
                      role="img"
                    />
                  ) : (
                    <User size={24} />
                  )}
                </Link>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 lg:px-12 pb-12 scrollbar-hide">
              <div className="max-w-6xl mx-auto py-6">{children}</div>
            </div>
          </main>

          <nav className="lg:hidden fixed bottom-4 left-6 right-6 h-18 bg-white/80 backdrop-blur-2xl border border-white/20 rounded-[1.5rem] shadow-2xl z-[100] px-8 flex items-center justify-between">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex flex-col items-center gap-1 ${isActive ? "text-brand-primary" : "text-gray-400"}`}
                >
                  <Icon size={24} />
                  {isActive && (
                    <motion.div
                      layoutId="mobileActive"
                      className="w-1 h-1 bg-brand-primary rounded-full mt-1"
                    />
                  )}
                </Link>
              );
            })}
            <Link
              href={ROUTES.dashboard.settings}
              className={`relative flex flex-col items-center gap-1 ${pathname === ROUTES.dashboard.settings ? "text-brand-primary" : "text-gray-400"}`}
            >
              {avatarUrl ? (
                <div
                  className="w-6 h-6 rounded-full bg-cover bg-center border border-gray-200"
                  style={{ backgroundImage: `url("${avatarUrl}")` }}
                  aria-label="Profile avatar"
                  role="img"
                />
              ) : (
                <User size={24} />
              )}
              {pathname === ROUTES.dashboard.settings && (
                <motion.div
                  layoutId="mobileActive"
                  className="w-1 h-1 bg-brand-primary rounded-full mt-1"
                />
              )}
            </Link>
          </nav>
        </div>
      </PanelPrescreenGate>
    </DashboardRoleGate>
  );
}
