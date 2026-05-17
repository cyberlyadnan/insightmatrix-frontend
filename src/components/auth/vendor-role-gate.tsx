"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { vendorMeRequest } from "@/services/vendor-auth";
import { queryKeys } from "@/services/queries";
import { useVendorAuthStore } from "@/store/vendorAuthStore";

export function VendorRoleGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const setVendor = useVendorAuthStore((s) => s.setVendor);
  const vendor = useVendorAuthStore((s) => s.vendor);

  const { data, isLoading, isError, isFetched } = useQuery({
    queryKey: queryKeys.vendorAuth.profile,
    queryFn: vendorMeRequest,
    retry: false,
  });

  useEffect(() => {
    if (data) setVendor(data);
  }, [data, setVendor]);

  useEffect(() => {
    if (!isFetched) return;
    if (isError || !data) {
      router.replace(`${ROUTES.vendor.login}?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isFetched, isError, data, router, pathname]);

  if (isLoading || !vendor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
        <Loader2 className="h-9 w-9 animate-spin text-brand-primary" />
        <p className="text-sm font-medium text-muted-foreground">Loading vendor portal…</p>
      </div>
    );
  }

  if (vendor.status === "suspended") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-bold text-rose-700">Account suspended</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Contact InsightMatrix support to restore access.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
