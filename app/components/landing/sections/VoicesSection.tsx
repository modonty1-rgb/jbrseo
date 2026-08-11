import Image from "next/image";
import { Star } from "lucide-react";
import type { StaticLanding } from "@/app/content/landing/types";
import { ytId } from "../landing-helpers";
import { VideoFacade } from "./VideoFacade";

type Voice = NonNullable<StaticLanding["socialProof"]>["testimonials"][number];
type Props = { voices: Voice[]; socialProofEyebrow: string };

export function VoicesSection({ voices, socialProofEyebrow }: Props) {
  if (voices.length === 0) return null;

  return (
    <section
      id="social-proof"
      className="border-t border-t-[var(--border)] bg-background"
    >
      <div className="max-w-270 mx-auto px-5 md:px-7 py-6 md:py-10">
        <div className="text-center mb-5 md:mb-10">
          {/* Trust badge — matches structure of other sections */}
          <div className="inline-flex items-center gap-2 bg-success/10 border border-success/30 text-success text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-4">
            <Star className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden fill="currentColor" />
            <span>{socialProofEyebrow || "عملاء حقيقيون"}</span>
            <span className="text-success/60" aria-hidden>·</span>
            {/* «بدون تمثيل» not «لا سيناريو» — the latter is a literal rendering of "no
                script" that a Saudi buyer reads as film vocabulary, not as a promise that
                nobody was coached. And no mono face: it has no Arabic glyphs, so the
                browser substitutes mid-phrase and the letters stop joining. */}
            <span className="text-success/80 text-[11px]">بدون تمثيل</span>
          </div>
          {/* `text-balance` and `whitespace-nowrap` cancel each other — nowrap wins and the
              balancer never runs, so the heading was one unbreakable line held together only
              by the 5vw clamp shrinking it to 16px on a phone. Let it wrap and balance. */}
          <h2 className="text-balance text-[clamp(20px,5vw,34px)] font-semibold mb-3">
            شهادات <span className="text-success">تشوفها</span> — لا وعود تسمعها
          </h2>
          {/* Was: «نفس العملاء اللي شفت أرقامهم في قصص النجاح فوق». Untrue — the case studies
              are Smile Town, Kima Zone and Baqatek; of the two testimonials only Kima Zone
              appears in both. A visitor who checks the names finds the mismatch, and the one
              section whose whole job is credibility is where that costs the most. */}
          <p className="text-[14.5px] text-muted-foreground max-w-145 mx-auto leading-[1.7]">
            كل شهادة فيديو باسم صاحبها وشركته — مو نصّاً مكتوباً بأي كلام.
          </p>
        </div>

        {/* A grid, not a carousel. There are two testimonials. A slider spent an embla
            client bundle, two arrow buttons and a hidden slide to show one of them at a
            time — hiding half the proof and making the reader work for the other half.
            Both fit side by side on a desktop and stack on a phone, and the section is a
            pure server component again. Restore the slider only if this list grows past
            three or four. */}
        <div className="max-w-270 mx-auto grid gap-5 md:gap-7 md:grid-cols-2 items-stretch">
          {voices.map((v, i) => {
            const videoId = ytId(v.videoUrl);
            const initials = (v.name ?? "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
            return (
                    <div key={i} className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden md:shadow-[0_20px_50px_-30px_color-mix(in_oklch,var(--foreground)_25%,transparent)]">
                      {/* bg-muted (not bg-foreground) so the pre-load state is a subtle
                          dark block, not a jarring white flash on the dark theme. */}
                      <div className="relative aspect-video bg-muted">
                        {videoId ? (
                          <VideoFacade videoId={videoId} title={`${v.name} — ${v.company}`} />
                        ) : v.mediaImage ? (
                          <Image
                            src={v.mediaImage}
                            alt={v.name ?? ""}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-[13px]">
                            لا يوجد فيديو
                          </div>
                        )}
                      </div>
                      {/* flex-1 + mt-auto on the attribution: the two quotes differ in length,
                          and side by side that left one card's name floating mid-height while
                          the other's sat at the bottom. The names line up now. */}
                      <div className="flex flex-1 flex-col px-4 py-4 md:px-6 md:py-6">
                        {/* No mobile clamp. The quote ran to three lines and stopped at an
                            ellipsis with nothing to tap — the reader was shown that there
                            was more and denied it, in the section that exists to be read. */}
                        {v.quote && (
                          <p className="text-[15px] md:text-[16px] leading-[1.8] md:leading-[1.85] text-foreground font-normal mb-4 md:mb-5">
                            «{v.quote}»
                          </p>
                        )}
                        <div className="mt-auto pt-4 border-t border-t-border">
                          <div className="flex items-center gap-3">
                            <span className="relative w-11 h-11 shrink-0 rounded-full bg-border overflow-hidden flex items-center justify-center font-semibold text-muted-foreground">
                              {v.avatarImg ? (
                                <Image src={v.avatarImg} alt={v.name ?? ""} fill sizes="44px" unoptimized className="object-cover" />
                              ) : (
                                <span className="text-[15px]">{initials}</span>
                              )}
                            </span>
                            <div className="min-w-0 flex-1">
                              {/* No `truncate`. The role-and-company line is «مدير المبيعات ·
                                  شركة جبر الجنوبية للمقاولات» — 248px of card at 13px clipped
                                  it mid-company, in the section whose stated claim one line
                                  above is that every testimonial carries its owner's name and
                                  company. It wraps to a second line instead. */}
                              <div className="text-[15px] font-semibold text-foreground">{v.name}</div>
                              <div className="text-[13px] leading-[1.55] text-muted-foreground mt-0.5">
                                {[v.role, v.company].filter(Boolean).join(" · ")}
                              </div>
                            </div>
                            {v.metric && (
                              <div className="hidden md:inline-flex shrink-0 bg-success/10 text-success text-xs font-semibold px-3 py-1.5 rounded-full">
                                {v.metric}
                              </div>
                            )}
                          </div>
                          {v.metric && (
                            <div className="md:hidden mt-3 inline-flex bg-success/10 text-success text-xs font-semibold px-3 py-1.5 rounded-full">
                              {v.metric}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
