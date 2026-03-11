"use client";

import { useCallback, useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import {
  getSubscribers,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
  type SubscriberListItem,
} from "@/app/actions/subscribers";

const inputBase =
  "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring";
const labelClass = "text-xs font-medium text-muted-foreground";

const COUNTRIES = [{ value: "SA", label: "SA" }, { value: "EG", label: "EG" }];

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("ar-SA", { dateStyle: "short", timeStyle: "short" }).format(d);
}

export function SubscribersPageClient() {
  const router = useRouter();
  const [list, setList] = useState<SubscriberListItem[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

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

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);
    const result = await createSubscriber(formData);
    if (result.success) {
      setCreateOpen(false);
      (e.target as HTMLFormElement).reset();
      load();
      router.refresh();
    } else {
      setFormError(result.error);
    }
  };

  const handleUpdate = async (id: string, e: React.FormEvent<HTMLFormElement>) => {
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
      planIndex: (() => { const v = parseInt((form.querySelector('[name="planIndex"]') as HTMLInputElement)?.value ?? "", 10); return Number.isInteger(v) ? v : null; })(),
      country: (form.querySelector('[name="country"]') as HTMLSelectElement)?.value ?? "SA",
      isAnnual: (form.querySelector('[name="isAnnual"]') as HTMLInputElement)?.checked ?? false,
    });
    if (result.success) {
      setEditingId(null);
      load();
      router.refresh();
    } else {
      setFormError(result.error);
    }
  };

  const handleDelete = async (id: string) => {
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
        <input
          type="search"
          placeholder="بحث (بريد، جوال، خطة)..."
          className={`${inputBase} max-w-[220px]`}
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

      {formError && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {formError}
        </p>
      )}

      {createOpen && (
        <form onSubmit={handleCreate} className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
          <h2 className="text-sm font-semibold">إضافة مشترك</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>الاسم</label>
              <input name="name" type="text" required className={inputBase} />
            </div>
            <div>
              <label className={labelClass}>البريد</label>
              <input name="email" type="email" required className={inputBase} />
            </div>
            <div>
              <label className={labelClass}>الجوال</label>
              <input name="phone" type="tel" required className={inputBase} />
            </div>
            <div>
              <label className={labelClass}>اسم الخطة</label>
              <input name="planName" className={inputBase} placeholder="المجانية" />
            </div>
            <div>
              <label className={labelClass}>ترتيب الخطة</label>
              <input name="planIndex" type="number" min={0} className={inputBase} placeholder="0" />
            </div>
            <div>
              <label className={labelClass}>الدولة</label>
              <select name="country" className={inputBase}>
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2">
                <input name="isAnnual" type="checkbox" className="rounded border-input" />
                <span className={labelClass}>سنوي</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className={labelClass}>اسم النشاط (اختياري)</label>
              <input name="businessName" className={inputBase} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>نوع النشاط (اختياري)</label>
              <input name="businessType" className={inputBase} />
            </div>
          </div>
          <Button type="submit" size="sm">حفظ</Button>
        </form>
      )}

      <div className="rounded-lg border border-border overflow-x-auto">
        {loading ? (
          <p className="p-4 text-muted-foreground text-sm">جاري التحميل...</p>
        ) : list.length === 0 ? (
          <p className="p-4 text-muted-foreground text-sm">لا يوجد مشتركون</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-right p-2 font-medium">الاسم</th>
                <th className="text-right p-2 font-medium">البريد</th>
                <th className="text-right p-2 font-medium">الجوال</th>
                <th className="text-right p-2 font-medium">الخطة</th>
                <th className="text-right p-2 font-medium">الدولة</th>
                <th className="text-right p-2 font-medium">سنوي</th>
                <th className="text-right p-2 font-medium">التاريخ</th>
                <th className="p-2 w-24" />
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <Fragment key={row.id}>
                  <tr className="border-b border-border/60 hover:bg-muted/20">
                    <td className="p-2">{row.contactName}</td>
                    <td className="p-2">{row.email}</td>
                    <td className="p-2">{row.phone}</td>
                    <td className="p-2">{row.planName}</td>
                    <td className="p-2">{row.country}</td>
                    <td className="p-2">{row.isAnnual ? "نعم" : "لا"}</td>
                    <td className="p-2">{formatDate(row.createdAt)}</td>
                    <td className="p-2 flex gap-1">
                      <Button type="button" size="sm" variant="ghost" onClick={() => setEditingId(editingId === row.id ? null : row.id)}>
                        تعديل
                      </Button>
                      <Button type="button" size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(row.id)}>
                        حذف
                      </Button>
                    </td>
                  </tr>
                  {editingId === row.id && (
                    <tr>
                      <td colSpan={7} className="p-3 bg-muted/20">
                        <form onSubmit={(e) => handleUpdate(row.id, e)} className="grid grid-cols-2 gap-2">
                          <div><label className={labelClass}>الاسم</label><input name="name" defaultValue={row.contactName} className={inputBase} required /></div>
                          <div><label className={labelClass}>البريد</label><input name="email" defaultValue={row.email} className={inputBase} required /></div>
                          <div><label className={labelClass}>الجوال</label><input name="phone" defaultValue={row.phone} className={inputBase} required /></div>
                          <div><label className={labelClass}>اسم الخطة</label><input name="planName" defaultValue={row.planName} className={inputBase} /></div>
                          <div><label className={labelClass}>ترتيب الخطة</label><input name="planIndex" type="number" defaultValue={row.planIndex ?? 0} className={inputBase} /></div>
                          <div><label className={labelClass}>الدولة</label><select name="country" defaultValue={row.country} className={inputBase}>{COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
                          <div className="flex items-end"><label className="flex items-center gap-2"><input name="isAnnual" type="checkbox" defaultChecked={row.isAnnual} className="rounded border-input" /><span className={labelClass}>سنوي</span></label></div>
                          <div className="col-span-2"><label className={labelClass}>اسم النشاط</label><input name="businessName" defaultValue={row.businessName ?? ""} className={inputBase} /></div>
                          <div className="col-span-2"><label className={labelClass}>نوع النشاط</label><input name="businessType" defaultValue={row.businessType ?? ""} className={inputBase} /></div>
                          <div className="col-span-2 flex gap-2">
                            <Button type="submit" size="sm">حفظ</Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => setEditingId(null)}>إلغاء</Button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
