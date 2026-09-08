"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Mail,
  MapPin,
  Globe,
  Share2,
  Save,
  RefreshCw,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  getSiteSettings,
  updateSiteSettings,
  type SiteSettingsRecord,
} from "@/services/services-cms/services-cms-api";
import { queryKeys } from "@/services/queries/queryKeys";

function CompanyProfileFields({
  initialSettings,
  onSave,
  isSubmitting,
  successMessage,
}: {
  initialSettings: SiteSettingsRecord;
  onSave: (payload: Partial<SiteSettingsRecord>) => Promise<void>;
  isSubmitting: boolean;
  successMessage: string | null;
}) {
  const [companyName, setCompanyName] = useState(
    initialSettings.companyName || "InsightMatrix Research"
  );
  const [tagline, setTagline] = useState(
    initialSettings.tagline || "Better Insights. Smarter Decisions."
  );
  const [statement, setStatement] = useState(initialSettings.statement || "");
  const [shortDescription, setShortDescription] = useState(initialSettings.shortDescription || "");
  const [email, setEmail] = useState(initialSettings.email || "info@insightmatrix.online");
  const [salesEmail, setSalesEmail] = useState(
    initialSettings.salesEmail || "sales@insightmatrix.online"
  );
  const [supportEmail, setSupportEmail] = useState(
    initialSettings.supportEmail || "help@insightmatrix.online"
  );
  const [phonesStr, setPhonesStr] = useState(
    Array.isArray(initialSettings.phones)
      ? initialSettings.phones.join(", ")
      : "+91 8707017533, +91 8299357161"
  );
  const [businessHours, setBusinessHours] = useState(
    initialSettings.businessHours || "Monday – Saturday, 9:00 AM – 7:00 PM"
  );
  const [street, setStreet] = useState(
    initialSettings.address?.street || "123 Data Point Avenue, Suite 800"
  );
  const [city, setCity] = useState(initialSettings.address?.city || "San Francisco");
  const [state, setState] = useState(initialSettings.address?.state || "CA");
  const [country, setCountry] = useState(initialSettings.address?.country || "USA");
  const [postalCode, setPostalCode] = useState(initialSettings.address?.postalCode || "94105");
  const [hqLabel, setHqLabel] = useState(initialSettings.address?.hqLabel || "Silicon Valley HQ");
  const [linkedin, setLinkedin] = useState(
    initialSettings.socialLinks?.linkedin ||
      "https://www.linkedin.com/company/insightmatrixresearch"
  );
  const [instagram, setInstagram] = useState(
    initialSettings.socialLinks?.instagram ||
      "https://www.instagram.com/insightmatrix_research?igsh=OHp5dXdxbzdmcG13&utm_source=qr"
  );
  const [twitter, setTwitter] = useState(initialSettings.socialLinks?.twitter || "");
  const [facebook, setFacebook] = useState(initialSettings.socialLinks?.facebook || "");
  const [youtube, setYoutube] = useState(initialSettings.socialLinks?.youtube || "");
  const [website, setWebsite] = useState(
    initialSettings.socialLinks?.website || "https://www.insightmatrix.online"
  );
  const [seoDefaultTitle, setSeoDefaultTitle] = useState(initialSettings.seoDefaultTitle || "");
  const [seoDefaultDescription, setSeoDefaultDescription] = useState(
    initialSettings.seoDefaultDescription || ""
  );
  const [seoKeywordsStr, setSeoKeywordsStr] = useState(
    Array.isArray(initialSettings.seoKeywords) ? initialSettings.seoKeywords.join(", ") : ""
  );
  const [copyrightText, setCopyrightText] = useState(
    initialSettings.copyrightText || "InsightMatrix Research. All rights reserved."
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<SiteSettingsRecord> = {
      companyName: companyName.trim(),
      tagline: tagline.trim(),
      statement: statement.trim(),
      shortDescription: shortDescription.trim(),
      email: email.trim().toLowerCase(),
      salesEmail: salesEmail.trim().toLowerCase(),
      supportEmail: supportEmail.trim().toLowerCase(),
      phones: phonesStr
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      businessHours: businessHours.trim(),
      address: {
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        country: country.trim(),
        postalCode: postalCode.trim(),
        hqLabel: hqLabel.trim(),
      },
      socialLinks: {
        linkedin: linkedin.trim(),
        instagram: instagram.trim(),
        twitter: twitter.trim(),
        facebook: facebook.trim(),
        youtube: youtube.trim(),
        website: website.trim(),
      },
      seoDefaultTitle: seoDefaultTitle.trim(),
      seoDefaultDescription: seoDefaultDescription.trim(),
      seoKeywords: seoKeywordsStr
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      copyrightText: copyrightText.trim(),
    };

    await onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Save bar */}
      <div className="flex items-center justify-between bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <Building2 size={20} className="text-brand-primary" />
            <span>Company Profile & Global Contact Details</span>
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            These details are reflected dynamically across the Header, Footer, Contact page, and SEO
            tags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {successMessage && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-fadeIn">
              <CheckCircle2 size={14} />
              <span>{successMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs shadow-lg shadow-brand-primary/20 hover:bg-brand-hover active:scale-95 transition-all disabled:opacity-60"
          >
            <Save size={14} />
            <span>{isSubmitting ? "Saving..." : "Save Profile Settings"}</span>
          </button>
        </div>
      </div>

      {/* Grid: 1. Brand Info, 2. Contact info, 3. Social links, 4. Headquarters, 5. Default SEO */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Brand Foundation */}
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Sparkles size={16} className="text-brand-primary" />
            <span>Brand Identity</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Short Company Statement / Bio
            </label>
            <textarea
              rows={3}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Statement
            </label>
            <textarea
              rows={2}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Footer Copyright Text
            </label>
            <input
              type="text"
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
            />
          </div>
        </div>

        {/* Contact Points */}
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Mail size={16} className="text-brand-primary" />
            <span>Contact & Inquiries</span>
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                General Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Sales & Proposals Email
              </label>
              <input
                type="email"
                value={salesEmail}
                onChange={(e) => setSalesEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Support Email
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Contact Numbers (Comma Separated)
            </label>
            <input
              type="text"
              value={phonesStr}
              onChange={(e) => setPhonesStr(e.target.value)}
              placeholder="+91 8707017533, +91 8299357161"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Business Hours
            </label>
            <input
              type="text"
              value={businessHours}
              onChange={(e) => setBusinessHours(e.target.value)}
              placeholder="Monday – Saturday, 9:00 AM – 7:00 PM"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
            />
          </div>
        </div>

        {/* Headquarters & Address */}
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <MapPin size={16} className="text-brand-primary" />
            <span>Headquarters & Physical Address</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              HQ Label / Location Name
            </label>
            <input
              type="text"
              value={hqLabel}
              onChange={(e) => setHqLabel(e.target.value)}
              placeholder="Silicon Valley HQ"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="123 Data Point Avenue, Suite 800"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
            />
          </div>

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Share2 size={16} className="text-brand-primary" />
            <span>Social Profiles & Web</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              LinkedIn Company URL
            </label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Instagram URL
            </label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://x.com/..."
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Official Website URL
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Default SEO Defaults Panel */}
      <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
          <Globe size={16} className="text-brand-primary" />
          <span>Global SEO Defaults</span>
        </h3>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Default Global Site Title
          </label>
          <input
            type="text"
            value={seoDefaultTitle}
            onChange={(e) => setSeoDefaultTitle(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Default Meta Description
          </label>
          <textarea
            rows={2}
            value={seoDefaultDescription}
            onChange={(e) => setSeoDefaultDescription(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Default SEO Keywords (Comma Separated)
          </label>
          <input
            type="text"
            value={seoKeywordsStr}
            onChange={(e) => setSeoKeywordsStr(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
          />
        </div>
      </div>
    </form>
  );
}

export function CompanyProfileSettingsForm() {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: queryKeys.siteSettings.profile,
    queryFn: getSiteSettings,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<SiteSettingsRecord>) => updateSiteSettings(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.siteSettings.profile });
      setSuccessMessage("Company profile and site settings saved successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
    },
    onError: (err: unknown) => {
      const msg =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : "Failed to save settings";
      alert(msg || "Failed to save settings");
    },
  });

  const handleSave = async (payload: Partial<SiteSettingsRecord>) => {
    await updateMutation.mutateAsync(payload);
  };

  if (isLoading || !settings) {
    return (
      <div className="py-12 text-center bg-white rounded-[2rem] border border-gray-100">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand-primary mb-2" />
        <p className="font-bold text-xs text-gray-500">Loading site profile...</p>
      </div>
    );
  }

  return (
    <CompanyProfileFields
      key={settings.updatedAt || settings._id || "default"}
      initialSettings={settings}
      onSave={handleSave}
      isSubmitting={updateMutation.isPending}
      successMessage={successMessage}
    />
  );
}
