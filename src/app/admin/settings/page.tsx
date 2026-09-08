"use client";

import { AdminSettingsHub } from "@/components/admin/settings/AdminSettingsHub";
import { PageHelp } from "@/components/crm/page-help";
import { ADMIN_PAGE_HELP } from "@/constants/admin-page-help";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Settings &amp; Configuration
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Control global brand parameters, multi-channel communication endpoints, SEO defaults,
            and survey routing webhooks.
          </p>
        </div>
        <PageHelp content={ADMIN_PAGE_HELP.settings} />
      </div>

      <AdminSettingsHub />
    </div>
  );
}
