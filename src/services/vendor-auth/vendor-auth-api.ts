import { vendorApiClient } from "@/services/api/vendor-client";
import type { AuthAxiosRequestConfig } from "@/services/api/auth-request-config";
import type { VendorPublicProfile } from "@/types/vendor";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export async function vendorLoginRequest(payload: {
  email: string;
  password: string;
}): Promise<VendorPublicProfile> {
  const { data } = await vendorApiClient.post<ApiEnvelope<{ vendor: VendorPublicProfile }>>(
    "/vendor-auth/login",
    payload
  );
  return data.data.vendor;
}

export async function vendorLogoutRequest(): Promise<void> {
  await vendorApiClient.post("/vendor-auth/logout", {});
}

export async function vendorMeRequest(): Promise<VendorPublicProfile> {
  const { data } = await vendorApiClient.get<ApiEnvelope<VendorPublicProfile>>(
    "/vendor-portal/me",
    {
      skipAuthRedirect: true,
    } as AuthAxiosRequestConfig
  );
  return data.data;
}
