import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallPrompt from "@/components/InstallPrompt";

export const metadata: Metadata = {
  title: "12-Day Meal Plan",
  description: "Mon–Sat × 2 Weeks · For 3 people · Cook-friendly",
  applicationName: "Meal Plan",
  appleWebApp: {
    capable: true,
    title: "Meal Plan",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#2d6a4f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f5f5f0] text-[#2d2d2d]">
        <AuthProvider>{children}</AuthProvider>
        <InstallPrompt />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
