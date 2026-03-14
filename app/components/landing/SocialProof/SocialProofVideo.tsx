"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Icon } from "@/app/components/Icon";

type SocialProofVideoProps = {
  url: string;
  title: string;
};

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/shorts/")) {
        return u.pathname.split("/")[2] || null;
      }
      if (u.searchParams.has("v")) {
        return u.searchParams.get("v");
      }
    }
    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1) || null;
    }
  } catch {
    return null;
  }
  return null;
}

export function SocialProofVideo({ url, title }: SocialProofVideoProps) {
  const [active, setActive] = useState(false);
  const videoId = useMemo(() => extractYouTubeId(url), [url]);

  if (!videoId) return null;

  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const iframeSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div className="relative mb-5 overflow-hidden rounded-[18px] border border-border/60 bg-black/40 sm:mb-7">
      {!active ? (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group relative block w-full outline-none"
        >
          <div className="relative aspect-video w-full">
            <Image
              src={thumb}
              alt={title}
              width={480}
              height={360}
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              unoptimized
              className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-black shadow-lg transition group-hover:scale-105">
                <span className="ps-0.5 text-xl"><Icon emoji="▶" label="تشغيل" /></span>
              </div>
            </div>
          </div>
        </button>
      ) : (
        <div className="relative aspect-video w-full">
          <iframe
            src={iframeSrc}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      )}
    </div>
  );
}

