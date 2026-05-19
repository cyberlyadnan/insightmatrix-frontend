import type { VendorRespondentSessionStatus } from "@/constants/vendor-allocation";

export type VendorRespondentTracking = {
  id: string;
  vendor: { id: string; vendorCode: string; companyName: string } | null;
  panelSurvey: { id: string; surveyName: string; surveyCode: string } | null;
  allocation: { id: string; allocationCode: string; routingSlug: string } | null;
  vendorRespondentToid: string;
  internalSessionToken: string;
  supplierReturnedToken: string;
  supplierProjectPid: string;
  status: VendorRespondentSessionStatus;
  responseStatus: VendorRespondentSessionStatus;
  callbackForwarded: boolean;
  callbackForwardedAt: string | null;
  trafficType: string;
  respondentOwnerType: string;
  trafficSource: string;
  startedAt: string | null;
  redirectedAt: string | null;
  completedAt: string | null;
  createdAt: string | null;
};

export type VendorRespondentTrackingListMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
