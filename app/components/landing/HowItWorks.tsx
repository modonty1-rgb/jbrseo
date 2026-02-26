import { landing } from "@/app/content/landing";

export default function HowItWorks() {
  const { howItWorks } = landing;
  return (
    <section
      id="how-it-works"
      className="border-t border-border/50 bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      aria-labelledby="how-it-works-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            الطريقة
          </p>
          <h2
            id="how-it-works-title"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            كيف نعمل
          </h2>
        </div>

        <div className="relative grid gap-8 sm:grid-cols-3 sm:gap-6">
          {/* connector line — desktop only */}
          <div
            aria-hidden
            className="absolute top-8 start-[calc(16.67%+1rem)] end-[calc(16.67%+1rem)] hidden h-px border-t border-dashed border-border sm:block"
          />

          {howItWorks.steps.map((step, i) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              {/* step number — large decorative */}
              <div className="relative mb-4 flex h-16 w-16 items-center justify-center">
                <span
                  className="absolute inset-0 flex items-center justify-center text-6xl font-black text-primary/8 select-none"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground ring-4 ring-background">
                  {i + 1}
                </span>
              </div>

              <h3 className="mb-2 font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
