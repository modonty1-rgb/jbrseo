"use client";

import type { ReactNode } from "react";
import { useState, useEffect, useRef } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import { useCountUp } from "./useCountUp";
import { WhyNowTimeline } from "./WhyNowTimeline";
import { WhyNowCounter } from "./WhyNowCounter";

type Props = {
  children: ReactNode;
  costs: StaticLanding["whyNow"]["costs"];
  daysTarget: number;
};

export function WhyNowInteractive({ children, costs, daysTarget }: Props) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    const el = wrapperRef.current;
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setActive((a) => (a + 1) % costs.length),
      3200
    );
    return () => clearInterval(t);
  }, [costs.length]);

  const days = useCountUp(daysTarget, 1800, visible);

  return (
    <div
      ref={wrapperRef}
      className="grid grid-cols-1 gap-6 mb-14 lg:grid-cols-2 lg:gap-8 lg:items-start"
    >
      <WhyNowTimeline
        costs={costs}
        active={active}
        onSelect={setActive}
      />
      <div className="flex flex-col gap-4">
        <WhyNowCounter days={days} />
        {children}
      </div>
    </div>
  );
}
