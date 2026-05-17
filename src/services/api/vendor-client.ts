import axios from "axios";
import { env } from "@/config";
import { attachVendorInterceptors } from "./vendor-interceptors";

/** Isolated API client for B2B vendor portal (vendor* cookies, not member/admin). */
export const vendorApiClient = axios.create({
  baseURL: env.apiUrl || undefined,
  timeout: 30_000,
  headers: { Accept: "application/json" },
  withCredentials: true,
});

attachVendorInterceptors(vendorApiClient);
