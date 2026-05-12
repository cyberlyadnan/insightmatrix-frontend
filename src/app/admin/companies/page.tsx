"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Building2,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Power,
  Search,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Modal } from "@/components/shared/Modal";
import { EmptyState } from "@/components/shared/EmptyState";
import { ROUTES } from "@/constants/routes";
import { SURVEY_PROVIDER_LABELS } from "@/constants/survey-company";
import { parseApiError } from "@/services/api/errors";
import {
  deleteSurveyCompany,
  listSurveyCompanies,
  patchSurveyCompanyStatus,
  type SurveyCompany,
  type SurveyCompanyStatus,
} from "@/services/survey-company";
import { queryKeys } from "@/services/queries";

type SortField =
  | "companyName"
  | "companyCode"
  | "createdAt"
  | "providerType"
  | "status"
  | "contactPersonName";

function SortButton({
  label,
  field,
  sortBy,
  sortOrder,
  onSort,
}: {
  label: string;
  field: SortField;
  sortBy: SortField;
  sortOrder: "asc" | "desc";
  onSort: (field: SortField) => void;
}) {
  const active = sortBy === field;
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-1 font-black uppercase tracking-wider text-[10px] text-gray-500 hover:text-gray-900"
    >
      {label}
      {active ? (
        sortOrder === "asc" ? (
          <ArrowUp className="w-3 h-3 text-brand-primary" />
        ) : (
          <ArrowDown className="w-3 h-3 text-brand-primary" />
        )
      ) : (
        <MoreHorizontal className="w-3 h-3 opacity-40" />
      )}
    </button>
  );
}

