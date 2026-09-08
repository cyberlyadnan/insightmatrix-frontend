"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ROUTES } from "@/constants/routes";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthProfileQuery } from "@/hooks/use-auth-profile-query";
import { useAuthStore } from "@/store/authStore";

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
  const storeUser = useAuthStore((s) => s.user);
  const {
    data: profileUser,
    isFetched,
    isPending,
    isFetching,
  } = useAuthProfileQuery({
    enabled: hydrated,
  });

  // Prefer live profile, fall back to hydrated store so a transient diagnostic
  // 401 (e.g. email SMTP check) cannot empty the gate and bounce to /login.
  const user = profileUser ?? storeUser;

  useEffect(() => {
    if (!hydrated || isFetching || (!isFetched && isPending)) return;
    if (!user) {
      router.replace(`${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.admin.root)}`);
      return;
    }
    if (user.role !== "admin") {
      router.replace(ROUTES.dashboard.root);
    }
  }, [hydrated, isFetched, isPending, isFetching, user, router]);

  if (!hydrated || (!isFetched && isPending && !user)) {
    return <GateSpinner message="Checking admin access…" />;
  }

  if (!user || user.role !== "admin") {
    return <GateSpinner message="Redirecting…" />;
  }

  return <>{children}</>;
}
