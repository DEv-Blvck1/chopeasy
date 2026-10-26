"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin, Globe2, Compass, ExternalLink, Sparkles,
  RefreshCw, CheckCircle2, AlertCircle, ArrowRight
} from "lucide-react";
import { FoodNewsItem } from "@/app/api/food-news/route";

export default function GlobalFoodNews() {
  const [news, setNews] = useState<FoodNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState<"ALL" | "NG" | "US" | "EU">("ALL");
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch news based on selected region
  const fetchNews = async (region: string) => {
    setLoading(true);
    try {
      const url = region === "ALL" ? "/api/food-news" : `/api/food-news?region=${region}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.articles) {
        setNews(data.articles);
      }
    } catch {
      setErrorMsg("Could not load food news. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(activeRegion);
  }, [activeRegion]);

  // Request browser geolocation to filter news strictly to user's location
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }

    setLocationStatus("requesting");
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationStatus("granted");

        try {
          // Free open reverse geocoding via OpenStreetMap Nominatim
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            const countryCode = geoData.address?.country_code?.toUpperCase() || "";
            const city = geoData.address?.city || geoData.address?.state || geoData.address?.country || "Your Area";
            const countryName = geoData.address?.country || "";

            setDetectedLocation(`${city}, ${countryName}`);

            // Automatically filter news to detected region
            if (countryCode === "NG" || countryName.toLowerCase().includes("nigeria")) {
              setActiveRegion("NG");
            } else if (countryCode === "US" || countryName.toLowerCase().includes("united states")) {
              setActiveRegion("US");
            } else if (["GB", "UK", "DE", "FR", "ES", "IT"].includes(countryCode) || countryName.toLowerCase().includes("europe")) {
              setActiveRegion("EU");
            } else {
              setActiveRegion("ALL");
            }
            return;
          }
        } catch {
          // Geocode fallback based on coordinates
        }

        // Coordinate approximation fallback
        // Nigeria roughly: lat 4-14, lon 2-15
        if (latitude >= 4 && latitude <= 14 && longitude >= 2 && longitude <= 15) {
          setDetectedLocation("West Africa (Nigeria Region)");
          setActiveRegion("NG");
        } else if (latitude >= 24 && latitude <= 50 && longitude >= -125 && longitude <= -66) {
          setDetectedLocation("North America");
          setActiveRegion("US");
        } else if (latitude >= 35 && latitude <= 70 && longitude >= -10 && longitude <= 40) {
          setDetectedLocation("Europe & UK");
          setActiveRegion("EU");
        } else {
          setDetectedLocation("Global Culinary Network");
          setActiveRegion("ALL");
        }
      },
      (err) => {
        setLocationStatus("denied");
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg("Location permission was denied. You can still select your region manually below.");
        } else {
          setErrorMsg("Unable to retrieve location. Please choose a region tab.");
        }
      },
      { timeout: 8000 }
    );
  };

  return (
    <section id="food-news" className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 border-t border-black/5 dark:border-white/10 bg-transparent dark:bg-[#060608] text-slate-900 dark:text-white w-full">
      <div className="w-full space-y-8">
        {/* Header & Geolocation Trigger */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-[11px] font-bold text-rose-600 dark:text-rose-300">
              <Globe2 size={13} className="text-rose-500 dark:text-rose-400" />
              <span>LIVE INDUSTRY DISPATCH</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
              Global Food & Hospitality News
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Stay ahead with real-time culinary trends, cloud kitchen insights, and food vendor market intelligence filtered to your region.
            </p>
          </div>

          {/* Location Trigger Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={handleRequestLocation}
              disabled={locationStatus === "requesting"}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-xs shadow-lg shadow-rose-950/60 border border-rose-400/30 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <MapPin size={15} className={locationStatus === "requesting" ? "animate-bounce text-rose-300" : "text-rose-300"} />
              {locationStatus === "requesting" ? "Detecting Location..." : "Filter News By My Location"}
            </button>

            {detectedLocation && (
              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 size={14} className="text-emerald-500 dark:text-emerald-400" />
                <span>📍 {detectedLocation}</span>
              </div>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
            <AlertCircle size={15} className="shrink-0 text-amber-500 dark:text-amber-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Region Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "ALL", label: "🌍 Global Food Feed", badge: "All" },
            { id: "NG", label: "🇳🇬 Nigeria & West Africa", badge: "Regional" },
            { id: "US", label: "🇺🇸 North America", badge: "Americas" },
            { id: "EU", label: "🇪🇺 Europe & UK", badge: "Europe" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveRegion(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                activeRegion === tab.id
                  ? "bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-md shadow-rose-950/50 border border-rose-400/40"
                  : "glass-btn text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeRegion === tab.id ? "bg-white/20 text-white" : "bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-400"
              }`}>
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-3xl glass-card-dark border border-black/5 dark:border-white/10 p-4 space-y-3 animate-pulse">
                <div className="w-full h-40 bg-black/5 dark:bg-white/10 rounded-2xl" />
                <div className="h-4 bg-black/5 dark:bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-black/5 dark:bg-white/10 rounded w-full" />
                <div className="h-3 bg-black/5 dark:bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((item) => (
              <article
                key={item.id}
                className="group rounded-3xl glass-card-dark border border-black/5 dark:border-white/10 shadow-lg hover:border-rose-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between text-slate-900 dark:text-white"
              >
                <div>
                  <div className="relative w-full h-44 overflow-hidden bg-slate-900">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 shadow-xs">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-xs">
                        {item.regionName}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{item.publishedAt}</span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl glass-btn text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Read Article</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

