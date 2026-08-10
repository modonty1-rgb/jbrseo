"use client";

import { useEffect } from "react";

/**
 * Scrolls to the `#id` in the address bar once that element actually exists.
 *
 * Next scrolls to a hash on navigation, but this landing streams behind a `loading.tsx`:
 * when the router looks for `#pricing` the page is still the skeleton, so it finds
 * nothing and gives up. The reader clicking "الأسعار" from /about then arrived at the
 * top of the landing — right URL, wrong place, and no second chance.
 *
 * A direct page load is unaffected: the browser has already scrolled there, and calling
 * this again lands on the same spot.
 */
export function ScrollToHash() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    let cancelled = false;
    // Give up rather than spin forever on a hash that names nothing on this page.
    const deadline = performance.now() + 5000;

    const findAndScroll = () => {
      if (cancelled) return;
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ block: "start" });
        return;
      }
      if (performance.now() < deadline) requestAnimationFrame(findAndScroll);
    };

    requestAnimationFrame(findAndScroll);
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
