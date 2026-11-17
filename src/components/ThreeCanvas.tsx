"use client";

import React from "react";
import SteamingFoodPlate from "./SteamingFoodPlate";

interface ThreeCanvasProps {
  mode?: "food-steam" | "ambient" | "hero";
  className?: string;
  interactive?: boolean;
}

export default function ThreeCanvas({
  className = "",
  interactive = true,
}: ThreeCanvasProps) {
  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      <SteamingFoodPlate interactive={interactive} showBadges={false} />
    </div>
  );
}
