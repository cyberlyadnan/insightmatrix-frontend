import { vendorApiClient } from "@/services/api/vendor-client";
import type { VendorCallbackUrls } from "@/constants/vendor-callback";
import type { VendorDashboardSummary, VendorPublicProfile } from "@/types/vendor";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type VendorHourlyCellMetrics = {
  starts: number;
  completes: number;
  terminates: number;
  quotaFull: number;
  qualityRejects: number;
  revenue: number;
  conversionRate: number;
};

export type VendorHourlySlotRow = {
  hour: number;
  label: string;
  cells: Record<string, VendorHourlyCellMetrics>;
  total: VendorHourlyCellMetrics;
};

export type VendorMarketRow = {
  market: string;
  cells: Record<string, VendorHourlyCellMetrics>;
  total: VendorHourlyCellMetrics;
};

export type VendorHourlyReport = {
  dateFrom: string;
  dateTo: string;
  dates: string[];
  summary: {
    totalStarts: number;
    totalCompletes: number;
    totalTerminates: number;
    totalQuotaFull: number;
    totalQualityRejects: number;
    totalRevenue: number;
    conversionRate: number;
    peakHourLabel: string | null;
    peakHourTraffic: number;
    topMarket: string | null;
    topMarketTraffic: number;
  };
  dailyTotals: Record<string, VendorHourlyCellMetrics>;
  hourlyRows: VendorHourlySlotRow[];
  marketRows: VendorMarketRow[];
  filtersMeta: {
    allocations: Array<{
      id: string;
      allocationCode: string;
      surveyName: string;
      surveyCode: string;
    }>;
    countries: string[];
  };
};

export type VendorHourlyReportQuery = {
  dateFrom?: string;
  dateTo?: string;
  allocationId?: string;
  status?: string;
  country?: string;
  tzOffsetMinutes?: number;
};

export async function getVendorDashboardSummary(params?: {
  dateFrom?: string;
  dateTo?: string;
}): Promise<VendorDashboardSummary> {
  const { data } = await vendorApiClient.get<ApiEnvelope<VendorDashboardSummary>>(
    "/vendor-portal/dashboard",
    {
      params: {
        dateFrom: params?.dateFrom || undefined,
        dateTo: params?.dateTo || undefined,
      },
    }
  );
  return data.data;
}

export async function getVendorHourlyReport(
  params?: VendorHourlyReportQuery
): Promise<VendorHourlyReport> {
  const { data } = await vendorApiClient.get<ApiEnvelope<VendorHourlyReport>>(
    "/vendor-portal/reports/hourly",
    {
      params: {
        dateFrom: params?.dateFrom || undefined,
        dateTo: params?.dateTo || undefined,
        allocationId: params?.allocationId || undefined,
        status: params?.status || undefined,
        country: params?.country || undefined,
        tzOffsetMinutes: params?.tzOffsetMinutes,
      },
    }
  );
  return data.data;
}

export type VendorApiTrafficRow = {
  id: string;
  respondentId: string;
  internalSessionToken: string;
  surveyId: string;
  allocationCode: string;
  projectName: string;
  market: string;
  countryCode: string;
  entryTime: string | null;
  exitTime: string | null;
  rawStatus: string;
  status: string;
  cpi: number;
  revenue: number;
  redirectStatus: string;
  device: "desktop" | "mobile" | "tablet";
  entryUrl: string | null;
  exitUrl: string | null;
};

export type VendorApiTrafficReport = {
  items: VendorApiTrafficRow[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalAttempts: number;
    completes: number;
    terminates: number;
    dropOuts: number;
    quotaFull: number;
    qualityRejects: number;
    totalRevenue: number;
    conversionRate: number;
  };
  availableCountries: string[];
};

export type VendorApiTrafficReportQuery = {
  dateFrom?: string;
  dateTo?: string;
  country?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};

export type VendorLiveInventoryRow = {
  countryCode: string;
  liveSurveys: number;
  liveInventories: number;
  totalAllocatedQuota: number;
  avgCpi: number;
  avgLoi: number | null;
  avgIr: number | null;
};

export type VendorLiveInventory = {
  items: VendorLiveInventoryRow[];
  summary: {
    totalCountries: number;
    totalLiveSurveys: number;
    totalLiveInventories: number;
    topCountryCode: string | null;
  };
  availableCountries: string[];
};

export async function getVendorApiTrafficReport(
  params?: VendorApiTrafficReportQuery
): Promise<VendorApiTrafficReport> {
  const { data } = await vendorApiClient.get<ApiEnvelope<VendorApiTrafficReport>>(
    "/vendor-portal/reports/traffic",
    {
      params: {
        dateFrom: params?.dateFrom || undefined,
        dateTo: params?.dateTo || undefined,
        country: params?.country || undefined,
        status: params?.status && params.status !== "all" ? params.status : undefined,
        search: params?.search?.trim() || undefined,
        page: params?.page,
        pageSize: params?.pageSize,
      },
    }
  );
  return data.data;
}

export async function getVendorLiveInventory(params?: {
  country?: string;
}): Promise<VendorLiveInventory> {
  const { data } = await vendorApiClient.get<ApiEnvelope<VendorLiveInventory>>(
    "/vendor-portal/inventory/live",
    {
      params: {
        country: params?.country || undefined,
      },
    }
  );
  return data.data;
}

export async function updateVendorProfile(payload: {
  companyName?: string;
  contactPerson?: string;
  phone?: string;
  website?: string;
  callbackUrls?: VendorCallbackUrls;
}): Promise<VendorPublicProfile> {
  const { data } = await vendorApiClient.patch<ApiEnvelope<VendorPublicProfile>>(
    "/vendor-portal/me",
    payload
  );
  return data.data;
}

export async function changeVendorPassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await vendorApiClient.patch("/vendor-portal/me/password", payload);
}
