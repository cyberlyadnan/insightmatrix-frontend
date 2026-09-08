"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import {
  listAdminServices,
  toggleServiceStatus,
  deleteService,
} from "@/services/services-cms/services-cms-api";
import { queryKeys } from "@/services/queries/queryKeys";

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "core", label: "Core Services" },
  { value: "industries", label: "Industries" },
  { value: "b2b-b2c", label: "B2B & B2C" },
  { value: "healthcare", label: "Healthcare" },
  { value: "methodologies", label: "Methodologies" },
  { value: "operations", label: "Operations" },
];

export default function AdminServicesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<"published" | "draft" | "all">("all");
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const filters = { search, category, status, page, pageSize };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: queryKeys.servicesCms.adminList(filters),
    queryFn: () => listAdminServices(filters),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: "published" | "draft" }) =>
      toggleServiceStatus(id, nextStatus),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.servicesCms.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.servicesCms.all });
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const services = data?.items ?? [];
  const meta = data?.meta ?? { page: 1, pageSize: 50, total: 0, totalPages: 1 };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Services CMS</h1>
            <span className="px-3 py-1 bg-brand-subtle text-brand-primary text-xs font-black rounded-full border border-brand-light/30">
              {meta.total} Total Services
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            Manage dynamic service catalog, SEO metadata, audience targeting, and public pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-60"
            title="Refresh list"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin text-brand-primary" : ""} />
          </button>

          <Link
            href="/admin/services/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-hover active:scale-95 transition-all"
          >
            <Plus size={16} />
            <span>Create New Service</span>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-[1.75rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search services by title, slug, or keywords..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {(["all", "published", "draft"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  status === s
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-[1.75rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#091428] text-white uppercase text-[10px] tracking-wider font-extrabold select-none">
                <th className="py-2.5 px-3">Order</th>
                <th className="py-2.5 px-3">Service Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Slug / Route</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Featured</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand-primary mb-2" />
                    <p className="font-bold text-xs">Loading services...</p>
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <p className="font-bold text-sm text-gray-800">No services found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try adjusting your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                services.map((item) => {
                  const isPublished = item.status === "published";
                  const entityId = item._id || item.slug;

                  return (
                    <tr key={item.slug} className="hover:bg-blue-50/40 transition-colors h-11">
                      <td className="py-1.5 px-3 font-mono font-bold text-gray-400">
                        #{item.order ?? 0}
                      </td>

                      <td className="py-1.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-brand-subtle text-brand-primary flex items-center justify-center font-bold shrink-0">
                            <Layers size={14} />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">
                              {item.service_name}
                            </span>
                            <span className="text-[10px] text-gray-400 truncate max-w-xs block">
                              {item.seo?.meta_description ||
                                item.hero?.subtitle ||
                                "No description"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-1.5 px-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-gray-100 text-gray-700">
                          {item.category || "core"}
                        </span>
                      </td>

                      <td className="py-1.5 px-3 font-mono text-[11px] text-gray-600">
                        /services/{item.slug}
                      </td>

                      <td className="py-1.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isPublished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPublished ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {item.status}
                        </span>
                      </td>

                      <td className="py-1.5 px-3">
                        {item.featured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-extrabold">
                            <Sparkles size={10} /> Featured
                          </span>
                        ) : (
                          <span className="text-gray-300 font-mono">-</span>
                        )}
                      </td>

                      <td className="py-1.5 px-3 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5 whitespace-nowrap">
                          {/* Live preview */}
                          <Link
                            href={`/services/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            title="Open live public service page"
                          >
                            <ExternalLink size={13} />
                          </Link>

                          {/* Edit */}
                          <Link
                            href={`/admin/services/${entityId}/edit`}
                            className="p-1.5 rounded-lg border border-brand-primary/30 text-brand-primary bg-brand-subtle hover:bg-brand-primary hover:text-white transition-all font-bold"
                            title="Edit service details"
                          >
                            <Edit2 size={13} />
                          </Link>

                          {/* Status toggle */}
                          <button
                            type="button"
                            onClick={() =>
                              toggleStatusMutation.mutate({
                                id: entityId,
                                nextStatus: isPublished ? "draft" : "published",
                              })
                            }
                            disabled={toggleStatusMutation.isPending}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isPublished
                                ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title={isPublished ? "Set to Draft" : "Publish Service"}
                          >
                            {isPublished ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(entityId, item.service_name)}
                            disabled={deleteMutation.isPending}
                            className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete service"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
