import { landing } from "@/app/content/landing";

export default function WhyNow() {
  const { whyNow } = landing;
  return (
    <section
      id="why-now"
      className="border-t border-border/50 bg-muted/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      aria-labelledby="why-now-title"
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
          لماذا الآن
        </p>
        <h2
          id="why-now-title"
          className="mb-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          كل شهر تأخير له ثمن
        </h2>

        <div className="space-y-4 border-s-4 border-accent ps-6">
          {whyNow.lines.map((line, i) => (
            <p key={i} className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
