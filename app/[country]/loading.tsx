export default function CountrySegmentLoading() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      aria-busy
      aria-label="جاري التحميل"
    >
      <div
        className="h-10 w-10 rounded-full border-2 border-muted border-t-primary animate-spin"
        aria-hidden
      />
    </div>
  );
}
