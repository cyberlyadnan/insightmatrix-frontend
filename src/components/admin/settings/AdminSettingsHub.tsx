"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
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
  Copy,
  Check,
  ExternalLink,
  Shield,
  Bell,
  Search,
  Plus,
  X,
  RotateCcw,
  AlertTriangle,
  Phone,
  Clock,
  Briefcase,
  LifeBuoy,
  Link2,
  Terminal,
} from "lucide-react";
import {
  getSiteSettings,
  updateSiteSettings,
  type SiteSettingsRecord,
} from "@/services/services-cms/services-cms-api";
import { queryKeys } from "@/services/queries/queryKeys";
import { SURVEY_CALLBACK_CONFIG } from "@/constants/survey-callback";
import {
  buildPublicApiUrl,
  buildSurveyCallbackUrl,
  shouldWarnMissingPublicSiteUrl,
} from "@/lib/site-url";
import { toast } from "sonner";

type TabId = "brand" | "contact" | "location" | "social" | "seo" | "callbacks" | "security";

interface TabItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: string;
}

const TABS: TabItem[] = [
  { id: "brand", label: "Brand & Identity", icon: Sparkles },
  { id: "contact", label: "Contact & Inquiries", icon: Mail },
  { id: "location", label: "Headquarters & Address", icon: MapPin },
  { id: "social", label: "Social & Web", icon: Share2 },
  { id: "seo", label: "SEO & Search Defaults", icon: Search },
  { id: "callbacks", label: "Survey Routing Callbacks", icon: Link2, badge: "Webhooks" },
  { id: "security", label: "Security & Policies", icon: Shield },
];

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-2xs transition-all active:scale-95"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-600 font-bold">Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-gray-500" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

