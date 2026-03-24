"use client";

import type { ReactElement } from "react";
import { Button } from "@/app/components/ui/button";
import { MemberCard, type MemberCardMember } from "./MemberCard";

type TeamSectionEditorProps = {
  sectionPrefix: "core" | "exec";
  title: string;
  addButtonLabel: string;
  members: MemberCardMember[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof MemberCardMember, value: string) => void;
};

export function TeamSectionEditor({
  sectionPrefix,
  title,
  addButtonLabel,
  members,
  onAdd,
  onRemove,
  onUpdate,
}: TeamSectionEditorProps): ReactElement {
  const count = members.length;
  const canRemove = count > 1;

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            {count} عضو
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          className="h-auto border-primary/40 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10"
        >
          <span className="me-1">+</span>
          {addButtonLabel}
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member, index) => (
          <MemberCard
            key={`${sectionPrefix}-${index}`}
            sectionPrefix={sectionPrefix}
            index={index}
            member={member}
            onUpdate={(field, value) => onUpdate(index, field, value)}
            canDelete={canRemove}
            onDelete={canRemove ? () => onRemove(index) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
