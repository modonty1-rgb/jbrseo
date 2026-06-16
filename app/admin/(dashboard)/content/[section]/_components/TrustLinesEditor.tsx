"use client";

import { useRef, useState, type ReactElement } from "react";

type TrustLinesEditorProps = {
  defaultValue: string;
  /** Hidden textarea `name` — default `trustLines` (Hero). */
  fieldName?: string;
};

function initialLinesFromDefault(defaultValue: string): string[] {
  if (defaultValue === "") return [];
  return defaultValue.split("\n");
}

export function TrustLinesEditor({
  defaultValue,
  fieldName = "trustLines",
}: TrustLinesEditorProps): ReactElement {
  const hiddenRef = useRef<HTMLTextAreaElement>(null);
  const [lines, setLines] = useState<string[]>(() => initialLinesFromDefault(defaultValue));

  const sync = (newLines: string[]) => {
    setLines(newLines);
    if (hiddenRef.current) {
      hiddenRef.current.value = newLines.join("\n");
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        ref={hiddenRef}
        name={fieldName}
        defaultValue={defaultValue}
        readOnly
        tabIndex={-1}
        aria-hidden
        className="hidden"
      />
      {lines.map((line, i) => (
        <div key={`trust-line-${i}`} className="flex items-center gap-2">
          <input
            type="text"
            value={line}
            onChange={(e) => {
              const updated = [...lines];
              updated[i] = e.target.value;
              sync(updated);
            }}
            className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <button
            type="button"
            onClick={() => sync(lines.filter((_, j) => j !== i))}
            className="text-xs text-destructive hover:text-destructive/80"
            aria-label="إزالة العنصر"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => sync([...lines, ""])}
        className="text-xs text-primary hover:underline"
      >
        + إضافة عنصر
      </button>
    </div>
  );
}
