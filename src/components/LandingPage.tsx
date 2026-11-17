"use client";

import React, { useState } from "react";
import {
  ShoppingBag, Flame, Clock, ArrowRight, CheckCircle2,
  TrendingUp, ShieldCheck, MessageCircle, Footprints,
  Phone, Star, Sparkles, ChefHat, Store, ChevronRight,
  Package, DollarSign, Users, Award, Play
} from "lucide-react";
import ChopEasyLogo from "./ChopEasyLogo";
import SteamingFoodPlate from "./SteamingFoodPlate";
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

  return (
    <div className="min-h-screen app-wallpaper text-slate-900 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* ── TOP NAVIGATION ── */}
      <nav className="sticky top-0 z-40 glass-header px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <ChopEasyLogo size="md" />
          </div>

          <div className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-600">
            <a href="#features" className="hover:text-rose-600 transition-colors">Features</a>
            <a href="#pipeline" className="hover:text-rose-600 transition-colors">Kitchen Flow</a>
            <a href="#menu-showcase" className="hover:text-rose-600 transition-colors">Menu System</a>
            <a href="#pricing" className="hover:text-rose-600 transition-colors font-extrabold text-rose-600">Pricing</a>
            <a href="#food-news" className="hover:text-rose-600 transition-colors">Global News</a>
            <a href="#testimonials" className="hover:text-rose-600 transition-colors">Testimonials</a>
          </div>

          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <button
                onClick={onEnterDashboard}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/25 hover:from-rose-700 hover:to-amber-600 transition-all"
              >
                <span>Go to Kitchen Dashboard</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth("login")}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth("register")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/25 hover:from-rose-700 hover:to-amber-600 transition-all"
                >
                  <span>Launch Free</span>
                  <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION WITH 3D SIZZLING FOOD & MILD STEAM ── */}
      <section className="relative pt-8 pb-16 sm:py-20 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Messaging & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-bold shadow-sm">
              <Sparkles size={13} className="text-amber-500" />
              <span>Built for African Restaurants, Cloud Kitchens & Caterers</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 leading-[1.1] tracking-tight">
              Your food business, sorted. From{" "}
              <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                order to delivery.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Consolidate WhatsApp orders, walk-ins, and phone calls into a single real-time kitchen screen.
              Toggle sold-out dishes in 1-tap, prevent order mix-ups, and track your daily Naira revenue live.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
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
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-sm hover:bg-slate-50 shadow-sm transition-all cursor-pointer"
              >
                <span>Create Free Account</span>
              </button>
            </div>

            {/* Quick Hero Pricing Link */}
            <div className="flex items-center justify-center lg:justify-start pt-1">
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-rose-600 bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Pricing: Free Tier, Basic ($12/₦8.5k), Advanced ($35/₦24k) — View Details ↓</span>
              </a>
            </div>

            {/* Social Proof Badges */}
            <div className="pt-6 border-t border-slate-200/60 grid grid-cols-3 gap-3 text-left">
              <div>
                <p className="font-display font-black text-xl text-slate-900">₦45M+</p>
                <p className="text-[11px] text-slate-500 font-medium">Orders Processed</p>
              </div>
              <div>
                <p className="font-display font-black text-xl text-slate-900">99.9%</p>
                <p className="text-[11px] text-slate-500 font-medium">Kitchen Uptime</p>
              </div>
              <div>
                <p className="font-display font-black text-xl text-slate-900">0% Cut</p>
                <p className="text-[11px] text-slate-500 font-medium">Direct Sales Fees</p>
              </div>
            </div>
          </div>

          {/* Right Column: Sizzling Food Plate from Screenshot with Animated Rising Smoke */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-amber-400/25 to-rose-500/25 blur-3xl pointer-events-none" />

            {/* Steaming Food Container */}
            <div className="relative w-full max-w-[480px]">
              <SteamingFoodPlate interactive={true} showBadges={true} />

              {/* Floating Order Badges */}
              <div className="absolute -top-3 -left-3 p-2.5 rounded-2xl glass-panel shadow-xl border border-white/80 animate-float flex items-center gap-2.5 max-w-[210px] z-30">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-800 truncate">WhatsApp Order</p>
                  <p className="text-[9px] text-emerald-600 font-semibold font-mono">2× Jollof + Chicken</p>
                </div>
              </div>

              <div className="absolute -bottom-3 -right-3 p-2.5 rounded-2xl glass-panel shadow-xl border border-white/80 flex items-center gap-2.5 max-w-[220px] z-30">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Flame size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-800 truncate">Kitchen Preparing</p>
                  <p className="text-[9px] text-slate-600 font-mono">CHE-041 · ₦3,400</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KITCHEN WORKFLOW PIPELINE ── */}
      <section id="pipeline" className="py-16 px-4 sm:px-8 border-y border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              How ChopEasy Powers Your Kitchen
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Three seamless steps from order arrival to customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">Order Intake in Seconds</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take walk-in, WhatsApp, or phone orders instantly. Add sides, swallows, and special notes like "no pepper" with auto-calculated Naira totals.
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">Live Cook Progression</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chefs advance tickets from Pending to Preparing to Ready with a single tap. Zero lost slips, zero forgotten orders.
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">Instant Settlement & Sales</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track revenue, view top-selling dishes, and notify riders or customers as soon as the meal is ready for dispatch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE FEATURES GRID ── */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <Award size={13} />
              <span>Full Kitchen Control</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900">
              Everything Your Food Business Needs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Built with firsthand knowledge of how high-paced kitchens in Lagos, Abuja, and Port Harcourt run.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "Live Kitchen Screen",
                desc: "High-contrast visual cards showing cooking time, customer name, and exact order quantity.",
                icon: <Flame size={20} className="text-rose-600" />,
                bg: "bg-rose-50",
              },
              {
                title: "Instant Stock Toggle",
                desc: "Mark Jollof or Egusi as sold-out in real-time so your counter team never sells what is gone.",
                icon: <Package size={20} className="text-amber-600" />,
                bg: "bg-amber-50",
              },
              {
                title: "Sales Intelligence",
                desc: "Real-time revenue dashboard, channel distribution (WhatsApp vs Walk-in), and average ticket value.",
                icon: <TrendingUp size={20} className="text-emerald-600" />,
                bg: "bg-emerald-50",
              },
              {
                title: "WhatsApp Friendly",
                desc: "Direct link integration for Nigerian vendors taking over 60% of repeat business on WhatsApp.",
                icon: <MessageCircle size={20} className="text-blue-600" />,
                bg: "bg-blue-50",
              },
            ].map((f) => (
              <div key={f.title} className="glass-panel rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className={`w-10 h-10 rounded-2xl ${f.bg} flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE MENU SHOWCASE ── */}
      <section id="menu-showcase" className="py-16 px-4 sm:px-8 bg-slate-900 text-white rounded-3xl max-w-7xl mx-auto my-8">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Catalog & Menu System</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-1">
                Versatile Menu Architecture
              </h2>
              <p className="text-xs text-slate-400 mt-1">Pre-configured with authentic West African staples and custom dishes.</p>
            </div>
            <button
              onClick={onEnterDashboard}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-xs shadow-md hover:from-rose-700 hover:to-amber-600 transition-all self-start sm:self-auto"
            >
              Test Menu In App →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {[
              { name: "Jollof Rice", cat: "Rice", price: "₦800", image: "/images/dishes/jollof-rice.png" },
              { name: "Egusi Soup", cat: "Soup", price: "₦600", image: "/images/dishes/egusi-soup.png" },
              { name: "Pounded Yam", cat: "Swallow", price: "₦300", image: "/images/dishes/pounded-yam.png" },
              { name: "Full Chicken", cat: "Protein", price: "₦1,800", image: "/images/dishes/full-chicken.png" },
              { name: "Small Chops", cat: "Snack", price: "₦2,500", image: "/images/dishes/small-chops.png" },
              { name: "Chilled Zobo", cat: "Drink", price: "₦300", image: "/images/dishes/chilled-zobo.png" },
            ].map((dish) => (
              <div
                key={dish.name}
                className="group p-2.5 sm:p-3 rounded-2xl bg-[#0e1626]/80 backdrop-blur-md border border-white/10 hover:border-amber-400/50 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 flex flex-col items-center justify-between"
              >
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-800/80 mb-2.5">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="font-bold text-xs sm:text-sm text-white truncate w-full">{dish.name}</p>
                <p className="text-[11px] sm:text-xs text-amber-400 font-mono font-bold mt-0.5">{dish.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3-TIER PRICING SECTION (FREE, BASIC, ADVANCED) WITH LOCATION CURRENCY ── */}
      <PricingSection
        onSelectPlan={(plan, curr) => {
          if (plan === "free") {
            onOpenAuth("register");
          } else {
            onEnterDashboard();
          }
        }}
      />

      {/* ── LOCATION-BASED GLOBAL FOOD & HOSPITALITY NEWS ── */}
      <GlobalFoodNews />

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-16 sm:py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              Trusted by Food Vendors
            </h2>
            <p className="text-xs text-slate-500">From busy canteens to cloud kitchens delivering across cities.</p>
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

      {/* ── CTA BANNER ── */}
      <section className="py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white p-8 sm:p-12 text-center space-y-6 shadow-2xl shadow-rose-500/20">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white max-w-xl mx-auto">
            Ready to organize your food business?
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 max-w-md mx-auto">
            Join hundreds of kitchen managers tracking orders in real-time. Start free in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-lg hover:bg-slate-100 transition-all"
            >
              Open Kitchen Dashboard
            </button>
            <button
              onClick={() => onOpenAuth("register")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-extrabold text-sm hover:bg-slate-800 transition-all"
            >
              Register New Kitchen
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-auto border-t border-slate-200/60 bg-white/70 backdrop-blur-md py-8 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <ChopEasyLogo size="sm" />
          <div className="flex items-center gap-6">
            <button onClick={onOpenTerms} className="hover:text-rose-600 transition-colors">Terms of Use</button>
            <button onClick={onOpenTerms} className="hover:text-rose-600 transition-colors">Privacy Policy</button>
            <button onClick={onEnterDashboard} className="hover:text-rose-600 transition-colors font-bold text-slate-700">Dashboard</button>
          </div>
          <p suppressHydrationWarning>© {new Date().getFullYear()} ChopEasy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

