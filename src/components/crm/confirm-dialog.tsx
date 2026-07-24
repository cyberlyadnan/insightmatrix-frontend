"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { Modal } from "@/components/shared/Modal";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  /** Destructive styling for delete actions (default true). */
  destructive?: boolean;
  children?: ReactNode;
};

/**
 * Reusable confirmation dialog for destructive actions.
 * Default copy: “Are you sure?” / “This action cannot be undone.”
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  destructive = true,
  children,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (loading) return;
        onOpenChange(next);
      }}
      title={title}
      description={description}
      footer={
        <div className="flex w-full gap-2 justify-end">
          <button
            type="button"
            disabled={loading}
            className="h-10 px-4 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            className={
              destructive
                ? "h-10 px-4 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 disabled:opacity-60 inline-flex items-center gap-2"
                : "h-10 px-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-black disabled:opacity-60 inline-flex items-center gap-2"
            }
            onClick={onConfirm}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Deleting…
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      }
    >
      {children ?? <p className="text-sm text-gray-600">Please confirm you want to proceed.</p>}
    </Modal>
  );
}
