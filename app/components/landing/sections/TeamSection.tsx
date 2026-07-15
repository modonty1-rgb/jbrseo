import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StaticLanding } from "@/app/content/landing/types";
import { toArabicDigits } from "../landing-helpers";

type TeamMember = NonNullable<StaticLanding["team"]>["coreTeam"][number];
type Props = {
  coreTeam: TeamMember[];
  executionTeam: TeamMember[];
};

/** Team faces (core + execution) — data-driven, server-ready. */
export function TeamSection({ coreTeam, executionTeam }: Props) {
  return (
    <section
          className="border-t border-t-[var(--border)] bg-card"
        >
          <div className="max-w-270 mx-auto px-7 py-8 md:py-14">
            <div className="text-center mb-5 md:mb-10">
              <h2 className="text-balance text-[clamp(20px,5.6vw,34px)] font-semibold tracking-[-1px] mb-3">
                مين يشتغل على <span className="text-success">حضورك؟</span>
              </h2>
              <p className="hidden md:block text-[14.5px] text-muted-foreground max-w-145 mx-auto leading-[1.7]">
                هؤلاء وقّعوا تعهّد &laquo;حضور لا وعود&raquo; — تقدر تسائلهم شخصياً على كل مقال.
              </p>
            </div>

            {/* Mobile: teaser+collapse — the closed summary itself shows real
                faces (passive human-trust, like the client-logos teaser).
                Desktop: full cards, always open. */}
            <details className="group">
              <summary className="md:hidden cursor-pointer list-none [&::-webkit-details-marker]:hidden flex flex-col items-center gap-2.5">
                <div className="flex justify-center">
                  {[...coreTeam, ...executionTeam].slice(0, 4).map((m, i) => {
                    const initials = m.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
                    return (
                      <span key={i} className="relative w-11 h-11 rounded-full overflow-hidden bg-muted ring-2 ring-card flex items-center justify-center -ms-2.5 first:ms-0">
                        {m.avatarUrl ? (
                          <Image src={m.avatarUrl} alt={m.name} fill sizes="44px" unoptimized className="object-cover" />
                        ) : (
                          <span className="text-[13px] font-semibold text-muted-foreground">{initials}</span>
                        )}
                      </span>
                    );
                  })}
                </div>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-foreground">
                  <span>فريق من {toArabicDigits(coreTeam.length + executionTeam.length)} شخص يبني حضورك</span>
                  <ChevronDown className="w-4 h-4 text-success animate-bounce group-open:animate-none group-open:rotate-180" strokeWidth={2.5} aria-hidden />
                </span>
              </summary>

              <div className="hidden group-open:block md:block mt-5 md:mt-0">
            {coreTeam.length > 0 && (
              <div
                className={cn(
                  "grid grid-cols-1 gap-4",
                  coreTeam.length >= 2 && "md:grid-cols-2",
                  executionTeam.length > 0 && "mb-8",
                )}
              >
                {coreTeam.map((m, i) => {
                  const initials = m.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
                  return (
                    <div
                      key={i}
                      className="group bg-background border border-border rounded-2xl p-5 flex items-start gap-4 hover:border-success/40 hover:shadow-[0_20px_40px_-24px_color-mix(in_oklch,var(--success)_30%,transparent)] transition-all"
                    >
                      <div className="relative shrink-0 w-16 h-16 md:w-19 md:h-19 rounded-full overflow-hidden bg-muted flex items-center justify-center ring-2 ring-success/15">
                        {m.avatarUrl ? (
                          <Image src={m.avatarUrl} alt={`${m.name} — ${m.role}`} fill sizes="76px" unoptimized className="object-cover" />
                        ) : (
                          <span className="text-[22px] font-semibold text-muted-foreground">{initials}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[15px] md:text-[16px] font-semibold text-foreground leading-tight mb-1.5">{m.name}</div>
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="inline-flex items-center gap-1 bg-success/10 text-success text-[10px] font-mono font-bold px-2 py-0.5 rounded-full tracking-wide">
                            <span className="w-1 h-1 rounded-full bg-success" aria-hidden />
                            <span>مسؤول</span>
                          </span>
                          <span className="text-[12.5px] text-muted-foreground">{m.role}</span>
                        </div>
                        {m.bio && (
                          <p className="text-[12.5px] text-muted-foreground leading-[1.7]">{m.bio}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {executionTeam.length > 0 && (
              <div>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 font-mono text-[10.5px] text-muted-foreground tracking-[1.5px]">
                    <span className="w-6 h-px bg-border" aria-hidden />
                    <span>فريق التنفيذ</span>
                    <span className="w-6 h-px bg-border" aria-hidden />
                  </div>
                </div>
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                >
                  {executionTeam.map((m, i) => {
                    const initials = m.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
                    return (
                      <div
                        key={i}
                        className="bg-background border border-border rounded-xl p-3 flex flex-col items-center text-center gap-2 hover:border-muted-foreground/50 transition-colors"
                      >
                        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                          {m.avatarUrl ? (
                            <Image src={m.avatarUrl} alt={`${m.name} — ${m.role}`} fill sizes="56px" unoptimized className="object-cover" />
                          ) : (
                            <span className="text-[15px] font-semibold text-muted-foreground">{initials}</span>
                          )}
                        </div>
                        <div className="min-w-0 w-full">
                          <div className="text-[12.5px] font-semibold text-foreground truncate">{m.name}</div>
                          <div className="text-[10.5px] text-muted-foreground truncate mt-0.5">{m.role}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
              </div>
            </details>
          </div>
        </section>
  );
}
