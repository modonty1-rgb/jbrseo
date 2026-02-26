import { landing } from "@/app/content/landing";

export default function Outcomes() {
  const { outcomes } = landing;
  return (
    <section
      id="outcomes"
      className="border-t border-border/50 bg-muted/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      aria-labelledby="outcomes-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            النتائج
          </p>
          <h2
            id="outcomes-title"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            ما الذي تحصل عليه
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl bg-background ps-5 pe-5 py-5 border-s-2 border-accent transition-colors hover:bg-card"
            >
              <h3 className="mb-2 font-semibold text-foreground leading-snug">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
