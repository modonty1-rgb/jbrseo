"use client";

import { useState } from "react";
import type { Section } from "@/app/content/landing/price-section-types";

interface DetailsAccordionProps {
  sections: Section[];
  featured: boolean;
}

export function DetailsAccordion({ sections, featured }: DetailsAccordionProps) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mt-4 flex flex-col gap-1.5">
      {sections.map((sec, i) => (
        <div
          key={i}
          className={`rounded-xl overflow-hidden border transition-all duration-200
            ${featured ? "border-white/10" : "border-gray-100"}
            ${open === i ? (featured ? "bg-white/8" : "bg-stone-50") : ""}`}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className={`w-full flex items-center justify-between px-3 py-2.5 bg-transparent border-0 cursor-pointer font-tajawal text-right gap-2 transition-colors duration-150
              ${featured ? "hover:bg-white/5" : "hover:bg-stone-50"}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">{sec.icon}</span>
              <span className={`text-xs font-bold ${featured ? "text-white/70" : "text-gray-600"}`}>
                {sec.title}
              </span>
            </div>
            <span
              className={`text-sm font-light shrink-0 transition-transform duration-200 ${featured ? "text-purple-300" : "text-violet-500"}`}
              style={{ transform: open === i ? "rotate(45deg)" : "none" }}
            >+</span>
          </button>
          {open === i && (
            <div className="px-3 pb-3 flex flex-col gap-2">
              {sec.features.map((f, j) => (
                <div key={j} className="flex items-start gap-2">
                  <span className={`text-xs mt-0.5 shrink-0 ${featured ? "text-purple-400" : "text-violet-500"}`}>✓</span>
                  <span className={`text-xs leading-relaxed ${featured ? "text-white/70" : "text-gray-500"}`}>{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