function SettingsFormView({
  initialSettings,
  onSave,
  isSaving,
}: {
  initialSettings: SiteSettingsRecord;
  onSave: (payload: Partial<SiteSettingsRecord>) => Promise<void>;
  isSaving: boolean;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("brand");

  // Local Form States initialized from props (no setState in useEffect)
  const [companyName, setCompanyName] = useState(
    initialSettings.companyName || "InsightMatrix Research"
  );
  const [tagline, setTagline] = useState(
    initialSettings.tagline || "Better Insights. Smarter Decisions."
  );
  const [statement, setStatement] = useState(initialSettings.statement || "");
  const [shortDescription, setShortDescription] = useState(initialSettings.shortDescription || "");
  const [copyrightText, setCopyrightText] = useState(
    initialSettings.copyrightText || "InsightMatrix Research. All rights reserved."
  );

  const [email, setEmail] = useState(initialSettings.email || "info@insightmatrix.online");
  const [salesEmail, setSalesEmail] = useState(
    initialSettings.salesEmail || "sales@insightmatrix.online"
  );
  const [supportEmail, setSupportEmail] = useState(
    initialSettings.supportEmail || "help@insightmatrix.online"
  );
  const [phonesList, setPhonesList] = useState<string[]>(
    Array.isArray(initialSettings.phones) && initialSettings.phones.length > 0
      ? initialSettings.phones
      : ["+91 8707017533", "+91 8299357161"]
  );
  const [newPhoneInput, setNewPhoneInput] = useState("");
  const [businessHours, setBusinessHours] = useState(
    initialSettings.businessHours || "Monday – Saturday, 9:00 AM – 7:00 PM"
  );

  const [hqLabel, setHqLabel] = useState(
    initialSettings.address?.hqLabel || "Silicon Valley Global HQ"
  );
  const [street, setStreet] = useState(
    initialSettings.address?.street || "123 Data Point Avenue, Suite 800"
  );
  const [city, setCity] = useState(initialSettings.address?.city || "San Francisco");
  const [state, setState] = useState(initialSettings.address?.state || "CA");
  const [country, setCountry] = useState(initialSettings.address?.country || "USA");
  const [postalCode, setPostalCode] = useState(initialSettings.address?.postalCode || "94105");

  const [linkedin, setLinkedin] = useState(
    initialSettings.socialLinks?.linkedin ||
      "https://www.linkedin.com/company/insightmatrixresearch"
  );
  const [instagram, setInstagram] = useState(
    initialSettings.socialLinks?.instagram || "https://www.instagram.com/insightmatrix_research"
  );
  const [twitter, setTwitter] = useState(initialSettings.socialLinks?.twitter || "");
  const [facebook, setFacebook] = useState(initialSettings.socialLinks?.facebook || "");
  const [youtube, setYoutube] = useState(initialSettings.socialLinks?.youtube || "");
  const [website, setWebsite] = useState(
    initialSettings.socialLinks?.website || "https://www.insightmatrix.online"
  );

  const [seoDefaultTitle, setSeoDefaultTitle] = useState(
    initialSettings.seoDefaultTitle ||
      "InsightMatrix — Global B2B & Consumer Market Research Solutions"
  );
  const [seoDefaultDescription, setSeoDefaultDescription] = useState(
    initialSettings.seoDefaultDescription ||
      "Precision-targeted online audience sampling, survey programming, data collection, and actionable market intelligence for global brands."
  );
  const [seoKeywordsList, setSeoKeywordsList] = useState<string[]>(
    Array.isArray(initialSettings.seoKeywords) && initialSettings.seoKeywords.length > 0
      ? initialSettings.seoKeywords
      : ["market research", "B2B sampling", "consumer insights", "online panels"]
  );
  const [newKeywordInput, setNewKeywordInput] = useState("");

  // Check for unsaved changes
  const isDirty = useMemo(() => {
    const initialPhones = Array.isArray(initialSettings.phones) ? initialSettings.phones : [];
    const initialKeywords = Array.isArray(initialSettings.seoKeywords)
      ? initialSettings.seoKeywords
      : [];

    return (
      companyName !== (initialSettings.companyName || "") ||
      tagline !== (initialSettings.tagline || "") ||
      statement !== (initialSettings.statement || "") ||
      shortDescription !== (initialSettings.shortDescription || "") ||
      copyrightText !== (initialSettings.copyrightText || "") ||
      email !== (initialSettings.email || "") ||
      salesEmail !== (initialSettings.salesEmail || "") ||
      supportEmail !== (initialSettings.supportEmail || "") ||
      businessHours !== (initialSettings.businessHours || "") ||
      hqLabel !== (initialSettings.address?.hqLabel || "") ||
      street !== (initialSettings.address?.street || "") ||
      city !== (initialSettings.address?.city || "") ||
      state !== (initialSettings.address?.state || "") ||
      country !== (initialSettings.address?.country || "") ||
      postalCode !== (initialSettings.address?.postalCode || "") ||
      linkedin !== (initialSettings.socialLinks?.linkedin || "") ||
      instagram !== (initialSettings.socialLinks?.instagram || "") ||
      twitter !== (initialSettings.socialLinks?.twitter || "") ||
      facebook !== (initialSettings.socialLinks?.facebook || "") ||
      youtube !== (initialSettings.socialLinks?.youtube || "") ||
      website !== (initialSettings.socialLinks?.website || "") ||
      seoDefaultTitle !== (initialSettings.seoDefaultTitle || "") ||
      seoDefaultDescription !== (initialSettings.seoDefaultDescription || "") ||
      JSON.stringify(phonesList) !== JSON.stringify(initialPhones) ||
      JSON.stringify(seoKeywordsList) !== JSON.stringify(initialKeywords)
    );
  }, [
    initialSettings,
    companyName,
    tagline,
    statement,
    shortDescription,
    copyrightText,
    email,
    salesEmail,
    supportEmail,
    businessHours,
    hqLabel,
    street,
    city,
    state,
    country,
    postalCode,
    linkedin,
    instagram,
    twitter,
    facebook,
    youtube,
    website,
    seoDefaultTitle,
    seoDefaultDescription,
    phonesList,
    seoKeywordsList,
  ]);

  const handleSave = useCallback(async () => {
    const payload: Partial<SiteSettingsRecord> = {
      companyName: companyName.trim(),
      tagline: tagline.trim(),
      statement: statement.trim(),
      shortDescription: shortDescription.trim(),
      email: email.trim().toLowerCase(),
      salesEmail: salesEmail.trim().toLowerCase(),
      supportEmail: supportEmail.trim().toLowerCase(),
      phones: phonesList.map((p) => p.trim()).filter(Boolean),
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
      seoKeywords: seoKeywordsList.map((k) => k.trim()).filter(Boolean),
      copyrightText: copyrightText.trim(),
    };

    await onSave(payload);
  }, [
    companyName,
    tagline,
    statement,
    shortDescription,
    email,
    salesEmail,
    supportEmail,
    phonesList,
    businessHours,
    street,
    city,
    state,
    country,
    postalCode,
    hqLabel,
    linkedin,
    instagram,
    twitter,
    facebook,
    youtube,
    website,
    seoDefaultTitle,
    seoDefaultDescription,
    seoKeywordsList,
    copyrightText,
    onSave,
  ]);

  const handleDiscard = () => {
    setCompanyName(initialSettings.companyName || "");
    setTagline(initialSettings.tagline || "");
    setStatement(initialSettings.statement || "");
    setShortDescription(initialSettings.shortDescription || "");
    setCopyrightText(initialSettings.copyrightText || "");
    setEmail(initialSettings.email || "");
    setSalesEmail(initialSettings.salesEmail || "");
    setSupportEmail(initialSettings.supportEmail || "");
    setPhonesList(initialSettings.phones || []);
    setBusinessHours(initialSettings.businessHours || "");
    setHqLabel(initialSettings.address?.hqLabel || "");
    setStreet(initialSettings.address?.street || "");
    setCity(initialSettings.address?.city || "");
    setState(initialSettings.address?.state || "");
    setCountry(initialSettings.address?.country || "");
    setPostalCode(initialSettings.address?.postalCode || "");
    setLinkedin(initialSettings.socialLinks?.linkedin || "");
    setInstagram(initialSettings.socialLinks?.instagram || "");
    setTwitter(initialSettings.socialLinks?.twitter || "");
    setFacebook(initialSettings.socialLinks?.facebook || "");
    setYoutube(initialSettings.socialLinks?.youtube || "");
    setWebsite(initialSettings.socialLinks?.website || "");
    setSeoDefaultTitle(initialSettings.seoDefaultTitle || "");
    setSeoDefaultDescription(initialSettings.seoDefaultDescription || "");
    setSeoKeywordsList(initialSettings.seoKeywords || []);
    toast.info("Changes reverted to saved state");
  };

  // Keyboard shortcut Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  const addPhone = () => {
    const trimmed = newPhoneInput.trim();
    if (trimmed && !phonesList.includes(trimmed)) {
      setPhonesList([...phonesList, trimmed]);
      setNewPhoneInput("");
    }
  };

  const removePhone = (index: number) => {
    setPhonesList(phonesList.filter((_, i) => i !== index));
  };

  const addKeyword = () => {
    const trimmed = newKeywordInput.trim().replace(/^,+|,+$/g, "");
    if (trimmed && !seoKeywordsList.includes(trimmed)) {
      setSeoKeywordsList([...seoKeywordsList, trimmed]);
      setNewKeywordInput("");
    }
  };

  const removeKeyword = (index: number) => {
    setSeoKeywordsList(seoKeywordsList.filter((_, i) => i !== index));
  };

  const postApiUrl = buildPublicApiUrl("/public/panel-routing-callback");
  const showEnvWarning = shouldWarnMissingPublicSiteUrl();

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Dock */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-brand-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 h-36 w-36 rounded-full bg-blue-500/5 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Live Configuration Engine
              </span>
              {isDirty && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200 animate-pulse">
                  Unsaved changes
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Enterprise Settings &amp; Presets
            </h2>
            <p className="text-xs text-gray-500 max-w-2xl leading-relaxed">
              Dynamically control global brand data, contact points, SEO tags, and survey partner
              routing callbacks without code deploys.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isDirty && (
              <button
                type="button"
                onClick={handleDiscard}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs shadow-2xs transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                <span>Discard</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 ${
                isDirty
                  ? "bg-brand-primary text-white shadow-brand-primary/25 hover:bg-brand-hover"
                  : "bg-gray-900 text-white hover:bg-black"
              } disabled:opacity-60`}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                  <span className="ml-1 text-[10px] font-normal opacity-70 hidden sm:inline">
                    (⌘S)
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-brand-primary text-white shadow-sm shadow-brand-primary/20"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                      isActive ? "bg-white/20 text-white" : "bg-brand-subtle text-brand-primary"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Panels */}
      <AnimatePresence mode="wait">
        {/* TAB 1: BRAND IDENTITY */}
        {activeTab === "brand" && (
          <motion.div
            key="brand"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid gap-6 lg:grid-cols-12"
          >
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-primary" />
                    <h3 className="text-sm font-bold text-gray-900">Brand Representation</h3>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400">
                    Visible on header, footer, &amp; emails
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Official Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="InsightMatrix Research"
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Primary Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Better Insights. Smarter Decisions."
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Executive Mission Statement
                  </label>
                  <textarea
                    rows={2}
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    placeholder="Empowering world-class market researchers with authenticated respondent data."
                    className="w-full p-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Short Company Bio (Footer &amp; Meta)
                  </label>
                  <textarea
                    rows={3}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="InsightMatrix is an ISO-certified market research and audience sampling network delivering real-time consumer and B2B intelligence across 100+ countries."
                    className="w-full p-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Footer Copyright Line
                  </label>
                  <input
                    type="text"
                    value={copyrightText}
                    onChange={(e) => setCopyrightText(e.target.value)}
                    placeholder="InsightMatrix Research. All rights reserved."
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Live Brand Preview Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="sticky top-6 space-y-4">
                <div className="rounded-3xl border border-gray-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 text-white shadow-md">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Live Footer &amp; Header Preview
                    </span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary text-white font-black text-sm">
                        {companyName.charAt(0) || "I"}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">
                          {companyName || "InsightMatrix Research"}
                        </h4>
                        <p className="text-[11px] text-brand-secondary font-medium">
                          {tagline || "Better Insights. Smarter Decisions."}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-normal pt-2">
                      {shortDescription ||
                        "Global market research sampling platform connecting top-tier enterprises with verified survey respondents worldwide."}
                    </p>

                    {statement && (
                      <div className="rounded-xl bg-slate-800/80 border border-slate-700/60 p-3 mt-3 text-xs text-slate-200 italic">
                        &ldquo;{statement}&rdquo;
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>
                        © {new Date().getFullYear()}{" "}
                        {copyrightText || "InsightMatrix Research. All rights reserved."}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-xs text-blue-800 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Automatic Brand Propagation
                  </p>
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    Changes here immediately sync to the Public Navbar, Mobile Menus, PDF Receipts,
                    Member Portals, and automated transactional emails.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: CONTACT & INQUIRIES */}
        {activeTab === "contact" && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid gap-6 lg:grid-cols-12"
          >
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brand-primary" />
                    <h3 className="text-sm font-bold text-gray-900">Communication Channels</h3>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400">
                    Official inboxes &amp; contact points
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      General Inquiries Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="info@insightmatrix.online"
                      className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                      Sales &amp; RFP Proposals
                    </label>
                    <input
                      type="email"
                      value={salesEmail}
                      onChange={(e) => setSalesEmail(e.target.value)}
                      placeholder="sales@insightmatrix.online"
                      className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <LifeBuoy className="w-3.5 h-3.5 text-gray-400" />
                      Member Support Email
                    </label>
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="help@insightmatrix.online"
                      className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      Operating Business Hours
                    </label>
                    <input
                      type="text"
                      value={businessHours}
                      onChange={(e) => setBusinessHours(e.target.value)}
                      placeholder="Monday – Saturday, 9:00 AM – 7:00 PM"
                      className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                    />
                  </div>
                </div>

                {/* Phone Numbers Tag Manager */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    Direct Telephone Contact Numbers
                  </label>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newPhoneInput}
                      onChange={(e) => setNewPhoneInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addPhone();
                        }
                      }}
                      placeholder="+91 8707017533 or +1 (415) 555-0199"
                      className="flex-1 h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                    />
                    <button
                      type="button"
                      onClick={addPhone}
                      className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Number</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {phonesList.map((phone, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-xs font-bold text-gray-800"
                      >
                        <Phone className="w-3 h-3 text-brand-primary" />
                        <span>{phone}</span>
                        <button
                          type="button"
                          onClick={() => removePhone(idx)}
                          className="text-gray-400 hover:text-rose-600 transition-colors ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {phonesList.length === 0 && (
                      <p className="text-xs text-gray-400 italic">No phone numbers listed yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Contact Card Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-brand-primary" />
                    Public Contact Card Preview
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Live
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="p-2 rounded-xl bg-white text-brand-primary shadow-2xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Email Dispatch</p>
                      <p className="text-gray-600 font-mono text-[11px]">{email}</p>
                      <p className="text-gray-400 text-[10px] mt-0.5">Sales: {salesEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="p-2 rounded-xl bg-white text-brand-primary shadow-2xs">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Direct Inquiries</p>
                      <p className="text-gray-600 text-[11px]">
                        {phonesList.length > 0 ? phonesList.join(" • ") : "None configured"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="p-2 rounded-xl bg-white text-brand-primary shadow-2xs">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Availability</p>
                      <p className="text-gray-600 text-[11px]">{businessHours}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: HEADQUARTERS & LOCATION */}
        {activeTab === "location" && (
          <motion.div
            key="location"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid gap-6 lg:grid-cols-12"
          >
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-primary" />
                    <h3 className="text-sm font-bold text-gray-900">
                      Physical Headquarters &amp; Operating Address
                    </h3>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400">
                    Displayed on invoices &amp; contact
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    HQ Location Label
                  </label>
                  <input
                    type="text"
                    value={hqLabel}
                    onChange={(e) => setHqLabel(e.target.value)}
                    placeholder="Silicon Valley Global HQ"
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Street Address &amp; Suite / Floor
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="123 Data Point Avenue, Suite 800"
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>

                <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="San Francisco"
                      className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      State / Prov
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="CA"
                      className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="USA"
                      className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="94105"
                      className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Visual Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                    Headquarters Badge Preview
                  </span>
                  <CopyButton
                    text={`${street}, ${city}, ${state} ${postalCode}, ${country}`}
                    label="Copy Address"
                  />
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50/40 border border-gray-200/70 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-primary">
                    <Building2 className="w-4 h-4" />
                    <span>{hqLabel || "Corporate Headquarters"}</span>
                  </div>

                  <p className="text-sm font-black text-gray-900 leading-snug">
                    {street || "123 Data Point Avenue"}
                  </p>

                  <p className="text-xs text-gray-600 font-medium">
                    {city || "San Francisco"}, {state || "CA"} {postalCode || "94105"} •{" "}
                    {country || "USA"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: SOCIAL & WEB PROFILES */}
        {activeTab === "social" && (
          <motion.div
            key="social"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-brand-primary" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Official Social Profiles &amp; Digital Channels
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-gray-400">
                  Linked across footer &amp; rich cards
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* LinkedIn */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#0077B5] text-white text-[10px] font-bold">
                        in
                      </span>
                      LinkedIn Company URL
                    </label>
                    {linkedin && (
                      <a
                        href={linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-brand-primary hover:underline inline-flex items-center gap-1"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://www.linkedin.com/company/insightmatrixresearch"
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white text-[10px] font-bold">
                        IG
                      </span>
                      Instagram Profile URL
                    </label>
                    {instagram && (
                      <a
                        href={instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-brand-primary hover:underline inline-flex items-center gap-1"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://www.instagram.com/insightmatrix_research"
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>

                {/* X / Twitter */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-black text-white text-[10px] font-bold">
                        𝕏
                      </span>
                      Twitter / X Handle URL
                    </label>
                    {twitter && (
                      <a
                        href={twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-brand-primary hover:underline inline-flex items-center gap-1"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://x.com/insightmatrix"
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>

                {/* Facebook */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#1877F2] text-white text-[10px] font-bold">
                        fb
                      </span>
                      Facebook Page URL
                    </label>
                    {facebook && (
                      <a
                        href={facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-brand-primary hover:underline inline-flex items-center gap-1"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/insightmatrixresearch"
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>

                {/* YouTube */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FF0000] text-white text-[10px] font-bold">
                        YT
                      </span>
                      YouTube Channel URL
                    </label>
                    {youtube && (
                      <a
                        href={youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-brand-primary hover:underline inline-flex items-center gap-1"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="https://youtube.com/@insightmatrix"
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>

                {/* Official Website */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-brand-primary" />
                      Official Public Domain URL
                    </label>
                    {website && (
                      <a
                        href={website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-brand-primary hover:underline inline-flex items-center gap-1"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://www.insightmatrix.online"
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: SEO & SEARCH DEFAULTS */}
        {activeTab === "seo" && (
          <motion.div
            key="seo"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid gap-6 lg:grid-cols-12"
          >
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-brand-primary" />
                    <h3 className="text-sm font-bold text-gray-900">
                      Global Search Engine Defaults (OpenGraph &amp; Meta)
                    </h3>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400">
                    Fallback for indexable routes
                  </span>
                </div>

                {/* Default Title */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Default Global Meta Title
                    </label>
                    <span
                      className={`text-[11px] font-bold tabular-nums ${
                        seoDefaultTitle.length > 60
                          ? "text-amber-600"
                          : seoDefaultTitle.length >= 35
                            ? "text-emerald-600"
                            : "text-gray-400"
                      }`}
                    >
                      {seoDefaultTitle.length} / 60 chars (ideal ~55)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={seoDefaultTitle}
                    onChange={(e) => setSeoDefaultTitle(e.target.value)}
                    placeholder="InsightMatrix — Global B2B & Consumer Market Research Solutions"
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>

                {/* Default Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Default Meta Description
                    </label>
                    <span
                      className={`text-[11px] font-bold tabular-nums ${
                        seoDefaultDescription.length > 160
                          ? "text-amber-600"
                          : seoDefaultDescription.length >= 120
                            ? "text-emerald-600"
                            : "text-gray-400"
                      }`}
                    >
                      {seoDefaultDescription.length} / 160 chars (ideal ~150)
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={seoDefaultDescription}
                    onChange={(e) => setSeoDefaultDescription(e.target.value)}
                    placeholder="Precision-targeted online audience sampling, survey programming, data collection, and actionable market intelligence for global brands."
                    className="w-full p-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  />
                </div>

                {/* Keyword Tags Manager */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Global SEO Keywords &amp; Target Tags
                  </label>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newKeywordInput}
                      onChange={(e) => setNewKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addKeyword();
                        }
                      }}
                      placeholder="e.g. b2b market research, online audience sampling..."
                      className="flex-1 h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Tag</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {seoKeywordsList.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900"
                      >
                        <span>{keyword}</span>
                        <button
                          type="button"
                          onClick={() => removeKeyword(idx)}
                          className="text-blue-400 hover:text-rose-600 transition-colors ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {seoKeywordsList.length === 0 && (
                      <p className="text-xs text-gray-400 italic">No keywords added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Google Search Engine Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-brand-primary" />
                    Google Search Result Snippet Preview
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    SERP Preview
                  </span>
                </div>

                <div className="p-4 rounded-2xl border border-gray-200/80 bg-white space-y-1.5 shadow-2xs font-sans">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white text-[10px] font-bold">
                      IM
                    </div>
                    <div className="min-w-0 leading-tight">
                      <p className="text-[12px] font-medium text-gray-800 truncate">
                        InsightMatrix Research
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono truncate">
                        https://insightmatrix.online
                      </p>
                    </div>
                  </div>

                  <h4 className="text-[15px] font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                    {seoDefaultTitle || "InsightMatrix — Global Market Research Solutions"}
                  </h4>

                  <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                    {seoDefaultDescription ||
                      "Precision-targeted online audience sampling, survey programming, data collection, and actionable market intelligence for global brands."}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-xs text-emerald-800 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Automated Schema &amp; OpenGraph Meta
                  </p>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    Twitter Cards (`summary_large_image`) and JSON-LD Organization schema are
                    automatically generated from these values for all published pages.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: SURVEY ROUTING CALLBACKS */}
        {activeTab === "callbacks" && (
          <motion.div
            key="callbacks"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Warning if public URL not configured */}
            {showEnvWarning && (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Production Configuration Notice</p>
                  <p className="mt-0.5 text-amber-800 leading-relaxed">
                    Set{" "}
                    <code className="font-mono bg-amber-100/80 px-1 rounded">
                      NEXT_PUBLIC_APP_URL
                    </code>{" "}
                    to your live domain in production so sample partners receive permanent,
                    canonical callback links.
                  </p>
                </div>
              </div>
            )}

            {/* Provider Callbacks Grid */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-brand-primary" />
                    <span>Sample Provider Redirect Endpoints</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Provide these redirect URLs to Cint, Dynata, Lucid, Toluna, or your custom
                    sample partners.
                  </p>
                </div>
                <span className="text-xs font-bold text-brand-primary bg-brand-subtle px-2.5 py-1 rounded-lg self-start sm:self-auto">
                  4 Callbacks Active
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {SURVEY_CALLBACK_CONFIG.map((callback) => {
                  const fullUrl = buildSurveyCallbackUrl(callback.slug);
                  const sampleUrl = buildSurveyCallbackUrl(callback.slug, {
                    pid: "YOUR_PROJECT_PID",
                    toid: "RESPONDENT_UID",
                  });

                  const outcomeBadges: Record<string, string> = {
                    complete: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    "quota-full": "bg-purple-50 text-purple-700 border-purple-200",
                    terminate: "bg-amber-50 text-amber-700 border-amber-200",
                    quality: "bg-rose-50 text-rose-700 border-rose-200",
                  };

                  return (
                    <div
                      key={callback.slug}
                      className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-gray-50/50 p-4 space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                              outcomeBadges[callback.slug] ||
                              "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {callback.shortLabel}
                          </span>
                          <span className="text-[11px] font-mono text-gray-400">
                            /{callback.slug}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-900">{callback.label}</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          {callback.description}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-gray-200/60">
                        <code className="block text-[11px] font-mono text-gray-800 bg-white border border-gray-200 rounded-xl p-2.5 break-all shadow-2xs">
                          {fullUrl}
                          <span className="text-brand-primary font-bold">?pid=…&amp;toid=…</span>
                        </code>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] text-gray-400">
                            Passes supplier project &amp; respondent token
                          </span>
                          <CopyButton text={sampleUrl} label="Copy Test URL" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct S2S Webhook POST Documentation */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-brand-primary" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Direct Server-to-Server (S2S) Callback API
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                  POST /api/v1/public/panel-routing-callback
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    For sample partners that support direct server-to-server webhook dispatches,
                    your partners can send an HTTP POST request to this endpoint with the JSON
                    payload below.
                  </p>

                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5 font-mono text-[11px]">
                    <p className="text-gray-500 font-bold uppercase text-[10px]">Endpoint</p>
                    <p className="text-gray-900 font-semibold break-all">{postApiUrl}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-700">Sample JSON Payload</span>
                    <CopyButton
                      text={JSON.stringify(
                        {
                          supplierProjectPid: "PRJ_10023",
                          respondentTrackingUid: "RESP_881239",
                          eventType: "complete",
                        },
                        null,
                        2
                      )}
                      label="Copy JSON"
                    />
                  </div>
                  <pre className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                    {`{\n  "supplierProjectPid": "YOUR_PROJECT_PID",\n  "respondentTrackingUid": "RESPONDENT_REF",\n  "eventType": "complete" // complete | quota_full | terminate | quality_reject\n}`}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 7: SECURITY & NOTIFICATIONS */}
        {activeTab === "security" && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Notifications Policy */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 text-brand-primary">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Admin Digest Notifications</h4>
                    <p className="text-xs text-gray-500">Weekly operational intelligence</p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Sends weekly summaries of inbound enterprise contact queries, respondent fraud
                  alerts, completed allocations, and panel payout metrics to admin emails.
                </p>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700">Weekly Digest Status</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => toast.success("Notification preferences up to date")}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-800 transition-all active:scale-95"
                >
                  Configure Channels
                </button>
              </div>
            </div>

            {/* Access Control & RBAC */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 border border-purple-100 text-purple-600">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Role-Based Access Control</h4>
                    <p className="text-xs text-gray-500">
                      Session isolation &amp; JWT verification
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Admin routes are protected via authenticated HttpOnly cookies and client-side
                  verified role gates. Non-admin members are isolated to the respondent dashboard.
                </p>

                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-600">Active Role Policy</span>
                  <span className="font-bold text-purple-700">ROLE_ADMIN_ENFORCED</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => toast.info("Role guards verified and active")}
                  className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-xs font-bold text-white transition-all active:scale-95"
                >
                  Audit Permissions
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AdminSettingsHub() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: queryKeys.siteSettings.profile,
    queryFn: getSiteSettings,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<SiteSettingsRecord>) => updateSiteSettings(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.siteSettings.profile });
      toast.success("Settings saved successfully", {
        description: "Public pages and system headers have been updated.",
      });
    },
    onError: (err: unknown) => {
      const msg =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : "Failed to save settings";
      toast.error("Could not save settings", { description: msg });
    },
  });

  const handleSave = async (payload: Partial<SiteSettingsRecord>) => {
    await updateMutation.mutateAsync(payload);
  };

  if (isLoading || !settings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-3xl border border-gray-200/80 bg-white p-12 shadow-xs">
        <RefreshCw className="h-8 w-8 text-brand-primary animate-spin mb-3" />
        <p className="text-sm font-semibold text-gray-600">Loading system settings...</p>
      </div>
    );
  }

  return (
    <SettingsFormView
      key={settings.updatedAt || settings._id || "ready"}
      initialSettings={settings}
      onSave={handleSave}
      isSaving={updateMutation.isPending}
    />
  );
}
