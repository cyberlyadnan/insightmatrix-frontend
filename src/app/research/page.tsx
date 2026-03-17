import { Metadata } from "next";
import { ResearchHeader, CaseStudyCard } from "@/components/research/ResearchComponents";
import { caseStudies } from "@/lib/data-research";
import { ArrowRight, FileText, Search, Filter } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data & Research | InsightMatrix",
  description: "Explore our collection of industry-leading case studies and market intelligence reports.",
};

export default function ResearchPage() {
  return (
    <div className="bg-white min-h-screen">
      <ResearchHeader />

      <section className="max-w-7xl mx-auto px-6 lg:px-8 -mt-10 relative z-20">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-4 lg:p-6 shadow-2xl shadow-gray-200/50 border border-gray-100 mb-16 flex flex-col md:flex-row gap-4 items-center">
           <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search case studies, industries, or keywords..." 
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              />
           </div>
           <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-bold text-gray-700 transition-colors">
                 <Filter size={18} /> Filters
              </button>
              <button className="flex-1 md:flex-none px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl text-sm hover:bg-black transition-all">
                 Search
              </button>
           </div>
        </div>

        {/* Case Studies Grid */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Recent Case Studies</h2>
              <p className="text-gray-500 font-medium mt-1">Real-world results for global leaders.</p>
            </div>
            <Link href="#" className="hidden sm:flex items-center gap-2 text-sm font-black text-brand-primary hover:gap-3 transition-all">
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, idx) => (
              <CaseStudyCard key={study.id} study={study} index={idx} />
            ))}
          </div>
        </div>

        {/* Industry Reports Section */}
        <div className="bg-gray-50 rounded-[3rem] p-8 lg:p-16 border border-gray-100 mb-24">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-4 block">Free Resources</span>
                 <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">2026 Global Consumer Trends Report</h2>
                 <p className="text-gray-600 text-lg leading-relaxed mb-8 font-medium">
                    We surveyed 200,000+ panel members across 40 countries to identify the 5 foundational shifts in consumer behavior for the coming year.
                 </p>
                 <div className="space-y-4 mb-10">
                    {['Hyper-Personalization in Retail', 'The Rise of Async Commerce', 'Sustainability Verification'].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                         </div>
                         <span className="text-sm font-bold text-gray-700">{item}</span>
                      </div>
                    ))}
                 </div>
                 <button className="inline-flex items-center gap-2 px-10 py-4 bg-gray-900 text-white rounded-full font-black hover:bg-black transition-all shadow-xl shadow-gray-900/10">
                    <FileText size={20} /> Download Free PDF
                 </button>
              </div>
              <div className="relative">
                 <div className="aspect-[4/5] rounded-[2.5rem] bg-gradient-to-br from-brand-primary/20 to-violet-600/20 p-8 flex items-center justify-center">
                    <div className="w-full bg-white rounded-2xl shadow-2xl p-6 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                       <div className="h-4 bg-gray-100 rounded w-1/4 mb-4" />
                       <div className="h-24 bg-gray-50 rounded mb-4" />
                       <div className="space-y-2">
                          <div className="h-3 bg-gray-50 rounded" />
                          <div className="h-3 bg-gray-50 rounded" />
                          <div className="h-3 bg-gray-50 rounded w-3/4" />
                       </div>
                    </div>
                 </div>
                 {/* Decorative elements */}
                 <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-primary blur-[80px] opacity-20 -z-10" />
              </div>
           </div>
        </div>

        {/* Feature Stats for Research */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pb-32">
           {[
             { label: "Data Points", value: "2.4B+" },
             { label: "Weekly Surveys", value: "500k+" },
             { label: "Accuracy Rate", value: "99.9%" },
             { label: "Global Presence", value: "140+ Countries" }
           ].map((stat, i) => (
             <div key={i} className="text-center lg:text-left">
                <div className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</div>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
}
