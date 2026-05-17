"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, User, Store } from "lucide-react";

import { VendorRoleGate } from "@/components/auth/vendor-role-gate";
import { ImxLogo } from "@/components/brand";
import { ROUTES } from "@/constants/routes";
import { vendorLogoutRequest } from "@/services/vendor-auth";
import { useVendorAuthStore } from "@/store/vendorAuthStore";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: ROUTES.vendor.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.vendor.profile, label: "Profile", icon: User },
] as const;

export default function VendorPanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const vendor = useVendorAuthStore((s) => s.vendor);
  const clearVendor = useVendorAuthStore((s) => s.clearVendor);

  const logout = async () => {
    try {
      await vendorLogoutRequest();
    } catch {
      /* ignore */
    }
    clearVendor();
    window.location.href = ROUTES.vendor.login;
  };

  return (
    <VendorRoleGate>
      <div className="min-h-screen bg-slate-50 flex flex-col text-gray-900 [color-scheme:light]">
        <header className="border-b border-border bg-white">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-6 min-w-0">
              <ImxLogo href={ROUTES.vendor.dashboard} size="sm" surface="light" />
              <nav className="hidden sm:flex items-center gap-1">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
                        active
                          ? "bg-brand-subtle text-brand-primary"
                          : "text-muted-foreground hover:bg-slate-100 hover:text-brand-accent1"
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-brand-subtle px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                <Store className="h-3 w-3" />
                {vendor?.vendorCode}
              </span>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
      </div>
    </VendorRoleGate>
  );
}
