import Link from "next/link";
import { ArrowRight, BarChart2, Users, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-10 sm:pt-16 lg:pt-20">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-600 mb-4">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
                The leading global research platform
              </span>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl max-w-3xl">
                <span className="block xl:inline">Shape the future of</span>{" "}
                <span className="block text-indigo-600 xl:inline">products & services</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Join our premium community of participants. Share your insights, influence major brands, and earn meaningful rewards for your valuable time.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg transition-all"
                  >
                    Get Started Now
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    href="/about"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 md:py-4 md:text-lg transition-all"
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-gray-100 pt-8 sm:w-max sm:mx-auto lg:mx-0">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center text-gray-900 font-bold text-xl">
                    <Users className="text-indigo-500 mr-2" size={20} />
                    <span>2M+</span>
                  </div>
                  <span className="text-sm text-gray-500">Active Panelists</span>
                </div>
                <div className="flex flex-col items-center lg:items-start pl-4 border-l border-gray-100">
                  <div className="flex items-center text-gray-900 font-bold text-xl">
                    <BarChart2 className="text-indigo-500 mr-2" size={20} />
                    <span>10k+</span>
                  </div>
                  <span className="text-sm text-gray-500">Surveys</span>
                </div>
                <div className="flex flex-col items-center lg:items-start pl-4 border-l border-gray-100">
                  <div className="flex items-center text-gray-900 font-bold text-xl">
                    <ShieldCheck className="text-indigo-500 mr-2" size={20} />
                    <span>100%</span>
                  </div>
                  <span className="text-sm text-gray-500">Data Privacy</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50 flex items-center justify-center p-10 lg:p-0">
        <div className="relative w-full max-w-lg lg:max-w-none lg:w-full lg:h-full flex items-center justify-center">
            {/* Abstract visual representation replacing image */}
            <div className="w-full max-w-md aspect-square rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 relative">
              <div className="absolute top-1/4 left-10 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="absolute top-1/2 right-10 p-4 bg-white rounded-xl shadow-lg opacity-90 border border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">✓</div>
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-32 h-4 bg-indigo-100 rounded animate-pulse"></div>
              </div>
              <div className="absolute bottom-1/4 left-1/4 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="flex space-x-2">
                   <div className="w-4 h-12 bg-indigo-500 rounded-t"></div>
                   <div className="w-4 h-16 bg-indigo-400 rounded-t"></div>
                   <div className="w-4 h-8 bg-indigo-300 rounded-t"></div>
                   <div className="w-4 h-20 bg-indigo-600 rounded-t"></div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
