"use client";

import Image from "next/image";
import { useCallback, useState, type ReactElement } from "react";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, ChevronDown, GripVertical, Trash2, X } from "lucide-react";
import type { TrustBarClient } from "@/app/content/landing/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/app/components/ui/collapsible";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/lib/utils";

const AR_INDIC = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"] as const;

export type TrustBarClientRow = TrustBarClient & { id: string; href: string };

export function clientsToRows(clients: TrustBarClient[]): TrustBarClientRow[] {
  return clients.map((c) => ({
    id: crypto.randomUUID(),
    name: c.name,
    logoUrl: c.logoUrl,
    href: c.href ?? "",
  }));
}

export function rowsToClients(rows: TrustBarClientRow[]): TrustBarClient[] {
  return rows.map(({ id: _id, href, ...rest }) => ({
    ...rest,
    href: href.trim() ? href.trim() : undefined,
  }));
}

export function emptyClientRow(): TrustBarClientRow {
  return { id: crypto.randomUUID(), name: "", logoUrl: "", href: "" };
}

function toArabicIndicCount(n: number): string {
  return String(n).replace(/\d/g, (d) => AR_INDIC[Number(d)] ?? d);
}

function isValidHttpUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

type TrustBarClientsEditorProps = {
  rows: TrustBarClientRow[];
  onRowsChange: React.Dispatch<React.SetStateAction<TrustBarClientRow[]>>;
};

