import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Terms of Service | InsightMatrix",
  description:
    "Terms and conditions governing use of the InsightMatrix survey platform, panel participation, and related services.",
};

const LAST_UPDATED = "May 12, 2026";

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated={LAST_UPDATED}>
      <p className="text-gray-600">
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of the websites,
        applications, and services operated by InsightMatrix (&quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;). By creating an account, participating in research, or otherwise using our
        platform, you agree to these Terms. If you do not agree, do not use our services.
      </p>

      <LegalSection title="1. Eligibility and accounts">
        <p>
          You must be at least the age of majority in your jurisdiction to register. You agree to
          provide accurate information and to keep your credentials secure. You are responsible for
          activity under your account and must notify us promptly of any unauthorized use.
        </p>
      </LegalSection>

      <LegalSection title="2. Description of services">
        <p>
          InsightMatrix provides market-research and survey-related tools and experiences, including
          panel participation, routing to third-party surveys where applicable, rewards in points or
          other program currency as described on the platform, and related analytics for clients. We
          may modify, suspend, or discontinue features with reasonable notice where practicable.
        </p>
      </LegalSection>

      <LegalSection title="3. Acceptable use">
        <p>You agree not to:</p>
        <ul>
          <li>Violate applicable laws or infringe others&apos; rights.</li>
          <li>
            Attempt to gain unauthorized access to our systems, other users&apos; accounts, or data.
          </li>
          <li>
            Use bots, scripts, or automation to distort responses, quotas, or rewards unless
            expressly permitted.
          </li>
          <li>
            Harass staff or other participants, or submit fraudulent, offensive, or harmful content.
          </li>
          <li>Reverse engineer or scrape the service in ways that exceed normal personal use.</li>
        </ul>
        <p>
          We may investigate suspected abuse and may suspend or terminate accounts that violate
          these rules or pose risk to the platform.
        </p>
      </LegalSection>

      <LegalSection title="4. Third-party surveys and links">
        <p>
          Some studies may be hosted or fulfilled by third-party partners. Their sites and terms may
          apply in addition to ours. We are not responsible for third-party content, availability,
          or practices, though we aim to work with reputable partners.
        </p>
      </LegalSection>

      <LegalSection title="5. Rewards and points">
        <p>
          Rewards (including points) are described in-product and may change. Points typically have
          no cash value unless expressly stated otherwise. Rewards may be subject to verification,
          tax reporting where required, and program rules. We may void rewards obtained through
          fraud or violation of these Terms.
        </p>
      </LegalSection>

      <LegalSection title="6. Intellectual property">
        <p>
          The platform, branding, software, and content we provide are owned by InsightMatrix or our
          licensors. Subject to these Terms, we grant you a limited, non-exclusive, non-transferable
          license to use the service for personal, non-commercial participation unless you are an
          authorized business user under a separate agreement.
        </p>
      </LegalSection>

      <LegalSection title="7. Disclaimers">
        <p>
          The service is provided &quot;as is&quot; and &quot;as available.&quot; To the fullest
          extent permitted by law, we disclaim warranties of merchantability, fitness for a
          particular purpose, and non-infringement. We do not guarantee uninterrupted or error-free
          operation or that research opportunities will always be available.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of liability">
        <p>
          To the maximum extent permitted by law, InsightMatrix and its affiliates will not be
          liable for any indirect, incidental, special, consequential, or punitive damages, or for
          loss of profits, data, or goodwill, arising from your use of the service. Our aggregate
          liability for claims relating to the service is limited to the greater of (a) the amounts
          you paid us in the twelve months before the claim or (b) one hundred dollars (USD), except
          where prohibited by law.
        </p>
      </LegalSection>

      <LegalSection title="9. Indemnity">
        <p>
          You will defend and indemnify InsightMatrix against claims, damages, losses, and expenses
          (including reasonable legal fees) arising from your misuse of the service, your content,
          or your violation of these Terms or applicable law.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes">
        <p>
          We may update these Terms from time to time. We will post the revised version on this page
          and update the &quot;Last updated&quot; date. Material changes may be communicated through
          the platform or by email where appropriate. Continued use after changes constitutes
          acceptance of the updated Terms.
        </p>
      </LegalSection>

      <LegalSection title="11. Governing law and disputes">
        <p>
          These Terms are governed by the laws of the jurisdiction in which InsightMatrix operates
          its primary business, without regard to conflict-of-law rules, except where mandatory
          consumer protections in your country apply. Courts in that jurisdiction have exclusive
          jurisdiction, unless applicable law requires otherwise.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          Questions about these Terms:{" "}
          <a
            href="mailto:help@insightmatrix.com"
            className="font-bold text-brand-primary hover:underline"
          >
            help@insightmatrix.com
          </a>
          . Our privacy practices are described in the{" "}
          <Link href={ROUTES.privacy} className="font-bold text-brand-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
