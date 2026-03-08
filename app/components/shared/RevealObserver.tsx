"use client";

import { useEffect } from "react";

export function RevealObserver() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute("data-v", "");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const root = entry.target as HTMLElement;
          const delay = Number(root.dataset.staggerDelay ?? 90);
          root.querySelectorAll<HTMLElement>(".si").forEach((item, i) => {
            item.style.setProperty("--d", `${i * delay}ms`);
            item.setAttribute("data-v", "");
          });
          staggerObserver.unobserve(root);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    const observeAll = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not([data-v])")
        .forEach((el) => revealObserver.observe(el));

      document
        .querySelectorAll<HTMLElement>(".stagger-root:not([data-obs])")
        .forEach((el) => {
          el.setAttribute("data-obs", "");
          staggerObserver.observe(el);
        });
    };

    observeAll();

    const mutationObserver = new MutationObserver(observeAll);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      revealObserver.disconnect();
      staggerObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
