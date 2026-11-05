"use client";

import { useState, useRef, useCallback, useLayoutEffect, type RefObject } from "react";
import type { DayPlan } from "@/data/mealPlan";
import { formatMealText } from "@/lib/formatMealText";

interface ShareModalProps {
  dayPlan: DayPlan;
  cardRef: RefObject<HTMLDivElement>;
  onClose: () => void;
}

export default function ShareModal({
  dayPlan,
  cardRef,
  onClose,
}: ShareModalProps) {
  const [text, setText] = useState(() => formatMealText(dayPlan));
  const [isCapturing, setIsCapturing] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Grow the preview to fit the whole message so nothing (like the soak
  // reminders at the end) is hidden below a scroll.
  useLayoutEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight + ta.offsetHeight - ta.clientHeight}px`;
  }, [text]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  /* ---- Share as Text ---- */
  const handleShareText = () => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  /* ---- Share as Image ---- */
  const handleShareImage = async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);

    try {
      // Dynamic import keeps html2canvas out of the main bundle
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
          "image/png"
        );
      });

      const file = new File(
        [blob],
        `${dayPlan.day}-week${dayPlan.week}.png`,
        { type: "image/png" }
      );

      // Try Web Share API (mobile Chrome/Safari with file support)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `${dayPlan.day} \u2014 Week ${dayPlan.week} Meal Plan`,
          files: [file],
        });
      } else {
        // Fallback: download image + open WhatsApp text link
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        handleShareText();
      }
    } catch (err) {
      console.error("Image share failed:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Share ${dayPlan.day} meal plan`}
    >
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-[15px] font-bold">
            Share {dayPlan.day} {"\u2014"} Week {dayPlan.week}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            aria-label="Close share modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Editable text preview */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
            Edit before sharing
          </label>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full min-h-[12rem] text-[13px] leading-relaxed p-3 rounded-lg border border-gray-200 focus:border-forest focus:ring-1 focus:ring-forest outline-none resize-none font-mono"
            spellCheck={false}
          />
        </div>

        {/* Action buttons */}
        <div className="px-4 py-3 border-t border-gray-100 flex flex-col gap-2">
          <button
            onClick={handleShareText}
            className="w-full py-2.5 rounded-lg bg-[#25D366] text-white font-semibold text-[14px] hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Share as Text via WhatsApp
          </button>

          <button
            onClick={handleShareImage}
            disabled={isCapturing}
            className="w-full py-2.5 rounded-lg bg-forest text-white font-semibold text-[14px] hover:bg-forest/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCapturing ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Capturing...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Share as Image
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
