"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { cl } from "@/helpers/cloudinary";
import { cn } from "@/lib/utils";

const PLACEHOLDER_AVATAR = cl(
  "https://res.cloudinary.com/dfegnpgwx/image/upload/w_96,c_fill,g_face/v1771979297/modonatyAvatar_scfhac.png"
);

const GRADIENTS = [
  "linear-gradient(135deg, oklch(0.45 0.22 265), oklch(0.35 0.26 280))",
  "linear-gradient(135deg, oklch(0.42 0.19 142), oklch(0.34 0.22 160))",
  "linear-gradient(135deg, oklch(0.48 0.2 25), oklch(0.38 0.24 10))",
  "linear-gradient(135deg, oklch(0.4 0.2 300), oklch(0.32 0.24 315))",
  "linear-gradient(135deg, oklch(0.44 0.18 200), oklch(0.36 0.22 215))",
] as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getGradient(name: string): string {
  let n = 0;
  for (let i = 0; i < name.length; i++) n = (n * 17 + name.charCodeAt(i)) >>> 0;
  return GRADIENTS[n % GRADIENTS.length];
}

function isValidImageSrc(s: string): boolean {
  const t = s.trim();
  if (!t) return false;
  if (t.startsWith("/")) return true;
  try {
    const u = new URL(t);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

type AvatarProps = {
  name: string;
  src?: string | null;
  size?: "sm" | "md";
  className?: string;
};

const sizeClasses = { sm: "h-9 w-9 text-[10px]", md: "h-10 w-10 sm:h-12 sm:w-12 text-[11px]" } as const;

export function Avatar({ name, src, size = "md", className = "" }: AvatarProps): React.JSX.Element {
  const effectiveSrc = src?.trim() ?? "";
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [effectiveSrc]);

  const onImgError = useCallback(() => {
    setImgError(true);
  }, []);

  const usePlaceholder =
    imgError ||
    !isValidImageSrc(effectiveSrc) ||
    effectiveSrc === PLACEHOLDER_AVATAR;

  const sizeClass = sizeClasses[size];

  if (usePlaceholder) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden font-bold tracking-tight text-white ring-2 ring-white/20",
          sizeClass,
          className,
          "rounded-full"
        )}
        style={{ background: getGradient(name) }}
        aria-hidden
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className={cn("relative shrink-0 overflow-hidden", sizeClass, className, "rounded-full")}>
      <Image
        src={effectiveSrc}
        alt={name}
        fill
        className="object-cover rounded-full"
        sizes={size === "sm" ? "40px" : "48px"}
        onError={onImgError}
      />
    </div>
  );
}
