"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Eye, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes";
import { parseApiError } from "@/services/api/errors";
import {
  deletePrescreen,
  duplicatePrescreen,
  listPrescreens,
  publishPrescreen,
  unpublishPrescreen,
} from "@/services/prescreen";
import { queryKeys } from "@/services/queries";

export default function AdminPrescreenListPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

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
      toast.success("Prescreen deleted");
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

  const unpublishMutation = useMutation({
    mutationFn: unpublishPrescreen,
    onSuccess: async () => {
      toast.success("Moved to draft");
      await refresh();
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Prescreening</h1>
          <p className="text-sm text-gray-500 font-medium">
            Create and manage dynamic prescreen questionnaires.
          </p>
        </div>
        <Link
          href={ROUTES.admin.prescreenCreate}
          className="h-11 px-5 rounded-xl bg-gray-900 text-white inline-flex items-center gap-2 font-bold"
        >
          <Plus className="w-4 h-4" />
          Create Prescreen
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-5">
        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prescreens..."
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 text-sm"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-xl border border-gray-200 px-3 text-sm"
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
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4">
                      <p className="font-bold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.slug}</p>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 text-[10px] rounded-full bg-gray-100 font-black uppercase text-gray-600">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{item.questions.length}</td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/prescreen/edit/${item.id}`}
                          className="h-9 px-3 border border-gray-200 rounded-lg text-xs font-bold inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Edit
                        </Link>
                        <button
                          className="h-9 px-3 border border-gray-200 rounded-lg text-xs font-bold inline-flex items-center gap-1"
                          onClick={() => duplicateMutation.mutate(item.id)}
                        >
                          <Copy className="w-3 h-3" />
                          Duplicate
                        </button>
                        {item.status === "published" ? (
                          <button
                            className="h-9 px-3 border border-gray-200 rounded-lg text-xs font-bold"
                            onClick={() => unpublishMutation.mutate(item.id)}
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            className="h-9 px-3 border border-gray-200 rounded-lg text-xs font-bold"
                            onClick={() => publishMutation.mutate(item.id)}
                          >
                            Publish
                          </button>
                        )}
                        <button
                          className="h-9 w-9 border border-rose-200 text-rose-600 rounded-lg inline-flex items-center justify-center"
                          onClick={() => deleteMutation.mutate(item.id)}
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
    </div>
  );
}
