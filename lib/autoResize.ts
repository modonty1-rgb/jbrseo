import type { FormEvent } from "react";

export function autoResize(e: FormEvent<HTMLTextAreaElement>): void {
  const t = e.currentTarget;
  t.style.height = "auto";
  t.style.height = `${t.scrollHeight}px`;
}
