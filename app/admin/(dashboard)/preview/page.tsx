"use client";

import { useState } from "react";
import Link from "@/app/components/link";
import { Button } from "@/app/components/ui/button";

const COUNTRIES = [
  { slug: "sa", label: "السعودية" },
  { slug: "eg", label: "مصر" },
] as const;

const PAGES = [
  { path: "", label: "الصفحة الرئيسية" },
  { path: "/pricing", label: "صفحة الأسعار" },
  { path: "/signup", label: "صفحة التسجيل" },
] as const;

export default function AdminPreviewPage() {
  const [country, setCountry] = useState<(typeof COUNTRIES)[number]["slug"]>("sa");
  const [page, setPage] = useState<(typeof PAGES)[number]["path"]>("");

  const previewHref = `/${country}${page}?country=${country}`;

  return (
    <div className="flex h-[calc(100vh-52px)] flex-col lg:flex-row">
      <aside className="w-full border-b border-border bg-card/80 p-4 text-sm lg:w-64 lg:border-b-0 lg:border-e">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
          أداة معاينة الموقع
        </h2>
        <div className="space-y-3">
          <div>
            <p className="mb-1 text-[11px] font-medium text-muted-foreground">الدولة</p>
            <div className="inline-flex overflow-hidden rounded-md border border-border bg-background text-xs">
              {COUNTRIES.map((c) => (
                <Button
                  key={c.slug}
                  type="button"
                  variant={country === c.slug ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCountry(c.slug)}
                  className={`h-auto rounded-none px-3 py-1.5 text-xs shadow-none ${
                    country === c.slug ? "" : "text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {c.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-[11px] font-medium text-muted-foreground">الصفحة</p>
            <div className="space-y-1 text-xs">
              {PAGES.map((p) => (
                <Button
                  key={p.path || "root"}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(p.path)}
                  className={`h-auto w-full justify-end rounded-md px-3 py-1.5 text-xs shadow-none ${
                    page === p.path
                      ? "bg-muted font-semibold text-foreground"
                      : "text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-muted-foreground">
            <p className="mb-1">المسار الحالي:</p>
            <code className="block truncate rounded bg-muted px-2 py-1 text-[10px] font-mono">
              {previewHref}
            </code>
            <p className="mt-2">
              يمكن استخدام الروابط القديمة في الشريط الجانبي، هذه الأداة فقط لتسهيل المعاينة في نفس الواجهة.
            </p>
            <p className="mt-1">
              للتكبير الكامل يمكنك فتح الرابط في تبويب جديد:
            </p>
            <Link
              href={previewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center rounded-md border border-border bg-background px-2 py-1 text-[11px] font-semibold text-foreground shadow-sm hover:bg-muted/80"
            >
              فتح في تبويب جديد
            </Link>
          </div>
        </div>
      </aside>

      <section className="min-h-0 flex-1 bg-muted/40">
        <iframe
          key={previewHref}
          src={previewHref}
          title="معاينة الموقع"
          className="h-full w-full border-0 bg-background"
        />
      </section>
    </div>
  );
}

