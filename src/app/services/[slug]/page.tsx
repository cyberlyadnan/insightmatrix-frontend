import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, Zap, Target, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Service Details | InsightMatrix",
  description: "Learn more about our professional survey and research solutions.",
};

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  // Simple title generator from slug
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="bg-white pb-24">
      {/* Breadcrumbs & Simple Hero */}
      <div className="bg-indigo-700 pt-16 pb-24 px-6 lg:px-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 -mt-20 -mr-20 w-96 h-96 rounded-full bg-indigo-600 blur-3xl opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/services" className="inline-flex items-center text-sm font-medium text-indigo-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-3xl">
            {title}
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-2xl leading-relaxed">
            Discover how InsightMatrix delivers unparalleled value through state-of-the-art methodology, rigorous quality control, and a massive global reach.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
           <div className="p-8 lg:p-12 lg:w-2/3">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Overview</h2>
              <div className="prose prose-lg text-gray-500 max-w-none">
                <p>
                  Our {title} solution is engineered to meet the highest industry standards, providing the critical foundation required for accurate data modeling and strategic decision making. By leveraging a meticulous combination of advanced technology and human verification, we ensure complete reliability.
                </p>
                <p className="mt-4">
                  Whether you are an enterprise conducting complex multi-market segmentation or an academic tracking longitudinal sentiment changes, our platform provides the tools, the scale, and the precision required for success.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 tracking-tight">Key Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                 {[
                   "Real-time Dashboard Analytics",
                   "Proprietary Anti-Bot Technology",
                   "Dynamic Quota Management",
                   "Seamless API Integration",
                   "24/7 Dedicated Support",
                   "Extensive Demographic Targeting"
                 ].map((feat, i) => (
                   <li key={i} className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                     <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-3 shrink-0" />
                     <span className="font-medium">{feat}</span>
                   </li>
                 ))}
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6 tracking-tight">Our Process</h2>
              <div className="space-y-6">
                 {[
                   { step: "01", title: "Consultation & Setup", desc: "We evaluate your goals and configure the ideal sampling parameters." },
                   { step: "02", title: "Deployment & Targeting", desc: "Surveys are distributed logically to highly screened, qualified respondents." },
                   { step: "03", title: "Quality Assurance", desc: "Data is scrubbed in real-time, eliminating speeders, straight-liners, and suspicious IPs." },
                   { step: "04", title: "Delivery & Analysis", desc: "Clean data is delivered instantly via dashboard exports or API webhooks." },
                 ].map((process, i) => (
                    <div key={i} className="flex">
                       <div className="flex-shrink-0 flex flex-col items-center">
                          <span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg mb-2">{process.step}</span>
                          {i !== 3 && <div className="w-0.5 h-full bg-indigo-100"></div>}
                       </div>
                       <div className="ml-6 pb-8">
                          <h3 className="text-xl font-semibold text-gray-900">{process.title}</h3>
                          <p className="mt-2 text-gray-500">{process.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-gray-50 p-8 lg:p-12 lg:w-1/3 border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col justify-between">
              <div>
                 <h3 className="text-xl font-bold text-gray-900 mb-6">Benefits</h3>
                 <div className="space-y-6">
                    <div className="flex">
                       <Zap className="h-6 w-6 text-indigo-500 mr-4 shrink-0" />
                       <div>
                          <h4 className="font-semibold text-gray-900">Velocity</h4>
                          <p className="text-sm text-gray-500 mt-1">Accelerate fieldwork by 40% with automated matching algorithms.</p>
                       </div>
                    </div>
                    <div className="flex">
                       <ShieldCheck className="h-6 w-6 text-indigo-500 mr-4 shrink-0" />
                       <div>
                          <h4 className="font-semibold text-gray-900">Reliability</h4>
                          <p className="text-sm text-gray-500 mt-1">Industry-leading double-opt-in verification protocols for all panelists.</p>
                       </div>
                    </div>
                    <div className="flex">
                       <Target className="h-6 w-6 text-indigo-500 mr-4 shrink-0" />
                       <div>
                          <h4 className="font-semibold text-gray-900">Precision</h4>
                          <p className="text-sm text-gray-500 mt-1">Access over 300 deep demographic data points for micro-targeting.</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="mt-12 bg-white p-6 rounded-xl border border-indigo-100 shadow-sm text-center">
                 <h4 className="font-bold text-gray-900 text-lg mb-2">Ready to Start?</h4>
                 <p className="text-sm text-gray-500 mb-6">Talk to our experts to configure a solution tailored to your exact needs.</p>
                 <Link href="/contact" className="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow transition-colors w-full bg-indigo-600 hover:bg-indigo-700">
                    Contact Sales
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
