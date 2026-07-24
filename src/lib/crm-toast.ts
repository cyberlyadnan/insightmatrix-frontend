import { toast } from "sonner";

/** Standardized CRM success toasts — keep error toasts unchanged at call sites. */
export const crmToast = {
  saved: () => toast.success("Saved Successfully"),
  updated: () => toast.success("Updated Successfully"),
  deleted: () => toast.success("Deleted Successfully"),
  created: () => toast.success("Saved Successfully"),
  success: (message: string) => toast.success(message),
};
