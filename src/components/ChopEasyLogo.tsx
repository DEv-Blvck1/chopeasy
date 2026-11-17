"use client";

import React from "react";

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
      className={`relative flex items-center justify-center shrink-0 rounded-2xl shadow-lg shadow-rose-500/25 transition-transform duration-300 hover:scale-105 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #e11d48 0%, #f43f5e 40%, #f59e0b 100%)",
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />

      {/* Cloche Dome & Rising Ember Spark */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[62%] h-[62%] text-white drop-shadow-sm"
      >
        <circle cx="24" cy="11" r="3" fill="currentColor" />
        <path
          d="M10 28C10 20.268 16.268 14 24 14C31.732 14 38 20.268 38 28"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M7 32C11.5 34.5 36.5 34.5 41 32"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path d="M24 18C21 21.5 20.5 25 24 28C27 25 27 21.5 24 18Z" fill="#fef08a" />
        <path
          d="M17 26.5C19 28 22 28.5 24 28.5"
          stroke="#fef08a"
          strokeWidth="2"
          strokeLinecap="round"
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
  dark = false,
  onClick,
}: LogoProps) {
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
        <div className="flex items-center gap-1">
          <span
            className={`font-display font-black tracking-tight leading-none ${currentSize.title} ${
              dark ? "text-white" : "text-slate-900"
            }`}
          >
            Chop
            <span className="text-rose-600 bg-gradient-to-r from-rose-600 to-amber-500 bg-clip-text text-transparent">
              Easy
            </span>
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ml-0.5" />
        </div>

        {showTagline && (
          <p
            className={`font-medium tracking-normal mt-0.5 ${currentSize.tag} ${
              dark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Your food business, sorted
          </p>
        )}
      </div>
    </div>
  );
}
