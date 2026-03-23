"use client";

import type { FormEvent, ReactElement } from "react";
import { useCallback, useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
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
import { fieldClass, labelClass } from "../components/AdminFormShared";
import {
  getSubscribers,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
  type SubscriberListItem,
} from "@/app/actions/subscribers";

const COUNTRIES = [
  { value: "SA", label: "SA" },
  { value: "EG", label: "EG" },
] as const;

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("ar-SA", { dateStyle: "short", timeStyle: "short" }).format(d);
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

export function SubscribersPageClient(): ReactElement {
  const router = useRouter();
  const [list, setList] = useState<SubscriberListItem[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [createCountry, setCreateCountry] = useState("SA");
  const [createAnnual, setCreateAnnual] = useState(false);

  const [editCountry, setEditCountry] = useState("SA");
  const [editAnnual, setEditAnnual] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getSubscribers({ search: search || undefined }).then((data) => {
      setList(data);
      setLoading(false);
    });
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!editingId) return;
    const row = list.find((r) => r.id === editingId);
    if (row) {
      setEditCountry(row.country);
      setEditAnnual(row.isAnnual);
    }
  }, [editingId, list]);

  const handleCreate = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);
    const result = await createSubscriber(formData);
    if (result.success) {
      setCreateOpen(false);
      (e.target as HTMLFormElement).reset();
      setCreateCountry("SA");
      setCreateAnnual(false);
      load();
      router.refresh();
    } else {
      setFormError(result.error);
    }
  };

  const handleUpdate = async (id: string, e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFormError(null);
    const form = e.currentTarget;
    const result = await updateSubscriber(id, {
      contactName: (form.querySelector('[name="name"]') as HTMLInputElement)?.value?.trim(),
      email: (form.querySelector('[name="email"]') as HTMLInputElement)?.value?.trim(),
      phone: (form.querySelector('[name="phone"]') as HTMLInputElement)?.value?.trim(),
      businessName: (form.querySelector('[name="businessName"]') as HTMLInputElement)?.value?.trim() || null,
      businessType: (form.querySelector('[name="businessType"]') as HTMLInputElement)?.value?.trim() || null,
      planName: (form.querySelector('[name="planName"]') as HTMLInputElement)?.value?.trim() ?? "",
      planIndex: (() => {
        const v = parseInt((form.querySelector('[name="planIndex"]') as HTMLInputElement)?.value ?? "", 10);
        return Number.isInteger(v) ? v : null;
      })(),
      country: (form.querySelector('[name="country"]') as HTMLInputElement)?.value ?? "SA",
      isAnnual:
        (form.querySelector('[name="isAnnual"]') as HTMLInputElement)?.value === "true" ||
        (form.querySelector('[name="isAnnual"]') as HTMLInputElement)?.value === "on",
    });
    if (result.success) {
      setEditingId(null);
      load();
      router.refresh();
    } else {
      setFormError(result.error);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (typeof window !== "undefined" && !window.confirm("حذف هذا المشترك؟")) return;
    const result = await deleteSubscriber(id);
    if (result.success) {
      load();
      router.refresh();
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="search"
          placeholder="بحث (بريد، جوال، خطة)..."
          className="max-w-[220px]"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), setSearch(searchInput))}
        />
        <Button size="sm" variant="secondary" onClick={() => setSearch(searchInput)}>
          بحث
        </Button>
        <Button size="sm" onClick={() => setCreateOpen((o) => !o)}>
          {createOpen ? "إلغاء" : "إضافة مشترك"}
        </Button>
      </div>

      {formError ? (
        <p
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {formError}
        </p>
      ) : null}

      {createOpen ? (
        <Card className="border-border bg-muted/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">إضافة مشترك</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
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
                  <Input name="planName" placeholder="المجانية" />
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
                <div className="col-span-2 space-y-1">
                  <Label className={labelClass}>اسم النشاط (اختياري)</Label>
                  <Input name="businessName" />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className={labelClass}>نوع النشاط (اختياري)</Label>
                  <Input name="businessType" />
                </div>
              </div>
              <Button type="submit" size="sm">
                حفظ
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <div className="rounded-lg border border-border overflow-x-auto">
        {loading ? (
          <p className="p-4 text-muted-foreground text-sm">جاري التحميل...</p>
        ) : list.length === 0 ? (
          <p className="p-4 text-muted-foreground text-sm">لا يوجد مشتركون</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start p-2 font-medium">الاسم</TableHead>
                <TableHead className="text-start p-2 font-medium">البريد</TableHead>
                <TableHead className="text-start p-2 font-medium">الجوال</TableHead>
                <TableHead className="text-start p-2 font-medium">الخطة</TableHead>
                <TableHead className="text-start p-2 font-medium">الدولة</TableHead>
                <TableHead className="text-start p-2 font-medium">سنوي</TableHead>
                <TableHead className="text-start p-2 font-medium">التاريخ</TableHead>
                <TableHead className="p-2 w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((row) => (
                <Fragment key={row.id}>
                  <TableRow className="hover:bg-muted/20">
                    <TableCell className="p-2">{row.contactName}</TableCell>
                    <TableCell className="p-2">{row.email}</TableCell>
                    <TableCell className="p-2">{row.phone}</TableCell>
                    <TableCell className="p-2">{row.planName}</TableCell>
                    <TableCell className="p-2">{row.country}</TableCell>
                    <TableCell className="p-2">{row.isAnnual ? "نعم" : "لا"}</TableCell>
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
                          onClick={() => void handleDelete(row.id)}
                        >
                          حذف
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {editingId === row.id ? (
                    <TableRow>
                      <TableCell colSpan={8} className="p-3 bg-muted/20">
                        <form
                          onSubmit={(e) => {
                            void handleUpdate(row.id, e);
                          }}
                          className="grid grid-cols-2 gap-2"
                        >
                          <div className="space-y-1">
                            <Label className={labelClass}>الاسم</Label>
                            <Input name="name" defaultValue={row.contactName} required />
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
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