function StatusBadge({ status }: { status: SurveyCompanyStatus }) {
  const active = status === "active";
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function AdminSurveyCompaniesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [statusFilter, setStatusFilter] = useState<"" | SurveyCompanyStatus>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteTarget, setDeleteTarget] = useState<SurveyCompany | null>(null);

  const filters = useMemo(
    () => ({
      search: deferredSearch.trim() || undefined,
      status: statusFilter || undefined,
      page,
      pageSize,
      sortBy,
      sortOrder,
    }),
    [deferredSearch, statusFilter, page, pageSize, sortBy, sortOrder]
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: queryKeys.surveyCompanies.list(filters),
    queryFn: () => listSurveyCompanies(filters),
    placeholderData: (prev) => prev,
  });

  const items = data?.items ?? [];
  const meta = data?.meta;

  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: queryKeys.surveyCompanies.all });
  };

  const toggleSort = (field: SortField) => {
    setPage(1);
    if (sortBy === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder(field === "createdAt" ? "desc" : "asc");
    }
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, next }: { id: string; next: SurveyCompanyStatus }) =>
      patchSurveyCompanyStatus(id, next),
    onSuccess: async (_, vars) => {
      toast.success(vars.next === "active" ? "Company enabled" : "Company disabled");
      await refresh();
    },
    onError: (error) => toast.error(parseApiError(error, "Could not update status")),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSurveyCompany(id),
    onSuccess: async () => {
      toast.success("Company deleted");
      setDeleteTarget(null);
      await refresh();
    },
    onError: (error) => toast.error(parseApiError(error, "Could not delete company")),
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: "" | SurveyCompanyStatus) => {
    setStatusFilter(value);
    setPage(1);
  };

  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Survey providers</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Manage external survey companies and routers that supply your panel with inventory.
          </p>
        </div>
        <Link
          href={ROUTES.admin.companiesCreate}
          className="h-11 px-5 rounded-xl bg-gray-900 text-white inline-flex items-center justify-center gap-2 font-bold hover:bg-black shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add company
        </Link>
      </div>

      <div className="rounded-[2rem] border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-3 xl:items-center mb-6">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search name, code, contact, or email…"
              className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400"
              aria-label="Search companies"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value as "" | SurveyCompanyStatus)}
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white min-w-[160px]"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900 bg-white"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No companies yet"
            description="Add survey providers such as sample exchanges or routers to organize incoming inventory."
          >
            <Link
              href={ROUTES.admin.companiesCreate}
              className="inline-flex h-11 px-5 rounded-xl bg-gray-900 text-white items-center justify-center font-bold hover:bg-black"
            >
              Add company
            </Link>
          </EmptyState>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto -mx-2">
              <table className="w-full min-w-[960px] text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] text-gray-400">
                    <th className="pb-3 pl-2 pr-4">
                      <SortButton
                        label="Company"
                        field="companyName"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="pb-3 px-4">
                      <SortButton
                        label="Code"
                        field="companyCode"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="pb-3 px-4">
                      <SortButton
                        label="Contact"
                        field="contactPersonName"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="pb-3 px-4">Email</th>
                    <th className="pb-3 px-4">
                      <SortButton
                        label="Type"
                        field="providerType"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="pb-3 px-4">
                      <SortButton
                        label="Status"
                        field="status"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="pb-3 px-4">
                      <SortButton
                        label="Created"
                        field="createdAt"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={toggleSort}
                      />
                    </th>
                    <th className="pb-3 pr-2 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 pl-2 pr-4">
                        <p className="font-bold text-gray-900">{row.companyName}</p>
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-gray-700">
                        {row.companyCode}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {row.contactPersonName || "—"}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 max-w-[200px] truncate">
                        {row.companyEmail || "—"}
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-gray-700">
                        {SURVEY_PROVIDER_LABELS[row.providerType]}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 whitespace-nowrap">
                        {row.createdAt ? format(new Date(row.createdAt), "MMM d, yyyy") : "—"}
                      </td>
                      <td className="py-4 pr-2 pl-4 text-right">
                        <div className="inline-flex flex-wrap justify-end gap-1">
                          <Link
                            href={ROUTES.admin.company(row.id)}
                            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={ROUTES.admin.companyEdit(row.id)}
                            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            title={row.status === "active" ? "Disable" : "Enable"}
                            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                            onClick={() =>
                              statusMutation.mutate({
                                id: row.id,
                                next: row.status === "active" ? "inactive" : "active",
                              })
                            }
                            disabled={statusMutation.isPending}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Delete"
                            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                            onClick={() => setDeleteTarget(row)}
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

            <div className="lg:hidden space-y-4">
              {items.map((row) => (
                <div
                  key={row.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 space-y-3"
                >
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="font-black text-gray-900">{row.companyName}</p>
                      <p className="text-xs font-mono text-gray-500">{row.companyCode}</p>
                    </div>
                    <StatusBadge status={row.status} />
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="text-gray-400 font-bold text-[10px] uppercase mr-2">
                        Contact
                      </span>
                      {row.contactPersonName || "—"}
                    </p>
                    <p className="truncate">
                      <span className="text-gray-400 font-bold text-[10px] uppercase mr-2">
                        Email
                      </span>
                      {row.companyEmail || "—"}
                    </p>
                    <p>
                      <span className="text-gray-400 font-bold text-[10px] uppercase mr-2">
                        Type
                      </span>
                      {SURVEY_PROVIDER_LABELS[row.providerType]}
                    </p>
                    <p>
                      <span className="text-gray-400 font-bold text-[10px] uppercase mr-2">
                        Created
                      </span>
                      {row.createdAt ? format(new Date(row.createdAt), "MMM d, yyyy") : "—"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link
                      href={ROUTES.admin.company(row.id)}
                      className="flex-1 min-w-[100px] h-10 rounded-xl border border-gray-200 bg-white text-center text-xs font-black uppercase tracking-widest leading-10"
                    >
                      View
                    </Link>
                    <Link
                      href={ROUTES.admin.companyEdit(row.id)}
                      className="flex-1 min-w-[100px] h-10 rounded-xl border border-gray-200 bg-white text-center text-xs font-black uppercase tracking-widest leading-10"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="flex-1 min-w-[100px] h-10 rounded-xl border border-gray-200 bg-white text-xs font-black uppercase tracking-widest"
                      onClick={() =>
                        statusMutation.mutate({
                          id: row.id,
                          next: row.status === "active" ? "inactive" : "active",
                        })
                      }
                      disabled={statusMutation.isPending}
                    >
                      {row.status === "active" ? "Disable" : "Enable"}
                    </button>
                    <button
                      type="button"
                      className="flex-1 min-w-[100px] h-10 rounded-xl border border-rose-200 text-rose-600 text-xs font-black uppercase tracking-widest"
                      onClick={() => setDeleteTarget(row)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {meta && totalPages > 1 ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Page {meta.page} of {totalPages}
                  <span className="text-gray-400">
                    {" "}
                    ({meta.total} {meta.total === 1 ? "company" : "companies"})
                  </span>
                  {isFetching ? (
                    <span className="ml-2 text-xs font-bold text-brand-primary">Updating…</span>
                  ) : null}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-10 px-4 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 hover:bg-gray-50 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="h-10 px-4 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 hover:bg-gray-50 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>

      <Modal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete company?"
        description={
          deleteTarget
            ? `Remove "${deleteTarget.companyName}" (${deleteTarget.companyCode}) from the directory.`
            : undefined
        }
        footer={
          <div className="flex gap-2 justify-end w-full">
            <button
              type="button"
              className="h-10 px-4 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleteMutation.isPending || !deleteTarget}
              className="h-10 px-4 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 disabled:opacity-60"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </button>
          </div>
        }
      >
        <p className="text-sm text-gray-600">
          Future survey flows may reference providers by ID. Only delete if you are sure this
          provider is obsolete.
        </p>
      </Modal>
    </div>
  );
}
