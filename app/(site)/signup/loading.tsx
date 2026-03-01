const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-muted/70 ${className ?? ""}`} />
);

export default function SignupLoading() {
  return (
    <div className="relative min-h-[70vh] overflow-hidden px-4 py-20 flex justify-center items-start landing-grain">
      {/* Background glows — same as real page */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-16 start-1/4 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-20 end-1/4 h-64 w-64 rounded-full bg-accent/12 blur-3xl" />
      </div>

      {/* Card — same shape and grid as SignupForm */}
      <div className="relative z-10 w-full max-w-md lg:max-w-4xl rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/8 p-6 lg:p-8 flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_1fr] lg:gap-8 bg-linear-to-br from-primary/3 via-transparent to-accent/3">

        {/* ── Left column: form skeleton ── */}
        <div className="flex flex-col gap-5 min-w-0">
          <div className="space-y-3">
            {/* eyebrow */}
            <Skeleton className="h-3 w-32" />
            {/* plan tabs */}
            <div className="flex gap-1.5">
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
            {/* price */}
            <Skeleton className="h-6 w-28" />
            {/* plan title */}
            <Skeleton className="h-6 w-3/4" />
          </div>

          {/* form fields */}
          <div className="flex flex-col gap-3.5">
            {/* email */}
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            {/* phone */}
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-3 w-44" />
            </div>
            {/* business name */}
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            {/* business type */}
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
            {/* submit button */}
            <Skeleton className="h-11 w-full rounded-lg mt-1" />
          </div>
        </div>

        {/* ── Right column: plan detail skeleton ── */}
        <div className="lg:border-s lg:border-border/60 lg:ps-8 flex flex-col rounded-xl bg-muted/10 p-5 lg:p-6 gap-4">
          {/* section heading */}
          <Skeleton className="h-3 w-40" />
          {/* price box */}
          <div className="rounded-xl border-2 border-accent/20 bg-primary/5 px-4 py-3 flex flex-col items-center gap-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-3.5 w-14" />
          </div>
          {/* for-who paragraph */}
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
            <Skeleton className="h-3.5 w-4/6" />
          </div>
          {/* features list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 mt-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/30" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
