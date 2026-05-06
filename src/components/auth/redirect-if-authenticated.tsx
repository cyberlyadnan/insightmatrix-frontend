"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ROUTES } from "@/constants/routes";
import { fetchProfileOptional } from "@/services/auth";
import { queryKeys } from "@/services/queries";

/** Auth pages (login/register/…) are for guests only */
export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user, isFetched } = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: fetchProfileOptional,
    staleTime: 60_000,
    retry: false,
  });

  useEffect(() => {
    if (!isFetched || !user) return;
    router.replace(user.role === "admin" ? ROUTES.admin.root : ROUTES.dashboard.root);
  }, [isFetched, user, router]);

  if (!isFetched || user) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center">
        <div
          className="h-10 w-10 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"
          aria-hidden
        />
      </div>
    );
  }

  return <>{children}</>;
}
