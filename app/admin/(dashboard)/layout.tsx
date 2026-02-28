import { redirect } from "next/navigation";
import { isAdmin } from "@/app/actions/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin/login");
  return <>{children}</>;
}
