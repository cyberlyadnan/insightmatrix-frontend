import { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import { Mail, Phone, MapPin, BuildingIcon, Sparkles } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { StackedVisual } from "@/components/common/HeaderVisuals";

export const metadata: Metadata = {
  title: "Contact Us | InsightMatrix",
  description: "Get in touch with our team for sales inquiries, support, or partnership opportunities.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#fafafa] min-h-screen">
      <PageHeader 
        badge="Contact Our Global Team"
        title="We'd love to hear from you"
        description="Whether you have a strategic enterprise inquiry or need support with your account, our dedicated team is here to assist you."
        visual={
          <StackedVisual 
            image1="https://i.pravatar.cc/300?img=11" 
            image2="https://i.pravatar.cc/300?img=12" 
            image3="https://i.pravatar.cc/300?img=13" 
          />
        }
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Contact Information Cards */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Core contact points</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Mail, title: "Email", info: "sales@insightmatrix.com", info2: "help@insightmatrix.com", accent: "bg-brand-subtle text-brand-primary" },
                { icon: Phone, title: "Phone", info: "+1 (800) 555-0199", info2: "+1 (415) 555-0198", accent: "bg-violet-50 text-violet-600" },
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                  <div className={`w-14 h-14 rounded-2xl ${item.accent} flex items-center justify-center mb-6`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm mb-1">{item.info}</p>
                  <p className="text-gray-500 text-sm">{item.info2}</p>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-8 items-center lg:items-start group transition-all hover:shadow-xl">
               <div className="w-full sm:w-1/2">
                 <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-6">
                   <MapPin className="w-7 h-7" />
                 </div>
                 <h3 className="text-xl font-extrabold text-gray-900 mb-4">Our Headquarters</h3>
                 <p className="text-gray-500 leading-relaxed text-sm">
                   123 Data Point Avenue, Suite 800<br />
                   San Francisco, CA 94105, USA
                 </p>
               </div>
               <div className="w-full sm:w-1/2 h-44 bg-gray-50 rounded-2xl overflow-hidden relative border border-gray-100">
                 {/* Decorative Map Visual */}
                 <div className="absolute inset-0 bg-[#f8fafc] flex items-center justify-center">
                    <div className="relative">
                       <div className="w-10 h-10 bg-brand-primary rounded-full absolute -top-5 -left-5 animate-ping opacity-20" />
                       <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-brand-primary/40">
                          <MapPin className="text-white w-5 h-5" />
                       </div>
                    </div>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-white/80" />
                 <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <BuildingIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Silicon Valley HQ</span>
                 </div>
               </div>
            </div>

            {/* Support Highlight */}
            <div className="bg-gradient-to-br from-brand-primary to-brand-accent1 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-brand-primary/30 relative overflow-hidden">
               <Sparkles className="absolute -top-10 -right-10 w-40 h-40 opacity-20" />
               <div className="relative z-10">
                 <h3 className="text-2xl font-black mb-4">Enterprise scale?</h3>
                 <p className="text-white/80 font-medium mb-6 leading-relaxed">
                   Looking to integrate our data via API or need custom white-labeled panel management? Our enterprise team specializes in high-volume research global deployments.
                 </p>
                 <div className="flex items-center gap-3">
                   <div className="flex -space-x-3">
                     {[1,2,3].map(i => <img key={i} src={`https://i.pravatar.cc/80?img=${i+20}`} className="w-10 h-10 rounded-full border-2 border-brand-primary shadow-lg" />)}
                   </div>
                   <span className="text-sm font-bold">Experts standing by</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100 flex flex-col gap-8 shadow-2xl shadow-gray-200/50">
             <div className="max-w-md">
               <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Send a message</h2>
               <p className="text-gray-500 font-medium">Complete the form below and the relevant department lead will reach out within 4 business hours.</p>
             </div>
             <ContactForm />
          </div>

        </div>
      </div>
    </div>
  );
}
