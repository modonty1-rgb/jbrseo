"use client";

import Image from "next/image";
import { useState, type ReactElement } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/lib/utils";

type ImageUrlFieldProps = {
  id: string;
  name: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  previewClass?: string;
  aspectHint?: string;
};

export function ImageUrlField({
  id,
  name,
  label,
  hint,
  value,
  onChange,
  placeholder = "https://...",
  previewClass = "h-12 w-12 rounded-full object-cover",
  aspectHint,
}: ImageUrlFieldProps): ReactElement {
  const [broken, setBroken] = useState(false);
  const trimmed = value.trim();
  const showPreview = trimmed.length > 0 && !broken;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground">
        {label}
      </Label>
      {hint ? (
        <p className="text-[10px] text-muted-foreground">{hint}</p>
      ) : null}
      <div className="flex flex-wrap items-start gap-3">
        <div
          className={cn(
            "relative shrink-0 overflow-hidden border border-border bg-muted/30",
            previewClass,
          )}
        >
          {showPreview ? (
            <Image
              src={trimmed}
              alt=""
              fill
              className="object-cover"
              sizes="96px"
              unoptimized
              onError={() => setBroken(true)}
              onLoad={() => setBroken(false)}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
              —
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <Input
            id={id}
            name={name}
            type="url"
            value={value}
            onChange={(e) => {
              setBroken(false);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            dir="ltr"
            className="text-xs"
          />
          {aspectHint ? (
            <p className="text-[10px] text-muted-foreground">{aspectHint}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
