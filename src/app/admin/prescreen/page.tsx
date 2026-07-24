"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Eye, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/crm/confirm-dialog";
import { PageHeader } from "@/components/crm/page-help";
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
        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prescreens..."
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white"
          >
            <option value="">All status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !data?.items?.length ? (
          <div className="text-center py-16">
            <p className="font-black text-gray-800">No prescreens found</p>
            <p className="text-sm text-gray-500 mt-1">
              Create one to start building targeting forms.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-gray-400">
                  <th className="py-3">Title</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Questions</th>
                  <th className="py-3 text-right">Submissions</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4">
                      <p className="font-bold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.slug}
                        {item.isRequiredForPanel && item.status === "published" ? (
                          <span className="ml-2 text-[10px] font-black uppercase text-emerald-700">
                            · Active required
                          </span>
                        ) : item.isRequiredForPanel ? (
                          <span className="ml-2 text-[10px] font-black uppercase text-amber-700">
                            · Required (publish to activate)
                          </span>
                        ) : null}
                      </p>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 text-[10px] rounded-full bg-gray-100 font-black uppercase text-gray-600">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{item.questions.length}</td>
                    <td className="py-4 text-sm text-gray-900 font-bold text-right tabular-nums">
                      {item.submissionCount ?? 0}
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/prescreen/edit/${item.id}`}
                          className="h-9 px-3 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 inline-flex items-center gap-1 bg-white hover:bg-gray-50"
                        >
                          <Eye className="w-3 h-3" />
                          Edit
                        </Link>
                        <button
                          className="h-9 px-3 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 inline-flex items-center gap-1 bg-white hover:bg-gray-50"
                          onClick={() => duplicateMutation.mutate(item.id)}
                        >
                          <Copy className="w-3 h-3" />
                          Duplicate
                        </button>
                        {!(item.isRequiredForPanel && item.status === "published") ? (
                          <button
                            type="button"
                            className="h-9 px-3 border border-brand-primary/30 rounded-lg text-xs font-bold text-brand-primary bg-brand-subtle hover:bg-brand-light disabled:opacity-50"
                            disabled={setRequiredMutation.isPending}
                            onClick={() => setRequiredMutation.mutate(item.id)}
                          >
                            Set as required
                          </button>
                        ) : null}
                        {item.status === "published" ? (
                          <button
                            className="h-9 px-3 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 bg-white hover:bg-gray-50"
                            onClick={() => unpublishMutation.mutate(item.id)}
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            className="h-9 px-3 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 bg-white hover:bg-gray-50"
                            onClick={() => publishMutation.mutate(item.id)}
                          >
                            Publish
                          </button>
                        )}
                        <button
                          type="button"
                          title="Delete"
                          className="h-9 w-9 border border-rose-200 text-rose-600 rounded-lg inline-flex items-center justify-center hover:bg-rose-50"
                          onClick={() => setDeleteTarget(item)}
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
