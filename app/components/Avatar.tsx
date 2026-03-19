import Image from "next/image";
import { cl } from "@/helpers/cloudinary";
import { cn } from "@/lib/utils";

const PLACEHOLDER_AVATAR = cl(
  "https://res.cloudinary.com/dfegnpgwx/image/upload/w_96,c_fill,g_face/v1771979297/modonatyAvatar_scfhac.png"
);

const AVATAR_COLORS = [
  "oklch(0.55 0.22 265)",
  "oklch(0.52 0.19 142)",
  "oklch(0.58 0.2 25)",
  "oklch(0.5 0.2 300)",
  "oklch(0.54 0.18 200)",
] as const;

function getInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const first = trimmed[0];
  return first;
}

function getColor(name: string): string {
  let n = 0;
  for (let i = 0; i < name.length; i++) {
    n = (n * 17 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

type AvatarProps = {
  name: string;
  src?: string | null;
  size?: "sm" | "md";
  className?: string;
};

const sizeClasses = { sm: "h-9 w-9 text-sm", md: "h-10 w-10 sm:h-12 sm:w-12 text-base" } as const;

export function Avatar({ name, src, size = "md", className = "" }: AvatarProps) {
  const effectiveSrc = src?.trim();
  const usePlaceholder = !effectiveSrc || effectiveSrc === PLACEHOLDER_AVATAR;
  const initial = getInitial(name);
  const color = getColor(name);
  const sizeClass = sizeClasses[size];

  if (usePlaceholder) {
    return (
      <div
        className={cn("flex shrink-0 items-center justify-center overflow-hidden font-bold text-white", sizeClass, className, "rounded-full")}
        style={{ backgroundColor: color }}
        aria-hidden
      >
        {initial}
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
      />
    </div>
  );
}
