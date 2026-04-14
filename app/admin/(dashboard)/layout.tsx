import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isAdmin } from "@/app/actions/auth";
import { AdminCountrySync } from "./components/AdminCountrySync";
import { AdminTopNavbar } from "./components/AdminTopNavbar";
import { AdminCountryBanner } from "./components/AdminCountryBanner";
import { AdminToaster } from "./components/AdminToaster";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin/login");
  return (
    <div className="min-h-screen bg-background">
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
    </div>
  );
}
