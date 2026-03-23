"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ChatWidget = dynamic(
  () => import("@/app/components/layout/ChatWidget/ChatWidget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false, loading: () => null }
);

export function ChatWidgetLazy() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Delay loading the chat widget until user interacts or 5s pass
    const loadWidget = () => setShow(true);
    const timeoutId = setTimeout(loadWidget, 5000);
    const events = ["scroll", "mousemove", "keydown", "touchstart"];
    
    const handleEvent = () => {
      loadWidget();
      events.forEach(e => window.removeEventListener(e, handleEvent));
      clearTimeout(timeoutId);
    };

    events.forEach(e => window.addEventListener(e, handleEvent, { once: true, passive: true }));

    return () => {
      events.forEach(e => window.removeEventListener(e, handleEvent));
      clearTimeout(timeoutId);
    };
  }, []);

  if (!show) return null;
  return <ChatWidget />;
}
