import { isAxiosError } from "axios";
import type { ApiErrorBody } from "@/types";

function formatApiErrorDetails(details: unknown): string {
  if (details == null) return "";
  if (Array.isArray(details)) {
    const parts = details
      .map((d) => {
        if (d && typeof d === "object" && "message" in d) {
          const m = (d as { message: unknown }).message;
          return typeof m === "string" ? m : null;
        }
        return typeof d === "string" ? d : null;
      })
      .filter((x): x is string => Boolean(x));
    if (parts.length === 0) return "";
    const shown = parts.slice(0, 8);
    const tail = parts.length > 8 ? ` (+${parts.length - 8} more)` : "";
    return ` — ${shown.join("; ")}${tail}`;
  }
  if (typeof details === "object") {
    return ` — ${JSON.stringify(details).slice(0, 280)}`;
  }
  return ` — ${String(details)}`;
}

export function parseApiError(error: unknown, fallback = "Something went wrong"): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }
  const data = error.response?.data as ApiErrorBody | undefined;
  const base =
    typeof data?.message === "string" && data.message.trim() !== ""
      ? data.message
      : error.message || fallback;
  return base + formatApiErrorDetails(data?.details);
}
