import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isAdmin } from "@/app/actions/auth";
import { AdminCountrySync } from "./_components/AdminCountrySync";
import { AdminTopNavbar } from "./_components/AdminTopNavbar";
import { AdminCountryBanner } from "./_components/AdminCountryBanner";
import { AdminToaster } from "./_components/AdminToaster";
import { AdminThemeProvider } from "./_components/AdminThemeProvider";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin/login");
  return (
    <AdminThemeProvider>
      <AdminToaster />
      <Suspense fallback={null}>
        <AdminCountrySync />
      </Suspense>
      <Suspense
        fallback={
          <header className="sticky top-0 z-20 flex min-h-13 items-center justify-between border-b border-border bg-card/95 px-6 py-3 backdrop-blur">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          </header>
        }
      >
        <AdminTopNavbar />
      </Suspense>
      <Suspense fallback={null}>
        <AdminCountryBanner />
      </Suspense>
      <main className="min-w-0 flex-1">{children}</main>
    </AdminThemeProvider>
  );
}
