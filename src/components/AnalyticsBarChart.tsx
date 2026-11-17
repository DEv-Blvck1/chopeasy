"use client";

import React, { useState } from "react";
import {
  BarChart3, TrendingUp, Calendar, Clock,
  ArrowUpRight, Target, Sparkles, ChevronRight
} from "lucide-react";

interface AnalyticsBarChartProps {
  currencyCode: string;
  formatMoney: (val: number) => string;
  dailyTarget: number;
}

export default function AnalyticsBarChart({
  currencyCode,
  formatMoney,
  dailyTarget,
}: AnalyticsBarChartProps) {
  const [viewMode, setViewMode] = useState<"weekly" | "hourly" | "monthly">("weekly");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Normalized multipliers to simulate realistic data in NGN, USD, EUR
  // Base scale is calibrated around standard daily target
  const baseScale = currencyCode === "USD" ? 1 / 1400 : currencyCode === "EUR" ? 1 / 1500 : 1;

  // 1. Weekly data (Last 7 Days)
  const weeklyData = [
    { label: "Mon", fullLabel: "Monday", val: Math.round(92000 * baseScale), orders: 28, peakItem: "Jollof Rice" },
    { label: "Tue", fullLabel: "Tuesday", val: Math.round(114000 * baseScale), orders: 34, peakItem: "Egusi Soup" },
    { label: "Wed", fullLabel: "Wednesday", val: Math.round(108000 * baseScale), orders: 31, peakItem: "Pounded Yam" },
    { label: "Thu", fullLabel: "Thursday", val: Math.round(135000 * baseScale), orders: 42, peakItem: "Full Chicken" },
    { label: "Fri", fullLabel: "Friday", val: Math.round(188000 * baseScale), orders: 58, peakItem: "Small Chops" },
    { label: "Sat", fullLabel: "Saturday", val: Math.round(245000 * baseScale), orders: 74, peakItem: "Jollof Feast" },
    { label: "Sun", fullLabel: "Sunday (Today)", val: Math.round(168000 * baseScale), orders: 51, peakItem: "Party Platters" },
  ];

  // 2. Hourly rush data (Today's Peak Hours)
  const hourlyData = [
    { label: "10 AM", fullLabel: "10:00 AM", val: Math.round(18000 * baseScale), orders: 6, peakItem: "Breakfast Yam" },
    { label: "12 PM", fullLabel: "12:00 PM (Lunch Rush)", val: Math.round(62000 * baseScale), orders: 21, peakItem: "Jollof Rice" },
    { label: "2 PM", fullLabel: "02:00 PM", val: Math.round(48000 * baseScale), orders: 16, peakItem: "Egusi Soup" },
    { label: "4 PM", fullLabel: "04:00 PM", val: Math.round(24000 * baseScale), orders: 8, peakItem: "Small Chops" },
    { label: "6 PM", fullLabel: "06:00 PM (Dinner Rush)", val: Math.round(78000 * baseScale), orders: 26, peakItem: "Full Chicken" },
    { label: "8 PM", fullLabel: "08:00 PM", val: Math.round(52000 * baseScale), orders: 17, peakItem: "Pounded Yam" },
    { label: "10 PM", fullLabel: "10:00 PM (Late Orders)", val: Math.round(19000 * baseScale), orders: 7, peakItem: "Chilled Zobo" },
  ];

  // 3. Monthly growth trend (Past 6 months)
  const monthlyData = [
    { label: "Jun", fullLabel: "June", val: Math.round(1450000 * baseScale), orders: 420, peakItem: "Bukka Special" },
    { label: "Jul", fullLabel: "July", val: Math.round(1720000 * baseScale), orders: 495, peakItem: "Jollof Rice" },
    { label: "Aug", fullLabel: "August", val: Math.round(1980000 * baseScale), orders: 580, peakItem: "Egusi Soup" },
    { label: "Sep", fullLabel: "September", val: Math.round(2250000 * baseScale), orders: 660, peakItem: "Small Chops" },
    { label: "Oct", fullLabel: "October", val: Math.round(2780000 * baseScale), orders: 790, peakItem: "Full Chicken" },
    { label: "Nov", fullLabel: "November (Current)", val: Math.round(3420000 * baseScale), orders: 940, peakItem: "Combo Platters" },
  ];

  const currentDataset = viewMode === "weekly" ? weeklyData : viewMode === "hourly" ? hourlyData : monthlyData;
  const maxVal = Math.max(...currentDataset.map((d) => d.val), 1);
  const totalRevenue = currentDataset.reduce((sum, d) => sum + d.val, 0);
  const totalOrders = currentDataset.reduce((sum, d) => sum + d.orders, 0);
  const avgVal = Math.round(totalRevenue / currentDataset.length);

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6">
      {/* Top Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 leading-tight">
                Sales & Performance Growth Analysis
              </h3>
              <p className="text-xs text-slate-500">
                Visual revenue telemetry, order velocity, and capacity targets
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher Buttons */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200/80 self-start sm:self-auto">
          {[
            { id: "weekly", label: "Last 7 Days" },
            { id: "hourly", label: "Hourly Rush" },
            { id: "monthly", label: "6-Mo Trend" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setViewMode(tab.id as any);
                setHoveredIdx(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === tab.id
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70">
        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Sales In Window</p>
          <p className="font-display font-extrabold text-lg text-slate-900 mt-0.5">
            {formatMoney(totalRevenue)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Orders Dispatched</p>
          <p className="font-display font-extrabold text-lg text-rose-600 mt-0.5">
            {totalOrders} tickets
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average Ticket Run</p>
          <p className="font-display font-extrabold text-lg text-amber-600 mt-0.5">
            {formatMoney(avgVal)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pacing Growth Rate</p>
          <p className="font-display font-extrabold text-lg text-emerald-600 mt-0.5 flex items-center gap-1">
            <ArrowUpRight size={16} /> +28.4%
          </p>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="relative pt-6 pb-2">
        {/* Daily Target Benchmark line (shown in weekly view) */}
        {viewMode === "weekly" && dailyTarget > 0 && (
          <div
            className="absolute left-0 right-0 border-b-2 border-dashed border-amber-400/80 z-10 flex items-center justify-end pr-2 pointer-events-none transition-all duration-300"
            style={{
              bottom: `${Math.min(92, Math.max(15, (dailyTarget * baseScale / maxVal) * 200 + 40))}px`,
            }}
          >
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-xs flex items-center gap-1">
              <Target size={10} /> Target: {formatMoney(dailyTarget * baseScale)}
            </span>
          </div>
        )}

        {/* Visual Bars */}
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-64 border-b border-slate-200 px-2 sm:px-4">
          {currentDataset.map((item, idx) => {
            const heightPct = Math.round((item.val / maxVal) * 100);
            const isHovered = hoveredIdx === idx;
            const isHighest = item.val === maxVal;

            return (
              <div
                key={item.label}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-20 z-30 p-2.5 rounded-xl bg-slate-950 text-white shadow-xl text-center w-36 sm:w-40 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <p className="font-bold text-xs text-amber-300">{item.fullLabel}</p>
                    <p className="font-mono font-black text-sm text-white mt-0.5">{formatMoney(item.val)}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 border-t border-slate-800 pt-1">
                      <span>{item.orders} orders</span>
                      <span className="text-rose-400 truncate max-w-[70px]">{item.peakItem}</span>
                    </div>
                  </div>
                )}

                {/* Bar Value on top for highest */}
                {isHighest && !isHovered && (
                  <span className="text-[10px] font-bold font-mono text-amber-600 mb-1 animate-pulse">
                    Peak
                  </span>
                )}

                {/* Animated Bar Column */}
                <div className="w-full max-w-[48px] rounded-t-2xl overflow-hidden bg-slate-100 flex flex-col justify-end transition-all duration-300 group-hover:scale-y-105">
                  <div
                    className={`w-full rounded-t-2xl transition-all duration-500 ${
                      isHighest
                        ? "bg-gradient-to-t from-rose-600 via-rose-500 to-amber-400 shadow-md shadow-rose-500/30"
                        : "bg-gradient-to-t from-rose-600 to-amber-500 opacity-80 group-hover:opacity-100"
                    }`}
                    style={{ height: `${Math.max(8, heightPct)}%` }}
                  />
                </div>

                {/* X-axis Label */}
                <div className="mt-2 text-center">
                  <p className={`text-[11px] font-bold transition-colors ${
                    isHovered ? "text-rose-600" : "text-slate-600"
                  }`}>
                    {item.label}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
                    {formatMoney(item.val)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Insights Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/50 gap-2">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-amber-600 shrink-0" />
          <span>
            <strong>Growth Insight:</strong> Weekend dinner rushes drive 44% of total weekly volume. Enabling automated prep tickets reduces customer wait time by 12 minutes.
          </span>
        </div>
        <span className="font-bold text-amber-800 shrink-0">
          Daily Target: {formatMoney(dailyTarget * baseScale)}
        </span>
      </div>
    </div>
  );
}

