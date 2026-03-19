"use client";

import { useEffect, useRef } from "react";
import HEYO from "@heyo.so/js";

const DEFER_MS = 4000;

export function ChatWidget() {
  const projectId = process.env.NEXT_PUBLIC_HEYO_PROJECT_ID;
  const inited = useRef(false);

  useEffect(() => {
    if (!projectId || inited.current) return;

    const init = () => {
      if (inited.current) return;
      inited.current = true;
      HEYO.init({ projectId });
      window.removeEventListener("scroll", init, { capture: true });
      window.removeEventListener("click", init, { capture: true });
    };

    const t = setTimeout(init, DEFER_MS);
    window.addEventListener("scroll", init, { capture: true, once: true });
    window.addEventListener("click", init, { capture: true, once: true });

    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", init, { capture: true });
      window.removeEventListener("click", init, { capture: true });
    };
  }, [projectId]);

  if (!projectId) return null;
  return null;
}
