import Image from "next/image";

export type SectionImageSlot =
  | "hero"
  | "whyNow"
  | "howItWorks"
  | "outcomes"
  | "socialProof"
  | "faq"
  | "finalCta";

const SLOT_POSITION: Record<
  SectionImageSlot,
  { position: string; rotation: string; size: string }
> = {
  hero: { position: "top-4 right-4 sm:top-6 sm:right-8", rotation: "rotate-[28deg]", size: "w-32 sm:w-40" },
  whyNow: { position: "top-4 right-4 sm:top-6 sm:right-8", rotation: "rotate-[-12deg]", size: "w-28 sm:w-36" },
  howItWorks: { position: "top-6 left-4 sm:top-8 sm:left-6", rotation: "rotate-[-28deg]", size: "w-28 sm:w-36" },
  outcomes: { position: "top-6 left-4 sm:top-8 sm:left-6", rotation: "rotate-[14deg]", size: "w-28 sm:w-36" },
  socialProof: { position: "top-5 right-4 sm:top-8 sm:right-8", rotation: "rotate-[-16deg]", size: "w-28 sm:w-36" },
  faq: { position: "bottom-8 left-4 sm:bottom-10 sm:left-6", rotation: "rotate-[18deg]", size: "w-24 sm:w-32" },
  finalCta: { position: "bottom-8 right-4 sm:bottom-10 sm:right-6", rotation: "rotate-[-22deg]", size: "w-28 sm:w-36" },
};

/** Section image: per-slot position in empty space, next/image, Server Component. */
export function SectionImage({
  src,
  alt = "",
  priority = false,
  slot = "hero",
}: {
  src?: string;
  alt?: string;
  priority?: boolean;
  /** Placement per section so the image sits in empty space; each section has its own position. */
  slot?: SectionImageSlot;
}) {
  const url = src?.trim();
  if (!url) return null;
  const { position, rotation, size } = SLOT_POSITION[slot];
  return (
    <div
      className={`
        absolute z-0 hidden shrink-0 overflow-hidden rounded-2xl md:block
        aspect-square
        ${position} ${rotation} ${size}
        shadow-xl ring-2 ring-white/20 ring-offset-2 ring-offset-background
      `}
      role="presentation"
      aria-hidden
    >
      <Image
        src={url}
        alt=""
        fill
        sizes="(max-width: 640px) 128px, 160px"
        quality={80}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        placeholder="empty"
        className="object-cover"
      />
    </div>
  );
}
