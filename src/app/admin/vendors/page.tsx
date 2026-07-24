"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye, Pencil, Plus, Search, Store, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/crm/confirm-dialog";
import { PageHeader } from "@/components/crm/page-help";
import { ADMIN_PAGE_HELP } from "@/constants/admin-page-help";
import { ROUTES } from "@/constants/routes";
import { crmToast } from "@/lib/crm-toast";
import { parseApiError } from "@/services/api/errors";
import { deleteVendor, listVendors, patchVendorStatus, type VendorStatus } from "@/services/vendor";
import { queryKeys } from "@/services/queries";
import type { Vendor } from "@/types/vendor";

const primaryActionClass =
  "h-11 px-5 rounded-xl bg-gray-900 text-white inline-flex items-center justify-center gap-2 font-bold hover:bg-black shrink-0 transition-colors";

const STATUS_OPTIONS: { value: VendorStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "suspended", label: "Suspended" },
];

function StatusBadge({ status }: { status: VendorStatus }) {
  const styles: Record<VendorStatus, string> = {
    active: "bg-emerald-50 text-emerald-700",
    paused: "bg-amber-50 text-amber-800",
    suspended: "bg-rose-50 text-rose-700",
  };
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function AdminVendorsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [status, setStatus] = useState<VendorStatus | "">("");
  const [deleteTarget, setDeleteTarget] = useState<Vendor | null>(null);

  const filters = useMemo(
    () => ({ search: deferredSearch, status, page: 1, pageSize: 50 }),
    [deferredSearch, status]
  );

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.vendors.list(filters),
    queryFn: () => listVendors(filters),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status: s }: { id: string; status: VendorStatus }) =>
      patchVendorStatus(id, s),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.vendors.all });
      crmToast.updated();
    },
    onError: (e) => toast.error(parseApiError(e, "Could not update status")),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVendor,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.vendors.all });
      setDeleteTarget(null);
      crmToast.deleted();
    },
    onError: (e) => toast.error(parseApiError(e, "Could not delete vendor")),
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-8 text-gray-900">
      <PageHeader
        title="Vendors"
        description="Manage B2B subpanel partners. Internal codes (VND-*) are not supplier vid values."
        help={ADMIN_PAGE_HELP.vendors}
        actions={
          <Link href={ROUTES.admin.vendorsCreate} className={primaryActionClass}>
            <Plus className="w-4 h-4 shrink-0" />
            Add vendor
          </Link>
        }
      />

      <div className="rounded-[2rem] border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-3 xl:items-center mb-6">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company, code, email…"
              className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400"
              aria-label="Search vendors"
            />
          </div>
          <select
            className="h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white min-w-[160px] shrink-0"
            value={status}
            onChange={(e) => setStatus(e.target.value as VendorStatus | "")}
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value || "all"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Store}
            title="No vendors yet"
            description="Create a B2B vendor account for subpanel partners."
          >
            <Link href={ROUTES.admin.vendorsCreate} className={primaryActionClass}>
              <Plus className="w-4 h-4 shrink-0" />
              Add vendor
            </Link>
          </EmptyState>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full min-w-[720px] text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Completes</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((v) => (
                  <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/80">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-brand-primary">
                      {v.vendorCode}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{v.companyName}</td>
                    <td className="px-4 py-3 text-gray-600">{v.email}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-4 py-3">{v.totalCompletes}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {v.createdAt ? format(new Date(v.createdAt), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={ROUTES.admin.vendor(v.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={ROUTES.admin.vendorEdit(v.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        {v.status !== "active" ? (
                          <button
                            type="button"
                            className="h-8 px-2.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                            onClick={() => statusMutation.mutate({ id: v.id, status: "active" })}
                          >
                            Activate
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="h-8 px-2.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                            onClick={() => statusMutation.mutate({ id: v.id, status: "paused" })}
                          >
                            Pause
                          </button>
                        )}
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50"
                          onClick={() => setDeleteTarget(v)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        description={
          deleteTarget
            ? `Remove “${deleteTarget.companyName}” (${deleteTarget.vendorCode}). This action cannot be undone.`
            : "This action cannot be undone."
        }
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
