import { vendorApiClient } from "@/services/api/vendor-client";
import type { VendorCallbackUrls } from "@/constants/vendor-callback";
import type { VendorDashboardSummary, VendorPublicProfile } from "@/types/vendor";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export async function getVendorDashboardSummary(): Promise<VendorDashboardSummary> {
  const { data } = await vendorApiClient.get<ApiEnvelope<VendorDashboardSummary>>(
    "/vendor-portal/dashboard"
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
