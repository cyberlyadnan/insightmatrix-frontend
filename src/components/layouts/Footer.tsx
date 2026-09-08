"use client";

import Link from "next/link";
import {
  Linkedin,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  ArrowRight,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { ImxLogo } from "@/components/brand";
import { isAuthRoute } from "@/constants";
import { FOOTER_CONTENT } from "@/constants/site-content";
import { useSiteSettings } from "@/hooks/use-site-settings";

export default function Footer() {
  const pathname = usePathname();
  const { settings } = useSiteSettings();

  const isAuthPage = isAuthRoute(pathname);
  const isAdminPage = pathname.startsWith("/admin");
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isSurveyStartPage = pathname.startsWith("/survey/start");
  const isSurveyCallbackPage = pathname.startsWith("/survey/callback");
  const isVendorPage = pathname.startsWith("/vendor");

  const currentYear = new Date().getFullYear();

  if (
    isAuthPage ||
    isAdminPage ||
    isDashboardPage ||
    isSurveyStartPage ||
    isSurveyCallbackPage ||
    isVendorPage
  ) {
    return null;
  }

  const social = settings.socialLinks;
  const primaryPhone = settings.phones?.[0];

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <ImxLogo href="/" size="lg" surface="dark" />
            <p className="mt-4 text-xs font-black uppercase tracking-widest text-brand-primary">
              {settings.tagline || FOOTER_CONTENT.tagline}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-400 max-w-sm">
              {settings.shortDescription || settings.statement || FOOTER_CONTENT.intro}
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              {social?.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
                  title="InsightMatrix LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {social?.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
                  title="InsightMatrix Instagram"
                >
                  <Instagram size={18} />
                </a>
              )}
              {social?.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
                  title="InsightMatrix Twitter / X"
                >
                  <Twitter size={18} />
                </a>
              )}
              {social?.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
                  title="InsightMatrix Facebook"
                >
                  <Facebook size={18} />
                </a>
              )}
              {social?.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
                  title="InsightMatrix YouTube"
                >
                  <Youtube size={18} />
                </a>
              )}
              <a
                href={social?.website || "https://www.insightmatrix.online"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
                title="InsightMatrix Website"
              >
                <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-5">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {FOOTER_CONTENT.quickLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6">
              Research Services
            </h3>
            <ul className="space-y-3 text-sm">
              {FOOTER_CONTENT.services.map((service, i) => (
                <li key={i}>
                  <Link href={service.href} className="hover:text-white transition-colors">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Proposals */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6">
              Contact & Inquiries
            </h3>
            <div className="space-y-4 text-sm">
              <a
                href={`mailto:${settings.email || "info@insightmatrix.online"}`}
                className="flex items-center gap-3 group hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                  <Mail size={14} className="group-hover:text-brand-primary transition-colors" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-500">General Info</div>
                  <div>{settings.email || "info@insightmatrix.online"}</div>
                </div>
              </a>

              <a
                href={`mailto:${settings.salesEmail || "sales@insightmatrix.online"}`}
                className="flex items-center gap-3 group hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                  <Mail size={14} className="group-hover:text-brand-primary transition-colors" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-500">
                    Sales & Proposals
                  </div>
                  <div>{settings.salesEmail || "sales@insightmatrix.online"}</div>
                </div>
              </a>

              {primaryPhone && (
                <a
                  href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 group hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                    <Phone size={14} className="group-hover:text-brand-primary transition-colors" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-500">
                      Support Desk
                    </div>
                    <div>{primaryPhone}</div>
                  </div>
                </a>
              )}

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Globe size={14} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-500">Website</div>
                  <div>www.insightmatrix.online</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary hover:bg-brand-hover text-white text-xs font-black uppercase tracking-wider transition-all"
                >
                  Request a Quote <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {currentYear}{" "}
            {settings.copyrightText || "InsightMatrix Research. All rights reserved."}
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-gray-400 transition-colors">
              Global Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
