import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList, TrendingUp, Users, Share2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Services | InsightMatrix",
  description: "Explore our comprehensive suite of market research services and solutions.",
};

export default function ServicesPage() {
  const services = [
    {
      title: "Survey Participation",
      slug: "survey-participation",
      description: "Join our global panel and earn rewards by sharing your authentic opinions and feedback on products, services, and trends.",
      icon: <ClipboardList className="h-8 w-8 text-indigo-600 mb-4" />,
      features: ["Verified Demographics", "Guaranteed Compensation", "Mobile-First Interface", "Data Privacy"],
      color: "bg-blue-50 border-blue-100",
    },
    {
      title: "Market Research Data Collection",
      slug: "market-research-data-collection",
      description: "Access our vast, diverse panel to rapidly collect high-quality data for your academic, corporate, or independent research projects.",
      icon: <TrendingUp className="h-8 w-8 text-indigo-600 mb-4" />,
      features: ["Targeted Sampling", "Real-Time Tracking", "Fraud Prevention", "Agile Methodology"],
      color: "bg-indigo-50 border-indigo-100",
    },
    {
      title: "Survey Panel Management",
      slug: "survey-panel-management",
      description: "Leverage our robust technology infrastructure to build, manage, and engage your own proprietary custom research panel.",
      icon: <Users className="h-8 w-8 text-indigo-600 mb-4" />,
      features: ["Custom Branding", "Panel Health Metrics", "Automated Rewards", "Compliance Security"],
      color: "bg-purple-50 border-purple-100",
    },
    {
      title: "Survey Distribution Network",
      slug: "survey-distribution-network",
      description: "Extend your survey reach beyond traditional boundaries with our programmatic distribution network and API integrations.",
      icon: <Share2 className="h-8 w-8 text-indigo-600 mb-4" />,
      features: ["API Connectivity", "Global Publisher Network", "Dynamic Allocation", "Quality Assurance"],
      color: "bg-cyan-50 border-cyan-100",
    }
  ];

  return (
    <div className="bg-white pb-24">
      <div className="bg-indigo-700 py-24 sm:py-32 mb-16 px-6 lg:px-8 text-center text-white">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
          Our Solutions
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-indigo-100 mx-auto">
          Comprehensive, industry-leading tools and services designed to streamline data collection and maximize participant engagement.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service, idx) => (
            <Card key={idx} className={`shadow-sm hover:shadow-xl transition-all border-t-4 hover:-translate-y-1 ${service.color}`}>
              <CardHeader className="pb-4">
                {service.icon}
                <CardTitle className="text-2xl font-bold text-gray-900">{service.title}</CardTitle>
                <CardDescription className="text-base text-gray-600 mt-2">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mt-4">
                   {service.features.map((feature, i) => (
                     <li key={i} className="flex items-center text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                        {feature}
                     </li>
                   ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-4 border-t border-gray-100 mt-4 rounded-b-xl">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-indigo-600 font-semibold hover:text-indigo-800 flex items-center transition-colors"
                >
                  Learn more about this solution <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
