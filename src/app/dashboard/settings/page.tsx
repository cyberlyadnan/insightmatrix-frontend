"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Shield, ChevronRight, Camera } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { parseApiError } from "@/services/api/errors";
import { cancelAccountDeletionRequest, requestAccountDeletion } from "@/services/auth";
import { queryKeys } from "@/services/queries";
import { useAuthStore } from "@/store/authStore";

export default function PanelSettings() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();
  const [deleteReason, setDeleteReason] = useState("");
  const accountItems = [
    {
      name: "Account Information",
      desc: "Update your name, email, and avatar",
      icon: User,
      href: ROUTES.dashboard.settingsAccount,
    },
    {
      name: "Security & Privacy",
      desc: "Update your password and start forgot-password flow",
      icon: Shield,
      href: ROUTES.dashboard.settingsSecurity,
    },
    // {
    //   name: "Notification Settings",
    //   desc: "Choose what updates you want to receive",
    //   icon: Bell,
    // },
    // {
    //   name: "Connected Devices",
    //   desc: "View and manage active sessions",
    //   icon: Smartphone,
    // },
    // { name: "Data Usage", desc: "Manage your research data preferences", icon: Lock },
  ];

  const deletionRequestMutation = useMutation({
    mutationFn: requestAccountDeletion,
    onSuccess: async (updated) => {
      setUser(updated);
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      toast.success("Account deletion request submitted.");
    },
    onError: (error) => toast.error(parseApiError(error, "Could not submit deletion request.")),
  });

  const cancelDeletionMutation = useMutation({
    mutationFn: cancelAccountDeletionRequest,
    onSuccess: async (updated) => {
      setUser(updated);
      setDeleteReason("");
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      toast.success("Account deletion request cancelled.");
    },
    onError: (error) => toast.error(parseApiError(error, "Could not cancel request.")),
  });

  const avatarUrl = user?.avatar?.trim() || "";

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Profile Settings</h1>
        <p className="text-gray-500 font-medium">
          Customize your experience and security preferences.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Profile Card */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 flex flex-col items-center text-center shadow-sm">
            <div className="relative mb-6">
              {avatarUrl ? (
                <div
                  className="w-28 h-28 md:w-32 md:h-32 rounded-[2.2rem] md:rounded-[2.5rem] bg-cover bg-center border-4 border-white shadow-xl"
                  style={{ backgroundImage: `url("${avatarUrl}")` }}
                  aria-label="User avatar"
                  role="img"
                />
              ) : (
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-[2.2rem] md:rounded-[2.5rem] bg-brand-subtle flex items-center justify-center text-brand-primary border-4 border-white shadow-xl">
                  <User size={48} className="md:w-16 md:h-16" />
                </div>
              )}
              <button className="absolute bottom-1 right-1 w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-lg border-2 border-white hover:bg-brand-primary transition-colors active:scale-95">
                <Camera size={18} />
              </button>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-gray-900">
              {user?.fullName ?? "Dashboard Member"}
            </h3>
            <p className="text-[10px] md:text-xs font-black text-brand-primary uppercase tracking-widest mt-1">
              Platinum Member
            </p>

            <div className="w-full mt-8 md:mt-10 pt-8 md:pt-10 border-t border-gray-50 space-y-4">
              <div className="flex justify-between items-center text-xs md:text-sm">
                <span className="font-bold text-gray-400">Total Missions</span>
                <span className="font-black text-gray-900">142</span>
              </div>
              <div className="flex justify-between items-center text-xs md:text-sm">
                <span className="font-bold text-gray-400">Member Since</span>
                <span className="font-black text-gray-900">Oct 2023</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {accountItems.map((item) => {
              const Row = (
                <div className="p-6 md:p-8 flex items-center justify-between group cursor-pointer hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4 md:gap-6 min-w-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all shrink-0">
                      <item.icon size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-gray-900 leading-tight mb-1 text-sm md:text-base truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] md:text-xs font-medium text-gray-500 truncate">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-gray-300 group-hover:text-brand-primary transition-all shrink-0"
                  />
                </div>
              );

              if (!item.href) return <div key={item.name}>{Row}</div>;

              return (
                <Link key={item.name} href={item.href}>
                  {Row}
                </Link>
              );
            })}
          </div>

          <div className="p-6 md:p-8 bg-rose-50 rounded-[2rem] md:rounded-[2.5rem] border border-rose-100 space-y-4">
            <div className="min-w-0">
              <h4 className="font-black text-rose-600 mb-1 text-sm md:text-base">
                Deactivate Account Request
              </h4>
              <p className="text-[11px] md:text-xs font-medium text-rose-400">
                Request deactivation. Admin must approve. Account is marked inactive, not deleted.
              </p>
            </div>
            {user?.deletionRequested ? (
              <div className="rounded-xl bg-white p-4 border border-rose-100">
                <p className="text-xs font-bold text-rose-600 mb-1">Request submitted</p>
                <p className="text-xs text-gray-500 mb-3">
                  Your request is pending admin approval.
                </p>
                <button
                  type="button"
                  onClick={() => cancelDeletionMutation.mutate()}
                  disabled={cancelDeletionMutation.isPending}
                  className="px-4 py-2 bg-white text-rose-600 font-black text-[10px] md:text-xs rounded-xl border border-rose-200 hover:bg-rose-600 hover:text-white transition-all disabled:opacity-60"
                >
                  {cancelDeletionMutation.isPending ? "Cancelling..." : "Cancel Request"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Reason for deactivation request (optional)"
                  className="w-full min-h-24 p-3 rounded-xl border border-rose-100 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-rose-100"
                />
                <button
                  type="button"
                  onClick={() =>
                    deletionRequestMutation.mutate({ reason: deleteReason.trim() || undefined })
                  }
                  disabled={deletionRequestMutation.isPending}
                  className="w-full sm:w-auto px-6 py-3 bg-white text-rose-600 font-black text-[10px] md:text-xs rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-60"
                >
                  {deletionRequestMutation.isPending ? "Submitting..." : "Request Deactivation"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
