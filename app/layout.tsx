import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "12-Day Meal Plan",
  description: "Mon\u2013Sat \u00D7 2 Weeks \u00B7 For 3 people \u00B7 Cook-friendly",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f5f5f0] text-[#2d2d2d]">{children}</body>
    </html>
  );
}
