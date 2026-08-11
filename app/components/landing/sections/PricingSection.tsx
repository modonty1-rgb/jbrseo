"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Clapperboard, Code2, FileText, Gift, Lock, ShieldCheck, Star } from "lucide-react";
import type { Plan as DBPlan } from "@prisma/client";
import { cn } from "@/lib/utils";
import { getPlanCardContent } from "@/lib/plan-card-content";
import { GTMEvents } from "@/lib/gtm";
import { toArabicDigits, formatPrice } from "../landing-helpers";
import {
  PLAN_DURATIONS,
  RECOMMENDED_DURATION,
  FREE_MONTHS,
  priceForDuration,
  parseDuration,
  type PlanDuration,
} from "@/lib/pricing-durations";

const EASTERN_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/**
 * The monthly article count, read out of the label an admin typed.
 *
 * `Plan` stores the figure only inside `articlesLabel` — "٤ مقالات / شهر" — so the card
 * cannot multiply it out without parsing it back. Eastern digits are transliterated
 * first because that is how the labels are written.
 *
 * Returns null when the label holds no number, which is the case that matters: a label
 * written in words ("أربع مقالات") must leave the card printing the label as-is rather
 * than showing a total derived from nothing.
 */
function monthlyArticles(label: string | null | undefined): number | null {
  if (!label) return null;
  const western = label.replace(/[٠-٩]/g, (d) => String(EASTERN_DIGITS.indexOf(d)));
  const match = western.match(/\d+/);
  if (!match) return null;
  const n = Number(match[0]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

type Props = {
  visiblePlans: DBPlan[];
  currency: string;
  countrySlug: "sa" | "eg";
  whatsappLink: string;
  checkoutHref: string;
  /**
   * Where the Tamara route starts, or nothing at all.
   *
   * Absent means "do not offer Tamara here", and the server is the only thing that can
   * decide that: it knows the country and whether the keys exist. Passing a boolean
   * instead would put that decision in the browser, where a stale build could show a
   * button for a market Tamara rejects.
   */
  tamaraHref?: string;
  /**
   * The guarantee line under the buttons, straight from the content the admin edits.
   *
   * Optional on purpose: absent means the section renders no promise at all. A default
   * string here would be a guarantee written by this file rather than by whoever owns
   * the refund policy, and that is how a page ends up promising something the business
   * never agreed to.
   */
  refundNote?: string;
};

/** Pricing plans (DB) with the 3/6/12-month duration toggle. Owns duration state
 *  + the GA4 pricing_view IntersectionObserver (both pricing-only). Client component. */
/**
 * The brand marks that ride inside a payment button.
 *
 * They sit in the button rather than in a row above it because there are now two ways to
 * pay and a shared row cannot say which logo belongs to which. A customer scanning the
 * card should be able to tell the two buttons apart without reading either — the mark is
 * doing the work the label would otherwise have to.
 *
 * `aria-hidden`: the button's own text already names the payment method, so announcing
 * "mada Visa Mastercard" again would only lengthen what a screen reader has to sit
 * through before the actual action.
 */
const CARD_MARKS = [
  { src: "/logos/mada.svg", alt: "مدى" },
  { src: "/logos/visa.svg", alt: "Visa" },
  { src: "/logos/mastercard.svg", alt: "Mastercard" },
] as const;

/**
 * The Tamara call to action, or the exact space it would have taken.
 *
 * A pricing table earns its keep by letting the eye compare one row against the next, and
 * that only works while the three cards stay in step. The consultation plan has no Tamara
 * route, so without this its feature list started 107px above its neighbours' and the
 * comparison broke — a cost introduced by adding the button to two cards out of three.
 *
 * The placeholder is the same element rendered `invisible` rather than a hardcoded height,
 * so it cannot drift: change the padding, the logo size or the label, and the reserved
 * space follows on its own. It is removed from the accessibility tree and from the tab
 * order, so a keyboard or screen-reader user never meets a button that is not there.
 */
function TamaraCta({
  href,
  onClick,
  placeholder = false,
}: {
  href: string;
  onClick?: () => void;
  placeholder?: boolean;
}) {
  const className = cn(
    // Deliberately quieter than the primary above it, and now visibly so: the two used to
    // share a background and a border, which made the card offer two equal actions and
    // left the reader choosing between them instead of choosing the plan. Outlined on the
    // card's own surface reads as "the other way", which is what it is.
    "flex items-center justify-center gap-2 p-[13px] rounded-[11px] text-[14px]",
    "no-underline mb-2 border border-border bg-transparent font-bold text-muted-foreground",
    "transition-colors hover:border-foreground/30 hover:text-foreground",
    placeholder && "invisible",
  );

  const inner = (
    <>
      {/* Text only. The Tamara wordmark used to sit inside this button, which made the
          card carry brand plates in two of its three controls while the same marks also
          ran above the whole section. It moved to the card's footer beside mada, Visa and
          Mastercard: one strip, one scheme, every way to pay in the same place. The label
          still names the offer, which is what the button is for. */}
      <span>قسّطها على دفعات</span>
      <ArrowLeft className="w-4 h-4" aria-hidden />
    </>
  );

  if (placeholder) {
    return (
      <div className={className} aria-hidden="true">
        {inner}
      </div>
    );
  }

  return (
    <Link href={href} prefetch={false} onClick={onClick} className={className}>
      {inner}
    </Link>
  );
}

function PayMarks({ logos }: { logos: readonly { src: string; alt: string }[] }) {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {logos.map((logo) => (
        <span
          key={logo.alt}
          className="h-5 w-8 rounded bg-white ring-1 ring-black/5 flex items-center justify-center px-1"
        >
          <Image
            src={logo.src}
            alt=""
            width={200}
            height={44}
            unoptimized
            style={{ height: 10, width: "auto", maxWidth: "100%", objectFit: "contain" }}
          />
        </span>
      ))}
    </span>
  );
}

export function PricingSection({ visiblePlans, currency, countrySlug, whatsappLink, checkoutHref, tamaraHref, refundNote }: Props) {
  // Default to the recommended duration (6 months). The ?duration= deep-link is
  // read client-side so the page itself stays static/cacheable.
  const [duration, setDuration] = useState<PlanDuration>(RECOMMENDED_DURATION);

  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get("duration");
    if (d) setDuration(parseDuration(d));
  }, []);

  useEffect(() => {
    const pricingEl = document.getElementById("pricing");
    if (!pricingEl) return;
    let fired = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          GTMEvents.pricingView({ country: countrySlug });
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(pricingEl);
    return () => observer.disconnect();
  }, [countrySlug]);

  return (
    /* `leading-[1.7]` on the section, not on thirty-three elements.
       Thirty-three Arabic lines here inherited the 1.5 default, where Arabic wants
       1.6–1.8: its ascenders, descenders and diacritics need the vertical room that
       Latin does not, and at 1.5 the marks of one line sit on the letters of the next.
       Nearly all of them had no line-height class at all, so the fix belongs at the root
       rather than repeated down the tree — anything that genuinely needs to be tighter
       (the price figure, the plan names) states its own value and overrides this. */
    /* `md:pb-12`, down from `md:pb-20`: 80px of padding under a one-line link left the
       section trailing off into empty space before the next one began. */
    // No `scroll-mt-16`. globals.css sets `[id] { scroll-margin-top: 104px }` for the
    // sticky header, and 64px here overrode it downward — the one section every nav and
    // CTA on the page points at was also the one that landed under the header.
    <section id="pricing" className="max-w-270 mx-auto px-5 md:px-7 pt-8 pb-10 md:pt-10 md:pb-12 leading-[1.7]">
        {/* `mb-14`, not `mb-5`.
            The gap between the duration control and the cards measured 20px — and the
            plan-name tabs hang 19px above their cards, so the two were effectively
            touching: the tabs looked like a fourth row of the toggle. A control and the
            thing it controls need a break between them, or the reader cannot tell which
            of the two rows of pills they are supposed to press. */}
        <div className="text-center mb-14">
          {/* Founding-offer badge — the free-months incentive is a launch
              concession, not a permanent price. Labelling it "limited" keeps
              the sticker price intact so it can be retracted later without a
              price drop (Khalid 2026-08-03). */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11.5px] font-bold text-amber-600 dark:text-amber-400 mb-3">
            <span className="relative flex h-1.5 w-1.5">
              {/* The one motion that survives in this section, and the only one that
                  carries information: the offer is time-limited, and a pulse is what
                  "still running" looks like. Six others — a glow on all three gift
                  badges and a bouncing chevron on all three cards — ran beside it around
                  the buy button, and continuous motion around a purchase reads as an ad,
                  which the eye learns to skip. `motion-reduce` stops it outright. */}
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
            </span>
            <span>عرض تأسيسي — لفترة محدودة</span>
          </div>
          {/* Heading first, offer second.
              The stack opened with a limited-offer badge, then the twelve-for-eighteen
              hook, and only then said what the section is — so the reader met two
              promotions before learning they were looking at plans. The heading now leads
              and the hook supports it, which is also the order the eye wants: the largest
              type at the top of the block. */}
          <h2 className="text-balance text-[clamp(20px,5.8vw,32px)] font-semibold leading-[1.3]">اختر باقتك وابدأ اليوم</h2>
          {/* The "ادفع ١٢ شهر — واستلم ١٨" hook is gone.
              It contradicted the page it sat on. The toggle defaults to six months, so
              every number under this line said seven months and one free — while the line
              promised eighteen. A reader met a promise that matched nothing in front of
              them, on the section where every figure has to be trusted.
              It was also the third statement of the same gift: the twelve-month tab now
              says "٦ شهور مجاناً" on the control that grants it, and each card names the
              free month inside its price band. Both of those move with the reader's
              choice; this line could not. */}
          {/* Segmented control — 3 durations (6 months = الأنسب) */}
          <div
            // Wider and taller: three tabs now carry badges that name months, and at
            // 320px the labels sat edge to edge with them. It is also the control that
            // changes every number below it, so it should not be the smallest thing in
            // the header.
            // `mt-8`: the tags ride 10px above the buttons, so a 24px margin left them
            // sitting on the hook line above.
            className="grid grid-cols-3 w-full max-w-96 mx-auto bg-muted rounded-[14px] p-1.5 mt-8 text-sm font-medium"
            role="tablist"
            aria-label="مدة الاشتراك"
          >
            {PLAN_DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                role="tab"
                aria-selected={duration === d}
                onClick={() => setDuration(d)}
                className={cn(
                  "relative rounded-[11px] py-3 px-2 min-h-[var(--tap)] text-[15px] font-bold",
                  duration === d ? "bg-card text-foreground shadow-[0_1px_3px_color-mix(in oklch, var(--foreground) 8%, transparent)]" : "bg-transparent text-muted-foreground",
                )}
              >
                {d === 12 ? "١٢ شهر" : d === 6 ? "٦ شهور" : "٣ شهور"}
                {/* One badge per tab, and it states the gift rather than an opinion.
                    The six-month tab wore "الأنسب" and the twelve-month tab a separate
                    gift chip, so the two tabs were labelled on different dimensions — a
                    recommendation against an offer — and neither could be compared with
                    the third, which had no label at all. Read as free months the three
                    options line up on one scale: nothing, a month, six. That is the
                    difference the toggle exists to show, and a fact a reader can check
                    beats a word telling them what to prefer.
                    Both derive from `FREE_MONTHS`, so the badge cannot drift from the
                    months the price is actually calculated on. */}
                {FREE_MONTHS[d] > 0 && (
                  <span
                    className={cn(
                      // 11px, and `start-1/2` rather than `right-1/2`. This badge carries
                      // the free-months offer — the strongest number in the control — and
                      // it was the smallest text in the section at 10px. The physical
                      // `right-1/2` also centred it from the wrong edge outside RTL.
                      "absolute -top-2.5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap",
                      d === RECOMMENDED_DURATION
                        ? "bg-success text-success-foreground"
                        : "bg-amber-400 text-amber-950",
                    )}
                  >
                    {FREE_MONTHS[d] === 1
                      ? "شهر مجاني"
                      : `${toArabicDigits(FREE_MONTHS[d])} شهور مجاناً`}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* The Saudi payment row that used to sit here is gone.
            It showed mada, Visa, Mastercard and Tamara, plus the gateway caption, above
            the plans — so a reader met the ways to pay before there was anything to pay
            for, and then met the same marks again inside every card: once in the primary
            button and once as the Tamara button. Reassurance works at the moment of
            commitment, and the cards already carry it there, on the controls that act on
            it. The certification line survives once, under the grid. */}
        {/* Egypt: InstaPay / bank transfer + international cards (the N-Genius
            gateway accepts Visa/Mastercard globally — Khalid 2026-07-15). */}
        {countrySlug === "eg" && (
          <div className="mb-6 md:mb-8 flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2">
              {[
                { src: "/logos/instapay.svg", alt: "InstaPay" },
                { src: "/logos/visa.svg", alt: "Visa" },
                { src: "/logos/mastercard.svg", alt: "Mastercard" },
                { src: "/logos/saib-bank.png", alt: "SAIB Bank" },
              ].map((logo) => (
                <div key={logo.alt} className="h-7 w-12 bg-white rounded-md ring-1 ring-black/5 flex items-center justify-center px-1.5">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={200}
                    height={44}
                    unoptimized
                    style={{ height: 14, width: "auto", maxWidth: "100%", objectFit: "contain" }}
                  />
                </div>
              ))}
            </div>
            <div className="text-[11.5px] leading-[1.6] text-muted-foreground">
              إنستا باي · البطاقات · التحويل البنكي
            </div>
          </div>
        )}

        <div
          // gap-8 below sm, gap-3.5 from there. Stacked in one column the cards sit 14px
          // apart, and each plan-name tab hangs 19px above its own card — 5px into the
          // card above it, landing on that card's payment footer. Side by side on desktop
          // the tabs have open air above them and 14px is right; the extra room is only
          // needed where the cards are vertically adjacent.
          className="grid gap-8 sm:gap-3.5 max-sm:grid-cols-1!"
          style={{ gridTemplateColumns: `repeat(${Math.min(visiblePlans.length, 4)}, 1fr)` }}
        >
          {visiblePlans.map((p) => {
            const featured = !!p.featuredBadge && p.featuredBadge.trim() !== "";
            const dp = priceForDuration(p.priceMonthly, duration);
            const content = getPlanCardContent(p.slug);
            if (!content) return null;
            // `personaIcon` is no longer read here — the line it belonged to is gone.
            // The field stays in `plan-card-content` for the admin preview that also
            // renders it; dropping it there is a separate change.

            // Articles across the whole term. `articlesLabel` is free text an admin
            // writes ("٤ مقالات / شهر"), so the monthly figure is read out of it rather
            // than stored — and when it holds no digit at all, this is null and the card
            // falls back to printing the label untouched instead of guessing a total.
            const perMonth = monthlyArticles(p.articlesLabel);
            const totalArticles = perMonth ? perMonth * dp.serviceMonths : null;

            // Articles delivered to the customer's own site, counted the same way — the
            // free month delivers these too, so the multiplier is service months, not
            // paid months. Null on the plans with no integration, which is what hides the
            // row (and reserves its height so the three cards stay in step).
            const siteTotal = content.siteArticlesPerMonth
              ? content.siteArticlesPerMonth * dp.serviceMonths
              : null;

            // Reels across the term, on the same rule as both article counts.
            const reelsTotal = content.reelsPerMonth
              ? content.reelsPerMonth * dp.serviceMonths
              : null;

            // No prepended article bullet any more: the box that now opens the feature
            // list carries both the total and the monthly rate, so adding the rate again
            // as the first bullet would print it twice, a line apart.
            const bullets = content.bullets;
            // `ctaAsConsultation` is no longer read: every Saudi plan now routes to
            // checkout, including the top tier, whose price is published and whose
            // deliverables are fixed. See the note in `plan-card-content`.
            // Payment is Saudi-only — Egypt visitors go to WhatsApp for pricing plans.
            const isExternalCta = countrySlug === "eg";

            return (
              <div
                key={p.id}
                className={cn(
                  // A flex column so the footer can be pinned to the bottom edge with
                  // `mt-auto`. The grid already stretches the three cards to one height;
                  // without this the payment footer stopped wherever the content did and
                  // left a gap beneath it on the shorter cards.
                  "rounded-[18px] px-5.5 py-6.5 relative border-2 bg-card text-foreground flex flex-col",
                  featured
                    ? "order-first md:order-none border-success ring-2 ring-success/40"
                    : "border-border",
                )}
              >
                {/* A pill riding the top border, on every card that has something to say
                    there — not only the featured one.
                    The featured card was the only one wearing a tab, which gave it a
                    silhouette the other two lacked and made the row read as one plan plus
                    two afterthoughts before a single word was read. `p.badge` carries the
                    label for the rest ("للمؤسسات" on الريادة), so the shape is shared and
                    the colour does the ranking: green names the popular choice, neutral
                    names an audience. A plan with neither simply has no tab. */}
                {/* The plan's name, on the tab.
                    It was set at 20px inside the card, a third of the way down, while the
                    frame above it carried a ranking label — so the first thing the eye
                    met on each card was an adjective and the name came second. The name
                    is what a reader compares, points at and says out loud, so it takes
                    the tab; the ranking moves inside as the line under it. Green with a
                    star still marks the popular one, which is what that badge was for. */}
                {/* At the 20px it had inside the card, not shrunk to badge size. Moving
                    it to the tab was about position, not weight: the name is still the
                    thing being compared across the row, so it keeps the size that made it
                    readable at a glance. The tab grows to fit it. */}
                <span
                  className={cn(
                    // `start-6`, not `right-6`. The plan-name tab belongs on the card's
                    // start edge; the case-study badge above was already corrected the
                    // same way after landing on the wrong corner in LTR.
                    // z-10: the tab is absolutely positioned and overhangs the card, so
                    // without a stacking order it paints under whatever static content
                    // follows it in the flow.
                    "absolute -top-[19px] start-6 z-10 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[20px] font-extrabold leading-none",
                    featured
                      ? "bg-success text-success-foreground md:shadow-[0_10px_22px_-10px_color-mix(in_oklch,var(--success)_60%,transparent)]"
                      : "border-2 border-border bg-card text-foreground",
                  )}
                >
                  {featured && <Star className="w-4 h-4 shrink-0 fill-current" strokeWidth={2.5} aria-hidden />}
                  {p.name}
                </span>

                {/* The persona line is gone.
                    It read "للنشاط الجديد الحابس على أول عملاء من قوقل" and its two
                    siblings named ambitions — new, serious, wanting to grow fast — which
                    every owner reads as themselves. A label nobody can rule themselves
                    out of sorts nobody into anything, so it cost a line on all three cards
                    and left the reader exactly where they started. What actually
                    distinguishes the plans is directly below it: the article count, the
                    price, and the bullets. `p.badge` stays, because "للمؤسسات" is a fact
                    about who the plan is sold to rather than a description of ambition. */}
                {/* `p.badge` is not rendered. It held "للمؤسسات" on the top plan and
                    nothing on the others, so it printed a line on one card out of three
                    and pushed that card's price a line lower than its neighbours' — the
                    row stopped comparing straight across, which is the one thing a
                    pricing table has to do. The plan sells itself on its price and its
                    list; a label naming an audience did not earn a line of its own.
                    The field stays in the database untouched. */}

                {/* The price, directly under the name.
                    Stripe, Notion and Slack all set their cards in the same order — name,
                    price, button, features — and NN/g's finding is why: a visitor reading
                    a pricing page is looking for the number, and a site that puts it first
                    is read as forthright. This card had the article count between the two,
                    so the figure being searched for arrived third, behind a claim.
                    The deliverables did not lose anything by moving: they now sit where
                    every one of those pages puts them, under the button. */}
                {/* The price on its own band, edge to edge.
                    Set inline and left-aligned it was one paragraph among several, at the
                    same measure as everything else — so the figure the reader is here to
                    weigh had no more presence on the card than a feature line. Breaking
                    the band out of the card's padding (`-mx-5.5`) gives it the full width
                    and a rule top and bottom, which is what makes it read as a section of
                    the card rather than another sentence in it. Centred, because a
                    centred number in a full-width band is a price tag, and a price tag is
                    the object being imitated.
                    No rounded corners and no fill beyond a faint tint: after the buttons
                    became the card's only filled, rounded objects, anything else wearing
                    that treatment starts looking pressable. */}
                <div className="-mx-5.5 mb-1 border-y border-y-border bg-foreground/[.03] px-5.5 py-4 text-center">
                  <div className="flex items-baseline justify-center gap-2">
                    {/* `dir="ltr"` on the figure: a price never mirrors, in either script,
                        and the thousands separator has to stay where the grouping put it. */}
                    {/* No `font-mono`. `formatPrice` returns Eastern digits with ASCII
                        commas, and a monospace stack has no Arabic-Indic glyphs — so the
                        separators rendered in one face and the digits in another, inside
                        the largest number on the page. */}
                    <span dir="ltr" className="text-[40px] font-semibold leading-none text-foreground">{formatPrice(dp.total)}</span>
                    <span className="text-[13px] text-muted-foreground">{currency} · {toArabicDigits(dp.serviceMonths)} شهر</span>
                  </div>
                  {/* Effective per-month, and the gift that produces it — one line under
                      the price, the only place the two facts explain each other: the rate
                      is lower than the sticker precisely because a month is free. The gift
                      used to sit up on the frame as a badge, where it announced an offer
                      without showing what it did to the number. */}
                  {/* The monthly rate on every term, not only the ones with a gift.
                      This was rendered `freeMonths > 0`, so choosing ٣ شهور replaced it
                      with an invisible spacer: the card showed ١,١٩٧ ر.س and nothing to
                      divide it by, and the shortest term — the one a hesitant buyer picks
                      — was the only one that hid its per-month figure. That also broke the
                      toggle's whole purpose, since the three terms can only be compared
                      through the rate they work out to.
                      `effectiveMonthly` is defined at every duration (total ÷ service
                      months), so at ٣ شهور it is simply the base monthly price. The gift
                      clause is what varies, and it appends only when there is one. */}
                  <div className="mt-2 text-[12px] font-bold leading-[1.6] text-success/90">
                    {/* The figure keeps mono and LTR; the Arabic around it does not. */}
                    = <span dir="ltr">{formatPrice(dp.effectiveMonthly)}</span> {currency}/شهر فعلياً
                    {dp.freeMonths > 0 && (
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {" · "}
                        منها {dp.freeMonths === 1 ? "شهر" : `${toArabicDigits(dp.freeMonths)} ${dp.freeMonths >= 3 ? "شهور" : "شهر"}`} مجاناً
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={isExternalCta ? whatsappLink : `${checkoutHref}?plan=${p.slug}&duration=${duration}`}
                  prefetch={false}
                  target={isExternalCta ? "_blank" : undefined}
                  rel={isExternalCta ? "noopener noreferrer" : undefined}
                  onClick={() => {
                    if (isExternalCta) GTMEvents.whatsappClick();
                    else
                      GTMEvents.planClick({
                        plan: p.slug,
                        price: dp.total,
                        billing: `${duration}m`,
                        country: countrySlug,
                      });
                  }}
                  className={cn(
                    // Filled, on every card — not only the featured one.
                    // Both routes out of this card were painted `bg-background` with a
                    // 1px border, which is the same treatment the article box, the trust
                    // chip and the card itself already wear: measured, the primary and the
                    // instalment link had identical backgrounds and identical borders, so
                    // nothing on the card said "this is the thing you press". On a page
                    // where the whole point is one action, the action has to be the only
                    // filled object in view.
                    "flex items-center justify-center gap-2 p-[15px] rounded-[11px] text-[15px] no-underline mt-4.5 mb-2 font-extrabold",
                    "transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 motion-reduce:transform-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                    featured
                      ? "bg-success text-success-foreground shadow-[0_10px_24px_-12px_color-mix(in_oklch,var(--success)_70%,transparent)] hover:shadow-[0_16px_32px_-14px_color-mix(in_oklch,var(--success)_75%,transparent)] focus-visible:ring-success"
                      : "bg-primary text-primary-foreground shadow-[0_10px_24px_-12px_color-mix(in_oklch,var(--primary)_70%,transparent)] hover:shadow-[0_16px_32px_-14px_color-mix(in_oklch,var(--primary)_75%,transparent)] focus-visible:ring-primary",
                  )}
                >
                  {/* Label and arrow only. The card marks used to ride inside this button,
                      which made the one control on the card carry three logos and its own
                      text — and the same three appeared again in the row above the plans.
                      They moved to the card's footer, where they say what they are for
                      without competing with the action. */}
                  <span>{countrySlug === "eg" ? "تواصل عبر واتساب" : (p.ctaText || `ابدأ بـ${p.name}`)}</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>

                {/* Tamara — a second, equal-weight route to the same plan.
                    It sits here rather than inside checkout because instalments
                    answer the sticker price, and the price is on this card. The
                    href arrives only when the server decided Tamara applies:
                    Saudi Arabia, and configured — Tamara refuses Egypt with
                    `400 not_supported_delivery_country`, so an Egyptian visitor
                    is never shown a button that cannot work. */}
                {tamaraHref && (
                  <TamaraCta
                    href={`${tamaraHref}?plan=${p.slug}&duration=${duration}`}
                    placeholder={isExternalCta}
                    onClick={() =>
                      GTMEvents.planClick({
                        plan: p.slug,
                        price: dp.total,
                        billing: `${duration}m`,
                        country: countrySlug,
                      })
                    }
                  />
                )}
                {/* Refund guarantee — only for Saudi + featured, matches project_refund_policy.md.
                    It follows BOTH buttons on purpose: the fourteen days belong to the
                    subscription, not to how it was paid for, and sitting under one of the
                    two would read as a promise that applies to that button alone. */}
                {/* Same reservation trick as the Tamara button, and for the same reason:
                    `mb-4` used to stand in for this line on the other cards, but a margin
                    is not the height of a row of text plus an icon, so the three feature
                    lists still started at different heights. Rendering the real line
                    invisibly keeps them locked together whatever the copy becomes. */}
                {/* Shown on every plan that is actually bought, not just the featured one.
                    The fourteen days come from the refund policy, which is written against
                    the subscription — nothing in it singles out one plan. Printing it on
                    one card and withholding it from the next reads as if the others are
                    not covered, which would be the opposite of true, and it withholds the
                    strongest reassurance at the exact moment it is needed. The consultation
                    plan is excluded because nothing is bought there. */}
                {countrySlug === "sa" && refundNote ? (
                  // Visible on all three now: every plan is bought here, so every plan
                  // carries the same guarantee. It used to be hidden on the top tier,
                  // whose button opened WhatsApp instead of checkout.
                  <div className="flex items-center justify-center gap-1.5 mb-3 text-[11px] text-success/90 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden />
                    <span>{refundNote}</span>
                  </div>
                ) : (
                  <div className="mb-3" />
                )}

                {/* The "عندك سؤال؟ تكلّم معنا" link that was here is gone.
                    It was added to keep a conversation available after the top plan's
                    consultation button became a checkout button — but putting it on all
                    three cards gave the section four WhatsApp links: one per card plus the
                    escape valve under the grid. The escape valve already does this job,
                    once, where a reader who has finished comparing arrives. */}
                {/* The output of the whole subscription, leading the deliverables.
                    It used to sit above the price, where it delayed the figure the reader
                    came for. Here it is the first thing under the button — the same slot
                    Stripe, Notion and Slack give "Includes:" — and it is the strongest
                    line in that list, so it opens it rather than hiding inside it.
                    Counted on `serviceMonths`, which includes the gift month, because that
                    month delivers its articles like any other (confirmed with Khalid).
                    The monthly rate stays under the total, so the big figure can always be
                    checked against it instead of taken on trust. If `articlesLabel` ever
                    stops carrying a number — an admin writes it in words — the label
                    prints as-is and nothing is invented. */}
                {/* No border, no fill.
                    Once the buttons became the only filled, bordered objects on the card,
                    this box started claiming the same affordance — a rounded panel with a
                    frame sitting right under a button reads as a second button, and a
                    reader who clicks it and gets nothing learns to distrust the card. It
                    is a statement of what the plan delivers, so it is set as text. The
                    icon loses its tinted chip for the same reason. */}
                <div className="mb-4 flex items-center gap-3">
                  <FileText className={cn("size-6 shrink-0", featured ? "text-success" : "text-muted-foreground")} strokeWidth={1.8} aria-hidden />
                  <div className="flex-1 min-w-0">
                    {totalArticles ? (
                      /* Total and rate on one line, one at each end.
                         Stacked, the rate sat directly under the total as a caption, and
                         two article counts in a column invite the eye to read the second
                         as a correction of the first. Across a line with space between
                         them they read as what they are: the whole, and the pace it
                         arrives at. */
                      <>
                        <div className="flex items-baseline justify-between gap-2">
                          {/* The destination in brackets on the same line as the total.
                              With two counts on the card, a number with no address is
                              ambiguous — and the difference between the two is precisely
                              where they land. On its own line underneath it read as a
                              caption; in brackets it belongs to the figure. */}
                          <span className={cn(
                            "text-[24px] font-extrabold leading-[1.15]",
                            featured ? "text-success" : "text-foreground",
                          )}>
                            {toArabicDigits(totalArticles)} {totalArticles >= 11 ? "مقالاً" : "مقالات"}
                            <span className="text-[13px] font-bold text-muted-foreground"> (مدونتي)</span>
                          </span>
                          <span className="shrink-0 text-[11.5px] leading-[1.6] text-muted-foreground">
                            {p.articlesLabel}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className={cn(
                        "text-[17px] font-extrabold leading-[1.4]",
                        featured ? "text-success" : "text-foreground",
                      )}>
                        {p.articlesLabel || "—"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Where the articles land, at the weight of how many there are.
                    A plan is compared on two things — how much content, and where it
                    goes — and the second was a bullet halfway down a list, so the plans
                    that publish to the customer's own site looked identical to the one
                    that does not until someone read to the fourth line. Set as a row
                    beside the count, the difference is visible in a glance across the
                    three cards, which is the whole job of a pricing table. */}
                {/* Only on the plans that actually reach the customer's own site.
                    الانطلاقة publishes to the platform and its channels, which the
                    section above and the bullets below already say — printing it here at
                    headline weight put a shared baseline where the other two cards put
                    their differentiator, and a row that is not a difference does not
                    belong in the place the eye compares.
                    The row is still rendered on that card, invisibly: the three feature
                    lists have to start at the same height or the table stops comparing
                    straight across, and reserving the real element keeps that true if the
                    copy ever changes. Out of the accessibility tree, so a screen reader
                    is not read a plan detail that does not apply.
                    `Code2` where it arrives programmatically — the icon is the whole
                    explanation now that the note under the line is gone. */}
                {siteTotal ? (
                  <div className="mb-4 flex items-center gap-3">
                    <Code2 className={cn("size-6 shrink-0", featured ? "text-success" : "text-muted-foreground")} strokeWidth={1.8} aria-hidden />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className={cn(
                          "text-[24px] font-extrabold leading-[1.15]",
                          featured ? "text-success" : "text-foreground",
                        )}>
                          {toArabicDigits(siteTotal)} {siteTotal >= 11 ? "مقالاً" : "مقالات"}
                          <span className="text-[13px] font-bold text-muted-foreground"> (موقعك)</span>
                        </span>
                        <span className="shrink-0 text-[11.5px] leading-[1.6] text-muted-foreground">
                          {toArabicDigits(content.siteArticlesPerMonth ?? 0)} مقالات / شهر
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Locked, not blank.
                     Reserved invisibly this row left a hole in the entry card, and a hole
                     says nothing — while the row it was holding open is the single
                     difference that separates this plan from the next one up. A pricing
                     table sells as much through what a tier does not include as through
                     what it does, so the row states the gap and names the plan that
                     closes it. It also keeps the three feature lists starting at the same
                     height, which is what the invisible version was there for.
                     Muted, struck and lock-iconed so it cannot be mistaken for something
                     the plan includes. */
                  <div className="mb-4 flex items-center gap-3 opacity-70">
                    <Lock className="size-6 shrink-0 text-muted-foreground" strokeWidth={1.8} aria-hidden />
                    <div className="flex min-w-0 flex-1 items-baseline justify-between gap-2">
                      <span className="text-[15px] font-bold leading-[1.35] text-muted-foreground line-through decoration-muted-foreground/50">
                        مقالات على موقعك
                      </span>
                      <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-bold leading-[1.5] text-foreground">
                        من باقة الزخم
                      </span>
                    </div>
                  </div>
                )}

                {/* Reels, at the weight of the two counts above it.
                    A video feed is one of the three things this plan delivers, not a
                    footnote to them — buried in the bullet list it read as a detail of
                    the platform rather than a channel of its own. Counted the same way:
                    the plan's monthly videos across the service months, gift month
                    included.
                    Reserved invisibly on plans without it, like the row above, so the
                    three feature lists still start at the same height. */}
                <div
                  className={cn("mb-4 flex items-center gap-3", !reelsTotal && "invisible")}
                  aria-hidden={!reelsTotal || undefined}
                >
                  <Clapperboard className={cn("size-6 shrink-0", featured ? "text-success" : "text-muted-foreground")} strokeWidth={1.8} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className={cn(
                        "text-[24px] font-extrabold leading-[1.15]",
                        featured ? "text-success" : "text-foreground",
                      )}>
                    {/* "طلّات مدونتي", not "ريلز".
                        Reels is Instagram's word and Shorts is YouTube's; borrowing either
                        would name the feature after someone else's product — and both
                        names promise video only, while this feed carries images too.
                        A طلّة is a brief appearance *by someone*, which is exactly what
                        separates it from TikTok: only verified businesses appear in it, a
                        doctor with advice or a shop with a product, never the public. It
                        is also the one word that works for a photo and a clip alike.
                        The bracket translates the coined name on first sight, in the same
                        pattern the two rows above use for their destinations — a new name
                        with no translator is a feature nobody understands.
                        No number: the monthly count is not decided yet, and a figure
                        inferred from the plans' video highlights would read as a
                        commitment nobody made — on a card people pay from. */}
                        {toArabicDigits(reelsTotal ?? 0)} طلّة
                        <span className="text-[13px] font-bold text-muted-foreground"> (مدونتي)</span>
                      </span>
                      {/* The rate doubles as the translator: "٤ صور أو فيديو / شهر" says
                          what a طلّة is in the same breath as how many arrive, so the
                          coined name needs no separate gloss. */}
                      <span className="shrink-0 text-[11.5px] leading-[1.6] text-muted-foreground">
                        {toArabicDigits(content.reelsPerMonth ?? 0)} صور أو فيديو / شهر
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bullets label */}
                <div className="text-[11.5px] text-muted-foreground mb-3 font-semibold pb-3 border-b border-border">
                  {content.bulletsLabel}
                </div>

                {/* Bullets — mobile shows the top 3 differentiators; the rest
                    live behind a counted collapse ("value stays countable" per
                    Baymard). Desktop always shows the full list. */}
                {/* `md:mb-3`, matching the 12px `gap-3` between the rows inside.
                    The list is split across two containers — the first three bullets
                    always visible, the rest behind a collapse on mobile — and the 20px
                    bottom margin on this one landed between bullet three and bullet four.
                    So one gap in the middle of a single list was wider than every other,
                    and a list with an uneven rhythm reads as two lists. */}
                <div className="flex flex-col gap-3 mb-3">
                  {bullets.slice(0, 3).map((b, i) => {
                    const Icon = b.icon;
                    return (
                      <div key={i} className={cn(
                        "flex gap-2.5 items-start text-[13px] leading-[1.7]",
                        b.highlight ? "text-foreground font-medium" : "text-muted-foreground",
                      )}>
                        <div className={cn(
                          "w-5.5 h-5.5 rounded-md flex items-center justify-center shrink-0",
                          b.highlight ? "bg-success/15 text-success" : "bg-foreground/[.04] text-muted-foreground",
                        )}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="pt-0.5">{b.text}</span>
                      </div>
                    );
                  })}
                </div>
                {/* The mobile collapse holds a second copy of the same bullets — the
                    desktop list below renders them again. Two copies in the DOM is how
                    this was built, and it works visually because each is hidden at the
                    other's breakpoint, but a screen reader walks the whole document and
                    reads both. `aria-hidden` on this one leaves the desktop copy as the
                    single announced version; sighted mobile users still get the control,
                    since the collapse itself is what they interact with.
                    The real fix is one list with a CSS-only clamp, which is a bigger
                    change than a spacing pass. */}
                {bullets.length > 3 && (
                  <details className="group mb-3 md:hidden">
                    {/* No `aria-hidden`, and a real tap target.
                        This control is the only way to reach bullets 4+ on a phone, and it
                        was both 19px tall and hidden from assistive tech — its desktop twin
                        is `hidden md:flex`, i.e. `display:none` on mobile, so a screen
                        reader was announced three bullets per plan and nothing else.
                        `min-h-11` and horizontal padding make it tappable; removing
                        `aria-hidden` makes the rest of the list exist. */}
                    <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden inline-flex min-h-11 items-center gap-1.5 -mx-2 px-2 text-[13px] font-semibold text-success">
                      <span>كل مميزات الباقة (+{toArabicDigits(bullets.length - 3)})</span>
                      {/* Rotates on open; no longer bounces forever until it does. A
                          control that nags continuously is read as an advert, and the
                          chevron beside a counted label — "كل مميزات الباقة (+٤)" —
                          already says it opens. */}
                      <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" strokeWidth={2.5} aria-hidden />
                    </summary>
                    <div className="mt-3 flex flex-col gap-3">
                      {bullets.slice(3).map((b, i) => {
                        const Icon = b.icon;
                        return (
                          <div key={i} className={cn(
                            "flex gap-2.5 items-start text-[13px] leading-[1.7]",
                            b.highlight ? "text-foreground font-medium" : "text-muted-foreground",
                          )}>
                            <div className={cn(
                              "w-5.5 h-5.5 rounded-md flex items-center justify-center shrink-0",
                              b.highlight ? "bg-success/15 text-success" : "bg-foreground/[.04] text-muted-foreground",
                            )}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="pt-0.5">{b.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                )}
                {bullets.length > 3 && (
                  <div className="hidden md:flex flex-col gap-3 mb-3">
                    {bullets.slice(3).map((b, i) => {
                      const Icon = b.icon;
                      return (
                        <div key={i} className={cn(
                          "flex gap-2.5 items-start text-[13px] leading-[1.7]",
                          b.highlight ? "text-foreground font-medium" : "text-muted-foreground",
                        )}>
                          <div className={cn(
                            "w-5.5 h-5.5 rounded-md flex items-center justify-center shrink-0",
                            b.highlight ? "bg-success/15 text-success" : "bg-foreground/[.04] text-muted-foreground",
                          )}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="pt-0.5">{b.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* `trustChip` is not rendered.
                    It read "الأفضل قيمة مقابل السعر — القرار الاقتصادي الذكي": an
                    adjective about the plan, written by the seller, sitting under a list
                    of facts a reader can check. Nothing in it can be verified or
                    compared, and it appeared on one card out of three, so it also cost
                    that card a block its neighbours did not have. The card's argument is
                    the price, the article count and the list. The field stays in
                    `plan-card-content` untouched. */}

                {/* The card's footer — the ways to pay, at the foot of the thing being
                    paid for.
                    These marks were inside the primary button and again in a row above
                    the whole section, so the same three logos appeared twice before a
                    reader had decided anything. A footer is where a receipt puts them:
                    present, checkable, and out of the way of the decision.
                    Full-bleed on `-mx`/`-mb` with the card's own bottom radius, so it
                    reads as part of the card rather than a box sitting inside it.
                    Not rendered for the consultation plan or Egypt, where nothing is paid
                    by card here — a payment footer under a button that opens WhatsApp
                    would be describing something that does not happen. */}
                {/* Two labelled groups, one at each end of the strip.
                    Centred together with only a hairline between them, the four marks read
                    as one accredited set — and they are not: the cards run through our
                    gateway, while Tamara is a separate company under its own contract.
                    Pushing them apart and giving each its own verb says which is which
                    without a caption explaining it, and it is the difference between
                    paying and paying in instalments, which is the choice being made. */}
                {countrySlug === "sa" && (
                  <div className="-mx-5.5 -mb-6.5 mt-auto flex items-center justify-between gap-3 rounded-b-[16px] border-t border-t-border bg-foreground/[.02] px-5.5 pb-3 pt-4">
                    <span className="flex items-center gap-2">
                      <span className="text-[11.5px] leading-none text-muted-foreground">الدفع عبر</span>
                      <PayMarks logos={CARD_MARKS} />
                    </span>
                    {tamaraHref && (
                      <span className="flex items-center gap-2">
                        <span className="text-[11.5px] leading-none text-muted-foreground">أو قسّط مع</span>
                        {/* A wider plate: a wordmark is not a square card badge. */}
                        <span className="flex h-5 w-13 items-center justify-center rounded bg-white px-1 ring-1 ring-black/5">
                          <Image
                            src="/logos/tamara.svg"
                            alt="تمارا"
                            width={200}
                            height={44}
                            unoptimized
                            style={{ height: 11, width: "auto", maxWidth: "100%", objectFit: "contain" }}
                          />
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* The gateway and its certification, said once, under the plans.
            This used to head the section alongside a row of payment marks, before the
            reader had a price to attach it to. It is a footnote — the kind of thing
            checked after deciding, not before — so it reads as one here and the marks
            stay on the buttons that use them. */}
        {countrySlug === "sa" && (
          <div className="mt-6 text-center text-[11.5px] leading-[1.7] text-muted-foreground">
            <div>
              الدفع بالبطاقة عبر بوابة معتمدة
              {tamaraHref && <> · والتقسيط عبر تمارا</>}
            </div>
            <div dir="ltr" className="mt-0.5 text-[10.5px] text-muted-foreground/80">
              Network International · PCI DSS
            </div>
          </div>
        )}

        {/* Escape valve — placed AFTER cards per Baymard 2024 (post-scan fallback for hesitant B2B buyers).
            `mt-5`, not `mt-10`: at 40px this line floated between the gateway note above
            it and 80px of section padding below, so the foot of the section read as three
            separate islands. It belongs to the block it follows. */}
        <div className="mt-5 text-center">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 px-2 text-[13px] text-muted-foreground hover:text-success transition-colors"
          >
            <span>لسه متردد؟</span>
            <span className="font-semibold text-success">تكلّم معنا على واتساب</span>
            <span>←</span>
          </a>
        </div>
      </section>
  );
}
