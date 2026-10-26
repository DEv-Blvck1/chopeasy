"use client";

import React from "react";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({
  className = "",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`group relative flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full transition-all duration-300 cursor-pointer select-none active:scale-95 ${
        isDark
          ? "bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-slate-200 hover:text-white shadow-lg shadow-black/30"
          : "bg-black/[0.05] hover:bg-black/[0.08] border border-black/10 text-slate-700 hover:text-slate-900 shadow-sm"
      } backdrop-blur-xl ${className}`}
    >
      {/* Sliding ambient highlight pill */}
      <div
        className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-all duration-500 ease-out shadow-sm ${
          isDark
            ? "bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white rotate-0 shadow-rose-900/50"
            : "bg-gradient-to-tr from-amber-400 to-orange-400 text-slate-950 rotate-180 shadow-amber-500/30"
        }`}
      >
        {isDark ? (
          <Moon
            size={14}
            className="transition-transform duration-500 ease-out rotate-0 scale-100 drop-shadow-xs"
          />
        ) : (
          <Sun
            size={14}
            className="transition-transform duration-500 ease-out rotate-180 scale-100 drop-shadow-xs"
          />
        )}
      </div>

      {/* Optional Mode Label */}
      {showLabel && (
        <span className="hidden md:inline-block text-xs font-bold tracking-tight pr-1">
          {isDark ? "Dark" : "Light"}
        </span>
      )}

      {/* Ambient hover glow dot */}
      <span
        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
          isDark
            ? "bg-rose-400 group-hover:bg-rose-300 shadow-sm shadow-rose-400"
            : "bg-amber-500 group-hover:bg-amber-400 shadow-sm shadow-amber-400"
        }`}
      />
    </button>
  );
}
