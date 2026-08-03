import Image from "next/image";
import { Star } from "lucide-react";
import type { StaticLanding } from "@/app/content/landing/types";
import { ytEmbed } from "../landing-helpers";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/app/components/ui/carousel";

type Voice = NonNullable<StaticLanding["socialProof"]>["testimonials"][number];
type Props = { voices: Voice[]; socialProofEyebrow: string };

export function VoicesSection({ voices, socialProofEyebrow }: Props) {
  if (voices.length === 0) return null;

  return (
    <section
      id="social-proof"
      className="border-t border-t-[var(--border)] bg-background"
    >
      <div className="max-w-270 mx-auto px-7 py-8 md:py-14">
        <div className="text-center mb-5 md:mb-10">
          {/* Trust badge — matches structure of other sections */}
          <div className="inline-flex items-center gap-2 bg-success/10 border border-success/30 text-success text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-4">
            <Star className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden fill="currentColor" />
            <span>{socialProofEyebrow || "شهادات صادرة بإذن أصحابها"}</span>
            <span className="text-success/60" aria-hidden>·</span>
            <span className="text-success/80 font-mono text-[10.5px]">لا سيناريو</span>
          </div>
          <h2 className="text-balance text-[clamp(16px,5vw,34px)] font-semibold tracking-[-1px] mb-3 whitespace-nowrap">
            شهادات <span className="text-success">تشوفها</span> — لا وعود تسمعها
          </h2>
          <p className="hidden md:block text-[14.5px] text-muted-foreground max-w-145 mx-auto leading-[1.7]">
            نفس العملاء اللي شفت أرقامهم في قصص النجاح فوق — الحين اسمعهم بأصواتهم.
          </p>
        </div>

        {/* Slider — same embla Carousel as CaseStudiesSlider up top */}
        <div className="max-w-215 mx-auto">
          <Carousel opts={{ direction: "rtl", align: "start", loop: true }}>
            <CarouselContent>
              {voices.map((v, i) => {
                const embedUrl = ytEmbed(v.videoUrl);
                const initials = (v.name ?? "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
                return (
                  <CarouselItem key={i}>
                    <div className="bg-card border border-border rounded-2xl overflow-hidden md:shadow-[0_20px_50px_-30px_color-mix(in_oklch,var(--foreground)_25%,transparent)]">
                      {/* bg-muted (not bg-foreground) so the lazy iframe's pre-load
                          state is a subtle dark block, not a jarring white flash
                          on the dark theme. */}
                      <div className="relative aspect-video bg-muted">
                        {embedUrl ? (
                          <iframe
                            src={embedUrl}
                            title={`${v.name} — ${v.company}`}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0 block"
                          />
                        ) : v.mediaImage ? (
                          <Image
                            src={v.mediaImage}
                            alt={v.name ?? ""}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-mono text-[13px]">
                            لا يوجد فيديو
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-4 md:px-8 md:py-6">
                        {v.quote && (
                          <p className="text-[15px] md:text-[17px] leading-[1.8] md:leading-[1.85] text-foreground font-normal mb-4 md:mb-5 line-clamp-3 md:line-clamp-none">
                            «{v.quote}»
                          </p>
                        )}
                        <div className="pt-4 border-t border-t-border">
                          <div className="flex items-center gap-3">
                            <span className="relative w-11 h-11 shrink-0 rounded-full bg-border overflow-hidden flex items-center justify-center font-semibold text-muted-foreground">
                              {v.avatarImg ? (
                                <Image src={v.avatarImg} alt={v.name ?? ""} fill sizes="44px" unoptimized className="object-cover" />
                              ) : (
                                <span className="text-[15px]">{initials}</span>
                              )}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="text-[15px] font-semibold text-foreground truncate">{v.name}</div>
                              <div className="text-[13px] text-muted-foreground mt-0.5 truncate">
                                {[v.role, v.company].filter(Boolean).join(" · ")}
                              </div>
                            </div>
                            {v.metric && (
                              <div className="hidden md:inline-flex shrink-0 bg-success/10 text-success text-xs font-semibold px-3 py-1.5 rounded-full font-mono">
                                {v.metric}
                              </div>
                            )}
                          </div>
                          {v.metric && (
                            <div className="md:hidden mt-3 inline-flex bg-success/10 text-success text-xs font-semibold px-3 py-1.5 rounded-full font-mono">
                              {v.metric}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {/* Navigation — built-in shadcn buttons in a centered row (same as
                CaseStudiesSlider). They self-manage their disabled state. */}
            {voices.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-4 md:mt-8">
                <CarouselPrevious className="static h-11 w-11 translate-y-0 start-auto end-auto bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground" />
                <CarouselNext className="static h-11 w-11 translate-y-0 start-auto end-auto bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground" />
              </div>
            )}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
