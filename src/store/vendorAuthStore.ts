import { create } from "zustand";
import type { VendorPublicProfile } from "@/types/vendor";

type VendorAuthState = {
  vendor: VendorPublicProfile | null;
  setVendor: (vendor: VendorPublicProfile | null) => void;
  clearVendor: () => void;
};

export const useVendorAuthStore = create<VendorAuthState>((set) => ({
  vendor: null,
  setVendor: (vendor) => set({ vendor }),
  clearVendor: () => set({ vendor: null }),
}));
