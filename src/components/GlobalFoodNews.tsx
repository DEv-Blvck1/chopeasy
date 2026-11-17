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
    <section id="food-news" className="py-16 sm:py-24 px-4 sm:px-8 border-t border-slate-100 bg-gradient-to-b from-transparent to-amber-50/20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Geolocation Trigger */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-[11px] font-bold text-rose-600">
              <Globe2 size={13} />
              <span>LIVE INDUSTRY DISPATCH</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
              Global Food & Hospitality News
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Stay ahead with real-time culinary trends, cloud kitchen insights, and food vendor market intelligence filtered to your region.
            </p>
          </div>

          {/* Location Trigger Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={handleRequestLocation}
              disabled={locationStatus === "requesting"}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <MapPin size={15} className={locationStatus === "requesting" ? "animate-bounce text-amber-400" : "text-amber-400"} />
              {locationStatus === "requesting" ? "Detecting Location..." : "Filter News By My Location"}
            </button>

            {detectedLocation && (
              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>📍 {detectedLocation}</span>
              </div>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-800">
            <AlertCircle size={15} className="shrink-0 text-amber-600" />
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
                  ? "bg-rose-600 text-white shadow-sm shadow-rose-600/30"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeRegion === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
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
              <div key={n} className="rounded-3xl bg-white border border-slate-100 p-4 space-y-3 animate-pulse">
                <div className="w-full h-40 bg-slate-200 rounded-2xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((item) => (
              <article
                key={item.id}
                className="group rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full h-44 overflow-hidden bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-white shadow-xs">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold shadow-xs">
                        {item.regionName}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-rose-600">{item.source}</span>
                      <span>{item.publishedAt}</span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-100/80">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    <span>Read Full Story</span>
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

