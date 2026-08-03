import Link from "@/app/components/link";

export function AdminSubscribersLink() {
  // Subscribers live at the admin home (/admin).
  return (
    <Link
      href="/admin"
      className="inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
    >
      المشتركون
    </Link>
  );
}
