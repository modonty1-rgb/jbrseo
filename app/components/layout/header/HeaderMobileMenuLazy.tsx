"use client";

import dynamic from "next/dynamic";

type NavLink = { href: string; label: string };

type Props = {
  navLinks: NavLink[];
  ctaLabel: string;
  pricingHref: string;
  bannerText: string;
};

function BurgerSkeleton() {
  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-foreground"
      aria-label="فتح القائمة"
      aria-hidden
      tabIndex={-1}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <line x1="4" y1="8" x2="20" y2="8" />
        <line x1="4" y1="16" x2="20" y2="16" />
      </svg>
    </button>
  );
}

const HeaderMobileMenu = dynamic(
  () =>
    import("./HeaderMobileMenu").then((mod) => mod.HeaderMobileMenu),
  {
    ssr: false,
    loading: () => <BurgerSkeleton />,
  }
);

export function HeaderMobileMenuLazy(props: Props) {
  return <HeaderMobileMenu {...props} />;
}
