import Link from "next/link";
import { ArrowRight, Clock, Award } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeaturedSurveys() {
  const featuredSurveys = [
    { title: "Technology Usage Habits", reward: "$15", time: "15 mins", type: "Consumer Tech" },
    {
      title: "Healthcare Product Feedback",
      reward: "$25",
      time: "20 mins",
      type: "Health & Wellness",
    },
    { title: "B2B Software Purchasing", reward: "$50", time: "30 mins", type: "Enterprise IT" },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Featured Opportunities
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Sample active surveys available on the platform right now. Sign up to view all
              opportunities.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <Link
              href="/register"
              className="text-brand-primary font-medium hover:text-brand-hover flex items-center"
            >
              View all surveys <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredSurveys.map((survey, i) => (
            <Card
              key={i}
              className="hover:shadow-lg transition-shadow bg-white rounded-xl border-gray-100 overflow-hidden"
            >
              <div className="h-2 w-full bg-brand-primary"></div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
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
                  Qualified participants needed for immediate study regarding preferences and trends
                  in this sector.
                </p>
                <div className="flex items-center text-2xl font-bold text-gray-900">
                  <Award className="w-6 h-6 mr-2 text-green-500" />
                  {survey.reward}{" "}
                  <span className="text-sm text-gray-500 font-normal ml-2">Reward</span>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <Link
                  href="/register"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none w-full"
                >
                  Qualify Now
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
