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
      className="relative flex flex-wrap items-center justify-center gap-x-[14px] gap-y-1 ps-[var(--tap)] pe-4 py-[10px] text-[13px] sm:text-[13.5px] font-medium text-card text-center bg-card-foreground"
    >
      <span
        className="font-bold text-[10.5px] text-success-foreground bg-success py-[3px] px-[7px] rounded-[4px] tracking-[0.5px]"
        style={{ fontFamily: "'IBM Plex Mono',monospace" }}
      >
        جديد
      </span>
      <span className="flex-[0_1_auto]">{message}</span>
      <button
        type="button"
        onClick={dismiss}
        aria-label="إخفاء الإعلان"
        className="absolute start-1 top-1/2 -translate-y-1/2 w-[var(--tap)] h-[var(--tap)] rounded-[var(--radius-sm)] text-card opacity-60 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-card/60 text-xl leading-none inline-flex items-center justify-center transition-opacity duration-150"
      >
        ×
      </button>
    </div>
  );
}
