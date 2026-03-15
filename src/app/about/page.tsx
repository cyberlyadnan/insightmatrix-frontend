import { Metadata } from "next";
import { CheckCircle2, Target, Lightbulb, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | InsightMatrix",
  description: "Learn more about InsightMatrix, our mission, vision, and how we are transforming the survey research industry.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="bg-indigo-50 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 uppercase tracking-wide">About Us</h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Empowering Decisions Through Data
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            InsightMatrix is the bridge between leading global brands and the consumers who shape their future. We provide high-quality, actionable insights through our premium research panel.
          </p>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-indigo-600 mr-3" />
                <h3 className="text-3xl font-bold tracking-tight text-gray-900">Our Mission</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed shadow-sm p-6 bg-gray-50 border-l-4 border-indigo-500 rounded-r-xl">
                To democratize market research by providing a transparent, rewarding platform for participants while delivering unparalleled data accuracy and speed to researchers worldwide.
              </p>
            </div>
            <div>
              <div className="flex items-center mb-6">
                <Lightbulb className="h-8 w-8 text-indigo-600 mr-3" />
                <h3 className="text-3xl font-bold tracking-tight text-gray-900">Our Vision</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed shadow-sm p-6 bg-gray-50 border-l-4 border-indigo-500 rounded-r-xl">
                To become the global standard for ethical data collection, where every opinion is valued, protected, and utilized to create better products and services for tomorrow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works / The Platform */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">The Platform</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Connecting participants and researchers
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              InsightMatrix utilizes advanced matching algorithms to pair the right surveys with the right participants, ensuring optimal results and compensation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Users className="text-indigo-600 w-8 h-8"/>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Community First</h4>
                <p className="text-gray-500">We prioritize the user experience, offering intuitive interfaces, fair compensation, and strict privacy controls.</p>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 className="text-indigo-600 w-8 h-8"/>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Data Integrity</h4>
                <p className="text-gray-500">Our multi-layered quality assurance mechanisms ensure researchers receive only authenticated, reliable responses.</p>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Target className="text-indigo-600 w-8 h-8"/>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Global Reach</h4>
                <p className="text-gray-500">With support for over 120 countries, our platform breaks down geographical barriers in market research.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Why Companies Use InsightMatrix */}
      <div className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
             <div className="mb-12 lg:mb-0">
               <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                 Why industry leaders choose us
               </h2>
               <p className="mt-4 text-lg text-gray-500">
                 From Fortune 500 corporations to agile startups, companies trust InsightMatrix to deliver the critical data required for high-stakes decision making.
               </p>
               <div className="mt-8 space-y-4">
                 {[
                   "Access to hard-to-reach B2B and consumer audiences",
                   "Industry-leading response rates and rapid turnaround times",
                   "Advanced fraud detection and bot mitigation",
                   "Comprehensive programmatic API integration",
                   "Dedicated support and custom panel creation"
                 ].map((item, i) => (
                   <div key={i} className="flex items-center text-gray-700">
                     <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                     <span>{item}</span>
                   </div>
                 ))}
               </div>
             </div>
             <div className="relative">
                <div className="aspect-[4/3] rounded-2xl bg-indigo-50 border border-gray-100 shadow-lg p-8 flex flex-col justify-center items-center overflow-hidden">
                   <div className="absolute grid grid-cols-4 gap-4 opacity-10 blur-sm w-full h-full transform scale-150 rotate-12">
                      <div className="bg-indigo-500 h-32 rounded-lg"></div><div className="bg-indigo-500 h-64 rounded-lg"></div><div className="bg-indigo-500 h-24 rounded-lg"></div><div className="bg-indigo-500 h-48 rounded-lg"></div>
                      <div className="bg-indigo-500 h-64 rounded-lg"></div><div className="bg-indigo-500 h-24 rounded-lg"></div><div className="bg-indigo-500 h-48 rounded-lg"></div><div className="bg-indigo-500 h-32 rounded-lg"></div>
                   </div>
                   <div className="relative z-10 text-center bg-white/90 backdrop-blur-sm p-8 rounded-xl border border-white/20 shadow-xl">
                      <p className="text-5xl font-extrabold text-indigo-600 mb-4">99.9%</p>
                      <p className="text-xl font-bold text-gray-900">Data Accuracy Rating</p>
                      <p className="text-sm text-gray-500 mt-2">Independently verified by third-party auditors</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
