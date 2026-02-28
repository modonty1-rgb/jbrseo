export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground" lang="ar">
      {children}
    </div>
  );
}
