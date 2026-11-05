"use client";

import { useEffect, useState } from "react";

/** Chrome/Edge/Samsung Internet fire this when the app can be installed. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "install-prompt-dismissed";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS reports itself as a Mac
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  );
}

/**
 * Bottom banner inviting the user to install the app.
 * - Android / desktop Chrome: an "Install" button that opens the native prompt.
 * - iPhone / iPad: instructions for Share → "Add to Home Screen" (iOS has no
 *   install prompt API).
 * Hidden once installed or after the user dismisses it.
 */
export default function InstallPrompt() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      // Storage unavailable (private mode) – just show the prompt.
    }

    if (isIOS()) setShowIOSHint(true);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstallEvent(null);
      setShowIOSHint(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  if (dismissed || (!installEvent && !showIOSHint)) return null;

  return (
    <div
      role="dialog"
      aria-label="Install app"
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto max-w-md bg-surface rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.15)] p-3 flex items-center gap-3">
        <img
          src="/icons/icon-192.png"
          alt=""
          width={40}
          height={40}
          className="rounded-lg shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-ink">
            Install Meal Plan
          </p>
          {installEvent ? (
            <p className="text-[12px] text-ink-muted">
              Open it from your home screen like an app.
            </p>
          ) : (
            <p className="text-[12px] text-ink-muted">
              Tap{" "}
              <ShareIcon />{" "}
              <span className="font-semibold">Share</span>, then{" "}
              <span className="font-semibold">Add to Home Screen</span>.
            </p>
          )}
        </div>
        {installEvent && (
          <button
            onClick={install}
            className="shrink-0 rounded-lg bg-forest text-white text-[13px] font-semibold px-3 py-2 hover:bg-forest/90 transition-colors"
          >
            Install
          </button>
        )}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 text-ink-muted hover:text-ink text-[18px] leading-none px-1"
        >
          {"×"}
        </button>
      </div>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      className="inline-block align-[-2px] text-[#007aff]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v12" />
      <path d="M8 7l4-4 4 4" />
      <path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" />
    </svg>
  );
}
