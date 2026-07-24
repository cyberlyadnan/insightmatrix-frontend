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
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/crm/confirm-dialog";
import {
  AdminPagination,
  AdminTableSkeleton,
  AdminTableToolbar,
  adminFilterSelectClass,
} from "@/components/crm/admin-table";
import { PageHeader } from "@/components/crm/page-help";
import { EmptyState } from "@/components/shared/EmptyState";
import { ADMIN_PAGE_HELP } from "@/constants/admin-page-help";
import { ROUTES } from "@/constants/routes";
import { SURVEY_PROVIDER_LABELS } from "@/constants/survey-company";
import { crmToast } from "@/lib/crm-toast";
import { parseApiError } from "@/services/api/errors";
import {
  deleteSurveyCompany,
  listSurveyCompanies,
  patchSurveyCompanyStatus,
  type SurveyCompany,
  type SurveyCompanyStatus,
} from "@/services/survey-company";
import { queryKeys } from "@/services/queries";
import { downloadCsv } from "@/utils/download-csv";

type SortField = "companyName" | "companyCode" | "createdAt" | "providerType" | "status";

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
      crmToast.deleted();
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

  const handleExport = () => {
    downloadCsv(
      `survey-providers-${Date.now()}.csv`,
      ["Company", "Code", "Type", "Status", "Created"],
      items.map((row) => [
        row.companyName,
        row.companyCode,
        SURVEY_PROVIDER_LABELS[row.providerType] ?? row.providerType,
        row.status,
        row.createdAt ? format(new Date(row.createdAt), "yyyy-MM-dd") : "",
      ])
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Survey Providers"
        description="Manage external survey companies and routers that supply your panel with inventory."
        help={ADMIN_PAGE_HELP.companies}
        actions={
          <Link
            href={ROUTES.admin.companiesCreate}
            className="h-11 px-5 rounded-xl bg-gray-900 text-white inline-flex items-center justify-center gap-2 font-bold hover:bg-black shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add company
          </Link>
        }
      />

      <div className="rounded-[2rem] border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
        <AdminTableToolbar
          search={search}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search name or code…"
          onExport={handleExport}
          exportDisabled={items.length === 0}
          filters={
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value as "" | SurveyCompanyStatus)}
              className={adminFilterSelectClass}
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          }
        />

        {isLoading ? (
          <AdminTableSkeleton rows={8} />
        ) : items.length === 0 ? (
          <EmptyState icon={Building2}>
            <Link
              href={ROUTES.admin.companiesCreate}
              className="inline-flex h-11 px-5 rounded-xl bg-gray-900 text-white items-center justify-center font-bold hover:bg-black"
            >
              Create New
            </Link>
          </EmptyState>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto -mx-2">
              <table className="w-full min-w-[720px] text-left">
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
            {isFetching ? (
              <p className="text-xs font-bold text-brand-primary mt-2">Updating…</p>
            ) : null}
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        description={
          deleteTarget
            ? `Remove "${deleteTarget.companyName}" (${deleteTarget.companyCode}) from the directory. This action cannot be undone.`
            : "This action cannot be undone."
        }
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      >
        <p className="text-sm text-gray-600">
          Future survey flows may reference providers by ID. Only delete if you are sure this
          provider is obsolete.
        </p>
      </ConfirmDialog>
    </div>
  );
}
