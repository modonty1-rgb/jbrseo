// This route immediately redirects — show a minimal spinner while the
// redirect resolves. A full page skeleton would never be seen.
export default function Loading() {
  return (
    <div
      dir="rtl"
      lang="ar"
      className="flex min-h-screen items-center justify-center bg-background"
      aria-busy="true"
      aria-label="جاري التحميل"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
    </div>
  );
}
