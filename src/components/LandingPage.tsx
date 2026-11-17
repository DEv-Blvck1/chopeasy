"use client";

import React, { useState } from "react";
import {
  ShoppingBag, Flame, Clock, ArrowRight, CheckCircle2,
  TrendingUp, ShieldCheck, MessageCircle, Footprints,
  Phone, Star, Sparkles, ChefHat, Store, ChevronRight,
  Package, DollarSign, Users, Award, Play, Search, MapPin,
  Heart, Tag
} from "lucide-react";
import ChopEasyLogo from "./ChopEasyLogo";
import SteamingFoodPlate from "./SteamingFoodPlate";
import SmokyBackground from "./SmokyBackground";
import PricingSection from "./PricingSection";
import GlobalFoodNews from "./GlobalFoodNews";
import { UserSession } from "./AuthModal";

interface LandingPageProps {
  onEnterDashboard: () => void;
  onOpenAuth: (mode: "login" | "register") => void;
  onOpenTerms: () => void;
  currentUser: UserSession | null;
}

export default function LandingPage({
  onEnterDashboard,
  onOpenAuth,
  onOpenTerms,
  currentUser,
}: LandingPageProps) {
  const [selectedDemoTab, setSelectedDemoTab] = useState<"intake" | "kitchen" | "analytics">("kitchen");
  const [selectedCity, setSelectedCity] = useState("Lagos, Nigeria");
  const [heroSearch, setHeroSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All", emoji: "🍽️" },
    { id: "rice", label: "Rice", emoji: "🍚" },
    { id: "soup", label: "Soups", emoji: "🍲" },
    { id: "swallow", label: "Swallows", emoji: "⚪" },
    { id: "protein", label: "Proteins", emoji: "🍗" },
    { id: "snack", label: "Small Chops", emoji: "🍢" },
    { id: "drink", label: "Beverages", emoji: "🍹" },
    { id: "healthy", label: "Specials", emoji: "🥗" },
  ];

  return (
    <div className="min-h-screen app-wallpaper text-slate-900 flex flex-col selection:bg-rose-500 selection:text-white w-full overflow-x-hidden">
      {/* ── TOP NAVIGATION (FULL-WIDTH) ── */}
      <nav className="sticky top-0 z-50 glass-header px-4 sm:px-8 lg:px-12 xl:px-16 py-3.5 transition-all">
        <div className="w-full flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <ChopEasyLogo size="md" />
          </div>

          <div className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a href="#features" className="hover:text-rose-600 transition-colors">Features</a>
            <a href="#pipeline" className="hover:text-rose-600 transition-colors">Kitchen Flow</a>
            <a href="#menu-showcase" className="hover:text-rose-600 transition-colors">Menu Catalog</a>
            <a href="#pricing" className="hover:text-rose-600 transition-colors font-extrabold text-rose-600">Pricing</a>
            <a href="#food-news" className="hover:text-rose-600 transition-colors">Global News</a>
            <a href="#testimonials" className="hover:text-rose-600 transition-colors">Testimonials</a>
          </div>

          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <button
                onClick={onEnterDashboard}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/25 hover:from-rose-700 hover:to-amber-600 transition-all cursor-pointer"
              >
                <span>Go to Kitchen Dashboard</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth("login")}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth("register")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/25 hover:from-rose-700 hover:to-amber-600 transition-all cursor-pointer"
                >
                  <span>Launch Free</span>
                  <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION (CONCEPT INSPIRED BY SCREENSHOT WITH SMOKY ANIMATION) ── */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 overflow-hidden bg-gradient-to-b from-[#070b14] via-[#0d1424] to-[#121b2d] text-white">
        {/* Animated Smoky Mist & Embers Background */}
        <SmokyBackground intensity="deep" showEmbers={true} className="opacity-80" />

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Column: Headline, Search & Filters */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-bold shadow-sm">
              <span className="text-amber-400 font-extrabold uppercase tracking-widest text-[10px]">
                DELICIOUS FOOD FOR A BETTER YOU
              </span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl text-white leading-[1.08] tracking-tight">
              Good Food Great{" "}
              <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 bg-clip-text text-transparent">
                Mood
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Fresh authentic ingredients. Delicious flavors. Delivered with real-time kitchen dispatch speed across WhatsApp, walk-ins, and online orders.
            </p>

            {/* Interactive Search & Location Bar (Matching Concept from Screenshot) */}
            <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl max-w-2xl mx-auto lg:mx-0 flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 w-full sm:flex-1">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search dishes, jollof, egusi, chicken..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Location Picker */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-white/10 rounded-xl border border-white/15 w-full sm:w-auto shrink-0">
                <MapPin size={14} className="text-amber-400" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  <option value="Lagos, Nigeria" className="bg-slate-900 text-white">Lagos, NG</option>
                  <option value="Abuja, Nigeria" className="bg-slate-900 text-white">Abuja, NG</option>
                  <option value="Port Harcourt, Nigeria" className="bg-slate-900 text-white">Port Harcourt, NG</option>
                  <option value="London, UK" className="bg-slate-900 text-white">London, UK</option>
                  <option value="New York, USA" className="bg-slate-900 text-white">New York, US</option>
                  <option value="Global Kitchens" className="bg-slate-900 text-white">Global</option>
                </select>
              </div>

              {/* Action Button */}
              <button
                onClick={onEnterDashboard}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-black text-xs sm:text-sm shadow-lg hover:from-amber-600 hover:to-rose-700 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Find Food</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Popular Fast Tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-bold">Popular:</span>
              {["Jollof Rice", "Egusi Soup", "Pounded Yam", "Full Chicken", "Small Chops", "Zobo"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setHeroSearch(tag)}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[11px] font-semibold border border-white/10 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
              <button
                onClick={onEnterDashboard}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-sm shadow-xl shadow-rose-500/25 hover:from-rose-700 hover:to-amber-600 active:scale-95 transition-all cursor-pointer"
              >
                <ChefHat size={18} />
                <span>Open Live Kitchen Dashboard</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => onOpenAuth("register")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/15 border border-white/25 text-white font-bold text-sm hover:bg-white/25 shadow-sm transition-all cursor-pointer"
              >
                <span>Create Free Account</span>
              </button>
            </div>

            {/* Social Proof Stats Bar */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="font-display font-black text-2xl text-white">₦45M+</p>
                <p className="text-[11px] text-slate-400 font-medium">Orders Processed</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl text-white">99.9%</p>
                <p className="text-[11px] text-slate-400 font-medium">Kitchen Uptime</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl text-white">0% Cut</p>
                <p className="text-[11px] text-slate-400 font-medium">Direct Sales Fees</p>
              </div>
            </div>
          </div>

          {/* Right Column: Sizzling Food Plate with Animated Smoke Plumes */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-amber-500/20 to-rose-600/20 blur-3xl pointer-events-none" />
            <div className="relative w-full max-w-[500px]">
              <SteamingFoodPlate interactive={true} showBadges={true} />
            </div>
          </div>
        </div>
      </section>

      {/* ── CIRCULAR CATEGORIES STRIP (FULL-WIDTH CONCEPT FROM SCREENSHOT) ── */}
      <section className="py-8 px-4 sm:px-8 lg:px-12 xl:px-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="w-full flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl transition-all shadow-xs ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-tr from-rose-600 to-amber-500 text-white ring-4 ring-rose-500/25 scale-105 shadow-md"
                    : "bg-white border-2 border-slate-200 text-slate-700 hover:border-amber-400 group-hover:scale-105"
                }`}
              >
                {cat.emoji}
              </div>
              <span
                className={`text-xs font-bold transition-colors ${
                  activeCategory === cat.id ? "text-rose-600 font-black" : "text-slate-600"
                }`}
              >
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── FEATURED DISHES CATALOG (FULL-WIDTH GRID) ── */}
      <section id="menu-showcase" className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-slate-950 text-white relative overflow-hidden">
        <SmokyBackground intensity="medium" showEmbers={true} className="opacity-50" />

        <div className="w-full space-y-10 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                HANDPICKED KITCHEN SPECIALS
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-1">
                Featured Dishes
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Authentic West African staples cooked fresh and dispatched in under 15 minutes.
              </p>
            </div>
            <button
              onClick={onEnterDashboard}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-xs shadow-md hover:from-rose-700 hover:to-amber-600 transition-all self-start sm:self-auto cursor-pointer"
            >
              Test Menu In App →
            </button>
          </div>

          {/* 6 Real Food Photo Cards Across the Full Screen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            {[
              { name: "Jollof Rice", cat: "Rice", price: "₦800", rating: "4.8 (2.3k)", image: "/images/dishes/jollof-rice.png" },
              { name: "Egusi Soup", cat: "Soup", price: "₦600", rating: "4.9 (1.8k)", image: "/images/dishes/egusi-soup.png" },
              { name: "Pounded Yam", cat: "Swallow", price: "₦300", rating: "4.7 (980)", image: "/images/dishes/pounded-yam.png" },
              { name: "Full Chicken", cat: "Protein", price: "₦1,800", rating: "4.9 (3.1k)", image: "/images/dishes/full-chicken.png" },
              { name: "Small Chops", cat: "Snack", price: "₦2,500", rating: "4.9 (4.2k)", image: "/images/dishes/small-chops.png" },
              { name: "Chilled Zobo", cat: "Drink", price: "₦300", rating: "4.8 (1.5k)", image: "/images/dishes/chilled-zobo.png" },
            ].map((dish) => (
              <div
                key={dish.name}
                className="group p-3 rounded-3xl bg-[#0f172a]/90 backdrop-blur-md border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800/80 mb-3 relative">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-white shadow-xs">
                        {dish.cat}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-white truncate">{dish.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                      <Star size={12} fill="#f59e0b" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10">
                  <span className="text-sm font-mono font-black text-amber-400">{dish.price}</span>
                  <button
                    onClick={onEnterDashboard}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-xs shadow-xs hover:from-rose-700 hover:to-amber-600 transition-all cursor-pointer"
                  >
                    Add +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIAL OFFER BANNER (INSPIRED BY SCREENSHOT) ── */}
      <section className="py-10 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl relative overflow-hidden">
          <SmokyBackground intensity="light" showEmbers={true} className="opacity-40" />

          <div className="relative z-10 space-y-3 text-center md:text-left max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest">
              SPECIAL KITCHEN OFFER
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
              Flat 20% OFF On Kitchen Catering & Bulk Prep
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Good food, happier days. Automate bulk WhatsApp orders and party platters with 1-click dispatch.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 font-mono text-xs font-bold text-amber-300">
                Use Code: CHOPEASY20
              </div>
              <button
                onClick={onEnterDashboard}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-xs shadow-lg hover:from-amber-600 hover:to-rose-700 transition-all cursor-pointer"
              >
                Order Now →
              </button>
            </div>
          </div>

          <div className="w-56 sm:w-72 h-36 sm:h-44 rounded-3xl overflow-hidden shrink-0 border-2 border-white/20 shadow-2xl relative">
            <img
              src="/images/dishes/full-chicken.png"
              alt="Feast"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE CHOPEASY? (FULL-WIDTH 4-COL ROW FROM SCREENSHOT) ── */}
      <section className="py-12 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 border-t border-slate-200/80 bg-white/60">
        <div className="w-full space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
              Why Choose ChopEasy?
            </h2>
            <p className="text-xs text-slate-500">More than just food, we deliver kitchen happiness.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "⚡",
                title: "Fast WhatsApp Dispatch",
                desc: "Turn messy WhatsApp chats into clean digital kitchen tickets in 1 tap.",
                color: "bg-rose-50 text-rose-600",
              },
              {
                icon: "🌿",
                title: "Fresh Inventory Control",
                desc: "Mark sold-out dishes instantly to avoid customer complaints during peak rush.",
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                icon: "👨‍🍳",
                title: "Kitchen Display System",
                desc: "Stage tracking (Pending -> Preparing -> Ready -> Delivered) eliminates cook chaos.",
                color: "bg-amber-50 text-amber-600",
              },
              {
                icon: "🛡️",
                title: "Zero Commission Fees",
                desc: "Keep 100% of your earnings. Direct payments in Naira, Dollar, or Euro.",
                color: "bg-blue-50 text-blue-600",
              },
            ].map((prop) => (
              <div
                key={prop.title}
                className="glass-panel rounded-3xl p-6 text-center space-y-3 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-xs bg-slate-50">
                  {prop.icon}
                </div>
                <h3 className="font-display font-bold text-base text-slate-900">{prop.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3-TIER PRICING SECTION (FULL-WIDTH) ── */}
      <PricingSection
        onSelectPlan={(plan) => {
          if (plan === "free") {
            onOpenAuth("register");
          } else {
            onEnterDashboard();
          }
        }}
      />

      {/* ── LOCATION-BASED GLOBAL FOOD & HOSPITALITY NEWS (FULL-WIDTH) ── */}
      <GlobalFoodNews />

      {/* ── TESTIMONIALS (FULL-WIDTH) ── */}
      <section id="testimonials" className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 border-t border-slate-200/80">
        <div className="w-full space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              What Our Kitchens Say
            </h2>
            <p className="text-xs text-slate-500">From bustling bukkas to high-volume caterers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Before ChopEasy, we missed 4 to 5 WhatsApp orders every weekend rush. Now everything lands on one screen and we mark orders ready with one tap.",
                author: "Chef Amara Nwosu",
                role: "Founder, Amara's Kitchen Lekki",
              },
              {
                quote: "The ability to toggle dishes as 'Sold Out' instantly saved us from customer complaints. Our cook dispatch speed improved by 35%.",
                author: "Tunde Oladipo",
                role: "Manager, Bukka Express Abuja",
              },
              {
                quote: "Having today's revenue and average order size visible on mobile keeps our team motivated during lunch rushes.",
                author: "Blessing Eze",
                role: "Head Chef, Golden Pots Caterers",
              },
            ].map((t) => (
              <div key={t.author} className="glass-panel rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-xs text-slate-900">{t.author}</p>
                  <p className="text-[11px] text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER (FULL-WIDTH) ── */}
      <section className="py-12 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full rounded-3xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white p-8 sm:p-12 text-center space-y-6 shadow-2xl shadow-rose-500/20">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white max-w-xl mx-auto">
            Ready to organize your food business?
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 max-w-md mx-auto">
            Join hundreds of kitchen managers tracking orders in real-time. Start free in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-lg hover:bg-slate-100 transition-all cursor-pointer"
            >
              Open Kitchen Dashboard
            </button>
            <button
              onClick={() => onOpenAuth("register")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-extrabold text-sm hover:bg-slate-800 transition-all cursor-pointer"
            >
              Register New Kitchen
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER (FULL-WIDTH) ── */}
      <footer className="mt-auto border-t border-slate-200/60 bg-white/70 backdrop-blur-md py-8 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 text-xs text-slate-500">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <ChopEasyLogo size="sm" />
          <div className="flex items-center gap-6">
            <button onClick={onOpenTerms} className="hover:text-rose-600 transition-colors cursor-pointer">Terms of Use</button>
            <button onClick={onOpenTerms} className="hover:text-rose-600 transition-colors cursor-pointer">Privacy Policy</button>
            <button onClick={onEnterDashboard} className="hover:text-rose-600 transition-colors font-bold text-slate-700 cursor-pointer">Dashboard</button>
          </div>
          <p suppressHydrationWarning>© {new Date().getFullYear()} ChopEasy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
