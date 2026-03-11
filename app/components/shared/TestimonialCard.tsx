import Image from "next/image";

type TestimonialCardProps = {
  name: string;
  role: string;
  quote: string;
  metric?: string;
  image?: string;
  imageLoading?: "lazy" | "eager";
};

export function TestimonialCard({
  name,
  role,
  quote,
  metric,
  image,
  imageLoading = "lazy",
}: TestimonialCardProps) {
  return (
    <article
      className="group rounded-2xl border border-border border-t-2 border-t-accent bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-8"
      style={{ scrollMarginTop: "1rem" }}
    >
      <div className="flex gap-5">
        {image ? (
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-border/80 ring-offset-2 ring-offset-card transition-shadow duration-200 group-hover:ring-primary/20 sm:h-16 sm:w-16">
            <Image
              src={image}
              alt={name ? `Portrait of ${name}` : ""}
              className="h-full w-full object-cover"
              width={64}
              height={64}
              loading={imageLoading}
              sizes="(min-width: 640px) 64px, 56px"
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <blockquote className="border-none p-0">
            <div
              aria-hidden
              className="mb-1 text-6xl font-black leading-none text-primary/20 select-none sm:mb-2 sm:text-7xl"
            >
              &ldquo;
            </div>
            <p className="mb-6 text-base leading-[1.7] text-foreground/95 sm:text-lg">
              {quote}
            </p>
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-4">
              <cite className="not-italic">
                <span className="block font-semibold text-foreground">{name}</span>
                <span className="block text-sm text-muted-foreground">{role}</span>
              </cite>
              {metric && (
                <span className="inline-flex items-center rounded-full bg-success/15 px-3 py-1.5 text-xs font-medium text-success">
                  {metric}
                </span>
              )}
            </footer>
          </blockquote>
        </div>
      </div>
    </article>
  );
}
