"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactElement,
} from "react";
import { updateSection } from "@/app/actions/content-sections";
import { autoResize } from "@/lib/autoResize";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";

export type MarkdownPageFormProps = {
  formId: string;
  submitButtonId: string;
  sectionValue: "privacy" | "terms";
  defaultTitle: string;
  defaultUpdatedAt: string;
  defaultBody: string;
  redirectPath: string;
  sectionHeading: string;
  bodyLabel: string;
  saveLabel: string;
  idPrefix: string;
};

const LABEL = "text-sm font-medium text-foreground";
const FIELD = "flex flex-col gap-1.5";
const INPUT = "rounded-md border border-border bg-background px-3 py-2 text-sm";

export function MarkdownPageForm({
  formId,
  submitButtonId,
  sectionValue,
  defaultTitle,
  defaultUpdatedAt,
  defaultBody,
  redirectPath,
  sectionHeading,
  bodyLabel,
  idPrefix,
}: MarkdownPageFormProps): ReactElement {
  const [pending, setPending] = useState(false);
  const [titleVal, setTitleVal] = useState(defaultTitle);
  const [updatedAtVal, setUpdatedAtVal] = useState(defaultUpdatedAt);
  const [bodyVal, setBodyVal] = useState(defaultBody);

  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const titleId = `${idPrefix}-title`;
  const updatedAtId = `${idPrefix}-updatedAt`;
  const bodyId = `${idPrefix}-body`;

  useLayoutEffect(() => {
    if (!bodyRef.current) return;
    const el = bodyRef.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [bodyVal]);

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

  function setUpdatedAtToday(): void {
    const today = new Date().toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setUpdatedAtVal(today);
  }

  return (
    <>
      <form id={formId} onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="section" value={sectionValue} />
        <input type="hidden" name="redirect" value={redirectPath} />
        <input type="hidden" name="data" value="" />

        <div className="grid gap-4 md:grid-cols-2">
          <div className={FIELD}>
            <label className={LABEL} htmlFor={titleId}>عنوان الصفحة</label>
            <Input
              id={titleId}
              name="title"
              type="text"
              value={titleVal}
              onChange={(e) => setTitleVal(e.target.value)}
              className={INPUT}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor={updatedAtId}>آخر تحديث (اختياري)</label>
            <div className="flex flex-wrap items-stretch gap-2">
              <Input
                id={updatedAtId}
                name="updatedAt"
                type="text"
                value={updatedAtVal}
                onChange={(e) => setUpdatedAtVal(e.target.value)}
                className={`${INPUT} min-w-0 flex-1`}
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
        </div>

        <div className={FIELD}>
          <label className={LABEL} htmlFor={bodyId}>{bodyLabel}</label>
          <Textarea
            ref={bodyRef}
            id={bodyId}
            name="body"
            rows={10}
            value={bodyVal}
            onChange={(e) => setBodyVal(e.target.value)}
            onInput={handleBodyInput}
            dir="rtl"
            className="min-h-60 resize-none overflow-hidden rounded-md border border-border bg-background px-3 py-2 font-mono text-sm"
          />
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
          حفظ
        </Button>
      </form>
    </>
  );
}
