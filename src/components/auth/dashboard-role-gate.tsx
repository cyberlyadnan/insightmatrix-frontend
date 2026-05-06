"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ROUTES } from "@/constants/routes";
import { fetchProfileOptional } from "@/services/auth";
import { queryKeys } from "@/services/queries";

/** Blocks `admin` from the member dashboard; sends them to `/admin` only */
export function DashboardRoleGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isFetched } = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: fetchProfileOptional,
    staleTime: 60_000,
    retry: false,
  });

  useEffect(() => {
    if (!isFetched) return;
    if (!user) {
      router.replace(`${ROUTES.login}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user.role === "admin") {
      router.replace(ROUTES.admin.root);
    }
  }, [isFetched, user, router, pathname]);

  if (!isFetched || !user || user.role === "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
        <div
          className="h-10 w-10 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"
          aria-hidden
        />
        <p className="text-sm font-medium text-gray-500">Loading your workspace…</p>
      </div>
    );
  }

  return <>{children}</>;
}
