import Link from "next/link";
import { CheckCircle2, Award, Clock, Shield, Zap } from "lucide-react";

export default function Benefits() {
  const benefits = [
    { title: "High-Paying Surveys", description: "Our platform partners with top global brands, ensuring competitive compensation for your valuable insights.", icon: <Award className="h-6 w-6 text-brand-primary" /> },
    { title: "Flexible Participation", description: "Complete surveys on any device, anywhere, anytime. Our mobile-first design makes participation seamless.", icon: <Clock className="h-6 w-6 text-brand-primary" /> },
    { title: "Strict Data Privacy", description: "We adhere to GDPR and CCPA standards. Your personal data is anonymized and never sold to third parties.", icon: <Shield className="h-6 w-6 text-brand-primary" /> },
    { title: "Instant Payouts", description: "Withdraw your earnings instantly once you reach the minimum threshold via PayPal, Bank Transfer, or Crypto.", icon: <Zap className="h-6 w-6 text-brand-primary" /> },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Why Choose InsightMatrix?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              We bridge the gap between visionary brands and insightful consumers. Our platform offers a premium experience for both participants and researchers.
            </p>
            <div className="mt-10 space-y-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-subtle text-brand-primary">
                      {benefit.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{benefit.title}</h3>
                    <p className="mt-2 text-base text-gray-500">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:pl-10">
            <div className="bg-brand-subtle border border-brand-light rounded-2xl p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 rounded-full bg-brand-light opacity-50"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 relative z-10">Earn more for your expertise</h3>
              <p className="text-gray-600 mb-8 relative z-10">Sign up specifically for industry panels to receive highly relevant, premium compensation surveys matched precisely to your professional background.</p>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="text-brand-primary mr-3 h-5 w-5" /> IT & Engineering
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="text-brand-primary mr-3 h-5 w-5" /> Healthcare Professionals
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle2 className="text-brand-primary mr-3 h-5 w-5" /> B2B Decision Makers
                </li>
              </ul>
              <div className="mt-8 relative z-10">
                <Link href="/register" className="inline-flex h-11 items-center justify-center rounded-md bg-brand-primary px-8 text-sm font-medium text-white hover:bg-brand-hover w-full sm:w-auto transition-colors">
                  Join Expert Panel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
