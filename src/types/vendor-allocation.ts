import type {
  VendorAllocationResponseStatus,
  VendorAllocationStatus,
} from "@/constants/vendor-allocation";

export type VendorPortalQuotaGroup = {
  id: string;
  groupName: string;
  groupDescription: string;
  totalQuota: number;
  remainingQuota: number;
  status: string;
};

export type VendorSurveyAllocation = {
  id: string;
  allocationCode: string;
  routingSlug: string;
  panelSurveyId: string;
  vendorId: string;
  panelSurvey: {
    id: string;
    surveyName: string;
    surveyCode: string;
    surveyStatus: string;
    remainingQuota: number;
    totalQuota: number;
    targetCountries?: string[];
    estimatedLOI?: number | null;
    incidenceRate?: number | null;
  } | null;
  vendor: {
    id: string;
    vendorCode: string;
    companyName: string;
    status: string;
  } | null;
  status: VendorAllocationStatus;
  vendorResponseStatus: VendorAllocationResponseStatus;
  vendorRespondedAt: string | null;
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
  surveyStatus: string;
  status: VendorAllocationStatus;
  vendorResponseStatus: VendorAllocationResponseStatus;
  vendorRespondedAt: string | null;
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
  /** Null until vendor accepts the allocation */
  routingLink: string | null;
  startDate: string | null;
  endDate: string | null;
  allocationNotes: string;
  createdAt: string | null;
  // Full safe survey specifications
  targetCountries: string[];
  targetGender: string;
  targetAgeMin: number | null;
  targetAgeMax: number | null;
  targetProfessions: string[];
  targetIndustries: string[];
  targetCompanySizes: string[];
  targetDevices: string[];
  targetLanguages: string[];
  estimatedLOI: number | null;
  surveyIncidenceRate: number | null;
  surveyTotalQuota: number;
  surveyRemainingQuota: number;
  dynamicQuotaGroups: VendorPortalQuotaGroup[];
  surveyStartDate: string | null;
  surveyEndDate: string | null;
  surveyNotes: string;
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
