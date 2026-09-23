"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Eye, EyeOff, Sparkles, KeyRound, Check } from "lucide-react";
import { toast } from "sonner";

import { parseApiError } from "@/services/api/errors";
import { createUser, type CreateUserPayload } from "@/services/users";
import { queryKeys } from "@/services/queries";
import type { UserRole } from "@/types/user";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  onSuccess?: () => void;
}

function generateRandomPassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let pass = "";
  for (let i = 0; i < 12; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

export function CreateUserModal({
  isOpen,
  onClose,
  defaultRole = "user",
  onSuccess,
}: CreateUserModalProps) {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [status, setStatus] = useState("active");
  const [isVerified, setIsVerified] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Sync defaultRole if modal opens for different context
  React.useEffect(() => {
    if (isOpen) {
      setRole(defaultRole);
    }
  }, [isOpen, defaultRole]);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setRole(defaultRole);
    setStatus("active");
    setIsVerified(true);
    setShowPassword(false);
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("User account created successfully", {
        description: `Account for ${fullName} (${role}) is ready.`,
      });
      resetForm();
      onClose();
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(parseApiError(err, "Could not create user account"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Valid email address is required");
      return;
    }
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    createMutation.mutate({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      status,
      isVerified,
    });
  };

  const handleAutoGeneratePassword = () => {
    const generated = generateRandomPassword();
    setPassword(generated);
    setShowPassword(true);
    toast.success("Generated secure temporary password");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 border border-gray-100 my-8"
        >
          {/* Modal Header */}
          <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                <UserPlus size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  {role === "admin" ? "Add Admin / Team Member" : "Create User Account"}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {role === "admin"
                    ? "Grant administrative permissions and management access."
                    : "Create a panel member or platform user account."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors shadow-2xs"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-600 block">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                required
                className="w-full h-12 px-4 rounded-2xl border border-gray-200 text-sm font-medium text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-600 block">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@company.com"
                required
                className="w-full h-12 px-4 rounded-2xl border border-gray-200 text-sm font-medium text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-600 block">
                  Initial Password <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoGeneratePassword}
                  className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles size={12} /> Auto-generate
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  className="w-full h-12 pl-4 pr-12 rounded-2xl border border-gray-200 text-sm font-medium text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role & Status Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-600 block">
                  Account Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full h-12 px-4 rounded-2xl border border-gray-200 text-sm font-bold text-gray-900 bg-white focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                >
                  <option value="user">Panel Member (User)</option>
                  <option value="admin">Administrator (Admin)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-600 block">
                  Account Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl border border-gray-200 text-sm font-bold text-gray-900 bg-white focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Mark as Verified Checkbox */}
            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
              <div className="text-xs">
                <span className="font-bold text-gray-900 block">Mark Email as Verified</span>
                <span className="text-gray-500 font-medium">
                  Allows immediate login without confirmation email link
                </span>
              </div>
            </label>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={createMutation.isPending}
                className="px-5 py-3 rounded-2xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-6 py-3 rounded-2xl bg-gray-900 hover:bg-brand-primary text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-gray-200/50 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {createMutation.isPending ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
