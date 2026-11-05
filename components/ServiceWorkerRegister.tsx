"use client";

import { useEffect } from "react";

/**
 * Registers the service worker (public/sw.js) that makes the app installable
 * and lets it open without a connection. Production only, so `npm run dev`
 * never serves stale cached files.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) =>
          console.error("Service worker registration failed:", err)
        );
    };

    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
