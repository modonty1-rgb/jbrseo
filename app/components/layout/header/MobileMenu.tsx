"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Menu } from "lucide-react";
import type { MobileMenuNavLink } from "./MobileMenuDrawer";

// The drawer body (Radix Dialog + icons + ThemeToggle) is the heavy part and
// only matters once the hamburger is used, so it is lazy-loaded client-only.
// Its JS stays off the initial mobile bundle; the trigger button below ships eager.
const MobileMenuDrawer = dynamic(
  () => import("./MobileMenuDrawer").then((m) => m.MobileMenuDrawer),
  { ssr: false },
);

type Props = {
  navLinks: MobileMenuNavLink[];
  whatsappHref: string;
  phoneDisplay: string;
};

export function MobileMenu({ navLinks, whatsappHref, phoneDisplay }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Warm the drawer chunk on first hover/touch/focus — a beat before the tap —
  // so its slide-in animation plays intact on the very first open. If the tap
  // beats the fetch, mounting already-open still triggers Sheet's `animate-in`
  // keyframes (they run on mount, not via a closed→open transition).
  const warm = () => setMounted(true);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
        onPointerEnter={warm}
        onTouchStart={warm}
        onFocus={warm}
        aria-label="فتح القائمة"
        aria-expanded={open}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white/40 lg:hidden"
      >
        <Menu className="h-5 w-5" strokeWidth={2.5} />
      </button>

      {mounted && (
        <MobileMenuDrawer
          open={open}
          onOpenChange={setOpen}
          navLinks={navLinks}
          whatsappHref={whatsappHref}
          phoneDisplay={phoneDisplay}
        />
      )}
    </>
  );
}
