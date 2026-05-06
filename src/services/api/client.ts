import axios from "axios";
import { env } from "@/config";
import { attachInterceptors } from "./interceptors";

export const apiClient = axios.create({
  baseURL: env.apiUrl || undefined,
  timeout: 30_000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: true,
});

attachInterceptors(apiClient);
