"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ROUTES } from "@/constants/routes";
import { fetchProfileOptional } from "@/services/auth";
import { queryKeys } from "@/services/queries";
import { useAuthStore } from "@/store/authStore";

/** Blocks `admin` from the member dashboard; sends them to `/admin` only */
export function DashboardRoleGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const storeUser = useAuthStore((s) => s.user);
  const {
    data: profileUser,
    isFetched,
    isFetching,
    isPending,
  } = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: fetchProfileOptional,
    staleTime: 60_000,
    retry: false,
  });
  const user = profileUser ?? storeUser;
  const authChecking = !isFetched || isFetching || isPending;

  useEffect(() => {
    if (authChecking) return;
    if (!user) {
      router.replace(`${ROUTES.login}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user.role === "admin") {
      router.replace(ROUTES.admin.root);
    }
  }, [authChecking, user, router, pathname]);

  if (authChecking || !user || user.role === "admin") {
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
