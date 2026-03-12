"use client";

import Image from "next/image";
import type { Testimonial } from "@/app/content/landing/types";
import { SocialProofVideo } from "./SocialProofVideo";

type SocialProofCardProps = {
  testimonial: Testimonial;
};

export function SocialProofCard({ testimonial }: SocialProofCardProps) {
  const { name, role, quote, metric, avatarImg, stars, tag, videoUrl, videoLabel } = testimonial;
  const effectiveVideoUrl = videoUrl ?? "https://www.youtube.com/shorts/6SMagY8K2Jc";
  return (
    <div
      className="relative overflow-hidden rounded-[20px] border border-border bg-card p-5 shadow-[0_4px_24px_color-mix(in_oklch,var(--foreground)_5%,transparent)] sm:p-8"
      style={{ animation: "slide-in-up .35s ease both" }}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] rounded-t-[22px]"
        style={{ background: "linear-gradient(to left, var(--accent), var(--primary))" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute start-8 top-6 select-none font-serif text-[96px] font-black leading-none"
        style={{ color: "color-mix(in oklch, var(--accent) 6%, transparent)" }}
      >
        "
      </span>
      {effectiveVideoUrl && <SocialProofVideo url={effectiveVideoUrl} title={videoLabel ?? name} />}
      <p className="mb-3 text-[14px] tracking-[2px] text-accent sm:mb-5 sm:text-[16px]" aria-label={`${stars} نجوم`}>
        {"★".repeat(stars)}
      </p>
      <p className="relative z-10 mb-5 text-[15px] font-medium leading-[1.85] text-foreground sm:mb-7 sm:text-[18px]">
        &quot;{quote}&quot;
      </p>
      <span
        className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black sm:mb-6 sm:px-3.5 sm:py-1.5 sm:text-[12px]"
        style={{
          background: "color-mix(in oklch, var(--success) 10%, transparent)",
          border: "1px solid color-mix(in oklch, var(--success) 25%, transparent)",
          color: "var(--success)",
        }}
      >
        ✓ {metric}
      </span>
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full shadow-[0_4px_12px_color-mix(in_oklch,var(--primary)_20%,transparent)] sm:h-12 sm:w-12">
          <Image src={avatarImg} alt={name} fill className="object-cover" sizes="48px" unoptimized />
        </div>
        <div>
          <p className="text-[13px] font-black text-foreground sm:text-[15px]">{name}</p>
          <p className="text-[11px] text-muted-foreground sm:text-[12px]">{role}</p>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-black sm:px-3 sm:text-[11px]"
          style={{
            background: "color-mix(in oklch, var(--accent) 8%, transparent)",
            border: "1px solid color-mix(in oklch, var(--accent) 18%, transparent)",
            color: "var(--accent)",
          }}
        >
          {tag}
        </span>
        {effectiveVideoUrl && (
          <a
            href={effectiveVideoUrl}
            target="_blank"
            rel="noreferrer"
            className="ms-auto inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold text-primary transition hover:bg-primary/10 sm:text-[11px]"
          >
            <span className="text-xs">▶</span>
            <span>{videoLabel ?? "شاهد القصة"}</span>
          </a>
        )}
      </div>
    </div>
  );
}
