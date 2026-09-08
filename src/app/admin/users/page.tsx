"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye, Trash2, UserRound } from "lucide-react";
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
import { deleteUser, listUsers, type AdminUserListItem } from "@/services/users";
import { queryKeys } from "@/services/queries";
import type { UserRole } from "@/types/user";
import { downloadCsv } from "@/utils/download-csv";
import { formatNumber } from "@/utils/format";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    suspended: "bg-amber-50 text-amber-700 border-amber-200",
    deactivated: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border leading-none ${
        styles[status] ?? "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
}

function PrescreenBadge({ completedAt }: { completedAt?: string | null }) {
  if (completedAt) {
    return (
      <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border leading-none bg-sky-50 text-sky-700 border-sky-200">
        Complete
      </span>
    );
  }
  return (
    <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border leading-none bg-slate-50 text-slate-500 border-slate-200">
      Incomplete
    </span>
  );
}

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [status, setStatus] = useState("");
  const [role, setRole] = useState<UserRole | "">("user");
  const [prescreen, setPrescreen] = useState<"" | "complete" | "incomplete">("");
  const [verified, setVerified] = useState<"" | "true" | "false">("");
  const [deleteTarget, setDeleteTarget] = useState<AdminUserListItem | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const filters = useMemo(
    () => ({
      search: deferredSearch,
      status,
      role,
      prescreen,
      verified,
      page,
      pageSize,
    }),
    [deferredSearch, status, role, prescreen, verified, page, pageSize]
  );

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => listUsers(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.users.all });
      setDeleteTarget(null);
      crmToast.deleted();
    },
    onError: (e) => toast.error(parseApiError(e, "Could not delete user")),
  });

  const items = data?.items ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleExport = () => {
    downloadCsv(
      `panel-users-${Date.now()}.csv`,
      ["Name", "Email", "Role", "Status", "Verified", "Prescreen", "Points", "Created"],
      items.map((u) => [
        u.fullName,
        u.email,
        u.role,
        u.status,
        u.isVerified ? "yes" : "no",
        u.panelPrescreenCompletedAt ? "complete" : "incomplete",
        u.panelPoints ?? 0,
        u.createdAt ? format(new Date(u.createdAt), "yyyy-MM-dd") : "",
      ])
    );
  };

  return (
    <div className="space-y-8 text-gray-900">
      <PageHeader
        title="Panel Users"
        description="Registered accounts with profile status and demographic prescreen progress."
        help={ADMIN_PAGE_HELP.users}
      />

      <AdminTableToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search name or email…"
        onExport={handleExport}
        filters={
          <>
            <select
              className={adminFilterSelectClass}
              value={role}
              onChange={(e) => {
                setRole(e.target.value as UserRole | "");
                setPage(1);
              }}
              aria-label="Filter by role"
            >
              <option value="">All roles</option>
              <option value="user">Panel members</option>
              <option value="admin">Admins</option>
              <option value="survey_manager">Survey managers</option>
            </select>
            <select
              className={adminFilterSelectClass}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deactivated">Deactivated</option>
            </select>
            <select
              className={adminFilterSelectClass}
              value={prescreen}
              onChange={(e) => {
                setPrescreen(e.target.value as "" | "complete" | "incomplete");
                setPage(1);
              }}
              aria-label="Filter by prescreen"
            >
              <option value="">Any prescreen</option>
              <option value="complete">Prescreen complete</option>
              <option value="incomplete">Prescreen incomplete</option>
            </select>
            <select
              className={adminFilterSelectClass}
              value={verified}
              onChange={(e) => {
                setVerified(e.target.value as "" | "true" | "false");
                setPage(1);
              }}
              aria-label="Filter by verification"
            >
              <option value="">Any verification</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </>
        }
      />

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        {isLoading ? (
          <AdminTableSkeleton rows={8} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={UserRound}
            title="No users found"
            description="Try clearing filters or adjusting your search."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Prescreen</th>
                  <th className="px-4 py-3 text-right">Points</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-brand-subtle text-brand-primary flex items-center justify-center text-xs font-black shrink-0 overflow-hidden">
                          {user.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (user.fullName?.[0] || "?").toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">{user.fullName}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-gray-700 capitalize">
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={user.status} />
                        {user.isVerified ? (
                          <span className="text-[10px] font-semibold text-emerald-600">
                            Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-amber-600">
                            Unverified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <PrescreenBadge completedAt={user.panelPrescreenCompletedAt} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-bold text-amber-600">
                      {formatNumber(user.panelPoints ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={ROUTES.admin.user(user.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          title="View profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(user)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50"
                          title="Delete user"
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

        {meta ? (
          <AdminPagination
            page={page}
            pageSize={pageSize}
            total={meta.total}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        ) : null}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete user?"
        description={
          deleteTarget
            ? `Permanently remove ${deleteTarget.fullName} (${deleteTarget.email}). This cannot be undone.`
            : "This action cannot be undone."
        }
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
