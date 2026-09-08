import { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import PageHeader from "@/components/shared/PageHeader";
import { StackedVisual } from "@/components/shared/HeaderVisuals";
import { CONTACT_CONTENT } from "@/constants/site-content";
import { ContactInfoCards } from "@/components/marketing/contact-info-cards";

export const metadata: Metadata = {
  title: "Contact Us | InsightMatrix Research",
  description:
    "Have a question about our panel, need a feasibility estimate, or ready to launch a multi-market research project? Reach out to our global research team.",
  openGraph: {
    title: "Contact Us | InsightMatrix Research",
    description:
      "Get in touch with InsightMatrix Research for quotes, panel queries, and project feasibility.",
    url: "https://www.insightmatrix.online/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <PageHeader
        badge={CONTACT_CONTENT.header.badge}
        title={CONTACT_CONTENT.header.title}
        description={CONTACT_CONTENT.header.description}
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
          {/* Dynamic Contact Information Cards */}
          <ContactInfoCards />

          {/* Form Side */}
          <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-gray-100 flex flex-col gap-8 shadow-2xl shadow-gray-200/50">
            <div className="max-w-md">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">
                Send a message
              </h2>
              <p className="text-gray-500 font-medium">
                Complete the form below and the relevant department lead will reach out within 4
                business hours.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
