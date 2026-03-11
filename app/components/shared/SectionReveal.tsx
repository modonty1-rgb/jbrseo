import type { ReactNode } from "react";

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
  return (
    <Tag className={`relative ${className}`}>
      {showSectionCounter && sectionNumber != null && (
        <span
          aria-hidden="true"
          className="
            pointer-events-none select-none
            absolute -top-6 end-4 z-0
            font-black leading-none tabular-nums
            text-[8rem] text-foreground/4
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
    <Tag className={className}>
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return <div className={`si ${className}`}>{children}</div>;
}
