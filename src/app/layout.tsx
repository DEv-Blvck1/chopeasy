import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "ChopEasy — Food Vendor Management",
  description: "Manage your menu, track orders and grow your food business in Nigeria",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
