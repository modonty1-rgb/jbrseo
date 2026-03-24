"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactElement,
} from "react";
import { updateSection } from "@/app/actions/content-sections";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { autoResize } from "@/lib/autoResize";
import { renderMarkdown } from "@/lib/simpleMarkdown";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { cn } from "@/lib/utils";
import { UnsavedChangesBar } from "./UnsavedChangesBar";

const TOOLBAR_ITEMS = [
  { label: "## H2", insert: "\n## " },
  { label: "### H3", insert: "\n### " },
  { label: "**B**", insert: "**نص**" },
  { label: "— فاصل", insert: "\n\n---\n\n" },
] as const;

export type MarkdownPageFormProps = {
  formId: string;
  submitButtonId: string;
  sectionValue: "privacy" | "terms";
  country: SupportedCountry;
  defaultTitle: string;
  defaultUpdatedAt: string;
  defaultBody: string;
  redirectPath: string;
  defaultsHref: string;
  sectionHeading: string;
  bodyLabel: string;
  saveLabel: string;
  idPrefix: string;
  defaultsConfirmMessage: string;
};

export function MarkdownPageForm({
  formId,
  submitButtonId,
  sectionValue,
  country,
  defaultTitle,
  defaultUpdatedAt,
  defaultBody,
  redirectPath,
  defaultsHref,
  sectionHeading,
  bodyLabel,
  saveLabel,
  idPrefix,
  defaultsConfirmMessage,
}: MarkdownPageFormProps): ReactElement {
  const [pending, setPending] = useState(false);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [titleVal, setTitleVal] = useState(defaultTitle);
  const [updatedAtVal, setUpdatedAtVal] = useState(defaultUpdatedAt);
  const [bodyVal, setBodyVal] = useState(defaultBody);

  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const titleId = `${idPrefix}-title`;
  const updatedAtId = `${idPrefix}-updatedAt`;
  const bodyId = `${idPrefix}-body`;

  const wordCount = bodyVal.trim() ? bodyVal.trim().split(/\s+/).length : 0;
  const charCount = bodyVal.length;

  useLayoutEffect(() => {
    if (mode !== "edit" || !bodyRef.current) return;
    const el = bodyRef.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [mode, bodyVal]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (pending) return;
    const form = e.currentTarget;
    const dataInput = form.querySelector(
      'input[name="data"]',
    ) as HTMLInputElement | null;
    if (dataInput) {
      const payload = {
        title: titleVal,
        updatedAt: updatedAtVal || "",
        body: bodyVal,
      };
      dataInput.value = JSON.stringify(payload);
    }
    const fd = new FormData(form);
    try {
      setPending(true);
      await updateSection(fd);
    } finally {
      setPending(false);
    }
  }

  function handleSave(): void {
    const el = document.getElementById(formId);
    if (el instanceof HTMLFormElement) el.requestSubmit();
  }

  function handleBodyInput(ev: FormEvent<HTMLTextAreaElement>): void {
    autoResize(ev);
  }

  function insertAtCursor(insert: string): void {
    const ta = bodyRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newVal = bodyVal.slice(0, start) + insert + bodyVal.slice(end);
    setBodyVal(newVal);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + insert.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  function setUpdatedAtToday(): void {
    const today = new Date().toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setUpdatedAtVal(today);
  }

  const previewHtml = renderMarkdown(bodyVal);

  return (
    <>
      <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="section" value={sectionValue} />
        <input type="hidden" name="redirect" value={redirectPath} />
        <input type="hidden" name="data" value="" />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            {sectionHeading}
          </h2>
          <a
            href={defaultsHref}
            className="text-xs font-semibold text-primary hover:underline"
            onClick={(ev) => {
              if (!confirm(defaultsConfirmMessage)) {
                ev.preventDefault();
              }
            }}
          >
            تحميل القيم الافتراضية
          </a>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor={titleId}
            className="text-xs font-semibold text-muted-foreground"
          >
            عنوان الصفحة
          </Label>
          <Input
            id={titleId}
            name="title"
            type="text"
            value={titleVal}
            onChange={(e) => setTitleVal(e.target.value)}
            className="text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor={updatedAtId}
            className="text-xs font-semibold text-muted-foreground"
          >
            آخر تحديث (اختياري)
          </Label>
          <div className="flex flex-wrap items-stretch gap-2">
            <Input
              id={updatedAtId}
              name="updatedAt"
              type="text"
              value={updatedAtVal}
              onChange={(e) => setUpdatedAtVal(e.target.value)}
              placeholder="مثال: ١ يونيو ٢٠٢٥"
              className="min-w-0 flex-1 text-sm"
            />
            <Button
              type="button"
              variant="outline"
              className="shrink-0 text-xs text-muted-foreground"
              onClick={setUpdatedAtToday}
            >
              اليوم
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label
              htmlFor={bodyId}
              className="text-xs font-semibold text-muted-foreground"
            >
              {bodyLabel}
            </Label>
            <div
              className="flex w-fit gap-1 rounded-md border border-border bg-muted/30 p-1"
              role="tablist"
              aria-label="وضع المحتوى"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "edit"}
                onClick={() => setMode("edit")}
                className={cn(
                  "rounded px-3 py-1 text-xs font-medium transition-colors",
                  mode === "edit"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                تحرير
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "preview"}
                onClick={() => setMode("preview")}
                className={cn(
                  "rounded px-3 py-1 text-xs font-medium transition-colors",
                  mode === "preview"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                معاينة
              </button>
            </div>
          </div>

          {mode === "edit" ? (
            <>
              <div className="mb-1 flex flex-wrap gap-1">
                {TOOLBAR_ITEMS.map((tool) => (
                  <button
                    key={tool.label}
                    type="button"
                    onClick={() => insertAtCursor(tool.insert)}
                    className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  >
                    {tool.label}
                  </button>
                ))}
              </div>
              <Textarea
                ref={bodyRef}
                id={bodyId}
                name="body"
                rows={4}
                value={bodyVal}
                onChange={(e) => setBodyVal(e.target.value)}
                onInput={handleBodyInput}
                dir="rtl"
                className={cn(
                  "min-h-[240px] resize-y font-mono text-sm",
                  "px-3 py-2",
                )}
              />
            </>
          ) : (
            <>
              <input type="hidden" name="body" value={bodyVal} />
              <div
                className="prose prose-sm prose-invert max-w-none min-h-[240px] rounded-md border border-border bg-muted/10 px-4 py-3 text-foreground prose-p:mb-2 prose-headings:text-foreground"
                dir="rtl"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </>
          )}

          <p className="mt-1 text-end text-xs text-muted-foreground">
            {charCount} حرف · {wordCount} كلمة
          </p>
        </div>

        <button
          type="submit"
          id={submitButtonId}
          className="hidden"
          tabIndex={-1}
          aria-hidden
        />
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={handleSave}
          disabled={pending}
        >
          {saveLabel}
        </Button>
      </form>

      <UnsavedChangesBar
        formId={formId}
        message={`تغييرات غير محفوظة — ${sectionHeading}`}
      />
    </>
  );
}
