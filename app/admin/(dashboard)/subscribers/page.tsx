import { SubscribersPageClient } from "./SubscribersPageClient";

export default function AdminSubscribersPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-bold text-foreground">المشتركون</h1>
      <SubscribersPageClient />
    </div>
  );
}
