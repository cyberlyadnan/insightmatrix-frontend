import { Star, ArrowUpRight, Quote, ChevronRight } from "lucide-react";

interface CardProps {
  type: "case-study" | "testimonial" | "partnership" | "logo";
  title?: string;
  subtitle?: string;
  content?: string;
  author?: string;
  authorTitle?: string;
  logoText?: string;
  logoColor?: string;
  className?: string;
  rating?: number;
}

function Card({ type, title, subtitle, content, author, authorTitle, logoText, logoColor, className, rating }: CardProps) {
  return (
    <div className={`group rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full border border-gray-100 ${className}`}>
      {type === "logo" && (
        <div className="flex flex-col items-center justify-center flex-1 py-10">
          <span className={`text-4xl font-black tracking-tighter ${logoColor || "text-gray-900"}`}>
            {logoText}
          </span>
          {subtitle && <span className="mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">{subtitle}</span>}
        </div>
      )}

      {type === "case-study" && (
        <>
          <div className="mb-6 flex items-start justify-between">
            <span className={`text-3xl font-black tracking-tighter ${logoColor || "text-gray-900"}`}>{logoText}</span>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-primary group-hover:text-white transition-colors">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="relative">
            <Quote className="w-8 h-8 text-brand-primary opacity-20 absolute -top-4 -left-2" />
            <p className="text-[17px] font-bold text-gray-900 leading-snug mb-6 pl-4 italic">
              "{content}"
            </p>
          </div>
          <div className="mt-auto">
            <p className="text-sm font-bold text-gray-900">{author}</p>
            <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">{authorTitle}</p>
            <span className="inline-block mt-4 text-[10px] font-bold text-brand-primary uppercase tracking-widest">Case Study</span>
          </div>
        </>
      )}

      {type === "testimonial" && (
        <>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-subtle flex items-center justify-center text-brand-primary font-black text-lg">
              {author?.charAt(0)}
            </div>
            <div>
              <p className="font-extrabold text-gray-900 leading-tight">{author}</p>
              <p className="text-xs font-bold text-gray-400">{authorTitle}</p>
            </div>
          </div>
          <Quote className="w-6 h-6 text-gray-200 mb-2" />
          <p className="text-gray-600 text-base leading-relaxed mb-6 font-medium">
            {content}
          </p>
          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex gap-1">
              {[...Array(rating || 5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-green-400 text-green-400" />
              ))}
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Testimonial</span>
          </div>
        </>
      )}

      {type === "partnership" && (
        <>
          <div className="mb-8 p-3 rounded-2xl bg-gray-50 inline-block">
            <span className="text-xl font-black tracking-tighter flex items-center gap-2">
               <span className="w-8 h-8 rounded-lg bg-red-600 flex-shrink-0" />
               <span className="text-gray-900">{logoText}</span>
            </span>
          </div>
          <h4 className="text-xl font-extrabold text-gray-900 mb-4 leading-tight">
            {title}
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            {content}
          </p>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest px-3 py-1 bg-blue-50 rounded-full">Partnership</span>
            <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:text-white transition-all">
               <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function TrustedBy() {
  return (
    <section className="py-24 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Trusted by the world
          </h2>
          <p className="text-xl text-gray-500 leading-relaxed font-medium">
            InsightMatrix solutions help the world's most recognized brands, media owners and agencies 
            <span className="text-brand-primary"> research reality</span>, using the biggest, most connected proprietary panel.
          </p>
        </div>

        {/* 9 Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Havas Case Study */}
          <Card 
            type="case-study"
            logoText="HAVAS"
            logoColor="text-red-600"
            content="InsightMatrix has a global reach and connected data capabilities which has enabled us to integrate their data at a respondent level into our platform."
            author="Dan Hagen"
            authorTitle="Global Chief Data & Technology Officer, Havas Media Network"
            className="bg-white"
          />

          {/* Card 2: Testimonial Lisa */}
          <Card 
            type="testimonial"
            author="Lisa"
            authorTitle="Member of the Panel (US)"
            content="InsightMatrix surveys are interesting and informative. I have been a member for years and I enjoy participating in each survey that is conducted. Redeeming points is great!"
            rating={5}
            className="bg-white"
          />

          {/* Card 3: Cambridge Partnership */}
          <Card 
            type="partnership"
            logoText="CAMBRIDGE"
            title="The Center for Public Opinion Research"
            content="A joint research centre run by InsightMatrix and the University of Cambridge, promoting in-depth collaboration between pollsters and academic experts."
            className="bg-white"
          />

          {/* Card 4: TikTok Logo/Partner */}
          <Card 
            type="logo"
            logoText="TikTok"
            logoColor="text-black"
            subtitle="Engaging Young Audiences"
            className="bg-white"
          />

          {/* Card 5: Coca Cola Case Study */}
          <Card 
            type="case-study"
            logoText="Coca-Cola"
            logoColor="text-red-700"
            content="The real-time tracking of consumer sentiment allows us to adjust our marketing strategies in days, not months. The depth of insight is unparalleled."
            author="Sarah Chen"
            authorTitle="VP of Global Insights, Coca-Cola"
            className="bg-white"
          />

          {/* Card 6: Netflix Partnership */}
          <Card 
            type="partnership"
            logoText="NETFLIX"
            title="Entertainment Preference Insights"
            content="Collaborating on deep-dive studies to understand emerging viewing habits across 120+ international markets using proprietary demographic data."
            className="bg-white"
          />

          {/* Card 7: Testimonial James */}
          <Card 
            type="testimonial"
            author="James"
            authorTitle="Power User (UK)"
            content="I've used many survey apps but InsightMatrix is on another level. The UI is slick and the payouts are instant. Feel like my voice actually matters here."
            rating={5}
            className="bg-white"
          />

          {/* Card 8: WEF Partnership */}
          <Card 
            type="partnership"
            logoText="WEF"
            title="Global Risks Report Data"
            content="Providing crucial socio-economic data points and public opinion trends for the annual Global Risks Report produced by the World Economic Forum."
            className="bg-white"
          />

          {/* Card 9: Google Logo/Partner */}
          <Card 
            type="logo"
            logoText="Google"
            logoColor="text-gray-900"
            subtitle="Cloud Insight Integration"
            className="bg-white"
          />

        </div>

        {/* Bottom Logo Cloud (Simplified) */}
        <div className="mt-20 pt-10 border-t border-gray-100 flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all">
          <span className="text-xl font-bold tracking-tighter">NIKE</span>
          <span className="text-xl font-bold tracking-tighter">SAMSUNG</span>
          <span className="text-xl font-bold tracking-tighter">ADIDAS</span>
          <span className="text-xl font-bold tracking-tighter">SPOTIFY</span>
          <span className="text-xl font-bold tracking-tighter">SONY</span>
          <span className="text-xl font-bold tracking-tighter">L'ORÉAL</span>
        </div>
      </div>
    </section>
  );
}
