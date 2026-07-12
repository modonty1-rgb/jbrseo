"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "preview-announcement-dismissed";

export function AnnouncementBar({ message }: { message: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(STORAGE_KEY) === "1") return;
    setShow(true);
  }, []);

  function dismiss() {
    setShow(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    }
  }

  if (!show || !message?.trim()) return null;

  return (
    <div
      role="status"
      className="relative bg-card-foreground text-card"
    >
      {/* Content lives in a flex row that keeps the "جديد" badge inline with
          the message's first line — no flex-wrap so the badge never breaks to
          its own row. Text wraps naturally if long; badge follows the first
          line via `items-baseline`. Left padding reserves space for dismiss. */}
      <div className="flex items-center justify-center ps-11 pe-4 py-3.5 text-[14px] sm:py-4 sm:text-[15px] font-semibold">
        <span className="text-center whitespace-nowrap">{message}</span>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="إخفاء الإعلان"
        className="absolute start-1 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-xl leading-none text-card opacity-60 transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-card/60"
      >
        ×
      </button>
    </div>
  );
}
