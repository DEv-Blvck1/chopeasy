import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full">
      <body className="h-full antialiased font-sans bg-[#fbf8f3] text-slate-900 selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
