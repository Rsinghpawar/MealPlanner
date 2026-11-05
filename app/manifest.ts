import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "12-Day Meal Plan",
    short_name: "Meal Plan",
    description: "Mon–Sat × 2 Weeks · For 3 people · Cook-friendly",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f5f5f0",
    theme_color: "#2d6a4f",
    categories: ["food", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
