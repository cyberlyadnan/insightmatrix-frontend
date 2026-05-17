"use client";

import { use } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Store } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  VENDOR_CALLBACK_OUTCOMES,
  VENDOR_CALLBACK_OUTCOME_CONFIG,
  VENDOR_CALLBACK_OUTCOME_LABELS,
  VENDOR_CALLBACK_RELAY_EXPLANATION,
} from "@/constants/vendor-callback";
import { ROUTES } from "@/constants/routes";
import { parseApiError } from "@/services/api/errors";
import {
  getVendor,
  getVendorAnalytics,
  patchVendorStatus,
  type VendorStatus,
} from "@/services/vendor";
import { queryKeys } from "@/services/queries";

export default function AdminVendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const qc = useQueryClient();

  const { data: vendor, isLoading } = useQuery({
    queryKey: queryKeys.vendors.detail(id),
    queryFn: () => getVendor(id),
  });

  const { data: analytics } = useQuery({
    queryKey: queryKeys.vendors.analytics(id),
    queryFn: () => getVendorAnalytics(id),
    enabled: Boolean(id),
  });

  const statusMutation = useMutation({
    mutationFn: (status: VendorStatus) => patchVendorStatus(id, status),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.vendors.detail(id) });
      await qc.invalidateQueries({ queryKey: queryKeys.vendors.all });
      toast.success("Status updated");
    },
    onError: (e) => toast.error(parseApiError(e, "Could not update status")),
  });

  if (isLoading || !vendor) {
    return <p className="text-sm text-gray-500">Loading vendor…</p>;
  }

  return (
    <div className="w-full space-y-6">
      <Link
        href={ROUTES.admin.vendors}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        All vendors
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-2">
            <Store className="w-3.5 h-3.5" />
            {vendor.vendorCode}
          </p>
          <h1 className="text-3xl font-black text-gray-900 mt-1">{vendor.companyName}</h1>
          <p className="text-sm text-gray-500 mt-1">{vendor.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={ROUTES.admin.vendorEdit(id)}
            className="inline-flex h-8 items-center justify-center rounded-md border border-gray-200 bg-white px-3 text-xs font-bold text-gray-900 hover:bg-gray-50"
          >
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Link>
          {vendor.status !== "active" && (
            <Button size="sm" onClick={() => statusMutation.mutate("active")}>
              Activate
            </Button>
          )}
          {vendor.status !== "paused" && (
            <Button size="sm" variant="outline" onClick={() => statusMutation.mutate("paused")}>
              Pause
            </Button>
          )}
          {vendor.status !== "suspended" && (
            <Button
              size="sm"
              variant="outline"
              className="text-rose-600 border-rose-200"
              onClick={() => statusMutation.mutate("suspended")}
            >
              Suspend
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</p>
          <p className="mt-2 text-lg font-bold capitalize">{vendor.status}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Conversion rate
          </p>
          <p className="mt-2 text-lg font-bold">{analytics?.conversionRate ?? 0}%</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Completes
          </p>
          <p className="mt-2 text-lg font-bold">{vendor.totalCompletes}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Revenue / payout
          </p>
          <p className="mt-2 text-lg font-bold">
            ${vendor.totalRevenueGenerated} / ${vendor.totalPayoutDue}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-3 text-sm">
        <h2 className="font-black uppercase tracking-widest text-[10px] text-gray-400">Details</h2>
        <p>
          <span className="text-gray-500">Contact:</span> {vendor.contactPerson || "—"}
        </p>
        <p>
          <span className="text-gray-500">Phone:</span> {vendor.phone || "—"}
        </p>
        <p>
          <span className="text-gray-500">Website:</span> {vendor.website || "—"}
        </p>
        <p>
          <span className="text-gray-500">Allowed IPs (future):</span>{" "}
          {vendor.allowedIps.length ? vendor.allowedIps.join(", ") : "—"}
        </p>
        <p>
          <span className="text-gray-500">Allowed countries (future):</span>{" "}
          {vendor.allowedCountries.length ? vendor.allowedCountries.join(", ") : "—"}
        </p>
        {vendor.notes ? (
          <p className="text-gray-600 whitespace-pre-wrap border-t border-gray-100 pt-3">
            {vendor.notes}
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
        <div>
          <h2 className="font-black uppercase tracking-widest text-[10px] text-gray-400">
            Callback configuration
          </h2>
          <p className="text-sm text-gray-600 mt-2">{VENDOR_CALLBACK_RELAY_EXPLANATION}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {VENDOR_CALLBACK_OUTCOMES.map((outcome) => {
            const url = vendor.callbackUrls[outcome];
            const status = vendor.callbackConfigurationStatus[outcome];
            return (
              <div key={outcome} className="rounded-xl border border-gray-100 p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                    {VENDOR_CALLBACK_OUTCOME_LABELS[outcome]}
                  </p>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      status === "configured"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {status === "configured" ? "Configured" : "Not set"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {VENDOR_CALLBACK_OUTCOME_CONFIG[outcome].description}
                </p>
                <p className="text-sm font-mono break-all text-gray-900">{url || "—"}</p>
                <p className="text-[10px] text-gray-400">Delivery testing: coming soon</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-6 shadow-sm">
        <h2 className="font-black uppercase tracking-widest text-[10px] text-gray-400">
          Webhook history (future)
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Outbound callback attempts, HTTP status, and retries will appear here once relay and
          logging are enabled.
        </p>
      </div>
    </div>
  );
}
