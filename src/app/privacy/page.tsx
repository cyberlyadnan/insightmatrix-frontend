import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Privacy Policy | InsightMatrix",
  description:
    "How InsightMatrix collects, uses, shares, and protects personal information when you use our survey platform and panel.",
};

const LAST_UPDATED = "May 12, 2026";

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <p className="text-gray-600">
        InsightMatrix (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy.
        This Privacy Policy explains how we collect, use, disclose, and safeguard information when
        you use our websites, applications, and related research services (collectively, the
        &quot;Service&quot;). It should be read together with our{" "}
        <Link href={ROUTES.terms} className="font-bold text-brand-primary hover:underline">
          Terms of Service
        </Link>
        .
      </p>

      <LegalSection title="1. Information we collect">
        <p>
          <strong>Account and profile.</strong> Name, email, password (hashed), country or region,
          and other details you provide when registering or completing profile or prescreen
          questionnaires.
        </p>
        <p>
          <strong>Research activity.</strong> Survey responses, routing events (e.g. completes,
          screenouts), device and browser type, approximate location derived from IP where used for
          fraud prevention or targeting, timestamps, and identifiers needed to link sessions across
          our platform and partner surveys.
        </p>
        <p>
          <strong>Support and communications.</strong> Messages you send us, feedback, and metadata
          associated with support tickets.
        </p>
        <p>
          <strong>Technical data.</strong> Log files, cookies, and similar technologies as described
          in Section 6.
        </p>
      </LegalSection>

      <LegalSection title="2. How we use information">
        <p>We use personal information to:</p>
        <ul>
          <li>Provide, secure, and improve the Service and your account.</li>
          <li>Match you to appropriate studies and manage quotas and incentives.</li>
          <li>Detect and prevent fraud, abuse, and violations of our policies.</li>
          <li>Communicate with you about the platform, studies, and policy updates.</li>
          <li>Comply with legal obligations and enforce our terms.</li>
          <li>Generate aggregated or de-identified analytics for clients and internal use.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Legal bases (where applicable)">
        <p>
          If the GDPR or similar laws apply, we rely on appropriate bases such as performance of a
          contract (providing the Service), legitimate interests (security, product improvement, and
          fraud prevention, balanced against your rights), consent where required (e.g. certain
          cookies or marketing), and legal obligation.
        </p>
      </LegalSection>

      <LegalSection title="4. Sharing of information">
        <p>We may share information with:</p>
        <ul>
          <li>
            <strong>Research clients and partners</strong> who field studies, subject to contracts
            and, where promised, aggregated or limited identifiers as appropriate for the project.
          </li>
          <li>
            <strong>Service providers</strong> that host data, send email, process payments or
            rewards, or provide analytics, under confidentiality and data-processing terms.
          </li>
          <li>
            <strong>Authorities</strong> when required by law or to protect rights, safety, and
            security.
          </li>
          <li>
            <strong>Business transfers</strong> in connection with a merger, acquisition, or sale of
            assets, with notice where required.
          </li>
        </ul>
        <p>We do not sell your personal information for money as a primary business model.</p>
      </LegalSection>

      <LegalSection title="5. Retention">
        <p>
          We retain information for as long as your account is active and as needed to provide the
          Service, comply with law, resolve disputes, and enforce agreements. Research datasets may
          be retained in line with client contracts and industry practice; we apply minimization and
          access controls where feasible.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="6. Cookies and similar technologies">
        <p>
          We use cookies and similar tools for authentication, preferences, security, and
          measurement. You can control cookies through your browser settings; disabling some cookies
          may limit certain features. Where required, we will obtain consent for non-essential
          cookies.
        </p>
      </LegalSection>

      <LegalSection title="7. Security">
        <p>
          We implement technical and organizational measures designed to protect personal
          information. No method of transmission or storage is completely secure; we encourage
          strong passwords and caution when sharing links.
        </p>
      </LegalSection>

      <LegalSection title="8. International transfers">
        <p>
          We may process information in countries other than your own. Where we transfer personal
          data across borders, we use appropriate safeguards (such as standard contractual clauses)
          where required by applicable law.
        </p>
      </LegalSection>

      <LegalSection id="your-rights" title="9. Your rights and choices">
        <p>
          Depending on your location, you may have rights to access, correct, delete, or export your
          personal data, to object to or restrict certain processing, to withdraw consent, and to
          lodge a complaint with a supervisory authority. You may also opt out of marketing messages
          via the unsubscribe link or your account settings. To exercise rights, contact us using
          the details below. We may need to verify your identity before responding.
        </p>
      </LegalSection>

      <LegalSection title="10. Children">
        <p>
          The Service is not directed at children under the age of majority. We do not knowingly
          collect personal information from children. If you believe we have collected such
          information, contact us and we will take appropriate steps.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. We will post the new version on this
          page and revise the &quot;Last updated&quot; date. For material changes, we will provide
          additional notice as appropriate.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact us">
        <p>
          For privacy-related requests or questions:{" "}
          <a
            href="mailto:help@insightmatrix.com"
            className="font-bold text-brand-primary hover:underline"
          >
            help@insightmatrix.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
