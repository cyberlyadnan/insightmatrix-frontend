import {
  VENDOR_CALLBACK_OUTCOMES,
  emptyVendorCallbackUrls,
  type VendorCallbackUrls,
} from "@/constants/vendor-callback";

export function normalizeVendorCallbackUrls(
  input?: Partial<VendorCallbackUrls> | null
): VendorCallbackUrls {
  const base = emptyVendorCallbackUrls();
  if (!input) return base;
  for (const key of VENDOR_CALLBACK_OUTCOMES) {
    const value = input[key];
    if (typeof value === "string") base[key] = value.trim();
  }
  return base;
}

export function vendorCallbackUrlsToPayload(
  urls: Partial<VendorCallbackUrls> | VendorCallbackUrls
): VendorCallbackUrls {
  return normalizeVendorCallbackUrls(urls);
}
