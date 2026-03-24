"use client";

import { useState, useTransition, type ReactElement } from "react";
import type { TrustBarClient } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateTrustBarSection } from "@/app/actions/content-sections";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";
import {
  TrustBarClientsEditor,
  clientsToRows,
  emptyClientRow,
  rowsToClients,
  type TrustBarClientRow,
} from "./TrustBarClientsEditor";

const TRUSTBAR_FORM_ID = "trustbar-section-form";

type TrustBarSectionFormProps = {
  country: SupportedCountry;
  headline: string;
  clients: TrustBarClient[];
};

export function TrustBarSectionForm({ country, headline, clients }: TrustBarSectionFormProps): ReactElement {
  const [isPending, startTransition] = useTransition();
  const [rows, setRows] = useState<TrustBarClientRow[]>(() =>
    clients.length > 0 ? clientsToRows(clients) : [emptyClientRow()],
  );

  function addClient(): void {
    setRows((prev) => [...prev, emptyClientRow()]);
  }

  function handleSave(): void {
    const form = document.getElementById(TRUSTBAR_FORM_ID);
    if (!(form instanceof HTMLFormElement)) return;
    const fd = new FormData(form);
    fd.set("trustClientsJson", JSON.stringify(rowsToClients(rows)));
    startTransition(() => {
      void updateTrustBarSection(fd);
    });
  }

  return (
    <form id={TRUSTBAR_FORM_ID} className="space-y-6">
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="section" value="trustbar" />
      <input type="hidden" name="redirect" value={`/admin/content/trustbar?country=${country}`} />

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">تعديل شريط العملاء</h2>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="trustBarHeadline" className="text-xs font-semibold text-muted-foreground">
          عنوان الشريط
        </Label>
        <Input
          id="trustBarHeadline"
          name="trustBarHeadline"
          defaultValue={headline}
          placeholder="مثال: يثق بنا أكثر من ١٢٠ نشاطًا..."
          className="rounded-md border-border bg-background text-sm"
        />
      </div>

      <TrustBarClientsEditor rows={rows} onRowsChange={setRows} />

      <button
        type="button"
        onClick={addClient}
        className="text-xs font-semibold text-primary hover:underline"
      >
        + إضافة عميل
      </button>

      <ConfirmSaveDialog
        onConfirm={handleSave}
        pending={isPending}
        triggerLabel="حفظ شريط العملاء"
        description="سيتم حفظ شريط العملاء للسعودية ومصر معًا. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}
