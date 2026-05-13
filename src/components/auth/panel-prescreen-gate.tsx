"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { ROUTES } from "@/constants/routes";
import { fetchProfileOptional } from "@/services/auth";
import { queryKeys } from "@/services/queries";

/**
 * When a required panel prescreen is configured, sends members to complete it before other dashboard areas.
 * Settings and help remain reachable so users can sign out or get support.
 */
const ALLOWED_PREFIXES = [
  ROUTES.dashboard.prescreen,
  ROUTES.dashboard.settings,
  ROUTES.dashboard.help,
] as const;

export function PanelPrescreenGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isFetched } = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: fetchProfileOptional,
    staleTime: 60_000,
    retry: false,
  });

  useEffect(() => {
    if (!isFetched || !user || !user.needsPanelPrescreen) return;
    const allowed = ALLOWED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    if (!allowed) {
      router.replace(ROUTES.dashboard.prescreen);
    }
  }, [isFetched, user, pathname, router]);

  return <>{children}</>;
}
