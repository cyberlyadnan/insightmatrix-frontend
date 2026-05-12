"use client";

import { Bell, Shield } from "lucide-react";
import { SurveyRoutingCallbacksSection } from "@/components/admin/SurveyRoutingCallbacksSection";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Workspace Settings</h1>
        <p className="mt-2 text-gray-600">
          Configure CMS preferences, routing URLs, and notifications. Further controls connect as the
          API layer grows.
        </p>
      </div>

      <SurveyRoutingCallbacksSection />

      <DashboardSection
        title="Notifications"
        description="Email alerts for queries, testimonials, and publishing workflows."
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-gray-200 bg-white text-gray-900 hover:bg-gray-50 hover:text-gray-900"
          >
            Save changes
          </Button>
        }
      >
        <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100">
            <Bell className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Digest emails</p>
            <p className="text-sm text-gray-600">
              Weekly summary of inbound queries and moderation tasks.
            </p>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection
        title="Security"
        description="Session management and admin roles will connect to your API layer."
        actions={
          <Button
            type="button"
            size="sm"
            className="bg-gray-900 text-white hover:bg-black hover:text-white"
          >
            Review policies
          </Button>
        }
      >
        <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100">
            <Shield className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Role-based access</p>
            <p className="text-sm text-gray-600">
              Wire{" "}
              <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">canAccessAdminRoute</code>{" "}
              checks into middleware once JWT roles are available from the backend.
            </p>
          </div>
        </div>
      </DashboardSection>
    </div>
  );
}
