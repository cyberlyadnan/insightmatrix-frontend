"use client";

import React, { useDeferredValue, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Users,
  Plus,
  Search,
  Mail,
  Trash2,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  AlertCircle,
  UserRound,
  KeyRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { CreateUserModal } from "@/components/admin/CreateUserModal";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";
import { ConfirmDialog } from "@/components/crm/confirm-dialog";
import { crmToast } from "@/lib/crm-toast";
import { parseApiError } from "@/services/api/errors";
import { queryKeys } from "@/services/queries";
import { deleteUser, listUsers, updateUser, type AdminUserListItem } from "@/services/users";

export default function AdminTeamPage() {
  const qc = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);
  const [roleFilter, setRoleFilter] = useState<"" | "admin" | "user">("admin");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserListItem | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.users.list({
      search: deferredSearch,
      role: roleFilter,
      pageSize: 50,
    }),
    queryFn: () =>
      listUsers({
        search: deferredSearch,
        role: roleFilter,
        pageSize: 50,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.users.all });
      setDeleteTarget(null);
      crmToast.deleted();
    },
    onError: (e) => toast.error(parseApiError(e, "Could not remove team member")),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateUser(id, { status }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("Team member status updated");
    },
    onError: (e) => toast.error(parseApiError(e, "Could not update status")),
  });

  const members = data?.items ?? [];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-brand-primary" size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary/60">
              Organization
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Team &amp; Admin Management
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Manage administrator privileges, internal staff accounts, and access roles.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search team member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as "" | "admin" | "user")}
            className="px-4 py-3 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-2xl focus:outline-none focus:border-brand-primary"
          >
            <option value="admin">Administrators</option>
            <option value="user">Panel Members</option>
            <option value="">All Account Roles</option>
          </select>

          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs rounded-2xl border border-amber-200/80 transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
            title="Change Admin Password"
          >
            <KeyRound size={16} /> Change Password
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-gray-900 hover:bg-brand-primary text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-xl shadow-gray-200/50 active:scale-95"
          >
            <Plus size={18} /> Add Admin / Member
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-[2.5rem] border border-gray-100 p-12 text-center">
          <RefreshCw className="w-8 h-8 text-brand-primary animate-spin mb-3" />
          <p className="text-sm font-semibold text-gray-500">Loading team members...</p>
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-[2.5rem] border border-gray-100 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
            <UserRound size={32} />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">No team members found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              {searchQuery
                ? `No accounts matching "${searchQuery}".`
                : "Create administrator accounts to manage your survey panel."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-brand-primary transition-all"
          >
            + Create Account Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {members.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-[2.5rem] border border-gray-100 p-7 hover:shadow-2xl hover:shadow-gray-200/50 transition-all group relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Header: Avatar, Role Pill, Actions */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.fullName}
                        className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-2xs"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-brand-primary/20">
                        {member.fullName?.charAt(0) || "A"}
                      </div>
                    )}
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        <ShieldCheck size={12} />
                        {member.role}
                      </span>
                      <h3 className="text-lg font-black text-gray-900 mt-1 line-clamp-1">
                        {member.fullName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      title="Change Password"
                    >
                      <KeyRound size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(member)}
                      className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete team member"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Email & Status */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-100 text-xs text-gray-700 font-medium">
                    <Mail size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>

                  <div className="flex items-center justify-between px-1 text-xs">
                    <span className="text-gray-500 font-medium">Account Status</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateStatusMutation.mutate({
                          id: member.id,
                          status: member.status === "active" ? "suspended" : "active",
                        })
                      }
                      disabled={updateStatusMutation.isPending}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer hover:opacity-80 transition-opacity ${
                        member.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {member.status}
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <span>
                  Created{" "}
                  {member.createdAt ? format(new Date(member.createdAt), "MMM d, yyyy") : "N/A"}
                </span>
                <span className="flex items-center gap-1 font-bold text-gray-600">
                  <UserCheck size={12} className="text-emerald-500" />
                  {member.isVerified ? "Verified" : "Unverified"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Dialogs */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultRole="admin"
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete team member?"
        description={
          deleteTarget
            ? `Permanently remove ${deleteTarget.fullName} (${deleteTarget.email}). They will immediately lose admin access.`
            : "This action cannot be undone."
        }
        confirmLabel="Delete Member"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </div>
  );
}
