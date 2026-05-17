import type { ReactNode } from "react";

/** Vendor portal is always light UI — avoids OS dark mode washing out labels on white cards */
export default function VendorRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="vendor-portal min-h-screen text-gray-900 [color-scheme:light] antialiased">
      {children}
    </div>
  );
}
