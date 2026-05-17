import type { VendorAllocationStatus } from "@/constants/vendor-allocation";

export type VendorSurveyAllocation = {
  id: string;
  allocationCode: string;
  panelSurveyId: string;
  vendorId: string;
  panelSurvey: {
    id: string;
    surveyName: string;
    surveyCode: string;
    surveyStatus: string;
    remainingQuota: number;
    totalQuota: number;
  } | null;
  vendor: {
    id: string;
    vendorCode: string;
    companyName: string;
    status: string;
  } | null;
  status: VendorAllocationStatus;
  allocatedQuota: number;
  startedCount: number;
  completedCount: number;
  terminateCount: number;
  quotaFullCount: number;
  qualityRejectCount: number;
  liveRemainingQuota: number;
  conversionRate: number;
  incidenceRate: number;
  vendorCpi: number;
  clientCpi: number;
  marginPerComplete: number;
  routingLink: string;
  startDate: string | null;
  endDate: string | null;
  notes: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type VendorPortalAllocation = {
  id: string;
  allocationCode: string;
  surveyName: string;
  surveyCode: string;
  status: VendorAllocationStatus;
  allocatedQuota: number;
  startedCount: number;
  completedCount: number;
  terminateCount: number;
  quotaFullCount: number;
  qualityRejectCount: number;
  liveRemainingQuota: number;
  conversionRate: number;
  incidenceRate: number;
  vendorCpi: number;
  routingLink: string;
  startDate: string | null;
  endDate: string | null;
};

export type VendorAllocationAnalytics = {
  allocationId: string;
  allocationCode: string;
  status: VendorAllocationStatus;
  allocatedQuota: number;
  liveRemainingQuota: number;
  startedCount: number;
  completedCount: number;
  terminateCount: number;
  quotaFullCount: number;
  qualityRejectCount: number;
  conversionRate: number;
  incidenceRate: number;
  redirectCount: number;
};

export type VendorAllocationListMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
