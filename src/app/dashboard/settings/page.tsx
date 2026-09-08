"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  User,
  Shield,
  ChevronRight,
  Camera,
  Loader2,
  ShieldCheck,
  ClipboardCheck,
  AlertTriangle,
  Mail,
  Calendar,
  CheckCircle2,
  Settings as SettingsIcon,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { optimizeAvatarImage } from "@/lib/optimize-avatar-image";
import { parseApiError } from "@/services/api/errors";
import {
  cancelAccountDeletionRequest,
  fetchProfileOptional,
  requestAccountDeletion,
  uploadAvatarRequest,
} from "@/services/auth";
import { queryKeys } from "@/services/queries";
import { useAuthStore } from "@/store/authStore";

export default function PanelSettings() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  const { data: profileUser } = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: fetchProfileOptional,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const displayUser = profileUser ?? user;
  const [deleteReason, setDeleteReason] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const accountItems = [
    {
      name: "Account Information",
      desc: "Update your full name, email address, and profile photo",
      icon: User,
      href: ROUTES.dashboard.settingsAccount,
      badge: "Profile",
    },
    {
      name: "Security & Privacy",
      desc: "Change your account password and manage authentication settings",
      icon: Shield,
      href: ROUTES.dashboard.settingsSecurity,
      badge: "Protected",
    },
    {
      name: "Profile Prescreen",
      desc: "Review and update demographic answers for research survey matching",
      icon: ClipboardCheck,
      href: ROUTES.dashboard.prescreen,
      badge: "Active",
    },
  ];

  const deletionRequestMutation = useMutation({
    mutationFn: requestAccountDeletion,
    onSuccess: async (updated) => {
      setUser(updated);
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      toast.success("Account deactivation request submitted.");
    },
    onError: (error) => toast.error(parseApiError(error, "Could not submit deactivation request.")),
  });

  const cancelDeletionMutation = useMutation({
    mutationFn: cancelAccountDeletionRequest,
    onSuccess: async (updated) => {
      setUser(updated);
      setDeleteReason("");
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      toast.success("Account deactivation request cancelled.");
    },
    onError: (error) => toast.error(parseApiError(error, "Could not cancel request.")),
  });

  const avatarUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const optimized = await optimizeAvatarImage(file);
      return uploadAvatarRequest(optimized);
    },
    onSuccess: async (updated) => {
      setUser(updated);
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      toast.success("Profile photo updated.");
    },
    onError: (error) => toast.error(parseApiError(error, "Could not upload photo.")),
  });

  async function onAvatarFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    avatarUploadMutation.mutate(file);
  }

  const avatarUrl = displayUser?.avatar?.trim() || "";

  const memberSinceLabel =
    displayUser?.createdAt != null && displayUser.createdAt !== ""
      ? (() => {
          try {
            return format(new Date(displayUser.createdAt), "MMM yyyy");
          } catch {
            return "—";
          }
        })()
      : "—";

  const totalMissions = displayUser?.panelCompletedSurveys ?? 0;

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-md bg-brand-subtle text-brand-primary flex items-center justify-center font-bold">
            <SettingsIcon size={14} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
            Account Management
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          Profile & Security Settings
        </h1>
        <p className="text-xs text-gray-500 font-medium mt-0.5 max-w-xl leading-relaxed">
          Manage your personal details, credentials, verification status, and data preferences.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center shadow-2xs">
            {/* Avatar with Camera Overlay */}
            <div className="relative mb-4">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                aria-hidden
                tabIndex={-1}
                onChange={onAvatarFileChange}
              />
              {avatarUrl ? (
                <div
                  className="w-20 h-20 rounded-2xl bg-cover bg-center border-2 border-white shadow-md"
                  style={{ backgroundImage: `url("${avatarUrl}")` }}
                  aria-label="User avatar"
                  role="img"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-md">
                  {displayUser?.fullName?.charAt(0).toUpperCase() || "M"}
                </div>
              )}
              <button
                type="button"
                title="Change profile photo"
                aria-label="Upload profile photo"
                disabled={avatarUploadMutation.isPending}
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center shadow-sm border-2 border-white hover:bg-brand-primary transition-colors active:scale-95 disabled:opacity-60"
              >
                {avatarUploadMutation.isPending ? (
                  <Loader2 size={13} className="animate-spin" aria-hidden />
                ) : (
                  <Camera size={13} aria-hidden />
                )}
              </button>
            </div>

            <h3 className="text-base font-black text-gray-900">
              {displayUser?.fullName ?? "Dashboard Member"}
            </h3>
            <p className="text-[11px] font-medium text-gray-400 mt-0.5 mb-2">
              {displayUser?.email ?? ""}
            </p>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-black uppercase tracking-wider">
              <Sparkles size={11} className="text-amber-500" />
              Platinum Member
            </div>

            {/* Quick Metrics */}
            <div className="w-full mt-5 pt-4 border-t border-gray-100 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-400 flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  Total Studies
                </span>
                <span className="font-black text-gray-900 tabular-nums">{totalMissions}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-400 flex items-center gap-1.5">
                  <Calendar size={13} className="text-brand-primary" />
                  Member Since
                </span>
                <span className="font-black text-gray-900">{memberSinceLabel}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-400 flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-indigo-500" />
                  Prescreen Status
                </span>
                <span className="font-black text-emerald-600">100% Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings Sections */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100 shadow-2xs">
            {accountItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="p-4 sm:p-5 flex items-center justify-between group hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-gray-900 text-xs sm:text-sm group-hover:text-brand-primary transition-colors">
                          {item.name}
                        </h4>
                        <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-gray-500 truncate mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-gray-300 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </Link>
              );
            })}
          </div>

          {/* Account Deactivation Area */}
          <div className="p-5 bg-white rounded-2xl border border-rose-100 shadow-2xs space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-black text-gray-900 text-xs sm:text-sm">Deactivate Account</h4>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5 leading-relaxed">
                  Requesting deactivation will mark your panel membership inactive pending
                  administrator approval.
                </p>
              </div>
            </div>

            {displayUser?.deletionRequested ? (
              <div className="rounded-xl bg-rose-50/60 p-3.5 border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-rose-700">Deactivation Request Pending</p>
                  <p className="text-[11px] text-rose-600/80">
                    Your request has been submitted and is waiting for review.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => cancelDeletionMutation.mutate()}
                  disabled={cancelDeletionMutation.isPending}
                  className="px-3.5 py-1.5 bg-white text-rose-700 font-bold text-xs rounded-lg border border-rose-200 hover:bg-rose-600 hover:text-white transition-all disabled:opacity-60 shadow-2xs self-start sm:self-auto"
                >
                  {cancelDeletionMutation.isPending ? "Cancelling..." : "Cancel Request"}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Reason for deactivation request (optional)..."
                  className="w-full min-h-16 p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:ring-2 focus:ring-rose-200 transition-all"
                />
                <button
                  type="button"
                  onClick={() =>
                    deletionRequestMutation.mutate({ reason: deleteReason.trim() || undefined })
                  }
                  disabled={deletionRequestMutation.isPending}
                  className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white font-bold text-xs rounded-xl border border-rose-200 transition-all active:scale-95 disabled:opacity-60"
                >
                  {deletionRequestMutation.isPending
                    ? "Submitting..."
                    : "Submit Deactivation Request"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
