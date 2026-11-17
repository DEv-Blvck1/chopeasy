"use client";

import Link from "next/link";
import { ArrowLeft, ChefHat, Sparkles } from "lucide-react";
import ChopEasyLogo from "@/components/ChopEasyLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen app-wallpaper flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 shadow-xl border border-white/80 space-y-6">
        <div className="flex justify-center">
          <ChopEasyLogo size="lg" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-100 text-rose-700 tracking-wider uppercase font-mono">
            404 • Page Not Found
          </span>
          <h1 className="font-display font-black text-3xl text-slate-900 mt-2">
            Lost in the Kitchen?
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The page or recipe you are looking for does not exist or has been moved to another station.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-xs shadow-md shadow-rose-500/25 hover:from-rose-700 hover:to-amber-600 transition-all"
          >
            <ArrowLeft size={14} />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-50 transition-all shadow-xs"
          >
            <ChefHat size={14} className="text-rose-600" />
            <span>Open Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

