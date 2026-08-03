"use client";

import type { FormEvent, ReactElement } from "react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { planBadgeClass } from "@/lib/planStyles";
import { cn } from "@/lib/utils";
import { fieldClass, labelClass } from "../_components/AdminFormShared";
import type { SubscriberListItem } from "@/app/actions/subscribers";
import { priceForDuration, parseDuration } from "@/lib/pricing-durations";

/** Active plan info (Saudi) — name + slug + prices, used for the plan toggles
 *  and the revenue amount shown on each. */
export type PlanInfo = {
  name: string;
  slug: string;
  priceMonthly: number;
  priceYearly: number;
};

const COUNTRIES = [
  { value: "SA", label: "SA" },
  { value: "EG", label: "EG" },
] as const;

// Plan filter toggles come from the active pricing plans (passed in) — no
// hardcoded plan list that drifts from the real plans.
const ALL_FILTER = "الكل";

const PAGE_SIZE = 10;

type SortKey =
  | "contactName"
  | "email"
  | "phone"
  | "planName"
  | "country"
  | "isAnnual"
  | "createdAt";

type SortState = { key: SortKey; dir: "asc" | "desc" };

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("ar-SA", { dateStyle: "short", timeStyle: "short" }).format(d);
}

function sortSubscribers(rows: SubscriberListItem[], sort: SortState): SubscriberListItem[] {
  const out = [...rows];
  const mult = sort.dir === "asc" ? 1 : -1;
  out.sort((a, b) => {
    let cmp = 0;
    switch (sort.key) {
      case "contactName":
        cmp = (a.contactName ?? "").localeCompare(b.contactName ?? "", "ar");
        break;
      case "email":
        cmp = a.email.localeCompare(b.email, "ar");
        break;
      case "phone":
        cmp = a.phone.localeCompare(b.phone, "ar");
        break;
      case "planName":
        cmp = a.planName.localeCompare(b.planName, "ar");
        break;
      case "country":
        cmp = a.country.localeCompare(b.country, "ar");
        break;
      case "isAnnual":
        cmp = Number(a.isAnnual) - Number(b.isAnnual);
        break;
      case "createdAt":
        cmp = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      default:
        break;
    }
    return cmp * mult;
  });
  return out;
}

function nextSort(prev: SortState, key: SortKey): SortState {
  if (prev.key === key) {
    return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
  }
  return { key, dir: "asc" };
}

