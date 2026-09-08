"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Eye, Plus, ListChecks, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/crm/confirm-dialog";
import {
  AdminTableSkeleton,
  AdminTableToolbar,
  adminFilterSelectClass,
} from "@/components/crm/admin-table";
import { PageHeader } from "@/components/crm/page-help";
import { EmptyState } from "@/components/shared/EmptyState";
import { ADMIN_PAGE_HELP } from "@/constants/admin-page-help";
import { ROUTES } from "@/constants/routes";
import { crmToast } from "@/lib/crm-toast";
import { parseApiError } from "@/services/api/errors";
import {
  deletePrescreen,
  duplicatePrescreen,
  listPrescreens,
  publishPrescreen,
  setPrescreenRequiredForPanel,
  unpublishPrescreen,
} from "@/services/prescreen";
import { queryKeys } from "@/services/queries";
import type { PrescreenForm } from "@/types/prescreen";
import { downloadCsv } from "@/utils/download-csv";
import { formatNumber } from "@/utils/format";

export default function AdminPrescreenListPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<PrescreenForm | null>(null);

  const filters = useMemo(
    () => ({ search, status: status || undefined, page: 1, pageSize: 20 }),
    [search, status]
  );

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.prescreens.list(filters),
    queryFn: () => listPrescreens(filters),
  });

  const items = data?.items ?? [];

  const handleExport = () => {
    downloadCsv(
      `prescreens-${Date.now()}.csv`,
      ["Title", "Slug", "Status", "Questions", "Submissions"],
      items.map((item) => [
        item.title,
        item.slug,
        item.status,
        item.questions?.length ?? 0,
        item.submissionCount ?? 0,
      ])
    );
  };

  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: queryKeys.prescreens.all });
  };

  const deleteMutation = useMutation({
    mutationFn: deletePrescreen,
    onSuccess: async () => {
      crmToast.deleted();
      setDeleteTarget(null);
      await refresh();
    },
    onError: (error) => toast.error(parseApiError(error, "Could not delete prescreen")),
  });

  const duplicateMutation = useMutation({
    mutationFn: duplicatePrescreen,
    onSuccess: async () => {
      toast.success("Prescreen duplicated");
      await refresh();
    },
  });

  const publishMutation = useMutation({
    mutationFn: publishPrescreen,
    onSuccess: async () => {
      toast.success("Prescreen published");
      await refresh();
    },
  });

  const setRequiredMutation = useMutation({
    mutationFn: setPrescreenRequiredForPanel,
    onSuccess: async () => {
      toast.success("This prescreen is now required for panel & routing");
      await refresh();
      await qc.invalidateQueries({ queryKey: queryKeys.auth.profile });
      await qc.invalidateQueries({ queryKey: queryKeys.panelPrescreen.bundle });
    },
    onError: (error) => toast.error(parseApiError(error, "Could not set as required prescreen")),
  });

  const unpublishMutation = useMutation({
    mutationFn: unpublishPrescreen,
    onSuccess: async () => {
      toast.success("Moved to draft");
      await refresh();
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Prescreening"
        description="Create and manage dynamic prescreen questionnaires."
        help={ADMIN_PAGE_HELP.prescreen}
        actions={
          <Link
            href={ROUTES.admin.prescreenCreate}
            className="h-11 px-5 rounded-xl bg-gray-900 text-white inline-flex items-center justify-center gap-2 font-bold hover:bg-black"
          >
            <Plus className="w-4 h-4" />
            Create Prescreen
          </Link>
        }
      />

      <div className="bg-white border border-gray-100 rounded-3xl p-5">
        <AdminTableToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search prescreens…"
          onExport={handleExport}
          exportDisabled={items.length === 0}
          filters={
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={adminFilterSelectClass}
            >
              <option value="">All status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          }
        />

        {isLoading ? (
          <AdminTableSkeleton rows={6} />
        ) : !items.length ? (
          <EmptyState icon={ListChecks}>
            <Link
              href={ROUTES.admin.prescreenCreate}
              className="inline-flex h-11 px-5 rounded-xl bg-gray-900 text-white items-center justify-center font-bold hover:bg-black"
            >
              Create New
            </Link>
          </EmptyState>
        ) : (
          <div className="overflow-x-auto custom-scrollbar rounded-xl border border-slate-200/90 bg-white shadow-sm">
            <table className="w-full min-w-[750px] text-xs text-slate-800">
              <thead className="bg-[#091428] text-white">
                <tr className="text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-100">
                  <th className="px-3 py-2 whitespace-nowrap">Title</th>
                  <th className="px-3 py-2 whitespace-nowrap">Status</th>
                  <th className="px-3 py-2 whitespace-nowrap">Questions</th>
                  <th className="px-3 py-2 text-right whitespace-nowrap">Submissions</th>
                  <th className="px-3 py-2 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-3 py-1.5 max-w-[240px] align-middle">
                      <Link
                        href={`/admin/prescreen/edit/${item.id}`}
                        className="font-bold text-blue-600 hover:text-blue-700 hover:underline truncate text-xs block"
                        title={item.title}
                      >
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">{item.slug}</span>
                        {item.isRequiredForPanel && item.status === "published" ? (
                          <span className="text-[9px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 leading-none">
                            Active Required
                          </span>
                        ) : item.isRequiredForPanel ? (
                          <span className="text-[9px] font-extrabold uppercase text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200 leading-none">
                            Required (Draft)
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap align-middle">
                      <span
                        className={`inline-flex px-2 py-0.5 text-[9px] rounded-full font-extrabold uppercase tracking-wider border leading-none ${
                          item.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : item.status === "archived"
                              ? "bg-slate-100 text-slate-700 border-slate-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 font-mono text-xs font-semibold text-slate-700 whitespace-nowrap align-middle">
                      {formatNumber(item.questions.length)}
                    </td>
                    <td className="px-3 py-1.5 text-xs text-slate-900 font-bold text-right tabular-nums whitespace-nowrap align-middle">
                      {formatNumber(item.submissionCount ?? 0)}
                    </td>
                    <td className="px-3 py-1.5 text-right align-middle whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 flex-nowrap whitespace-nowrap shrink-0">
                        <Link
                          href={`/admin/prescreen/edit/${item.id}`}
                          className="h-7 px-2 inline-flex items-center gap-1 rounded-md bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 shadow-sm shrink-0 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Edit</span>
                        </Link>
                        <button
                          className="h-7 px-2 border border-slate-200 rounded-md text-[11px] font-bold text-slate-700 inline-flex items-center gap-1 bg-white hover:bg-slate-50 shrink-0 transition-colors"
                          onClick={() => duplicateMutation.mutate(item.id)}
                        >
                          <Copy className="w-3 h-3" />
                          <span>Duplicate</span>
                        </button>
                        {!(item.isRequiredForPanel && item.status === "published") ? (
                          <button
                            type="button"
                            className="h-7 px-2 border border-blue-200 rounded-md text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 shrink-0 transition-colors"
                            disabled={setRequiredMutation.isPending}
                            onClick={() => setRequiredMutation.mutate(item.id)}
                          >
                            Set Required
                          </button>
                        ) : null}
                        {item.status === "published" ? (
                          <button
                            className="h-7 px-2 border border-amber-200 rounded-md text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 shrink-0 transition-colors"
                            onClick={() => unpublishMutation.mutate(item.id)}
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            className="h-7 px-2 border border-emerald-200 rounded-md text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 shrink-0 transition-colors"
                            onClick={() => publishMutation.mutate(item.id)}
                          >
                            Publish
                          </button>
                        )}
                        <button
                          type="button"
                          title="Delete"
                          className="h-7 w-7 border border-rose-200 text-rose-600 rounded-md inline-flex items-center justify-center hover:bg-rose-50 shrink-0 transition-colors"
                          onClick={() => setDeleteTarget(item)}
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
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        description={
          deleteTarget
            ? `Remove “${deleteTarget.title}” (${deleteTarget.slug}). Submissions may remain in the database for auditing.`
            : "This action cannot be undone."
        }
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      >
        <p className="text-sm text-gray-600">
          Members may be blocked from surveys if this was the active required panel prescreen.
          Publish another required prescreen afterward if needed.
        </p>
      </ConfirmDialog>
    </div>
  );
}
