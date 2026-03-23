"use client";

import { useState, useCallback } from "react";
import { Button } from "@/app/components/ui/button";

type Item = { emoji: string; code: string; name?: string };

export function EmojiGrid({ items }: { items: Item[] }) {
  return (
    <ul className="flex flex-wrap gap-3 p-4">
      {items.map((item, i) => (
        <li key={`${item.emoji}-${i}`}>
          <EmojiCard emoji={item.emoji} code={item.code} name={item.name} />
        </li>
      ))}
    </ul>
  );
}

function EmojiCard({ emoji, code, name }: Item) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    void navigator.clipboard.writeText(emoji).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [emoji]);

  return (
    <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-3 text-center min-w-[100px] hover:bg-muted/30 transition-colors">
      <span className="text-3xl" aria-hidden>{emoji}</span>
      <code className="text-xs text-muted-foreground font-mono">{code}</code>
      <span className="text-xs text-muted-foreground line-clamp-2 max-w-[120px]" title={name || undefined}>{name || "—"}</span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={copy}
        className="h-auto w-full px-2 py-1 text-xs"
      >
        {copied ? "تم النسخ" : "نسخ"}
      </Button>
    </div>
  );
}
