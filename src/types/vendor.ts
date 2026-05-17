import type {
  VendorCallbackConfigurationStatus,
  VendorCallbackUrls,
} from "@/constants/vendor-callback";

export type VendorStatus = "active" | "paused" | "suspended";

export type Vendor = {
  id: string;
  vendorCode: string;
  vendorUid: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  status: VendorStatus;
  callbackUrls: VendorCallbackUrls;
  callbackConfigurationStatus: VendorCallbackConfigurationStatus;
  allowedIps: string[];
  allowedCountries: string[];
  notes: string;
  totalAssignedQuota: number;
  totalCompletes: number;
  totalTerminates: number;
  totalQuotaFull: number;
  totalQualityRejects: number;
  totalRevenueGenerated: number;
  totalPayoutDue: number;
  lastLoginAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type VendorPublicProfile = {
  id: string;
  vendorCode: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  status: VendorStatus;
  callbackUrls: VendorCallbackUrls;
  callbackConfigurationStatus: VendorCallbackConfigurationStatus;
  lastLoginAt: string | null;
};

export type VendorDashboardSummary = {
  activeAssignments: number;
  totalCompletes: number;
  totalTerminates: number;
  totalQuotaFull: number;
  totalQualityRejects: number;
  conversionRate: number;
  terminationRate: number;
  todayCompletes: number;
  weeklyCompletes: number;
  monthlyCompletes: number;
  totalRevenueGenerated: number;
  totalPayoutDue: number;
};

export type VendorAnalyticsSummary = {
  vendorId: string;
  vendorCode: string;
  companyName: string;
  status: VendorStatus;
  totalAssignedQuota: number;
  totalCompletes: number;
  totalTerminates: number;
  totalQuotaFull: number;
  totalQualityRejects: number;
  totalRevenueGenerated: number;
  totalPayoutDue: number;
  conversionRate: number;
  terminationRate: number;
  lastLoginAt: string | null;
};