function CountrySelectField(props: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  hiddenName?: string;
}): ReactElement {
  const { id, value, onChange, hiddenName } = props;
  return (
    <div className="space-y-1">
      {hiddenName ? <input type="hidden" name={hiddenName} value={value} /> : null}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className={fieldClass}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function AnnualField(props: {
  id?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  hiddenName?: string;
}): ReactElement {
  const { id, checked, onCheckedChange, hiddenName } = props;
  return (
    <div className="flex items-end gap-2">
      {hiddenName ? <input type="hidden" name={hiddenName} value={checked ? "true" : "false"} /> : null}
      <div className="flex items-center gap-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(v) => onCheckedChange(v === true)}
        />
        <Label htmlFor={id} className={labelClass}>
          سنوي
        </Label>
      </div>
    </div>
  );
}

export type SubscribersTableProps = {
  list: SubscriberListItem[];
  /** Active plans (from pricing) → rendered as filter toggles even at 0, each
   *  with its subscriber count and paid revenue amount. */
  activePlans: PlanInfo[];
  loading: boolean;
  searchInput: string;
  setSearchInput: (v: string) => void;
  setSearch: (v: string) => void;
  createOpen: boolean;
  setCreateOpen: (v: boolean) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  formError: string | null;
  createCountry: string;
  setCreateCountry: (v: string) => void;
  createAnnual: boolean;
  setCreateAnnual: (v: boolean) => void;
  editCountry: string;
  setEditCountry: (v: string) => void;
  editAnnual: boolean;
  setEditAnnual: (v: boolean) => void;
  onCreate: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  onUpdate: (id: string, e: FormEvent<HTMLFormElement>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function SubscribersTable(props: SubscribersTableProps): ReactElement {
  const {
    list,
    activePlans,
    loading,
    searchInput,
    setSearchInput,
    setSearch,
    createOpen,
    setCreateOpen,
    editingId,
    setEditingId,
    formError,
    createCountry,
    setCreateCountry,
    createAnnual,
    setCreateAnnual,
    editCountry,
    setEditCountry,
    editAnnual,
    setEditAnnual,
    onCreate,
    onUpdate,
    onDelete,
  } = props;

  const [activePlan, setActivePlan] = useState<string>(ALL_FILTER);
  const [sort, setSort] = useState<SortState>({ key: "createdAt", dir: "desc" });
  const [page, setPage] = useState(1);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const totalCount = list.length;

  // Toggles = the active plans (from pricing) — shown even at 0 subscribers.
  const planNames = useMemo(() => activePlans.map((p) => p.name), [activePlans]);
  const planFilters = useMemo(() => [ALL_FILTER, ...planNames], [planNames]);

  // Subscriber count per plan name (all statuses / countries).
  const planCounts = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const row of list) {
      const p = row.planName?.trim();
      if (p) acc[p] = (acc[p] ?? 0) + 1;
    }
    return acc;
  }, [list]);

  // Paid revenue per plan — Saudi only (payment is SA-only; EG are WhatsApp
  // leads). Amount uses the current plan price at the subscriber's billing
  // (annual = full yearly total).
  const planRevenue = useMemo(() => {
    const bySlug = new Map(activePlans.map((p) => [p.slug, p]));
    const byName = new Map(activePlans.map((p) => [p.name, p]));
    const acc: Record<string, number> = {};
    let total = 0;
    for (const row of list) {
      if (row.country !== "SA" || row.paymentStatus !== "paid") continue;
      const plan = bySlug.get(row.plan) ?? byName.get(row.planName?.trim());
      if (!plan) continue;
      const amount = priceForDuration(plan.priceMonthly, parseDuration(row.billing)).total;
      acc[plan.name] = (acc[plan.name] ?? 0) + amount;
      total += amount;
    }
    return { byPlan: acc, total };
  }, [list, activePlans]);

  const filtered = useMemo(() => {
    if (activePlan === ALL_FILTER) return list;
    return list.filter((r) => r.planName.trim() === activePlan);
  }, [list, activePlan]);

  const sorted = useMemo(() => sortSubscribers(filtered, sort), [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [activePlan, list]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);


  const handleSortClick = (key: SortKey): void => {
    setSort((s) => nextSort(s, key));
  };

  const sortIndicator = (key: SortKey): string => {
    if (sort.key !== key) return "";
    return sort.dir === "asc" ? " ↑" : " ↓";
  };

  const emptyMessage =
    list.length === 0
      ? { title: "لا يوجد مشتركون", hint: "أضف مشتركاً أو غيّر معايير البحث من الخادم." }
      : { title: "لا نتائج", hint: "جرّب بحثاً مختلفاً أو غيّر فلتر الخطة." };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <span
              className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm"
              aria-hidden
            >
              🔍
            </span>
            <Input
              type="search"
              placeholder="بحث (بريد، جوال، خطة)..."
              className="h-9 w-64 max-w-[min(100%,16rem)] pe-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setSearch(searchInput);
                }
              }}
            />
          </div>
          <Button size="sm" variant="secondary" type="button" onClick={() => setSearch(searchInput)}>
            بحث
          </Button>
          <div className="flex flex-wrap gap-1">
            {planFilters.map((plan) => {
              const isAll = plan === ALL_FILTER;
              const count = isAll ? totalCount : (planCounts[plan] ?? 0);
              const revenue = isAll ? planRevenue.total : (planRevenue.byPlan[plan] ?? 0);
              const active = activePlan === plan;
              return (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setActivePlan(plan)}
                  title={`${plan} · ${count} مشترك · ${revenue.toLocaleString("en-US")} ر.س مدفوعة`}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors",
                    active
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="font-semibold">{plan}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                      active ? "bg-primary/20 text-primary" : "bg-foreground/10 text-foreground",
                    )}
                  >
                    {count}
                  </span>
                  <span className="text-[11px] font-bold tabular-nums text-success">
                    {revenue.toLocaleString("en-US")} ر.س
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button type="button" size="sm" className="gap-1.5 font-semibold">
              <span aria-hidden>+</span>
              إضافة مشترك
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto sm:max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة مشترك جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={onCreate} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className={labelClass}>الاسم</Label>
                  <Input name="name" type="text" required />
                </div>
                <div className="space-y-1">
                  <Label className={labelClass}>البريد</Label>
                  <Input name="email" type="email" required />
                </div>
                <div className="space-y-1">
                  <Label className={labelClass}>الجوال</Label>
                  <Input name="phone" type="tel" required />
                </div>
                <div className="space-y-1">
                  <Label className={labelClass}>اسم الخطة</Label>
                  <Input name="planName" placeholder="الانطلاقة" />
                </div>
                <div className="space-y-1">
                  <Label className={labelClass}>ترتيب الخطة</Label>
                  <Input name="planIndex" type="number" min={0} placeholder="0" />
                </div>
                <div className="space-y-1">
                  <Label className={labelClass}>الدولة</Label>
                  <CountrySelectField
                    value={createCountry}
                    onChange={setCreateCountry}
                    hiddenName="country"
                  />
                </div>
                <AnnualField
                  checked={createAnnual}
                  onCheckedChange={setCreateAnnual}
                  hiddenName="isAnnual"
                />
                <div className="space-y-1 sm:col-span-2">
                  <Label className={labelClass}>اسم النشاط (اختياري)</Label>
                  <Input name="businessName" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label className={labelClass}>نوع النشاط (اختياري)</Label>
                  <Input name="businessType" />
                </div>
              </div>
              <Button type="submit" size="sm">
                حفظ
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {formError ? (
        <p
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {formError}
        </p>
      ) : null}

      <div className="rounded-lg border border-border overflow-x-auto">
        {loading ? (
          <p className="p-4 text-muted-foreground text-sm">جاري التحميل...</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start p-2 font-medium">
                    <button
                      type="button"
                      className="inline-flex items-center gap-0.5 hover:text-foreground"
                      onClick={() => handleSortClick("contactName")}
                    >
                      الاسم
                      {sortIndicator("contactName")}
                    </button>
                  </TableHead>
                  <TableHead className="text-start p-2 font-medium">
                    <button
                      type="button"
                      className="inline-flex items-center gap-0.5 hover:text-foreground"
                      onClick={() => handleSortClick("email")}
                    >
                      البريد
                      {sortIndicator("email")}
                    </button>
                  </TableHead>
                  <TableHead className="text-start p-2 font-medium">
                    <button
                      type="button"
                      className="inline-flex items-center gap-0.5 hover:text-foreground"
                      onClick={() => handleSortClick("phone")}
                    >
                      الجوال
                      {sortIndicator("phone")}
                    </button>
                  </TableHead>
                  <TableHead className="text-start p-2 font-medium">
                    <button
                      type="button"
                      className="inline-flex items-center gap-0.5 hover:text-foreground"
                      onClick={() => handleSortClick("planName")}
                    >
                      الخطة
                      {sortIndicator("planName")}
                    </button>
                  </TableHead>
                  <TableHead className="text-start p-2 font-medium">
                    <button
                      type="button"
                      className="inline-flex items-center gap-0.5 hover:text-foreground"
                      onClick={() => handleSortClick("country")}
                    >
                      الدولة
                      {sortIndicator("country")}
                    </button>
                  </TableHead>
                  <TableHead className="text-start p-2 font-medium">
                    <button
                      type="button"
                      className="inline-flex items-center gap-0.5 hover:text-foreground"
                      onClick={() => handleSortClick("isAnnual")}
                    >
                      سنوي
                      {sortIndicator("isAnnual")}
                    </button>
                  </TableHead>
                  <TableHead className="text-start p-2 font-medium">
                    <button
                      type="button"
                      className="inline-flex items-center gap-0.5 hover:text-foreground"
                      onClick={() => handleSortClick("createdAt")}
                    >
                      التاريخ
                      {sortIndicator("createdAt")}
                    </button>
                  </TableHead>
                  <TableHead className="p-2 w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center">
                      <p className="mb-2 text-2xl" aria-hidden>
                        🔍
                      </p>
                      <p className="text-sm font-medium text-foreground">{emptyMessage.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{emptyMessage.hint}</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((row) => {
                  const name = row.contactName?.trim();
                  const initial = name?.charAt(0)?.toUpperCase() ?? "?";
                  return (
                    <Fragment key={row.id}>
                      <TableRow className="hover:bg-muted/20">
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {initial}
                            </div>
                            <span className="font-medium text-foreground">
                              {name ? (
                                name
                              ) : (
                                <span className="text-xs italic text-muted-foreground">بدون اسم</span>
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[180px] p-2">
                          <span
                            className="block truncate text-sm text-muted-foreground"
                            title={row.email}
                          >
                            {row.email}
                          </span>
                        </TableCell>
                        <TableCell className="p-2">{row.phone}</TableCell>
                        <TableCell className="p-2">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                              planBadgeClass(row.planName),
                            )}
                          >
                            {row.planName}
                          </span>
                        </TableCell>
                        <TableCell className="p-2">{row.country}</TableCell>
                        <TableCell className="p-2">
                          {row.isAnnual ? (
                            <span className="text-green-500" title="اشتراك سنوي">
                              <Check className="inline h-4 w-4" strokeWidth={2.5} aria-hidden />
                              <span className="sr-only">نعم</span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40" title="ليس سنوياً">
                              –
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="p-2">{formatDate(row.createdAt)}</TableCell>
                        <TableCell className="p-2">
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingId(editingId === row.id ? null : row.id)}
                            >
                              تعديل
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteTargetId(row.id)}
                            >
                              حذف
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {editingId === row.id ? (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-muted/20 p-3">
                            <form
                              onSubmit={(e) => {
                                void onUpdate(row.id, e);
                              }}
                              className="grid grid-cols-2 gap-2"
                            >
                              <div className="space-y-1">
                                <Label className={labelClass}>الاسم</Label>
                                <Input name="name" defaultValue={row.contactName ?? ""} required />
                              </div>
                              <div className="space-y-1">
                                <Label className={labelClass}>البريد</Label>
                                <Input name="email" defaultValue={row.email} required />
                              </div>
                              <div className="space-y-1">
                                <Label className={labelClass}>الجوال</Label>
                                <Input name="phone" defaultValue={row.phone} required />
                              </div>
                              <div className="space-y-1">
                                <Label className={labelClass}>اسم الخطة</Label>
                                <Input name="planName" defaultValue={row.planName} />
                              </div>
                              <div className="space-y-1">
                                <Label className={labelClass}>ترتيب الخطة</Label>
                                <Input name="planIndex" type="number" defaultValue={row.planIndex ?? 0} />
                              </div>
                              <div className="space-y-1">
                                <Label className={labelClass}>الدولة</Label>
                                <CountrySelectField
                                  value={editCountry}
                                  onChange={setEditCountry}
                                  hiddenName="country"
                                />
                              </div>
                              <AnnualField
                                checked={editAnnual}
                                onCheckedChange={setEditAnnual}
                                hiddenName="isAnnual"
                              />
                              <div className="col-span-2 space-y-1">
                                <Label className={labelClass}>اسم النشاط</Label>
                                <Input name="businessName" defaultValue={row.businessName ?? ""} />
                              </div>
                              <div className="col-span-2 space-y-1">
                                <Label className={labelClass}>نوع النشاط</Label>
                                <Input name="businessType" defaultValue={row.businessType ?? ""} />
                              </div>
                              <div className="col-span-2 flex gap-2">
                                <Button type="submit" size="sm">
                                  حفظ
                                </Button>
                                <Button type="button" size="sm" variant="outline" onClick={() => setEditingId(null)}>
                                  إلغاء
                                </Button>
                              </div>
                            </form>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </Fragment>
                  );
                })
                )}
              </TableBody>
            </Table>

            {sorted.length > 0 && totalPages > 1 ? (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2 text-xs text-muted-foreground">
                <span>
                  صفحة {page} من {totalPages} — {sorted.length} صف
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    السابق
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    التالي
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>

      <AlertDialog open={deleteTargetId !== null} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذا المشترك؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              type="button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTargetId) void onDelete(deleteTargetId);
                setDeleteTargetId(null);
              }}
            >
              حذف نهائياً
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
