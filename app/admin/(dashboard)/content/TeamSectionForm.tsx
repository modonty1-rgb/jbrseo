"use client";

import { useState } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateTeamSection } from "@/app/actions/content-sections";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";

type TeamSectionFormProps = {
  section: StaticLanding["team"];
  country: SupportedCountry;
};

type EditableMember = {
  name: string;
  role: string;
  bio: string;
  avatarColor: string;
  avatarUrl: string;
};

type MemberFieldsProps = {
  prefix: string;
  member: EditableMember;
  onUpdate: (field: keyof EditableMember, value: string) => void;
  onRemove?: () => void;
  showRemove?: boolean;
};

function MemberFields({ prefix, member, onUpdate, onRemove, showRemove }: MemberFieldsProps) {
  const name = member.name ?? "";
  const role = member.role ?? "";
  const bio = member.bio ?? "";
  const avatarUrl = member.avatarUrl ?? "";
  const avatarColor = member.avatarColor ?? DEFAULT_AVATAR;
  return (
    <div className="space-y-2 rounded-md border border-border/60 bg-card/40 p-3">
      <div className="flex items-start justify-between gap-2">
        <label className="flex-1 flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
          الاسم
          <Input
            name={`${prefix}_name`}
            value={name}
            onChange={(e) => onUpdate("name", e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs"
          />
        </label>
        {showRemove && onRemove ? (
          <Button
            type="button"
            variant="outline"
            onClick={onRemove}
            className="mt-5 h-auto border-destructive/40 bg-destructive/5 px-2 py-1 text-[10px] font-semibold text-destructive hover:bg-destructive/10"
          >
            حذف
          </Button>
        ) : null}
      </div>
      <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
        الدور
        <Input
          name={`${prefix}_role`}
          value={role}
          onChange={(e) => onUpdate("role", e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs"
        />
      </label>
      <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
        وصف قصير
        <Textarea
          name={`${prefix}_bio`}
          value={bio}
          onChange={(e) => onUpdate("bio", e.target.value)}
          className="min-h-[60px] rounded-md border border-border bg-background px-2 py-1 text-[11px]"
        />
      </label>
      <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
        صورة العضو (رابط)
        <Input
          name={`${prefix}_avatarUrl`}
          value={avatarUrl}
          onChange={(e) => onUpdate("avatarUrl", e.target.value)}
          placeholder="https://..."
          className="rounded-md border border-border bg-background px-2 py-1 text-xs"
        />
      </label>
      <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
        لون الأفاتار عند عدم وجود صورة (مثل from-primary/70 to-primary)
        <Input
          name={`${prefix}_avatarColor`}
          value={avatarColor}
          onChange={(e) => onUpdate("avatarColor", e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs font-mono"
        />
      </label>
    </div>
  );
}

const DEFAULT_AVATAR = "from-primary/70 to-primary";

const emptyMember = (): EditableMember => ({
  name: "",
  role: "",
  bio: "",
  avatarColor: DEFAULT_AVATAR,
  avatarUrl: "",
});

export function TeamSectionForm({ section, country }: TeamSectionFormProps) {
  const toEditable = (m: { name: string; role: string; bio: string; avatarColor: string; avatarUrl?: string }): EditableMember => ({
    ...m,
    avatarUrl: m.avatarUrl ?? "",
  });

  const [coreMembers, setCoreMembers] = useState<EditableMember[]>(
    section.coreTeam.length > 0 ? section.coreTeam.map(toEditable) : [emptyMember()],
  );

  const [execMembers, setExecMembers] = useState<EditableMember[]>(
    section.executionTeam.length > 0 ? section.executionTeam.map(toEditable) : [emptyMember()],
  );

  const addCoreMember = () => {
    setCoreMembers((prev) => [...prev, emptyMember()]);
  };

  const removeCoreMember = (index: number) => {
    setCoreMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const addExecMember = () => {
    setExecMembers((prev) => [...prev, emptyMember()]);
  };

  const removeExecMember = (index: number) => {
    setExecMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCoreMember = (index: number, field: keyof EditableMember, value: string) => {
    setCoreMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    );
  };

  const updateExecMember = (index: number, field: keyof EditableMember, value: string) => {
    setExecMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("country", country);
    fd.set("section", "team");
    fd.set("redirect", `/admin/content/team?country=${country}`);
    fd.set("coreCount", String(coreMembers.length));
    fd.set("execCount", String(execMembers.length));
    coreMembers.forEach((m, i) => {
      fd.set(`core_${i}_name`, m.name);
      fd.set(`core_${i}_role`, m.role);
      fd.set(`core_${i}_bio`, m.bio);
      fd.set(`core_${i}_avatarUrl`, m.avatarUrl ?? "");
      fd.set(`core_${i}_avatarColor`, m.avatarColor || DEFAULT_AVATAR);
    });
    execMembers.forEach((m, i) => {
      fd.set(`exec_${i}_name`, m.name);
      fd.set(`exec_${i}_role`, m.role);
      fd.set(`exec_${i}_bio`, m.bio);
      fd.set(`exec_${i}_avatarUrl`, m.avatarUrl ?? "");
      fd.set(`exec_${i}_avatarColor`, m.avatarColor || DEFAULT_AVATAR);
    });
    await updateTeamSection(fd);
  }

  return (
    <form id="team-form" onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="section" value="team" />
      <input
        type="hidden"
        name="redirect"
        value={`/admin/content/team?country=${country}`}
      />
      <input type="hidden" name="coreCount" value={coreMembers.length} />
      <input type="hidden" name="execCount" value={execMembers.length} />

      <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">الفريق الأساسي</h2>
          <Button
            type="button"
            variant="outline"
            onClick={addCoreMember}
            className="h-auto border-primary/40 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10"
          >
            إضافة عضو أساسي
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {coreMembers.map((member, index) => (
            <MemberFields
              key={index}
              prefix={`core_${index}`}
              member={member}
              onUpdate={(field, value) => updateCoreMember(index, field, value)}
              onRemove={coreMembers.length > 1 ? () => removeCoreMember(index) : undefined}
              showRemove={coreMembers.length > 1}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">فريق التنفيذ والدعم</h2>
          <Button
            type="button"
            variant="outline"
            onClick={addExecMember}
            className="h-auto border-primary/40 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10"
          >
            إضافة عضو تنفيذ
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {execMembers.map((member, index) => (
            <MemberFields
              key={index}
              prefix={`exec_${index}`}
              member={member}
              onUpdate={(field, value) => updateExecMember(index, field, value)}
              onRemove={execMembers.length > 1 ? () => removeExecMember(index) : undefined}
              showRemove={execMembers.length > 1}
            />
          ))}
        </div>
      </div>

      <Button
        type="submit"
        id="team-form-submit"
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />
      <ConfirmSaveDialog
        formId="team-form"
        submitButtonId="team-form-submit"
        triggerLabel="حفظ صفحة فريق العمل"
        description="سيتم حفظ التغييرات على صفحة فريق العمل للبلد المحدد. هل أنت متأكد؟"
      />
    </form>
  );
}
