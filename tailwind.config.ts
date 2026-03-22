import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fraunces'", "Georgia", "serif"],
        body: ["'Manrope'", "sans-serif"],
        mono: ["'Fira Code'", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
