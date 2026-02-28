import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { SubscribersPageClient } from "./SubscribersPageClient";

export default function AdminSubscribersPage() {
  return (
    <div className="px-4 py-4 min-w-[800px]">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground">المشتركون</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin">العودة للمحرر</Link>
        </Button>
      </header>
      <SubscribersPageClient />
    </div>
  );
}
