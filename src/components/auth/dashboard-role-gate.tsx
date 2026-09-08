"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ROUTES } from "@/constants/routes";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthProfileQuery } from "@/hooks/use-auth-profile-query";

function GateSpinner({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
      <div
        className="h-10 w-10 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"
        aria-hidden
      />
      <p className="text-sm font-medium text-gray-500">{message}</p>
    </div>
  );
}

/** Blocks `admin` from the member dashboard; sends unauthenticated to `/login` */
export function DashboardRoleGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthHydrated();
  const {
    data: profileUser,
    isFetched,
    isPending,
  } = useAuthProfileQuery({
    enabled: hydrated,
  });

  useEffect(() => {
    if (!hydrated || !isFetched) return;
    if (!profileUser) {
      // Profile query already cleared the store on 401/403; just leave the area.
      router.replace(`${ROUTES.login}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (profileUser.role === "admin") {
      router.replace(ROUTES.admin.root);
    }
  }, [hydrated, isFetched, profileUser, router, pathname]);

  if (!hydrated || (!isFetched && isPending)) {
    return <GateSpinner message="Loading your workspace…" />;
  }

  if (!profileUser || profileUser.role === "admin") {
    return <GateSpinner message="Redirecting…" />;
  }

  return <>{children}</>;
}
