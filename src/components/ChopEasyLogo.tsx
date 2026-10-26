"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  variant?: "full" | "icon" | "minimal";
  className?: string;
  dark?: boolean;
  onClick?: () => void;
}

export function ChopEasyLogoIcon({
  size = 38,
  className = "",
  onClick,
}: {
  size?: number;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center shrink-0 rounded-full shadow-lg shadow-rose-500/25 transition-transform duration-300 hover:scale-105 active:scale-95 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #ff385c 0%, #e11d48 45%, #f59e0b 100%)",
      }}
    >
      {/* Specular glass reflection on cloche circle */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/25 via-transparent to-transparent pointer-events-none" />

      {/* Realistic Cloche Platter & Dome matching screenshot */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[64%] h-[64%] text-white drop-shadow-xs"
      >
        {/* Handle Knob on top */}
        <circle cx="24" cy="11.5" r="3.2" fill="white" />
        {/* Cloche Dome */}
        <path
          d="M10 28C10 20.268 16.268 14 24 14C31.732 14 38 20.268 38 28"
          stroke="white"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        {/* Serving Platter rim */}
        <path
          d="M7 32.5C11.5 35 36.5 35 41 32.5"
          stroke="white"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        {/* Cloche Plate Base */}
        <line
          x1="11"
          y1="32"
          x2="37"
          y2="32"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Inner culinary aroma glow */}
        <path
          d="M24 18.5C21.5 21.5 21 24.5 24 27.5C27 24.5 26.5 21.5 24 18.5Z"
          fill="#fef08a"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

export default function ChopEasyLogo({
  size = "md",
  showTagline = true,
  variant = "full",
  className = "",
  dark,
  onClick,
}: LogoProps) {
  const { isDark } = useTheme();

  // If dark prop is explicitly passed, use it; otherwise automatically adapt to the current theme
  const effectiveDark = dark !== undefined ? dark : isDark;

  const sizeMap = {
    sm: { icon: 32, title: "text-lg", tag: "text-[10px]" },
    md: { icon: 42, title: "text-2xl", tag: "text-xs" },
    lg: { icon: 52, title: "text-3xl", tag: "text-sm" },
    xl: { icon: 64, title: "text-4xl", tag: "text-base" },
  };

  const currentSize = sizeMap[size];

  if (variant === "icon") {
    return <ChopEasyLogoIcon size={currentSize.icon} className={className} onClick={onClick} />;
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 select-none ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <ChopEasyLogoIcon size={currentSize.icon} />

      <div className="flex flex-col">
        <div className="flex items-center gap-0.5">
          <span
            className={`font-display font-black tracking-tight leading-none transition-colors duration-300 ${currentSize.title} ${
              effectiveDark ? "text-white" : "text-slate-900"
            }`}
          >
            Chop
            <span className="bg-gradient-to-r from-[#ff385c] via-[#f43f5e] to-[#f59e0b] bg-clip-text text-transparent">
              Easy
            </span>
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ml-0.5" />
        </div>

        {showTagline && (
          <p
            className={`font-medium tracking-normal mt-0.5 transition-colors duration-300 ${currentSize.tag} ${
              effectiveDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Your food business, sorted
          </p>
        )}
      </div>
    </div>
  );
}
