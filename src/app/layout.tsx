import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#e11d48",
};

export const metadata: Metadata = {
  title: "ChopEasy — Food Vendor Management Platform",
  description:
    "The modern operating system for African restaurants, cloud kitchens, and food caterers. Manage orders, menu inventory, and live analytics effortlessly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark" data-theme="dark" suppressHydrationWarning>
      <body className="h-full antialiased font-sans selection:bg-rose-500 selection:text-white transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
