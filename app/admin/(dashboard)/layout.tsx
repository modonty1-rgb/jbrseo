import { Suspense } from "react";
import Link from "@/app/components/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/app/actions/auth";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminCountryToggle } from "./components/AdminCountryToggle";
import { AdminCountrySync } from "./components/AdminCountrySync";
import { AdminSubscribersLink } from "./components/AdminSubscribersLink";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin/login");
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <AdminCountrySync />
      </Suspense>
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/95 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
            Admin
          </span>
          <h1 className="text-sm font-semibold text-foreground">
            JBRSEO لوحة التحكم
          </h1>
        </div>
        <nav className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>يمكنك إدارة المحتوى والإعدادات من اللوحة الجانبية</span>
          <Suspense fallback={
            <Link href="/admin/subscribers" className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm hover:bg-muted/70">
              المشتركون
            </Link>
          }>
            <AdminSubscribersLink />
          </Suspense>
          <Suspense fallback={
            <div className="flex items-center gap-1 rounded-md bg-muted px-1 py-0.5 text-[11px] font-medium text-foreground">
              <span className="px-2 py-1 rounded-md bg-primary/90 text-primary-foreground">السعودية</span>
              <span className="px-2 py-1 text-muted-foreground">مصر</span>
            </div>
          }>
            <AdminCountryToggle />
          </Suspense>
        </nav>
      </header>
      <div className="flex">
        <div className="sticky top-[52px] min-h-[calc(100vh-52px)] w-[240px] shrink-0 border-e border-border bg-muted/30">
          <Suspense fallback={null}>
            <AdminSidebar />
          </Suspense>
        </div>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
