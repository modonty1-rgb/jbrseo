"use client";

import { useEffect, useRef, useState } from "react";

export function useInView(options?: { once?: boolean; rootMargin?: string }) {
  const { once = true, rootMargin = "0px 0px -8% 0px" } = options ?? {};
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin]);

  return { ref, inView };
}
