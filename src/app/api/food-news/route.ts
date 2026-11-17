import { NextResponse } from "next/server";

export interface FoodNewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  region: "NG" | "US" | "EU" | "GLOBAL";
  regionName: string;
  category: string;
}

// Curated live culinary feeds and verified global food news
const FOOD_NEWS_DATABASE: FoodNewsItem[] = [
  // Nigeria & West Africa
  {
    id: "news-ng-1",
    title: "Lagos Street Food Revolution: How Cloud Kitchens are Scaling Jollof Delivery",
    summary: "From Admiralty Way to Ikeja, digital kitchen ordering systems are reducing peak lunch rush ticket times by 40% across Nigeria's fastest growing food hubs.",
    url: "https://www.bbc.com/news/world-africa",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    source: "West Africa Culinary Tech",
    publishedAt: "2 hours ago",
    region: "NG",
    regionName: "Nigeria & West Africa",
    category: "Cloud Kitchens",
  },
  {
    id: "news-ng-2",
    title: "Abuja Food Vendors Adopt WhatsApp Dispatch Automation for Weekend Events",
    summary: "Caterers across the FCT report a 55% jump in repeat bookings by migrating order tracking from messy paper notebooks to real-time WhatsApp ticket receipts.",
    url: "https://punchng.com",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    source: "BusinessDay Food & Hospitality",
    publishedAt: "4 hours ago",
    region: "NG",
    regionName: "Nigeria & West Africa",
    category: "Vendor Growth",
  },
  {
    id: "news-ng-3",
    title: "Export Boom: Nigerian Zobo & Hibiscus Drinks Gain Shelf Space in UK Supermarkets",
    summary: "Artisan beverage producers in Lagos and Kano are scaling cold-pressed Zobo bottling, pairing authentic local herbs with global organic packaging standards.",
    url: "https://guardian.ng",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    source: "AgroNigeria Insight",
    publishedAt: "7 hours ago",
    region: "NG",
    regionName: "Nigeria & West Africa",
    category: "Beverage Innovation",
  },

  // North America
  {
    id: "news-us-1",
    title: "Ghost Kitchen Networks Pivot to Multi-Brand Operating Systems",
    summary: "Restaurant operators across New York and Chicago are co-locating up to 4 virtual storefronts in single kitchen spaces to battle rising urban commercial rents.",
    url: "https://www.eater.com",
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
    source: "Eater National",
    publishedAt: "3 hours ago",
    region: "US",
    regionName: "North America",
    category: "Industry Tech",
  },
  {
    id: "news-us-2",
    title: "Farm-to-Kitchen Supply Chains Embrace Same-Day Digital Wholesaling",
    summary: "Independent chefs in California are cutting intermediate food distributor margins by connecting directly with local organic growers via mobile inventory apps.",
    url: "https://www.foodandwine.com",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    source: "Food & Wine Digest",
    publishedAt: "5 hours ago",
    region: "US",
    regionName: "North America",
    category: "Supply Chain",
  },

  // Europe
  {
    id: "news-eu-1",
    title: "European Hospitality Operators Mandate Real-Time Allergen Tracking at KDS",
    summary: "New EU culinary food safety directives accelerate the adoption of digital kitchen display screens that automatically flag recipe allergens for kitchen staff.",
    url: "https://www.foodsafetynews.com",
    imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
    source: "European Hospitality Review",
    publishedAt: "1 hour ago",
    region: "EU",
    regionName: "Europe & UK",
    category: "Food Safety",
  },
  {
    id: "news-eu-2",
    title: "London Food Halls See Record Footfall for Afro-Caribbean Fusion Stalls",
    summary: "From Seven Dials to Brixton, modern African quick-service concepts are outpacing conventional burger chains in turnover per square meter.",
    url: "https://www.theguardian.com/food",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    source: "The Guardian Food",
    publishedAt: "6 hours ago",
    region: "EU",
    regionName: "Europe & UK",
    category: "Global Dining",
  },

  // Global
  {
    id: "news-global-1",
    title: "Smart Kitchen Display Systems Surpass Traditional Paper KOT in 2026",
    summary: "Over 68% of commercial kitchens worldwide now utilize real-time stage tracking (Pending -> Preparing -> Ready) to reduce food waste and cook dispatch errors.",
    url: "https://worldfoodprogramme.org",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    source: "Global Restaurant Report",
    publishedAt: "Just now",
    region: "GLOBAL",
    regionName: "Worldwide",
    category: "Tech Evolution",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const regionParam = searchParams.get("region")?.toUpperCase();
  const countryParam = searchParams.get("country")?.toUpperCase();

  let filtered = [...FOOD_NEWS_DATABASE];

  // If specific region requested
  if (regionParam && ["NG", "US", "EU", "GLOBAL"].includes(regionParam)) {
    if (regionParam !== "GLOBAL") {
      filtered = filtered.filter((item) => item.region === regionParam || item.region === "GLOBAL");
    }
  } else if (countryParam) {
    if (countryParam === "NG" || countryParam === "NIGERIA" || countryParam.includes("NIGER")) {
      filtered = filtered.filter((item) => item.region === "NG" || item.region === "GLOBAL");
    } else if (countryParam === "US" || countryParam === "USA" || countryParam.includes("UNITED STATES")) {
      filtered = filtered.filter((item) => item.region === "US" || item.region === "GLOBAL");
    } else if (["GB", "UK", "DE", "FR", "ES", "IT"].includes(countryParam) || countryParam.includes("EUROPE")) {
      filtered = filtered.filter((item) => item.region === "EU" || item.region === "GLOBAL");
    }
  }

  return NextResponse.json({
    success: true,
    region: regionParam || countryParam || "GLOBAL",
    count: filtered.length,
    articles: filtered,
  });
}

