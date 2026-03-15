import { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import { Mail, Phone, MapPin, BuildingIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | InsightMatrix",
  description: "Get in touch with our team for sales inquiries, support, or partnership opportunities.",
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-indigo-700 py-24 px-6 lg:px-8 text-center text-white relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-indigo-800 to-transparent"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Get in touch
          </h1>
          <p className="text-xl text-indigo-100">
            Whether you have a strategic enterprise inquiry or need support with your account, our dedicated team is here to assist you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Contact Info & Map */}
          <div className="flex flex-col space-y-12 bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                    <Mail className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <p className="mt-1 text-gray-500">Sales: sales@insightmatrix.com</p>
                    <p className="text-gray-500">Support: help@insightmatrix.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                    <Phone className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                    <p className="mt-1 text-gray-500">Toll-free: +1 (800) 555-0199</p>
                    <p className="text-gray-500">International: +1 (415) 555-0198</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                    <MapPin className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-medium text-gray-900">Global Headquarters</h3>
                    <p className="mt-1 text-gray-500">
                      123 Data Point Avenue<br />
                      Suite 800<br />
                      San Francisco, CA 94105<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                 <BuildingIcon className="w-5 h-5 mr-2 text-indigo-600"/> View on Map
              </h3>
              <div className="w-full h-64 bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center relative overflow-hidden group">
                 {/* Abstract map pattern */}
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-300 via-gray-100 to-gray-100 bg-[length:20px_20px]"></div>
                 
                 <div className="relative z-10 flex flex-col items-center group-hover:scale-105 transition-transform">
                   <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 mb-3 animate-bounce">
                     <MapPin className="text-white h-6 w-6" />
                   </div>
                   <div className="bg-white px-4 py-2 rounded-lg shadow-md border border-gray-100 font-medium text-gray-900 text-sm">
                      San Francisco HQ
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-3xl p-1 lg:p-0 border border-transparent lg:bg-transparent lg:border-none">
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  );
}
