import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isAdmin } from "@/app/actions/auth";
import { AdminSidebar } from "./components/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin/login");
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={<aside className="w-[240px] shrink-0 border-e border-border bg-muted/30" />}>
        <AdminSidebar />
      </Suspense>
      <main className="min-w-0 flex-1 overflow-auto">{children}</main>
    </div>
  );
}
