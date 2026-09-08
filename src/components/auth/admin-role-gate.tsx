"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ROUTES } from "@/constants/routes";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthProfileQuery } from "@/hooks/use-auth-profile-query";
import { useAuthStore } from "@/store/authStore";
import { clearAuthCookies } from "@/utils/cookies";

function GateSpinner({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50">
      <div
        className="h-10 w-10 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"
        aria-hidden
      />
      <p className="text-sm font-medium text-gray-500">{message}</p>
    </div>
  );
}

/** Client gate for `/admin` — ensures user has verified active admin session */
export function AdminRoleGate({ children }: { children: ReactNode }) {
  const router = useRouter();
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
      useAuthStore.getState().clearSession();
      clearAuthCookies();
      router.replace(`${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.admin.root)}`);
      return;
    }
    if (profileUser.role !== "admin") {
      router.replace(ROUTES.dashboard.root);
    }
  }, [hydrated, isFetched, profileUser, router]);

  if (!hydrated || (!isFetched && isPending)) {
    return <GateSpinner message="Checking admin access…" />;
  }

  if (!profileUser || profileUser.role !== "admin") {
    return <GateSpinner message="Redirecting…" />;
  }

  return <>{children}</>;
}
