import type { CSSProperties, ReactNode } from "react";

type AnimVariant = "blur-in" | "fade-up" | "slide-rtl" | "scale-pop" | "none";

type SectionRevealProps = {
  children:            ReactNode;
  variant?:            AnimVariant;
  delay?:              number;
  sectionNumber?:      number;
  showSectionCounter?: boolean;
  className?:          string;
  as?:                 "div" | "section" | "article" | "aside";
};

type StaggerRevealProps = {
  children:   ReactNode;
  className?: string;
  itemDelay?: number;
  as?:        "div" | "ul" | "ol" | "section";
};

type StaggerItemProps = {
  children:   ReactNode;
  className?: string;
};

export function SectionReveal({
  children,
  variant = "blur-in",
  delay = 0,
  sectionNumber,
  showSectionCounter,
  className = "",
  as: Tag = "div",
}: SectionRevealProps) {
  if (variant === "none") {
    return <Tag className={`relative ${className}`}>{children}</Tag>;
  }

  return (
    <Tag
      className={`relative ${className}`}
      data-reveal={variant}
      style={delay > 0 ? ({ "--d": `${delay}ms` } as CSSProperties) : undefined}
    >
      {showSectionCounter && sectionNumber != null && (
        <span
          aria-hidden="true"
          className="
            pointer-events-none select-none
            absolute -top-6 end-4 z-0
            font-black leading-none tabular-nums
            text-[8rem] text-foreground/[0.04]
            sm:text-[11rem] lg:text-[14rem]
          "
        >
          {String(sectionNumber).padStart(2, "0")}
        </span>
      )}
      {children}
    </Tag>
  );
}

export function StaggerReveal({
  children,
  className = "",
  itemDelay = 90,
  as: Tag = "div",
}: StaggerRevealProps) {
  return (
    <Tag
      className={`stagger-root ${className}`}
      data-stagger-delay={itemDelay}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return <div className={`si ${className}`}>{children}</div>;
}
