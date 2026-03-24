"use client";

import { useState, type FormEvent, type ReactElement } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { DEFAULT_TEAM_AVATAR_GRADIENT } from "@/lib/teamPresets";
import { updateTeamSection } from "@/app/actions/content-sections";
import { Button } from "@/app/components/ui/button";
import { TeamSectionEditor } from "../components/TeamSectionEditor";
import { UnsavedChangesBar } from "../components/UnsavedChangesBar";
import type { MemberCardMember } from "../components/MemberCard";

const TEAM_FORM_ID = "team-form";

type TeamSectionFormProps = {
  section: StaticLanding["team"];
  country: SupportedCountry;
};

const emptyMember = (): MemberCardMember => ({
  name: "",
  role: "",
  bio: "",
  avatarColor: DEFAULT_TEAM_AVATAR_GRADIENT,
  avatarUrl: "",
});

export function TeamSectionForm({
  section,
  country,
}: TeamSectionFormProps): ReactElement {
  const toEditable = (m: {
    name: string;
    role: string;
    bio: string;
    avatarColor: string;
    avatarUrl?: string;
  }): MemberCardMember => ({
    ...m,
    avatarUrl: m.avatarUrl ?? "",
  });

  const [coreMembers, setCoreMembers] = useState<MemberCardMember[]>(
    section.coreTeam.length > 0
      ? section.coreTeam.map(toEditable)
      : [emptyMember()],
  );

  const [execMembers, setExecMembers] = useState<MemberCardMember[]>(
    section.executionTeam.length > 0
      ? section.executionTeam.map(toEditable)
      : [emptyMember()],
  );

  const [pending, setPending] = useState(false);

  function addCoreMember(): void {
    setCoreMembers((prev) => [...prev, emptyMember()]);
  }

  function removeCoreMember(index: number): void {
    setCoreMembers((prev) => prev.filter((_, i) => i !== index));
  }

  function addExecMember(): void {
    setExecMembers((prev) => [...prev, emptyMember()]);
  }

  function removeExecMember(index: number): void {
    setExecMembers((prev) => prev.filter((_, i) => i !== index));
  }

  function updateCoreMember(
    index: number,
    field: keyof MemberCardMember,
    value: string,
  ): void {
    setCoreMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    );
  }

  function updateExecMember(
    index: number,
    field: keyof MemberCardMember,
    value: string,
  ): void {
    setExecMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (pending) return;
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
      fd.set(
        `core_${i}_avatarColor`,
        m.avatarColor || DEFAULT_TEAM_AVATAR_GRADIENT,
      );
    });
    execMembers.forEach((m, i) => {
      fd.set(`exec_${i}_name`, m.name);
      fd.set(`exec_${i}_role`, m.role);
      fd.set(`exec_${i}_bio`, m.bio);
      fd.set(`exec_${i}_avatarUrl`, m.avatarUrl ?? "");
      fd.set(
        `exec_${i}_avatarColor`,
        m.avatarColor || DEFAULT_TEAM_AVATAR_GRADIENT,
      );
    });
    try {
      setPending(true);
      await updateTeamSection(fd);
    } finally {
      setPending(false);
    }
  }

  function handleSaveClick(): void {
    const el = document.getElementById(TEAM_FORM_ID);
    if (el instanceof HTMLFormElement) el.requestSubmit();
  }

  return (
    <>
      <form id={TEAM_FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="section" value="team" />
        <input
          type="hidden"
          name="redirect"
          value={`/admin/content/team?country=${country}`}
        />
        <input type="hidden" name="coreCount" value={coreMembers.length} />
        <input type="hidden" name="execCount" value={execMembers.length} />

        <TeamSectionEditor
          sectionPrefix="core"
          title="الفريق الأساسي"
          addButtonLabel="إضافة عضو أساسي"
          members={coreMembers}
          onAdd={addCoreMember}
          onRemove={removeCoreMember}
          onUpdate={updateCoreMember}
        />

        <TeamSectionEditor
          sectionPrefix="exec"
          title="فريق التنفيذ والدعم"
          addButtonLabel="إضافة عضو تنفيذ"
          members={execMembers}
          onAdd={addExecMember}
          onRemove={removeExecMember}
          onUpdate={updateExecMember}
        />

        <button
          type="submit"
          id="team-form-submit"
          className="hidden"
          tabIndex={-1}
          aria-hidden
        />
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={handleSaveClick}
          disabled={pending}
        >
          حفظ صفحة فريق العمل
        </Button>
      </form>

      <UnsavedChangesBar
        formId={TEAM_FORM_ID}
        message="تغييرات غير محفوظة في فريق العمل"
      />
    </>
  );
}