export function TrustBarClientsEditor({ rows, onRowsChange }: TrustBarClientsEditorProps): ReactElement {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      onRowsChange((items) => {
        const oldIndex = items.findIndex((r) => r.id === active.id);
        const newIndex = items.findIndex((r) => r.id === over.id);
        if (oldIndex < 0 || newIndex < 0) return items;
        return arrayMove(items, oldIndex, newIndex);
      });
    },
    [onRowsChange],
  );

  const countLabel = `${toArabicIndicCount(rows.length)} عملاء مضافون`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">قائمة العملاء</h3>
        <Badge variant="secondary" className="rounded-md border border-border/80 bg-muted/40 font-medium text-foreground">
          {countLabel}
        </Badge>
      </div>

      <DndContext
        id="trustbar-clients-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-3" role="list">
            {rows.map((row, index) => (
              <SortableTrustBarClientCard
                key={row.id}
                row={row}
                index={index}
                defaultExpanded={!row.name.trim() && !row.logoUrl.trim()}
                onUpdate={(field, value) => {
                  onRowsChange((prev) =>
                    prev.map((r) => (r.id === row.id ? { ...r, [field]: value } : r)),
                  );
                }}
                onRemove={() => {
                  onRowsChange((prev) => prev.filter((r) => r.id !== row.id));
                }}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

type SortableTrustBarClientCardProps = {
  row: TrustBarClientRow;
  index: number;
  defaultExpanded: boolean;
  onUpdate: (field: keyof TrustBarClient, value: string) => void;
  onRemove: () => void;
};

function SortableTrustBarClientCard({
  row,
  index,
  defaultExpanded,
  onUpdate,
  onRemove,
}: SortableTrustBarClientCardProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [logoPreviewUrl, setLogoPreviewUrl] = useState(row.logoUrl);
  const logoOk = isValidHttpUrl(logoPreviewUrl);
  const hrefOk = row.href.trim() === "" || isValidHttpUrl(row.href);

  const summary = row.name.trim() || `عميل ${index + 1}`;

  return (
    <li ref={setNodeRef} style={style} className={cn("list-none", isDragging && "z-10 opacity-90")}>
      <Collapsible defaultOpen={defaultExpanded} className="group">
        <Card
          className={cn(
            "overflow-hidden rounded-lg border border-border/90 bg-[#1a1a1a] shadow-sm",
            isDragging && "ring-2 ring-primary/40",
          )}
        >
          <div className="flex items-stretch gap-0 border-b border-border/60">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 text-start transition-colors hover:bg-muted/20"
              >
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/70 bg-muted/20 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
                >
                  <ChevronDown className="size-5" strokeWidth={2} />
                </span>
                <LogoThumb url={logoPreviewUrl} valid={logoOk} label={summary} />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{summary}</span>
              </button>
            </CollapsibleTrigger>

            <div className="flex shrink-0 items-center gap-0.5 pe-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    title="حذف هذا العميل"
                    aria-label="حذف هذا العميل"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>حذف العميل؟</AlertDialogTitle>
                    <AlertDialogDescription>
                      سيتم إزالة «{summary}» من الشريط. يمكنك التراجع قبل حفظ الصفحة.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                      type="button"
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={onRemove}
                    >
                      حذف
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "size-9 shrink-0 cursor-grab touch-none text-muted-foreground hover:bg-muted/30 active:cursor-grabbing",
                )}
                aria-label="سحب لإعادة الترتيب"
                title="سحب لإعادة الترتيب"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="size-5" strokeWidth={2} />
              </Button>
            </div>
          </div>

          <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:max-h-0 data-[state=closed]:opacity-0 data-[state=open]:max-h-[480px] data-[state=open]:opacity-100">
            <CardContent className="space-y-4 px-3 pb-4 pt-2 sm:px-4">
              <div className="space-y-1.5">
                <Label htmlFor={`tb-name-${row.id}`} className="text-xs font-semibold text-muted-foreground">
                  اسم العميل
                </Label>
                <Input
                  id={`tb-name-${row.id}`}
                  value={row.name}
                  onChange={(e) => onUpdate("name", e.target.value)}
                  placeholder="مثال: شركة التقنية"
                  className="rounded-md border-border bg-background text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`tb-logo-${row.id}`} className="text-xs font-semibold text-muted-foreground">
                  رابط الشعار
                </Label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                  <LogoThumb url={logoPreviewUrl} valid={logoOk} label="" className="sm:mt-0.5" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="relative">
                      <Input
                        id={`tb-logo-${row.id}`}
                        value={row.logoUrl}
                        onChange={(e) => onUpdate("logoUrl", e.target.value)}
                        onBlur={() => setLogoPreviewUrl(row.logoUrl.trim())}
                        placeholder="https://res.cloudinary.com/..."
                        dir="ltr"
                        className="rounded-md border-border bg-background pe-9 font-mono text-xs"
                      />
                      <span className="pointer-events-none absolute end-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center">
                        {row.logoUrl.trim() === "" ? null : logoOk ? (
                          <Check className="size-4 text-emerald-500" aria-hidden />
                        ) : (
                          <X className="size-4 text-destructive" aria-hidden />
                        )}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">تُحدَّث معاينة الشعار عند الخروج من الحقل (blur).</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Label htmlFor={`tb-href-${row.id}`} className="text-xs font-semibold text-muted-foreground">
                    رابط الموقع
                  </Label>
                  <Badge variant="outline" className="rounded-md text-[10px] font-normal text-muted-foreground">
                    اختياري
                  </Badge>
                </div>
                <div className="relative">
                  <Input
                    id={`tb-href-${row.id}`}
                    value={row.href}
                    onChange={(e) => onUpdate("href", e.target.value)}
                    placeholder="https://example.com"
                    dir="ltr"
                    className="rounded-md border-border bg-background pe-9 text-sm"
                  />
                  <span className="pointer-events-none absolute end-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center">
                    {row.href.trim() === "" ? null : hrefOk ? (
                      <Check className="size-4 text-emerald-500" aria-hidden />
                    ) : (
                      <X className="size-4 text-destructive" aria-hidden />
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </li>
  );
}

type LogoThumbProps = {
  url: string;
  valid: boolean;
  label: string;
  className?: string;
};

function LogoThumb({ url, valid, label, className }: LogoThumbProps): ReactElement {
  if (!valid || !url.trim()) {
    return (
      <div
        className={cn(
          "flex size-14 shrink-0 items-center justify-center rounded-md border border-dashed border-border/80 bg-muted/20 text-[10px] text-muted-foreground",
          className,
        )}
        aria-label={label ? `بدون شعار: ${label}` : "بدون معاينة للشعار"}
      >
        بدون شعار
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative size-14 shrink-0 overflow-hidden rounded-md border border-border/80 bg-background",
        className,
      )}
    >
      <Image src={url.trim()} alt="" width={56} height={56} className="size-full object-contain p-1" />
    </div>
  );
}
