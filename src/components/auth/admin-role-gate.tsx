"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ROUTES } from "@/constants/routes";
import { fetchProfileOptional } from "@/services/auth";
import { queryKeys } from "@/services/queries";

/** Client gate for `/admin` — middleware only checks for an access cookie */
export function AdminRoleGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user, isFetched } = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: fetchProfileOptional,
    staleTime: 60_000,
    retry: false,
  });

  useEffect(() => {
    if (!isFetched) return;
    if (!user) {
      router.replace(`${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.admin.root)}`);
      return;
    }
    if (user.role !== "admin") {
      router.replace(ROUTES.dashboard.root);
    }
  }, [isFetched, user, router]);

  if (!isFetched || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50">
        <div
          className="h-10 w-10 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"
          aria-hidden
        />
        <p className="text-sm font-medium text-gray-500">Checking admin access…</p>
      </div>
    );
  }

  return <>{children}</>;
}
