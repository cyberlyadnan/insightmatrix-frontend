"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ROUTES } from "@/constants/routes";
import { fetchProfileOptional } from "@/services/auth";
import { queryKeys } from "@/services/queries";
import { useAuthStore } from "@/store/authStore";

/** Auth pages (login/register/…) are for guests only */
export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const router = useRouter();
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
    if (authChecking || !user) return;
    router.replace(user.role === "admin" ? ROUTES.admin.root : ROUTES.dashboard.root);
  }, [authChecking, user, router]);

  if (authChecking || user) {
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
