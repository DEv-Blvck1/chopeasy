"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag, Flame, Clock, ArrowRight, CheckCircle2,
  TrendingUp, ShieldCheck, MessageCircle, Footprints,
  Phone, Star, Sparkles, ChefHat, Store, ChevronRight,
  ChevronLeft, Package, DollarSign, Users, Award, Play, Search, MapPin,
  Heart, Tag, Check, ArrowUpRight
} from "lucide-react";
import ChopEasyLogo from "./ChopEasyLogo";
import SteamingFoodPlate from "./SteamingFoodPlate";
import SmokyBackground from "./SmokyBackground";
import PricingSection from "./PricingSection";
import GlobalFoodNews from "./GlobalFoodNews";
import ThemeToggle from "./ThemeToggle";
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
  const [selectedCity, setSelectedCity] = useState("Lagos, Nigeria");
  const [heroSearch, setHeroSearch] = useState("");
  const [heroTab, setHeroTab] = useState<"kds" | "whatsapp" | "inventory" | "dispatch">("kds");

  // Why Choose ChopEasy Carousel State
  const [whySlide, setWhySlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  const whyFeatures = [
    {
      icon: "⚡",
      title: "Fast WhatsApp Dispatch",
      tag: "1-Tap Sync",
      desc: "Turn messy WhatsApp chats into clean digital kitchen tickets in 1 tap. Never lose customer order requests or custom spice preferences.",
      highlight: "Over 85,000+ tickets generated without pen & paper.",
      badge: "Instant Intake",
      gradient: "from-rose-600/30 to-red-900/40",
      accent: "text-rose-400",
    },
    {
      icon: "🌿",
      title: "Fresh Inventory Control",
      tag: "Live Stock",
      desc: "Mark sold-out dishes instantly to avoid customer complaints during peak rush. Syncs live with your public menu and kitchen display.",
      highlight: "Zero awkward calls apologizing for finished jollof rice.",
      badge: "Stock Protection",
      gradient: "from-emerald-600/30 to-teal-900/40",
      accent: "text-emerald-400",
    },
    {
      icon: "👨‍🍳",
      title: "Kitchen Display System",
      tag: "Live Pipeline",
      desc: "Stage tracking (Pending ➔ Preparing ➔ Ready ➔ Delivered) eliminates cook chaos and keeps line cooks & dispatchers in sync.",
      highlight: "Reduces kitchen ticket prep turnaround by 42%.",
      badge: "Zero Kitchen Chaos",
      gradient: "from-amber-600/30 to-orange-900/40",
      accent: "text-amber-400",
    },
    {
      icon: "🛡️",
      title: "Zero Commission Fees",
      tag: "100% Earnings",
      desc: "Keep 100% of your hard-earned revenue. Direct customer payments in Naira, Dollar, or Euro with zero 20% aggregator cuts.",
      highlight: "Direct bank settlements with bank-grade safety.",
      badge: "Pure Profit",
      gradient: "from-blue-600/30 to-indigo-900/40",
      accent: "text-blue-400",
    },
  ];

  // Auto-advance Why Choose ChopEasy carousel
  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(() => {
      setWhySlide((prev) => (prev + 1) % whyFeatures.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isCarouselPaused, whyFeatures.length]);

  const nextSlide = () => {
    setWhySlide((prev) => (prev + 1) % whyFeatures.length);
  };

  const prevSlide = () => {
    setWhySlide((prev) => (prev - 1 + whyFeatures.length) % whyFeatures.length);
  };

  return (
    <div className="min-h-screen app-wallpaper text-slate-900 dark:text-white flex flex-col selection:bg-rose-600 selection:text-white w-full overflow-x-hidden font-sans">
      {/* ── TOP NAVIGATION (FULL-WIDTH RED & BLACK GLASS HEADER) ── */}
      <nav className="sticky top-0 z-50 glass-header px-4 sm:px-8 lg:px-12 xl:px-16 py-3 transition-all border-b border-black/5 dark:border-white/10 backdrop-blur-2xl">
        <div className="w-full flex items-center justify-between">
          <div className="cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <ChopEasyLogo size="md" />
          </div>

          <div className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="px-3.5 py-1.5 rounded-full border border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white flex items-center gap-1.5 shadow-sm hover:border-black/20 dark:hover:border-white/30 transition-all"
            >
              <span>⌂</span>
              <span>Home</span>
            </a>
            <a href="#features" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-200">Features</a>
            <a href="#pipeline" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-200">Kitchen Flow</a>
            <a href="#menu-showcase" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-200">Menu Catalog</a>
            <a href="#why-choose" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-200">Why ChopEasy</a>
            <a href="#pricing" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-200 font-black text-rose-600 dark:text-rose-500">Pricing</a>
            <a href="#food-news" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-200">Global News</a>
            <a href="#testimonials" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-200">Testimonials</a>
          </div>

          <div className="flex items-center gap-3">
            {/* Top Right Corner Light/Dark Theme Switcher */}
            <ThemeToggle showLabel={true} />

            {currentUser ? (
              <button
                onClick={onEnterDashboard}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-rose-950/60 hover:shadow-rose-600/40 hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer border border-white/20"
              >
                <span>Go to Kitchen Dashboard</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth("login")}
                  className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white glass-btn transition-all duration-200 cursor-pointer active:scale-95"
                >
                  Sign In
                </button>
                <button
                  onClick={onEnterDashboard}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-rose-950/60 hover:shadow-rose-600/40 hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer border border-white/20"
                >
                  <span>Go to Kitchen Dashboard</span>
                  <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION (RED & BLACK LUXURY THEME MATCHING EXACT DESIGN REFERENCE) ── */}
      <section className="relative pt-10 pb-16 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 overflow-hidden bg-gradient-to-b from-[#060608] via-[#090910] to-[#060608] text-white border-b border-white/10">
        {/* Animated Smoky Mist & Embers Background */}
        <SmokyBackground intensity="deep" showEmbers={true} className="opacity-60" />

        {/* Ambient Crimson Glow Gradients */}
        <div className="absolute top-0 right-1/4 w-[550px] h-[550px] bg-rose-600/18 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-6 left-10 w-[450px] h-[450px] bg-red-700/15 rounded-full blur-[110px] pointer-events-none" />

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          {/* Left Column: Headline, 3 Cards + Wide Card, Search & Actions */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-bold shadow-md shadow-rose-950/40">
              <span className="text-amber-400 text-xs">⚡</span>
              <span className="font-extrabold uppercase tracking-wider text-[11px] text-rose-200">
                BUILT FOR HIGH-VELOCITY RESTAURANTS & FOOD VENDORS
              </span>
            </div>

            {/* Headline with Mood gradient + smile doodle */}
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.08] tracking-tight">
              Good Food Great{" "}
              <span className="relative inline-block bg-gradient-to-r from-rose-500 via-red-500 to-amber-400 bg-clip-text text-transparent">
                Mood
                {/* Curved underline smile accent matching screenshot */}
                <svg
                  className="absolute -bottom-2 left-0 w-full overflow-visible"
                  height="12"
                  viewBox="0 0 120 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9C35 2 85 2 117 9"
                    stroke="url(#mood-smile-grad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="mood-smile-grad" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#f43f5e" />
                      <stop offset="0.5" stopColor="#ef4444" />
                      <stop offset="1" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Turn chaotic WhatsApp orders, counter walk-ins, and online tickets into clean, color-coded kitchen displays with 1-tap dispatch speed.
            </p>

            {/* ── 3 INTERACTIVE FEATURE CARDS (MATCHING REFERENCE EXACTLY) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {/* Card 1: Kitchen Display (KDS) */}
              <button
                onClick={() => setHeroTab("kds")}
                className={`text-left p-3 rounded-2xl transition-all duration-300 flex items-center justify-between gap-2.5 cursor-pointer border ${
                  heroTab === "kds"
                    ? "bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 border-rose-400/80 text-white shadow-xl shadow-rose-950/80 animate-glow-red scale-[1.02]"
                    : "glass-card-dark border-white/10 hover:border-rose-500/40 text-slate-200 hover:bg-white/[0.08]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    heroTab === "kds" ? "bg-white/20 text-white" : "bg-rose-500/20 text-rose-400"
                  }`}>
                    <span className="text-sm">🖥️</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-xs text-white truncate">Kitchen Display (KDS)</p>
                    <p className={`text-[10px] truncate ${heroTab === "kds" ? "text-rose-100" : "text-slate-400"}`}>
                      Real-time • Color-coded • 1-tap
                    </p>
                  </div>
                </div>
                <ChevronRight size={14} className={heroTab === "kds" ? "text-white" : "text-slate-500"} />
              </button>

              {/* Card 2: 1-Tap WhatsApp */}
              <button
                onClick={() => setHeroTab("whatsapp")}
                className={`text-left p-3 rounded-2xl transition-all duration-300 flex items-center justify-between gap-2.5 cursor-pointer border ${
                  heroTab === "whatsapp"
                    ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 border-emerald-400/80 text-white shadow-xl shadow-emerald-950/80 scale-[1.02]"
                    : "glass-card-dark border-white/10 hover:border-emerald-500/40 text-slate-200 hover:bg-white/[0.08]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    heroTab === "whatsapp" ? "bg-white/20 text-white" : "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    <span className="text-sm">💬</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-xs text-white truncate">1-Tap WhatsApp</p>
                    <p className={`text-[10px] truncate ${heroTab === "whatsapp" ? "text-emerald-100" : "text-slate-400"}`}>
                      Auto-notify customers
                    </p>
                  </div>
                </div>
                <ChevronRight size={14} className={heroTab === "whatsapp" ? "text-white" : "text-slate-500"} />
              </button>

              {/* Card 3: Live Inventory */}
              <button
                onClick={() => setHeroTab("inventory")}
                className={`text-left p-3 rounded-2xl transition-all duration-300 flex items-center justify-between gap-2.5 cursor-pointer border ${
                  heroTab === "inventory"
                    ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 border-purple-400/80 text-white shadow-xl shadow-purple-950/80 scale-[1.02]"
                    : "glass-card-dark border-white/10 hover:border-purple-500/40 text-slate-200 hover:bg-white/[0.08]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    heroTab === "inventory" ? "bg-white/20 text-white" : "bg-purple-500/20 text-purple-400"
                  }`}>
                    <span className="text-sm">📦</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-xs text-white truncate">Live Inventory</p>
                    <p className={`text-[10px] truncate ${heroTab === "inventory" ? "text-purple-100" : "text-slate-400"}`}>
                      Never run out
                    </p>
                  </div>
                </div>
                <ChevronRight size={14} className={heroTab === "inventory" ? "text-white" : "text-slate-500"} />
              </button>
            </div>

            {/* ── FULL-WIDTH FAST DISPATCH CARD WITH ZERO TICKET LOSS BADGE ── */}
            <div className="p-3.5 rounded-2xl glass-card-dark border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                  <span className="text-base">⚡</span>
                </div>
                <div>
                  <p className="font-extrabold text-xs text-white">Fast Dispatch</p>
                  <p className="text-[11px] text-slate-400">Get orders to the right station, at the right time.</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold shrink-0 shadow-sm">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Zero Ticket Loss</span>
              </div>
            </div>

            {/* ── SEARCH & LOCATION BAR (PILL SHAPE MATCHING SCREENSHOT) ── */}
            <div className="p-1.5 rounded-full bg-[#0c0d14]/90 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col sm:flex-row items-center gap-1.5">
              <div className="flex items-center gap-2.5 px-4 py-2 w-full sm:flex-1">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search dishes, jollof, egusi, chicken..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Location Dropdown Pill */}
              <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 w-full sm:w-auto shrink-0 transition-colors">
                <MapPin size={13} className="text-rose-400" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
                >
                  <option value="Lagos, Nigeria" className="bg-slate-900 text-white">Lagos, NG</option>
                  <option value="Abuja, Nigeria" className="bg-slate-900 text-white">Abuja, NG</option>
                  <option value="Port Harcourt, Nigeria" className="bg-slate-900 text-white">Port Harcourt, NG</option>
                  <option value="London, UK" className="bg-slate-900 text-white">London, UK</option>
                  <option value="New York, USA" className="bg-slate-900 text-white">New York, US</option>
                </select>
              </div>

              {/* Find Food Pill Button */}
              <button
                onClick={onEnterDashboard}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-950/70 hover:shadow-rose-600/40 hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer border border-white/20"
              >
                <span>Find Food</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Popular Tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pt-0.5 text-xs">
              <span className="text-slate-400 font-bold mr-1">Popular:</span>
              {[
                { label: "Jollof Rice", emoji: "🍛" },
                { label: "Egusi Soup", emoji: "🍲" },
                { label: "Pounded Yam", emoji: "🥟" },
                { label: "Full Chicken", emoji: "🍗" },
                { label: "Small Chops", emoji: "🍢" },
                { label: "Zobo", emoji: "🍷" },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => setHeroSearch(p.label)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 hover:text-white text-[11px] font-semibold border border-white/10 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <span>{p.emoji}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* CTAs Below Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onEnterDashboard}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-rose-950/70 hover:shadow-rose-600/50 hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer border border-white/20"
              >
                <ChefHat size={17} />
                <span>Open Live Kitchen Dashboard</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => onOpenAuth("register")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full glass-btn text-white font-bold text-xs sm:text-sm hover:bg-white/15 hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer border border-white/15"
              >
                <span>Create Free Account</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Frame Matching Screenshot With Floating Badges & Animations */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center pt-4 lg:pt-0">
            {/* 3 Celebratory Sparkle Lines (Top Right of Food Visual) */}
            <div className="absolute -top-3 right-8 z-30 flex items-center gap-1 pointer-events-none">
              <span className="text-amber-400 font-extrabold text-base transform -rotate-12">╲</span>
              <span className="text-rose-400 font-extrabold text-lg transform -translate-y-1">│</span>
              <span className="text-amber-400 font-extrabold text-base transform rotate-12">╱</span>
            </div>

            {/* Dynamic Tilted Flame / Warm Gradient Backdrop Layer */}
            <div className="relative w-full max-w-[490px]">
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber-600 via-red-600 to-rose-700 rounded-3xl opacity-90 blur-xs transform rotate-[3deg] transition-transform duration-500 pointer-events-none" />

              {/* Main Visual Photo Container */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-[#090910] aspect-[16/11]">
                {/* Authentic Culinary Dish with Steam */}
                <img
                  src="/hot-food.png"
                  alt="Sizzling Roasted Chicken & Jollof Rice"
                  className="w-full h-full object-cover select-none transform hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle vignette gradient for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />

                {/* Floating Badge Top-Left: Live Kitchen View with Animated Soundwave Equalizer */}
                <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-[#090a10]/85 backdrop-blur-xl border border-white/15 shadow-2xl animate-float-subtle">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <span className="text-xs">🍳</span>
                  </div>
                  <div>
                    <p className="font-extrabold text-xs text-white leading-tight">Live Kitchen View</p>
                    <p className="text-[10px] text-slate-300">Orders flowing in real-time</p>
                  </div>
                  {/* Equalizer Soundwave Jumping Bars */}
                  <div className="flex items-center gap-0.8 h-5 pl-1.5 border-l border-white/15">
                    <span className="w-1 bg-emerald-400 rounded-full soundwave-bar-1" />
                    <span className="w-1 bg-emerald-400 rounded-full soundwave-bar-2" />
                    <span className="w-1 bg-emerald-400 rounded-full soundwave-bar-3" />
                    <span className="w-1 bg-emerald-400 rounded-full soundwave-bar-4" />
                  </div>
                </div>

                {/* Floating Stacked Status Badges Top-Right */}
                <div className="absolute top-3.5 right-3.5 z-20 flex flex-col gap-1.5 items-end">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#090a10]/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-extrabold shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>Preparing 12</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#090a10]/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[11px] font-extrabold shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-beacon" />
                    <span>Ready 8</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#090a10]/90 backdrop-blur-md border border-purple-500/40 text-purple-300 text-[11px] font-extrabold shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Delivered 24</span>
                  </div>
                </div>

                {/* Bottom-Left Handwritten Cursive Doodle Text with Curved Arrow */}
                <div className="absolute bottom-3 left-4 z-20 pointer-events-none">
                  <div className="flex items-end gap-1.5 text-white/95">
                    <span className="font-serif italic text-base sm:text-lg font-bold tracking-wide drop-shadow-md text-amber-100">
                      Fresh Food Happy Customers
                    </span>
                    <span className="text-xl text-rose-400 transform -rotate-12 animate-pulse font-bold">⤹</span>
                  </div>
                </div>
              </div>

              {/* ── 4 BOTTOM METRIC ICONS IN A CLEAN ROW DIRECTLY BENEATH THE PHOTO ── */}
              <div className="mt-4 pt-1 grid grid-cols-4 gap-2 text-center">
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                    <span className="text-base">🚀</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 leading-tight">
                    Increase<br />Order Speed
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                    <span className="text-base">🛡️</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 leading-tight">
                    Reduce<br />Errors
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <span className="text-base">📊</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 leading-tight">
                    Track In<br />Real Time
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                    <span className="text-base">💖</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 leading-tight">
                    Happy<br />Customers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED DISHES CATALOG (FULL-WIDTH GRID WITH RED & BLACK GLASSMORPHISM) ── */}
      <section id="menu-showcase" className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-transparent dark:bg-[#07070a] text-slate-900 dark:text-white relative overflow-hidden border-b border-black/5 dark:border-white/10">
        <SmokyBackground intensity="medium" showEmbers={true} className="opacity-25 dark:opacity-40" />

        <div className="w-full space-y-10 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-500 uppercase tracking-widest">
                HANDPICKED KITCHEN SPECIALS
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-1">
                Featured Dishes
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Authentic West African staples cooked fresh and dispatched in under 15 minutes.
              </p>
            </div>
            <button
              onClick={onEnterDashboard}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-bold text-xs shadow-lg shadow-rose-950/50 hover:from-rose-500 hover:to-red-600 hover:scale-[1.02] active:scale-95 transition-all duration-300 self-start sm:self-auto cursor-pointer border border-rose-500/30"
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
                className="group p-3.5 rounded-3xl glass-card-dark border border-black/5 dark:border-white/10 hover:border-rose-500/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between text-slate-900 dark:text-white"
              >
                <div>
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 mb-3 relative">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 shadow-sm">
                        {dish.cat}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{dish.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 dark:text-amber-400 font-medium">
                      <Star size={12} fill="#f59e0b" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-black/5 dark:border-white/10">
                  <span className="text-sm font-mono font-black text-rose-600 dark:text-rose-400">{dish.price}</span>
                  <button
                    onClick={onEnterDashboard}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-bold text-xs shadow-md shadow-rose-950/40 hover:from-rose-500 hover:to-red-600 transition-all duration-200 active:scale-95 cursor-pointer border border-rose-400/30"
                  >
                    Add +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIAL OFFER BANNER ── */}
      <section className="py-10 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full rounded-3xl bg-gradient-to-r from-[#0d090d] via-[#160b14] to-[#200a12] text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-rose-500/30 shadow-2xl relative overflow-hidden">
          <SmokyBackground intensity="light" showEmbers={true} className="opacity-40" />

          <div className="relative z-10 space-y-3 text-center md:text-left max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-widest">
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
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-bold text-xs shadow-lg shadow-rose-950/50 hover:from-rose-500 hover:to-red-600 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer border border-rose-400/30"
              >
                Order Now →
              </button>
            </div>
          </div>

          <div className="w-56 sm:w-72 h-36 sm:h-44 rounded-3xl overflow-hidden shrink-0 border-2 border-rose-500/30 shadow-2xl relative">
            <img
              src="/images/dishes/full-chicken.png"
              alt="Feast"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE CHOPEASY? (INTERACTIVE CAROUSEL WITH GLASSMORPHISM) ── */}
      <section
        id="why-choose"
        className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 border-t border-b border-black/5 dark:border-white/10 bg-transparent dark:bg-[#060608]/90 backdrop-blur-2xl relative text-slate-900 dark:text-white"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        <div className="w-full space-y-10 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-bold">
                <Sparkles size={13} className="text-rose-500 dark:text-rose-400" />
                <span>EXPERIENCE THE DIFFERENCE</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
                Why Choose ChopEasy?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                More than just food, we deliver complete kitchen happiness and zero cook chaos.
              </p>
            </div>

            {/* Carousel Control Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-2xl glass-btn flex items-center justify-center text-slate-700 dark:text-white hover:border-rose-500/40 active:scale-95 transition-all duration-200 cursor-pointer"
                title="Previous Slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-2xl glass-btn flex items-center justify-center text-slate-700 dark:text-white hover:border-rose-500/40 active:scale-95 transition-all duration-200 cursor-pointer"
                title="Next Slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Carousel Track Container */}
          <div className="relative overflow-hidden rounded-3xl p-1">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${whySlide * 100}%)` }}
            >
              {whyFeatures.map((feat, idx) => (
                <div
                  key={feat.title}
                  className="w-full shrink-0 px-2"
                >
                  <div className="glass-card-dark rounded-3xl p-8 sm:p-10 border border-black/5 dark:border-white/10 hover:border-rose-500/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-slate-900 dark:text-white">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="space-y-4 max-w-xl text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-black/[0.04] dark:bg-white/[0.07] border border-black/5 dark:border-white/15 flex items-center justify-center text-3xl shadow-inner">
                          {feat.icon}
                        </div>
                        <span className="px-3 py-1 rounded-full bg-black/[0.05] dark:bg-white/10 text-xs font-bold font-mono text-slate-700 dark:text-slate-300 border border-black/5 dark:border-white/10">
                          {feat.tag}
                        </span>
                      </div>

                      <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                        {feat.title}
                      </h3>

                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {feat.desc}
                      </p>

                      <div className="p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 flex items-center gap-2.5 text-xs text-rose-600 dark:text-rose-300">
                        <CheckCircle2 size={16} className="text-rose-500 dark:text-rose-400 shrink-0" />
                        <span>{feat.highlight}</span>
                      </div>
                    </div>

                    {/* Interactive Side Action Card */}
                    <div className="w-full md:w-80 p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 space-y-4 shrink-0 text-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 to-red-700 flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-950/50">
                        <ArrowUpRight size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">Live in Under 60 Secs</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Start taking orders immediately with zero upfront hardware costs.</p>
                      </div>
                      <button
                        onClick={onEnterDashboard}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-bold text-xs shadow-lg shadow-rose-950/50 hover:from-rose-500 hover:to-red-600 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer border border-rose-400/30"
                      >
                        Try Feature in Live App →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Slide Indicators */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {whyFeatures.map((_, i) => (
              <button
                key={i}
                onClick={() => setWhySlide(i)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  whySlide === i
                    ? "w-8 h-2.5 bg-gradient-to-r from-rose-600 to-red-600 shadow-md shadow-rose-950/50"
                    : "w-2.5 h-2.5 bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40"
                }`}
                title={`Go to slide ${i + 1}`}
              />
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

      {/* ── TESTIMONIALS (FULL-WIDTH RED & BLACK GLASSMORPHISM) ── */}
      <section id="testimonials" className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 border-t border-black/5 dark:border-white/10 bg-transparent dark:bg-[#060608] text-slate-900 dark:text-white">
        <div className="w-full space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              What Our Kitchens Say
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">From bustling bukkas to high-volume caterers.</p>
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
              <div key={t.author} className="glass-card-dark rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm space-y-4 text-slate-900 dark:text-white">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-white">{t.author}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER (FULL-WIDTH RED & BLACK GLASS GRADIENT) ── */}
      <section className="py-12 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full rounded-3xl bg-gradient-to-r from-rose-950 via-rose-900 to-red-950 border border-rose-500/40 text-white p-8 sm:p-12 text-center space-y-6 shadow-2xl shadow-rose-950/60 relative overflow-hidden">
          <SmokyBackground intensity="light" showEmbers={true} className="opacity-40" />

          <h2 className="font-display font-black text-3xl sm:text-4xl text-white max-w-xl mx-auto relative z-10">
            Ready to organize your food business?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto relative z-10">
            Join hundreds of kitchen managers tracking orders in real-time. Start free in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-xl hover:bg-slate-100 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              Open Kitchen Dashboard
            </button>
            <button
              onClick={() => onOpenAuth("register")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-extrabold text-sm hover:from-rose-500 hover:to-red-600 border border-rose-400/40 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg shadow-rose-950/50"
            >
              Register New Kitchen
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER (FULL-WIDTH GLASS) ── */}
      <footer className="mt-auto border-t border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#060608]/90 backdrop-blur-md py-8 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 text-xs text-slate-600 dark:text-slate-400">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <ChopEasyLogo size="sm" />
          <div className="flex items-center gap-6">
            <button onClick={onOpenTerms} className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer">Terms of Use</button>
            <button onClick={onOpenTerms} className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer">Privacy Policy</button>
            <button onClick={onEnterDashboard} className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors font-bold text-slate-900 dark:text-white cursor-pointer">Dashboard</button>
          </div>
          <p suppressHydrationWarning>© {new Date().getFullYear()} ChopEasy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
