import Image from "next/image";
import { landingImages } from "@/app/content/landing-images";

type StaffAvatarProps = {
  avatarUrl?: string;
  avatarColor?: string;
  name: string;
  size?: "sm" | "md" | "full";
};

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  full: "h-full w-full size-full",
};

export function StaffAvatar({
  avatarUrl,
  avatarColor = "from-primary/70 to-primary",
  name,
  size = "md",
}: StaffAvatarProps) {
  const url = avatarUrl?.trim();
  const effectiveUrl = url || landingImages.contactAvatar;
  const showImage = !!effectiveUrl;

  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  const dim = sizeClasses[size];
  const isFull = size === "full";

  if (showImage && effectiveUrl) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden bg-muted ${isFull ? `${dim} rounded-t-2xl` : `rounded-full ${dim}`}`}
      >
        <Image
          src={effectiveUrl}
          alt=""
          fill
          className="object-cover"
          sizes={isFull ? "100vw" : "48px"}
          unoptimized={!!url}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-gradient-to-tr ${avatarColor} text-white ${isFull ? `${dim} rounded-t-2xl text-2xl font-semibold` : `rounded-full ${dim} text-xs font-semibold`}`}
      aria-hidden
    >
      {initials}
    </div>
  );
}
