import Hero from "@/components/hero/Hero";
import { CheckCircle2, Award, Clock, ArrowRight, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const steps = [
    {
      title: "Register & Profile",
      description: "Create your free account and complete your demographic profile to get matched with relevant surveys.",
      icon: <UsersIcon />,
    },
    {
      title: "Participate in Studies",
      description: "Receive invitations to high-quality market research studies, product tests, and opinion polls.",
      icon: <ClipboardIcon />,
    },
    {
      title: "Earn Rewards",
      description: "Get compensated for your time and insights. Redeem points for cash, gift cards, or charitable donations.",
      icon: <GiftIcon />,
    },
  ];

  const benefits = [
    { title: "High-Paying Surveys", description: "Our platform partners with top global brands, ensuring competitive compensation for your valuable insights.", icon: <Award className="h-6 w-6 text-indigo-600" /> },
    { title: "Flexible Participation", description: "Complete surveys on any device, anywhere, anytime. Our mobile-first design makes participation seamless.", icon: <Clock className="h-6 w-6 text-indigo-600" /> },
    { title: "Strict Data Privacy", description: "We adhere to GDPR and CCPA standards. Your personal data is anonymized and never sold to third parties.", icon: <Shield className="h-6 w-6 text-indigo-600" /> },
    { title: "Instant Payouts", description: "Withdraw your earnings instantly once you reach the minimum threshold via PayPal, Bank Transfer, or Crypto.", icon: <Zap className="h-6 w-6 text-indigo-600" /> },
  ];

  const featuredSurveys = [
    { title: "Technology Usage Habits", reward: "$15", time: "15 mins", type: "Consumer Tech" },
    { title: "Healthcare Product Feedback", reward: "$25", time: "20 mins", type: "Health & Wellness" },
    { title: "B2B Software Purchasing", reward: "$50", time: "30 mins", type: "Enterprise IT" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Process</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How InsightMatrix Works
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Join millions of users worldwide and start earning in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, index) => (
              <div key={index} className="relative group p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-4 border-white">
                  {index + 1}
                </div>
                <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
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
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-50 text-indigo-600">
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
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 rounded-full bg-indigo-100 opacity-50"></div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 relative z-10">Earn more for your expertise</h3>
                <p className="text-gray-600 mb-8 relative z-10">Sign up specifically for industry panels to receive highly relevant, premium compensation surveys matched precisely to your professional background.</p>
                <ul className="space-y-4 relative z-10">
                  <li className="flex items-center text-gray-700">
                    <CheckCircle2 className="text-indigo-600 mr-3 h-5 w-5" /> IT & Engineering
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle2 className="text-indigo-600 mr-3 h-5 w-5" /> Healthcare Professionals
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle2 className="text-indigo-600 mr-3 h-5 w-5" /> B2B Decision Makers
                  </li>
                </ul>
                <div className="mt-8 relative z-10">
                  <Link href="/register" className="inline-flex h-11 items-center justify-center rounded-md bg-indigo-600 px-8 text-sm font-medium text-white hover:bg-indigo-700 w-full sm:w-auto transition-colors">
                    Join Expert Panel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Surveys Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Featured Opportunities</h2>
              <p className="mt-3 text-lg text-gray-500">
                Sample active surveys available on the platform right now. Sign up to view all opportunities.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link href="/register" className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                View all surveys <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredSurveys.map((survey, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow bg-white rounded-xl border-gray-100 overflow-hidden">
                <div className="h-2 w-full bg-indigo-500"></div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {survey.type}
                    </span>
                    <span className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" /> {survey.time}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{survey.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm mb-4">
                    Qualified participants needed for immediate study regarding preferences and trends in this sector.
                  </p>
                  <div className="flex items-center text-2xl font-bold text-gray-900">
                    <Award className="w-6 h-6 mr-2 text-green-500" />
                    {survey.reward} <span className="text-sm text-gray-500 font-normal ml-2">Reward</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                  <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none w-full">
                    Qualify Now
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="py-16 bg-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            <div>
              <div className="text-4xl font-extrabold text-white tracking-tight">2M+</div>
              <div className="mt-2 text-sm font-medium text-indigo-200">Registered Users</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white tracking-tight">$15M</div>
              <div className="mt-2 text-sm font-medium text-indigo-200">Rewards Paid Out</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white tracking-tight">120+</div>
              <div className="mt-2 text-sm font-medium text-indigo-200">Countries Supported</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-white tracking-tight">4.8/5</div>
              <div className="mt-2 text-sm font-medium text-indigo-200">Trustpilot Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-1/2 -mr-96 pt-32 hidden lg:block">
          <svg width="404" height="392" fill="none" viewBox="0 0 404 392" className="text-gray-100 opacity-50">
            <defs>
              <pattern id="8228f071-bcee-4ec8-90cb-a25ccaf10931" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" fill="currentColor"></rect>
              </pattern>
            </defs>
            <rect width="404" height="392" fill="url(#8228f071-bcee-4ec8-90cb-a25ccaf10931)"></rect>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-indigo-600 rounded-3xl shadow-xl overflow-hidden">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20 lg:flex lg:items-center">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Ready to make an impact?
                </h2>
                <p className="mt-4 max-w-3xl text-lg relative z-10 text-indigo-100">
                  Join our global community today. Sign up takes less than 2 minutes, and you can start participating in surveys immediately.
                </p>
                <div className="mt-10 sm:flex">
                  <div className="rounded-md shadow">
                    <Link
                      href="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg transition"
                    >
                      Create Free Account
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="/contact"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-900 md:py-4 md:text-lg transition"
                    >
                      Contact Sales
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Inline Icons for standard usage
function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  );
}
