import type { ReactElement } from "react";

type HeroSloganProps = {
  tagline: string;
};

export function HeroSlogan({ tagline }: HeroSloganProps): ReactElement {
  return (
    <div className="landing-reveal-content mt-5 mb-4 inline-flex items-center gap-3">
      <span
        aria-hidden
        className="h-px w-8 rounded-full"
        style={{ background: "linear-gradient(to left, var(--accent), transparent)" }}
      />
      <span
        className="text-[15px] font-black tracking-[.06em]"
        style={{
          background: "linear-gradient(to left, var(--accent), var(--primary))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {tagline}
      </span>
      <span
        aria-hidden
        className="h-px w-8 rounded-full"
        style={{ background: "linear-gradient(to right, var(--accent), transparent)" }}
      />
    </div>
  );
}
