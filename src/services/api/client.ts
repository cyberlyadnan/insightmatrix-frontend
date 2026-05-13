import axios from "axios";
import { env } from "@/config";
import { attachInterceptors } from "./interceptors";

export const apiClient = axios.create({
  baseURL: env.apiUrl || undefined,
  timeout: 30_000,
  /** Content-Type is set per-request in interceptors (JSON vs FormData). */
  headers: { Accept: "application/json" },
  withCredentials: true,
});

attachInterceptors(apiClient);
