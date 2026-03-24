"use client";

import {
  useLayoutEffect,
  useRef,
  type FormEvent,
  type ReactElement,
} from "react";
import { autoResize } from "@/lib/autoResize";
import {
  DEFAULT_TEAM_AVATAR_GRADIENT,
  GRADIENT_PRESETS,
} from "@/lib/teamPresets";
import { cn } from "@/lib/utils";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { ImageUrlField } from "./ImageUrlField";

export type MemberCardMember = {
  name: string;
  role: string;
  bio: string;
  avatarColor: string;
  avatarUrl: string;
};

type MemberCardProps = {
  sectionPrefix: "core" | "exec";
  index: number;
  member: MemberCardMember;
  onUpdate: (field: keyof MemberCardMember, value: string) => void;
  canDelete: boolean;
  onDelete?: () => void;
};

export function MemberCard({
  sectionPrefix,
  index,
  member,
  onUpdate,
  canDelete,
  onDelete,
}: MemberCardProps): ReactElement {
  const fieldPrefix = `${sectionPrefix}_${index}`;
  const idRoot = `team-${sectionPrefix}-${index}`;
  const nameId = `${idRoot}-name`;
  const roleId = `${idRoot}-role`;
  const bioId = `${idRoot}-bio`;
  const avatarUrlId = `${idRoot}-avatarUrl`;

  const nameVal = member.name ?? "";
  const roleVal = member.role ?? "";
  const bioVal = member.bio ?? "";
  const colorVal = member.avatarColor?.trim() || DEFAULT_TEAM_AVATAR_GRADIENT;
  const initial = nameVal.trim().charAt(0) || "؟";

  const bioRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = bioRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [bioVal]);

  function handleBioInput(e: FormEvent<HTMLTextAreaElement>): void {
    autoResize(e);
  }

  const bioLen = bioVal.length;
  const bioHintClass =
    bioLen > 120 ? "text-destructive" : "text-muted-foreground";

  return (
    <div className="space-y-3 rounded-md border border-border/60 bg-card/40 p-3">
      <input type="hidden" name={`${fieldPrefix}_avatarColor`} value={colorVal} />

      <div className="mb-3 flex items-center justify-between gap-2 border-b border-border/40 pb-2">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white",
              colorVal,
            )}
          >
            {initial}
          </div>
          <span className="truncate text-xs font-semibold text-foreground">
            {nameVal.trim() || "عضو جديد"}
          </span>
        </div>
        {canDelete && onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="shrink-0 text-xs text-destructive hover:underline"
          >
            حذف
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={nameId} className="text-[11px] font-semibold text-muted-foreground">
          الاسم
        </Label>
        <Input
          id={nameId}
          name={`${fieldPrefix}_name`}
          type="text"
          value={nameVal}
          onChange={(e) => onUpdate("name", e.target.value)}
          className="text-xs"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={roleId} className="text-[11px] font-semibold text-muted-foreground">
          الدور
        </Label>
        <Input
          id={roleId}
          name={`${fieldPrefix}_role`}
          type="text"
          value={roleVal}
          onChange={(e) => onUpdate("role", e.target.value)}
          className="text-xs"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={bioId} className="text-[11px] font-semibold text-muted-foreground">
          وصف قصير
        </Label>
        <Textarea
          ref={bioRef}
          id={bioId}
          name={`${fieldPrefix}_bio`}
          rows={2}
          value={bioVal}
          onChange={(e) => onUpdate("bio", e.target.value)}
          onInput={handleBioInput}
          className="min-h-0 resize-none px-2 py-1.5 text-[11px]"
        />
        <p className={cn("mt-0.5 text-end text-[10px]", bioHintClass)}>
          {bioLen}/120 حرف
        </p>
      </div>

      <ImageUrlField
        id={avatarUrlId}
        name={`${fieldPrefix}_avatarUrl`}
        label="صورة العضو"
        hint="رابط صورة مربعة (1:1) — من Cloudinary مُفضّل"
        value={member.avatarUrl ?? ""}
        onChange={(v) => onUpdate("avatarUrl", v)}
        previewClass="h-12 w-12 rounded-full object-cover"
        aspectHint="مربّعة 1:1"
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold text-muted-foreground">
          لون الأفاتار (عند غياب الصورة)
        </span>
        <div className="flex flex-wrap gap-1.5">
          {GRADIENT_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              title={preset.label}
              onClick={() => onUpdate("avatarColor", preset.value)}
              className={cn(
                "h-6 w-6 rounded-full bg-gradient-to-br p-0 ring-2 ring-offset-1 ring-offset-background transition-all",
                preset.value,
                colorVal === preset.value
                  ? "ring-primary scale-110"
                  : "ring-transparent hover:ring-border",
              )}
              aria-label={preset.label}
            />
          ))}
        </div>
        <Input
          type="text"
          value={colorVal}
          onChange={(e) => onUpdate("avatarColor", e.target.value)}
          placeholder={DEFAULT_TEAM_AVATAR_GRADIENT}
          dir="ltr"
          className="h-7 px-2 font-mono text-[11px] text-muted-foreground"
          aria-label="قيمة تدرج مخصصة"
        />
      </div>
    </div>
  );
}
