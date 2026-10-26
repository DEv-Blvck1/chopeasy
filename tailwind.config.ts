import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Outfit'", "'Plus Jakarta Sans'", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      colors: {
        chili: {
          50: "#fff1f2",
          100: "#ffe4e6",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          900: "#881337",
        },
        spice: {
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        leaf: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.06)",
        "glass-lg": "0 14px 40px -10px rgba(225, 29, 72, 0.12), 0 8px 24px -10px rgba(0, 0, 0, 0.08)",
        glow: "0 0 25px -5px rgba(225, 29, 72, 0.35)",
        "glow-amber": "0 0 25px -5px rgba(245, 158, 11, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
