"use client";

import React, { useState } from "react";
import {
  Check, Sparkles, MapPin, ShieldCheck, Zap,
  CreditCard, ArrowRight, Star, HelpCircle
} from "lucide-react";

interface PricingSectionProps {
  onSelectPlan: (plan: string, currency: string) => void;
}

export type PricingCurrency = "NGN" | "USD" | "EUR";

export default function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const [currency, setCurrency] = useState<PricingCurrency>("NGN");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [detectingLoc, setDetectingLoc] = useState(false);
  const [detectedNote, setDetectedNote] = useState<string | null>(null);

  // Auto-detect currency via browser location
  const handleDetectCurrency = () => {
    if (!navigator.geolocation) {
      setDetectedNote("Geolocation is not supported by your browser.");
      return;
    }
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setDetectingLoc(false);
        // Approximation: Africa -> NGN, Americas -> USD, Europe -> EUR
        if (latitude >= -35 && latitude <= 37 && longitude >= -20 && longitude <= 52) {
          setCurrency("NGN");
          setDetectedNote("📍 African Region Detected — Pricing set to ₦ Nigerian Naira");
        } else if (latitude >= 15 && latitude <= 70 && longitude >= -160 && longitude <= -50) {
          setCurrency("USD");
          setDetectedNote("📍 North American Region Detected — Pricing set to $ US Dollar");
        } else if (latitude >= 35 && latitude <= 72 && longitude >= -25 && longitude <= 45) {
          setCurrency("EUR");
          setDetectedNote("📍 European Region Detected — Pricing set to € Euro");
        } else {
          setCurrency("USD");
          setDetectedNote("📍 Global Location Detected — Standard pricing set to $ USD");
        }
      },
      () => {
        setDetectingLoc(false);
        setDetectedNote("Location access was skipped. Select your currency manually.");
      },
      { timeout: 6000 }
    );
  };

  // Pricing matrix
  const plans = [
    {
      id: "free",
      name: "Free Tier",
      badge: "Starter Kitchen",
      isPopular: false,
      desc: "Perfect for solo cooks, pop-up stalls, and home food businesses taking their first orders.",
      prices: {
        NGN: { monthly: "₦0", yearly: "₦0", period: "forever free" },
        USD: { monthly: "$0", yearly: "$0", period: "forever free" },
        EUR: { monthly: "€0", yearly: "€0", period: "forever free" },
      },
      features: [
        "Up to 50 active monthly orders",
        "1 kitchen staff screen device",
        "Direct WhatsApp order tickets",
        "Digital menu catalog (up to 15 items)",
        "Daily order summary & cash total",
        "Standard community support",
      ],
      ctaText: "Start Free Tier",
      ctaStyle: "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50",
    },
    {
      id: "basic",
      name: "Basic",
      badge: "Most Popular",
      isPopular: true,
      desc: "The high-speed kitchen engine for busy bukkas, canteens, takeout spots, and cloud kitchens.",
      prices: {
        NGN: {
          monthly: "₦8,500",
          yearly: "₦6,800",
          sub: billingCycle === "yearly" ? "billed ₦81,600 / year (save 20%)" : "billed monthly",
        },
        USD: {
          monthly: "$12",
          yearly: "$9.50",
          sub: billingCycle === "yearly" ? "billed $114 / year (save 20%)" : "billed monthly",
        },
        EUR: {
          monthly: "€11",
          yearly: "$8.80",
          sub: billingCycle === "yearly" ? "billed €105 / year (save 20%)" : "billed monthly",
        },
      },
      features: [
        "Unlimited orders & customer tickets",
        "3 kitchen staff display stations",
        "Automated WhatsApp customer notifications",
        "Sales & Performance Growth Bar Charts",
        "1-tap 'Sold Out' dish availability toggling",
        "Custom digital QR menu for dine-in & takeout",
        "Priority 24/7 kitchen chat support",
      ],
      ctaText: "Choose Basic Plan",
      ctaStyle: "bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-lg shadow-rose-500/25 hover:from-rose-700 hover:to-amber-600",
    },
    {
      id: "advanced",
      name: "Advanced",
      badge: "Multi-Branch & Catering",
      isPopular: false,
      desc: "Designed for multi-location restaurants, high-volume caterers, and food franchises scaling fast.",
      prices: {
        NGN: {
          monthly: "₦24,000",
          yearly: "₦19,200",
          sub: billingCycle === "yearly" ? "billed ₦230,400 / year (save 20%)" : "billed monthly",
        },
        USD: {
          monthly: "$35",
          yearly: "$28",
          sub: billingCycle === "yearly" ? "billed $336 / year (save 20%)" : "billed monthly",
        },
        EUR: {
          monthly: "€32",
          yearly: "€25.60",
          sub: billingCycle === "yearly" ? "billed €307 / year (save 20%)" : "billed monthly",
        },
      },
      features: [
        "Everything in Basic, plus:",
        "Unlimited branches & kitchen stations",
        "Dedicated Kitchen Display Systems (KDS)",
        "Multi-currency billing (₦ NGN, $ USD, € EUR)",
        "Sales forecasting & inventory depletion alerts",
        "Staff roles (Cashier, Line Cook, Kitchen Admin)",
        "Custom domain & branded checkout page",
        "Dedicated WhatsApp account manager",
      ],
      ctaText: "Upgrade to Advanced",
      ctaStyle: "bg-slate-900 text-white hover:bg-slate-800 shadow-md",
    },
  ];

  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 relative overflow-hidden w-full">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/10 blur-3xl pointer-events-none rounded-full" />

      <div className="w-full space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/70 text-rose-600 text-xs font-bold">
            <Sparkles size={13} className="text-amber-500" />
            <span>TRANSPARENT, GROW-AS-YOU-COOK PRICING</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight">
            Plans Tailored to Every Kitchen Scale
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Pay in your local currency with zero hidden commissions. Switch or cancel your subscription at any time.
          </p>
        </div>

        {/* Currency & Location Selector Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Location Currency Pills */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200/80 shadow-inner">
            {[
              { id: "NGN", label: "🇳🇬 ₦ Naira (NGN)", code: "NGN" },
              { id: "USD", label: "🇺🇸 $ Dollar (USD)", code: "USD" },
              { id: "EUR", label: "🇪🇺 € Euro (EUR)", code: "EUR" },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCurrency(c.code as PricingCurrency);
                  setDetectedNote(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currency === c.code
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Location Auto-detect Button */}
          <button
            onClick={handleDetectCurrency}
            disabled={detectingLoc}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
          >
            <MapPin size={14} className={detectingLoc ? "animate-spin text-amber-500" : "text-amber-500"} />
            <span>{detectingLoc ? "Detecting..." : "Detect Currency by Location"}</span>
          </button>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-xs font-bold">
            <span className={billingCycle === "monthly" ? "text-slate-900" : "text-slate-400"}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                billingCycle === "yearly" ? "bg-rose-600" : "bg-slate-300"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  billingCycle === "yearly" ? "left-6" : "left-1"
                }`}
              />
            </button>
            <span className={billingCycle === "yearly" ? "text-slate-900" : "text-slate-400"}>
              Yearly <span className="text-[10px] text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded-full">Save 20%</span>
            </span>
          </div>
        </div>

        {detectedNote && (
          <div className="max-w-md mx-auto text-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 py-1.5 px-3 rounded-xl animate-in fade-in duration-200">
            {detectedNote}
          </div>
        )}

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const priceData = plan.prices[currency];
            const currentPrice = billingCycle === "yearly" ? (priceData as any).yearly || priceData.monthly : priceData.monthly;
            const subPeriod = plan.id === "free" ? "/ forever" : billingCycle === "yearly" ? "/ month" : "/ month";

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                  plan.isPopular
                    ? "bg-white border-2 border-rose-500 shadow-xl shadow-rose-500/10 md:-translate-y-2"
                    : "bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Popular Pill */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                    <Star size={11} fill="white" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Top Header */}
                  <div>
                    {!plan.isPopular && (
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {plan.badge}
                      </span>
                    )}
                    <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display font-black text-4xl sm:text-5xl text-slate-900">
                        {currentPrice}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">{subPeriod}</span>
                    </div>
                    {(priceData as any).sub && (
                      <p className="text-[11px] text-rose-600 font-medium mt-1">
                        {(priceData as any).sub}
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">What's included:</p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 leading-tight">
                          <div className="p-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-8">
                  <button
                    onClick={() => onSelectPlan(plan.id, currency)}
                    className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${plan.ctaStyle}`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight size={15} />
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-2">
                    {plan.id === "free" ? "No credit card required" : "14-day free trial • Cancel anytime"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

