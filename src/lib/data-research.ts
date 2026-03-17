export interface CaseStudy {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  client: string;
  duration: string;
  results: {
    label: string;
    value: string;
    iconName: string;
  }[];
  challenge: string;
  solution: string;
  fullStory: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "1",
    slug: "global-retailer-market-entry",
    category: "Market Entry",
    title: "How a Top Retailer Conquered the Asian Market",
    excerpt: "Discover the data-driven strategy that enabled a multi-billion dollar retailer to identify untapped urban demographics.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
    client: "RetailGlobal Inc.",
    duration: "6 Months",
    results: [
      { label: "Market Growth", value: "+45%", iconName: "TrendingUp" },
      { label: "New Users", value: "1.2M", iconName: "Target" },
      { label: "Efficiency", value: "3x", iconName: "Zap" },
    ],
    challenge: "The client wanted to expand into emerging Asian markets but lacked hyper-local demographic data to drive their store placement strategy.",
    solution: "We deployed target surveys across 15 major cities, collecting 50,000+ responses from verified panel members to map consumer behavior.",
    fullStory: "Our research revealed that the target audience valued convenience over price in early-morning hours. This insight led to a hub-and-spoke store model that maximized morning foot traffic..."
  },
  {
    id: "2",
    slug: "fintech-ux-optimization",
    category: "UX Research",
    title: "Optimizing the Future of Digital Payments",
    excerpt: "Using real-time feedback loops to reduce friction in high-stakes financial transactions for 5 million users.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
    client: "PayStream Ltd.",
    duration: "3 Months",
    results: [
      { label: "Churn Reduction", value: "22%", iconName: "PieChart" },
      { label: "App Rating", value: "4.8/5", iconName: "LineChart" },
      { label: "Task Speed", value: "+35%", iconName: "Zap" },
    ],
    challenge: "PayStream noticed a high drop-off rate during the KYC (Know Your Customer) process but didn't know where the friction was occurring.",
    solution: "We conducted unmoderated remote usability testing with 500 panel members, observing real interactions with the prototype.",
    fullStory: "The findings highlighted that users were confused by the photo upload requirements. By simplifying the UI and adding real-time guidance, onboarding completion skyrocketed..."
  },
  {
    id: "3",
    slug: "eco-brand-sustainability-audit",
    category: "Consumer Insights",
    title: "Sustainability: The New Consumer Preference",
    excerpt: "Helping a legacy FMCG brand pivot to eco-friendly packaging through deep consumer sentiment analysis.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
    client: "NatureFirst Group",
    duration: "4 Months",
    results: [
      { label: "Brand Equity", value: "+60%", iconName: "BarChart3" },
      { label: "Premium Sales", value: "+18%", iconName: "TrendingUp" },
      { label: "Loyalty Score", value: "92/100", iconName: "Target" },
    ],
    challenge: "NatureFirst needed to know if consumers were willing to pay a premium for 100% recycled packaging.",
    solution: "A longitudinal study tracking purchase intent across 12 product categories with a diverse age sample.",
    fullStory: "The data proved that Gen Z and Millennial consumers were not only willing to pay more but would switch brands entirely if sustainability claims were verified by third parties."
  }
];
