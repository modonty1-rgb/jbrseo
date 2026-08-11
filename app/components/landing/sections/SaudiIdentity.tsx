import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck, Users } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { TeamFacesSlider } from "./TeamFacesSlider";
import type { StaticLanding } from "@/app/content/landing/types";

type TeamMember = NonNullable<StaticLanding["team"]>["coreTeam"][number];

type Props = {
  /** Faces shown in the cycler. Everyone else is one click away on /team. */
  team?: TeamMember[];
};

/**
 * One trust strip where there used to be two sections.
 *
 * The registration card ran 1,212px and the team section another 241px at opposite ends
 * of the page — the first above the prices, the second below them. Both answer the same
 * underlying question in two halves: *is this a real company* and *who actually does the
 * work*. Merging them costs one heading and buys back a section, and it puts the faces
 * above the price where they can still influence the decision instead of arriving after
 * it.
 *
 * What survived the compression is the part that proves rather than claims: the legal
 * name, the CR number a reader can paste into the ministry's portal, and real faces. The
 * certificate, the QR, the address and the full roster are one link away each — on the
 * pages a reader opens *because* they are checking, where a heavy scan also stays off
 * mobile devices whose GPUs it corrupted.
 */
export function SaudiIdentity({ team = [] }: Props) {
  // No slice worth making: the strip scrolls, so more people cost width the reader
  // chooses to travel rather than height the page pays for. Capped only against a roster
  // that grows unreasonably.
  const faces = team.slice(0, 12);

  return (
    <section className="bg-background">
      {/* `max-w-270`, the width every other section on the page uses.
          At `max-w-230` this row was 160px narrower than the sections above and below it,
          which showed as a dark inset on both sides — the cards looked like they had been
          dropped into the page rather than built into it. A shared measure is what makes
          a stack of sections read as one page. */}
      <div className="mx-auto max-w-270 px-5 md:px-7 py-5 md:py-6">
        {/* Same shape as the cost pair above: two cards, each split [what it is | the
            figure that proves it].
            They were single 56px strips — a label and a link — beside a section whose
            cards run 210px, so the two claims a sceptic actually checks were the least
            substantial things on the page. Reusing the pattern also means a reader who
            learned to read the cost cards reads these the same way. */}
        <div className="grid gap-3 md:grid-cols-2 md:items-stretch">
          {/* Card one — the company exists, and here is the number that proves it. */}
          <Link
            href="/about#legal"
            className="group grid h-full overflow-hidden rounded-2xl border border-border bg-card no-underline transition-colors hover:border-success/40 sm:grid-cols-[1fr_auto]"
          >
            <div className="flex flex-col px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                  <ShieldCheck className="size-5" strokeWidth={2.2} aria-hidden />
                </span>
                <div className="min-w-0">
                  <div className="text-[14px] font-bold leading-[1.4] text-foreground">
                    {COMPANY.legalName}
                  </div>
                  <div className="text-[12.5px] leading-[1.65] text-muted-foreground">
                    {COMPANY.city} · {COMPANY.country}
                  </div>
                </div>
              </div>

              {/* Mobile drops these three, desktop keeps them.
                  On a phone the card is name + number + certificate link, and the ticks
                  only restated what those three already are. On a desktop the card sits in
                  a two-column row at a fixed height, so removing them left the text half
                  hollow beside a filled number panel — the trim that tightened the phone
                  emptied the desktop. Different amounts of room, different answers. */}
              <ul className="mt-3 hidden space-y-1.5 md:block">
                {[
                  "كيان سعودي مسجّل رسمياً",
                  "تقدر تتحقق من السجل بنفسك",
                  "الشهادة منشورة كاملة",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2 text-[12.5px] leading-[1.6] text-foreground">
                    <Check className="mt-1 size-3.5 shrink-0 text-success" strokeWidth={2.5} aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The number, given the half the cost cards give their totals. It is the
                one thing on this card a reader can paste into the ministry's portal, so
                it is the thing that should be big. LTR: a registration number never
                mirrors, whatever the page direction. */}
            <div className="flex flex-col items-center justify-center gap-0.5 border-t border-t-border bg-background/40 px-5 py-4 text-center transition-colors group-hover:bg-success/5 sm:border-t-0 sm:border-s sm:border-s-border sm:px-6">
              {/* `tabular-nums`, not `font-mono`. The mono stack has no Arabic-Indic
                  glyphs; these are Latin digits so it did no harm here, but equal digit
                  widths are the only thing it was buying. */}
              <span dir="ltr" className="tabular-nums text-[22px] font-bold leading-none text-foreground">
                {COMPANY.unifiedNumber}
              </span>
              <span className="text-[12px] font-semibold text-muted-foreground">سجل تجاري</span>
              <span className="mt-2 inline-flex items-center gap-1 border-t border-t-border pt-2 text-[12.5px] font-bold text-success">
                شوف الشهادة
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
              </span>
            </div>
          </Link>

          {/* Half two — and these are the people. Rendered only when there are faces to
              show, so an empty roster collapses the row instead of leaving a stub. */}
          {faces.length > 0 && (
            <div className="grid h-full overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-[1fr_auto]">
              {/* The faces themselves, where the bullet list was.
                  The bullets described the photographs — "تشوف أسماءهم وأدوارهم" above a
                  card that was not showing them — so they spent the card's whole width
                  narrating what the card could simply do. The reader moves through the
                  roster instead of reading about it.
                  Not wrapped in the link any more: a draggable strip inside an anchor
                  fights the anchor on every swipe. */}
              <div className="flex min-w-0 flex-col px-5 py-4">
                <div className="mb-3 flex min-w-0 items-center gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                    <Users className="size-5" strokeWidth={2.2} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    {/* Not "فريق سعودي".
                        The roster is mixed — Saudis and non-Saudis — so the claim was
                        untrue, and an untrue line on the card whose whole job is trust
                        costs more than it buys. The company's Saudi registration is a
                        fact about the company, and the card beside this one makes it. */}
                    <div className="text-[14px] font-bold leading-[1.4] text-foreground">
                      الفريق اللي يشتغل على حضورك
                    </div>
                    <div className="text-[12.5px] leading-[1.65] text-muted-foreground">
                      بأسمائهم وأدوارهم
                    </div>
                  </div>
                </div>

                <TeamFacesSlider members={faces} />
              </div>

              {/* The claim, in the half the other card gives its registration number. */}
              <Link
                href="/team"
                className="group flex flex-col items-center justify-center gap-0.5 border-t border-t-border bg-background/40 px-5 py-4 text-center no-underline transition-colors hover:bg-success/5 sm:border-t-0 sm:border-s sm:border-s-border sm:px-6"
              >
                {/* Eastern digits and «٪» have no glyphs in a monospace stack. */}
                <span dir="ltr" className="text-[26px] font-bold leading-none text-foreground">
                  ١٠٠٪
                </span>
                <span className="text-[12px] font-semibold text-muted-foreground">فريق محترف</span>
                <span className="mt-2 inline-flex items-center gap-1 border-t border-t-border pt-2 text-[12.5px] font-bold text-success">
                  تعرّف عليهم
                  <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
