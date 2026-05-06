import { isAxiosError } from "axios";
import type { ApiErrorBody } from "@/types";

export function parseApiError(error: unknown, fallback = "Something went wrong"): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }
  const data = error.response?.data as ApiErrorBody | undefined;
  if (typeof data?.message === "string") return data.message;
  return error.message || fallback;
}
