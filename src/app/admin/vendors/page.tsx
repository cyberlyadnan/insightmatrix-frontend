"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye, Pencil, Plus, Store, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/crm/confirm-dialog";
import {
  AdminPagination,
  AdminTableSkeleton,
  AdminTableToolbar,
  adminFilterSelectClass,
} from "@/components/crm/admin-table";
import { PageHeader } from "@/components/crm/page-help";
import { ADMIN_PAGE_HELP } from "@/constants/admin-page-help";
import { ROUTES } from "@/constants/routes";
import { crmToast } from "@/lib/crm-toast";
import { parseApiError } from "@/services/api/errors";
import { deleteVendor, listVendors, patchVendorStatus, type VendorStatus } from "@/services/vendor";
import { queryKeys } from "@/services/queries";
import type { Vendor } from "@/types/vendor";
import { downloadCsv } from "@/utils/download-csv";
import { formatNumber } from "@/utils/format";

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
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    paused: "bg-amber-50 text-amber-700 border-amber-200",
    suspended: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border leading-none ${styles[status]}`}
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const filters = useMemo(
    () => ({ search: deferredSearch, status, page, pageSize }),
    [deferredSearch, status, page, pageSize]
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
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleExport = () => {
    downloadCsv(
      `vendors-${Date.now()}.csv`,
      ["Code", "Company", "Email", "Status", "Completes", "Created"],
      items.map((v) => [
        v.vendorCode,
        v.companyName,
        v.email,
        v.status,
        v.totalCompletes,
        v.createdAt ? format(new Date(v.createdAt), "yyyy-MM-dd") : "",
      ])
    );
  };

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
        <AdminTableToolbar
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Search company, code, email…"
          onExport={handleExport}
          exportDisabled={items.length === 0}
          filters={
            <select
              className={adminFilterSelectClass}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as VendorStatus | "");
                setPage(1);
              }}
              aria-label="Filter by status"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value || "all"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          }
        />

        {isLoading ? (
          <AdminTableSkeleton rows={6} />
        ) : items.length === 0 ? (
          <EmptyState icon={Store}>
            <Link href={ROUTES.admin.vendorsCreate} className={primaryActionClass}>
              <Plus className="w-4 h-4 shrink-0" />
              Create New
            </Link>
          </EmptyState>
        ) : (
          <>
            <div className="overflow-x-auto custom-scrollbar rounded-xl border border-slate-200/90 bg-white shadow-sm">
              <table className="w-full min-w-[720px] text-xs text-left text-slate-800">
                <thead className="bg-[#091428] text-white">
                  <tr className="text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-100">
                    <th className="px-3 py-2 whitespace-nowrap">Code</th>
                    <th className="px-3 py-2 whitespace-nowrap">Company</th>
                    <th className="px-3 py-2 whitespace-nowrap">Email</th>
                    <th className="px-3 py-2 whitespace-nowrap">Status</th>
                    <th className="px-3 py-2 whitespace-nowrap">Completes</th>
                    <th className="px-3 py-2 whitespace-nowrap">Created</th>
                    <th className="px-3 py-2 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((v) => (
                    <tr key={v.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-3 py-1.5 whitespace-nowrap align-middle">
                        <Link
                          href={ROUTES.admin.vendor(v.id)}
                          className="font-mono text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          {v.vendorCode}
                        </Link>
                      </td>
                      <td
                        className="px-3 py-1.5 font-bold text-slate-900 whitespace-nowrap align-middle max-w-[200px] truncate"
                        title={v.companyName}
                      >
                        {v.companyName}
                      </td>
                      <td className="px-3 py-1.5 text-slate-600 text-xs whitespace-nowrap align-middle">
                        {v.email}
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap align-middle">
                        <StatusBadge status={v.status} />
                      </td>
                      <td className="px-3 py-1.5 font-mono text-xs tabular-nums font-semibold text-slate-900 whitespace-nowrap align-middle">
                        {formatNumber(v.totalCompletes)}
                      </td>
                      <td className="px-3 py-1.5 text-xs text-slate-500 whitespace-nowrap align-middle">
                        {v.createdAt ? format(new Date(v.createdAt), "MMM d, yyyy") : "—"}
                      </td>
                      <td className="px-3 py-1.5 text-right align-middle whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1 flex-nowrap whitespace-nowrap shrink-0">
                          <Link
                            href={ROUTES.admin.vendor(v.id)}
                            className="h-7 px-2 inline-flex items-center gap-1 rounded-md bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 shadow-sm shrink-0 transition-colors"
                            title="Open Vendor"
                          >
                            <span>Open</span>
                            <Eye className="w-3 h-3" />
                          </Link>
                          <Link
                            href={ROUTES.admin.vendorEdit(v.id)}
                            className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shrink-0 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          {v.status !== "active" ? (
                            <button
                              type="button"
                              className="h-7 px-2 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 shrink-0 transition-colors"
                              onClick={() => statusMutation.mutate({ id: v.id, status: "active" })}
                            >
                              Activate
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="h-7 px-2 rounded-md border border-amber-200 bg-amber-50 text-amber-700 text-[11px] font-bold hover:bg-amber-100 shrink-0 transition-colors"
                              onClick={() => statusMutation.mutate({ id: v.id, status: "paused" })}
                            >
                              Pause
                            </button>
                          )}
                          <button
                            type="button"
                            className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50 shrink-0 transition-colors"
                            onClick={() => setDeleteTarget(v)}
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AdminPagination
              page={page}
              totalPages={totalPages}
              total={meta?.total}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(n) => {
                setPageSize(n);
                setPage(1);
              }}
            />
          </>
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
