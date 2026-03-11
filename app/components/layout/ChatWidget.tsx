"use client";

import { useEffect } from "react";
import HEYO from "@heyo.so/js";

export function ChatWidget() {
  const projectId = process.env.NEXT_PUBLIC_HEYO_PROJECT_ID;

  useEffect(() => {
    if (!projectId) return;
    HEYO.init({ projectId });
  }, [projectId]);

  if (!projectId) return null;
  return null;
}
