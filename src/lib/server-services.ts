import { SERVICES_CATALOG } from "@/constants/services";
import { getServiceBySlug as getStaticServiceBySlug } from "@/constants/services-utils";
import type { ServiceRecord } from "@/constants/service-types";

function getBackendBaseUrl(): string {
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL.replace(/\/+$/, "") + "/api/v1";
  }
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/+$/, "") + "/api/v1";
  }
  return "http://localhost:5000/api/v1";
}

export async function fetchServerServiceBySlug(slug: string): Promise<ServiceRecord | null> {
  const normalized = slug.trim().toLowerCase();

  try {
    const res = await fetch(
      `${getBackendBaseUrl()}/services/detail/${encodeURIComponent(normalized)}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data?.data) {
        return data.data as ServiceRecord;
      }
    }
  } catch {
    // Backend unreachable during build or SSR — fallback to static catalog
  }

  const staticFallback = getStaticServiceBySlug(normalized);
  return staticFallback || null;
}

export async function fetchServerAllServices(): Promise<ServiceRecord[]> {
  try {
    const res = await fetch(`${getBackendBaseUrl()}/services/public?pageSize=100`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data) && data.data.length > 0) {
        return data.data as ServiceRecord[];
      }
    }
  } catch {
    // Backend unreachable — fallback to static catalog
  }

  return SERVICES_CATALOG;
}
