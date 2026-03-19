"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(
  () => import("@/app/components/layout/ChatWidget/ChatWidget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false, loading: () => null }
);

export function ChatWidgetLazy() {
  return <ChatWidget />;
}
