import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  LayoutDashboard,
  Sparkles,
  Store,
  Settings2,
  CheckCircle2,
  TrendingUp,
  Newspaper,
  Share2,
  Globe,
  CalendarClock,
  PhoneCall,
  Images,
  Star,
  MapPin,
} from "lucide-react";


/**
 * The Business Profile page, as a row inside the channels card.
 *
 * It used to be its own bordered block with a "bonus" ribbon, sitting below the list of
 * publishing channels — which made a reader count it as something separate from the
 * three places their business appears. It is a fourth place. The ribbon and the second
 * border are gone; the collapse stays, because on mobile the pill list is long and the
 * headline alone answers the question.
 */
function BusinessProfileCard() {
  return (
            /* The collapse is back, on `.md-always-open`.
             *
             * This was a `<details>` once and the collapse was torn out: `md:block` could
             * not force a closed `<details>` open, so on desktop the card rendered as a
             * heading above 400px of nothing — present in the DOM, measurable, invisible.
             * That is the exact failure `.md-always-open` fixes, and it was verified in a
             * real browser before being written: a closed `<details>` measured 20px, and
             * 80px with `::details-content { content-visibility: visible }` applied. So the
             * card folds on a phone, where it measured 935px, and is open from md up. */
            <details className="md-always-open group relative block">

              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
                  {/* 36px on a phone, 44 from md — the fixed 44 was the same size as the
                      icon on the three step cards below, which are one line of text each,
                      so this card's mark outweighed a heading four times its length. */}
                  <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-success/15 text-success">
                    <Store className="w-4.5 h-4.5 md:w-6 md:h-6" strokeWidth={2} aria-hidden />
                  </span>
                  {/* The heading lists what is on the page instead of describing it.
                      "جاهزة من اليوم الأول" was a delivery promise nobody had committed
                      to. "بديل موقع إلكتروني" apologised — it made the page sound like
                      compensation for the real thing. And calling it a موقع outright would
                      contradict the paid upgrade two rows below, which sells publishing to
                      the client's own website: a reader who already had one from us would
                      rightly ask what they were paying extra for.
                      Four named capabilities settle it without a claim — the reader draws
                      the conclusion, and every word is checkable. */}
                  {/* Heading only.
                      The four capabilities used to sit beside it — حجوزات · معرض ·
                      تقييمات · خريطة — and they are the same four the pill grid below
                      lists in full. Naming them twice in one card taught the reader
                      nothing the second time and made the heading compete with itself.

                      Active voice on purpose: "نبني لك" answers what a noun alone leaves
                      open — do I build this, or do you? */}
                  <div className="min-w-0 flex-1">
                  {/* Fluid, not two fixed steps. `19px → 26px` jumped at exactly 768px and
                      was the same 19px on a 320px phone as on a 767px tablet — too big at
                      one end, small at the other. `clamp` reads the viewport instead: 16px
                      at 380px, 26px once there is room, and a 15px floor so it never
                      collapses. 1.35, not `leading-tight`: this heading wraps to two lines
                      on a narrow phone and Arabic diacritics need the room. */}
                    <h3 className="text-[clamp(15px,4.4vw,26px)] font-bold text-foreground leading-[1.35]">
                      نبني لك صفحة نشاطك
                    </h3>
                  </div>
                  {/* Same quiet affordance as the three step cards: muted word, muted caret,
                      no border and no fill. The row itself is the target. */}
                  <span className="fold-caret ms-auto inline-flex shrink-0 items-center gap-1 text-[12px] font-medium text-muted-foreground">
                    <span className="group-open:hidden">التفاصيل</span>
                    <span className="hidden group-open:inline">إخفاء</span>
                    <ChevronDown className="size-3.5 animate-bounce motion-reduce:animate-none" strokeWidth={3} aria-hidden />
                  </span>
              </summary>

              <div className="mt-3 md:mt-4">
              {/* `ps`, not `pr`. The icon is the row's first child, so it sits on the
                  start edge — the right in RTL — and this line indents past it. Written
                  physically it would jump to the wrong side the moment the page ran LTR;
                  `pe` would be wrong today, on the far side from the icon. */}
              {/* On mobile this card was a heading and six pills with nothing saying what
                  the page is. The pills name features; this names the thing they belong to. */}
              <p className="text-[13px] md:text-[13.5px] text-muted-foreground leading-[1.7] mb-4 md:ps-13.5">
                مو بس مقالات — عندك <span className="text-foreground font-semibold">صفحة كاملة لنشاطك</span> على منصة مدونتي: بيانات، حجوزات، معرض، تقييمات — كل شي محضّر ومربوط بجوجل.
              </p>
  
              {/* Two to a row on mobile too, not one.
                  Six full-width rows spent ~250px of scroll on labels three words long,
                  on the device four visitors in five arrive on and the one page whose
                  job is to reach the price. Halving the rows halves the cost. */}
              {/* Not folded — measured, and the fold lost.
                  Hiding the last two pills behind a <details> on mobile made this card 8px
                  TALLER: two pills at two columns are one 40px row, and the summary that
                  replaces them needs 44px to be tappable. An accordion pays off against
                  prose, not against a compact grid. Left open. */}
              <ul className="grid grid-cols-2 gap-1.5 md:gap-2 mb-4">
                {[
                  { icon: CalendarClock, label: "حجز مواعيد" },
                  { icon: PhoneCall, label: "اتصال + واتساب" },
                  { icon: Images, label: "معرض أعمال" },
                  { icon: Star, label: "تقييمات العملاء" },
                  // The longest of the six, and the only one that wrapped at two columns
                  // on a narrow phone. "خريطة جوجل" names the same thing in half the
                  // width, and names it more precisely — it is Google's map, not a
                  // generic one.
                  { icon: MapPin, label: "خريطة جوجل" },
                  { icon: Sparkles, label: "+١٥ خاصية أخرى" },
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-lg bg-card/60 border border-border/60 px-2.5 py-2">
                    <f.icon className="w-3.5 h-3.5 text-success shrink-0" strokeWidth={2} aria-hidden />
                    {/* No `truncate`. At two columns on a 320px phone the longest label
                        would land a pixel or two over the line, and `truncate` fails by
                        deleting the words — "موقعك على الخري…". Wrapping fails by adding
                        a line, which costs nothing and hides nothing. */}
                    <span className="text-[13px] md:text-[12px] text-foreground font-medium leading-[1.5]">{f.label}</span>
                  </li>
                ))}
              </ul>
  
              {/* A text link, not a filled button.
                  Filled green it was the loudest thing in the section, sitting in the
                  hot zone — and it opens modonty.com in a new tab. So the most visually
                  dominant element on the page before the prices was the one pointing out
                  of the funnel, and it caught exactly the reader it worked on: the one
                  convinced enough to want proof. The proof is worth offering, so the link
                  stays; it just stops outranking the section's own exit. */}
              <a
                href="https://www.modonty.com"
                target="_blank"
                rel="noopener noreferrer"
                // `min-h-11` with the padding pulled back by a negative margin, so the tap
                // target reaches 44px without the link visually detaching from the text
                // above it. It was 20px — the live proof of the whole card, on a phone.
                className="inline-flex min-h-11 items-center gap-1.5 -mx-2 px-2 text-[13.5px] font-semibold text-success no-underline transition-opacity hover:opacity-80"
              >
                <span>شوف صفحة عميل حقيقي</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </a>

              {/* The paid upgrade, in the premium card rather than as the third row of a
                  list of included channels.
                  It belongs to the same idea as the page above it — both are properties
                  the client owns — and next to two "مشمول" rows its price tag read as a
                  caveat on the free ones. Here it reads as the next step. */}
              <div className="mt-5 border-t border-t-success/20 pt-4">
                <div className="flex items-center gap-2.5">
                  <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-success/15 text-success">
                    <Globe className="w-4 h-4" strokeWidth={2.2} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    {/* "مقالاتك على موقعك أنت", not "ننشر على موقعك أنت".
                        The old line put us inside the customer's website: we publish, we
                        write to their domain. That is not what happens — Modonty hands
                        over a programmatic endpoint and the customer's own site reads
                        from it, connected by their developer. A buyer who signs up
                        expecting us to touch their site finds out at delivery, and by
                        then it is a refund conversation rather than a scoping one.
                        The verb belongs to them here for the same reason it does on the
                        plan bullet: "تسحبها". */}
                    <div className="text-[13.5px] font-semibold text-foreground leading-[1.5]">
                      مقالاتك على موقعك أنت
                    </div>
                    {/* 1.7, not `leading-tight`. At 1.25 the diacritics of one line sat
                        on the ascenders of the next — the setting Latin gets away with
                        and Arabic does not. */}
                    <div className="text-[12px] text-muted-foreground mt-0.5 leading-[1.7]">
                      ربط برمجي تسحبها فيه لدومينك
                    </div>
                  </div>
                  {/* No `font-mono`, and a size a badge can actually be read at.
                      Monospace gave every Arabic glyph the same advance width, so the
                      joined letters pulled apart into الـبـاقـات الأعـلـى — the badge
                      that tells a reader this row costs extra was the least legible text
                      in the card. */}
                  {/* The plan by name, not "الباقات الأعلى".
                      Publishing to the client's own domain is in الريادة alone — it is
                      the only plan whose highlights mention their external site — so the
                      plural was both vaguer and wrong. A reader who sees the name here
                      can find that exact card in the pricing table below. */}
                  {/* Back on the theme token now that `--success-foreground` is the dark
                      ink it always should have been — see the note in globals.css. */}
                  <span className="shrink-0 rounded-full bg-success px-2.5 py-1 text-[11.5px] font-bold text-success-foreground whitespace-nowrap">
                    باقة الريادة
                  </span>
                </div>
              </div>
              </div>
            </details>
  );
}

/** Features / platform system. Static. No state, server-ready. */
export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-t-[var(--border)] bg-card">
        <div className="max-w-270 mx-auto px-5 md:px-7 py-6 md:py-10">
          <div className="text-center mb-5 md:mb-10">
            <div className="inline-flex items-center gap-2 bg-success/10 border border-success/30 text-success text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-4">
              <span>منصة سعودية ١٠٠٪</span>
            </div>
            {/* Headings take a deliberate 1.3, body a deliberate 1.7 — set per role
                rather than inherited, so neither is an accident. Arabic ascenders,
                descenders and diacritics need the room at body size; at display size the
                same value would open a gap between the two lines of a heading. */}
            <h2 className="text-balance text-[clamp(20px,5.6vw,34px)] font-semibold leading-[1.3] mb-3">
              نبني <span className="text-success">حضورك</span> — لا نبيع وعود
            </h2>
            {/* One line, and a different claim from the heading above it.
                It first listed the three channels, which the card below listed again and
                the premium row a third time. Shortened, it became "حضور حقيقي … لا
                شعارات" — which is the heading's "لا نبيع وعود" said twice, with the badge
                above saying it a third time. A subtitle that repeats its heading is a
                line the reader pays for and learns nothing from.
                This names the mechanism instead: where the numbers come from. It is the
                same promise the plans make — "تقارير أداء حقيقية من جوجل" — so it claims
                nothing the product does not already do. */}
            {/* The credibility claim under the heading — the one line that says the numbers
                are not ours. Withholding it from mobile withheld it from most readers. */}
            <p className="text-[13.5px] md:text-[14.5px] text-muted-foreground max-w-145 mx-auto leading-[1.7]">
              كل رقم في لوحتك مصدره جوجل — مو تقديرات منّا.
            </p>
          </div>

          {/* 3-step horizontal grid — clear "who does what" story */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-5 mb-5 md:mb-8">
            {([
              {
                title: "إحنا نجهّز كل شي",
                icon: Settings2,
                desc: "فريق محترف يشتغل ورا الكواليس: بحث كلمات مفتاحية · استراتيجية محتوى · كتابة متخصصة · تصميم صور · تحسين لجوجل — جاهز في لوحتك، بانتظار موافقتك للنشر على منصة مدونتي.",
              },
              {
                title: "أنت توافق بضغطة",
                icon: CheckCircle2,
                desc: "كل مقال يظهر في لوحتك قبل النشر. اعتمد، عدّل، أو ارفض — ما يُنشر شي على منصة مدونتي بدون إذنك. تحكّم كامل بلا صداع.",
              },
              {
                title: "العملاء يجونك من جوجل",
                icon: TrendingUp,
                desc: "زوّار حقيقيون يبحثون في جوجل عن خدمتك ويلاقونك — بلا إعلانات، بلا مطاردة. المقالات تنمو شهرياً وتجيب لك عملاء للأبد.",
              },
            ] as const).map((step, i) => (
              /* Icon and heading on one row, at both widths.
                 The numbers ٠١/٠٢/٠٣ are gone: they sat in the far corner of each card
                 opposite the icon, so the eye entered on the icon, crossed an empty span
                 to a number, then came back down to the heading. The order they encoded
                 is already in the copy — نجهّز, then توافق, then يجونك — and in the cards'
                 own right-to-left order. One less thing, per the checklist.
                 It also retires the last Arabic text on the page set in a monospace face,
                 which spaces Eastern numerals apart from each other. */
              <details
                key={i}
                // The first step opens by default; the other two do not.
                // Seven collapsed rows now run down this page, and a reader who meets
                // «التفاصيل ⌄» seven times without ever seeing what is behind one stops
                // reading them as controls — the pattern turns into furniture. One open
                // card shows the kind and length of what a tap buys, which is what makes
                // the other six worth tapping. It is also the first step of the sequence,
                // so the page still explains itself to someone who taps nothing at all.
                open={i === 0}
                // `hover:` never fires on a touch screen — Tailwind wraps it in
                // `@media (hover: hover)` — so on a phone this card had no feedback at all
                // for the one gesture it now depends on. `open:` gives it a resting state
                // that says which card is expanded, and `active:` flashes on the press
                // itself. The hover rules stay for pointers, where they still work.
                className="md-always-open group relative rounded-xl md:rounded-2xl border border-border bg-background px-3 py-2.5 md:p-6 active:border-success/60 hover:border-success/40 hover:shadow-[0_20px_40px_-24px_color-mix(in_oklch,var(--success)_35%,transparent)] transition-colors md:transition-all"
              >
                {/* The whole row is the control: icon, title, then the caret at the far
                    end. `min-h-11` makes the row a 44px target on its own, and the caret
                    breathes — a slow scale pulse rather than a bounce, so it reads as "this
                    opens" without nagging like an advert. It stops the moment the card is
                    open, and `motion-reduce` stops it always.
                    From md the whole thing is inert: `pointer-events: none` on the summary
                    and the caret hidden, because the panel is forced open there. */}
                <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2.5 md:mb-3 md:gap-3.5 [&::-webkit-details-marker]:hidden">
                  <div className="shrink-0 w-7 h-7 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-success/10 flex items-center justify-center text-success">
                    <step.icon className="w-3.5 h-3.5 md:w-5.5 md:h-5.5" strokeWidth={2.2} aria-hidden />
                  </div>
                  <h3 className="min-w-0 text-[14px] md:text-[18px] font-medium md:font-semibold text-foreground leading-[1.35]">
                    {step.title}
                  </h3>
                  {/* A labelled pill, not a lone animated caret.
                      The caret was animating — measured at 5px of travel, `playState:
                      running` — and Khalid still saw nothing move. The likely cause is the
                      OS "reduce motion" setting, which Tailwind's `motion-reduce` honours
                      by design, and which no amount of tuning can work around. So the
                      affordance stops depending on movement: «التفاصيل» in the accent
                      colour inside a bordered pill reads as a control whether or not it
                      moves, on a phone or a desktop, at a glance or on inspection. The
                      motion stays as a bonus for readers who allow it, and the rotation on
                      open is a state change rather than a nag. */}
                  {/* Muted, unbordered, no fill. As a green pill it was the loudest thing in
                      the row — a secondary control competing with the heading beside it and
                      with the green accent the section spends on its actual claims. The word
                      plus the caret is enough of a signifier; the whole 44px row is the
                      target either way, so the badge never needed to look like a button. */}
                  <span className="fold-caret ms-auto inline-flex shrink-0 items-center gap-1 text-[12px] font-medium text-muted-foreground">
                    <span className="group-open:hidden">التفاصيل</span>
                    <span className="hidden group-open:inline">إخفاء</span>
                    {/* Tailwind's own `animate-bounce`, not a custom keyframe. A hand-written
                        `fold-hint` measured as running at 5px of travel and still read as
                        static; the built-in travels 25% of the glyph and is the same
                        animation the codebase already used on a disclosure chevron. Fewer
                        moving parts, and nothing to keep in globals.css. */}
                    <ChevronDown
                      className="size-3.5 animate-bounce motion-reduce:animate-none"
                      strokeWidth={3}
                      aria-hidden
                    />
                  </span>
                </summary>
                {/* Shown on the phone too. Hidden, the three steps were an icon and a
                    three-word title each — «نجهّز» «توافق» «يجونك» — so the one place the
                    page explains how the service actually works was desktop-only, on the
                    device most of the traffic arrives on. 13px on mobile so three
                    paragraphs do not push the pricing another screen down. */}
                <p className="text-[13px] md:text-[13.5px] text-muted-foreground leading-[1.7] md:leading-[1.75]">
                  {step.desc}
                </p>
              </details>
            ))}
          </div>
          {/* — end 3-step story — */}

          {/* Two cards, side by side and of comparable weight.
              Right: the official business page — the strongest single item, with its
              feature pills and a live example. Left: the control room, and beneath it the
              three places the content is published.

              The channels moved in here rather than keeping a card of their own: three
              rows could not fill a column beside a card carrying six pills and a button,
              and the section's own subtitle already names the same three channels in a
              line — "منصة مدونتي + سوشال ميديا + موقعك". They are detail under a claim
              already made, not a third claim. */}
          <div className="grid gap-4 md:grid-cols-2 md:items-stretch">

          <div className="rounded-2xl border-2 border-success/40 bg-gradient-to-br from-success/[.10] to-success/[.02] px-5 py-5 md:p-6 md:shadow-[0_24px_50px_-30px_color-mix(in_oklch,var(--success)_50%,transparent)] h-full">
            <BusinessProfileCard />
          </div>

          {/* Control room + where the content lands, in one card. */}
          <details className="md-always-open group rounded-2xl border border-border bg-background p-4 md:p-6 h-full flex flex-col">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 mb-2 [&::-webkit-details-marker]:hidden">
              <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-success/15 text-success">
                <LayoutDashboard className="w-4.5 h-4.5 md:w-6 md:h-6" strokeWidth={2} aria-hidden />
              </span>
              {/* Fluid like the card beside it, and 1.35 so a wrapped Arabic heading has
                  room for its diacritics. */}
              <h3 className="min-w-0 text-[clamp(15px,4.4vw,20px)] font-semibold text-foreground leading-[1.35]">
                لوحة تحكم <span className="text-success">خاصة فيك</span>
              </h3>
              <span className="fold-caret ms-auto inline-flex shrink-0 items-center gap-1 text-[12px] font-medium text-muted-foreground">
                <span className="group-open:hidden">التفاصيل</span>
                <span className="hidden group-open:inline">إخفاء</span>
                <ChevronDown className="size-3.5 animate-bounce motion-reduce:animate-none" strokeWidth={3} aria-hidden />
              </span>
            </summary>
            {/* The hook, at the head of the card instead of as a caption under the button
                at its foot. Three named capabilities are what make a reader want the rest
                of the card; under the exit button they arrived after the decision to
                leave had already been made. */}
            <p className="mb-4 text-[13px] md:text-[12.5px] text-muted-foreground leading-[1.7]">
              منظومة متكاملة · جودة + تنبيهات + تقارير
            </p>
            {/* Two columns inside the card from `md` up: what you control on one side,
                where the content lands on the other.
                Stacked, these two lists ran down a single column and left the card taller
                and narrower than its neighbour — a tall ribbon of text beside a card of
                pills. Side by side they fill the width the card already occupies. */}
            {/* Stacked, not side by side.
                Two columns inside a half-width card gave each list ~217px — enough to
                clip a channel name and wrap every bullet onto two lines. Full width, the
                bullets fit two to a row and nothing is cut. */}
            <div className="space-y-4">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 md:gap-y-2">
              {[
                // The alerts the hook above promises. It named جودة · تنبيهات · تقارير
                // and only تقارير appeared below it, so a reader pulled in by the alerts
                // scrolled the card and found nothing.
                // It replaces "تتابع كل خطوة في مقالاتك" rather than joining it: that
                // line said the same thing without saying how, and five items would
                // leave an orphan in a two-column grid. Every plan carries the alerts —
                // five on الانطلاقة, twenty-two on الريادة — so no caveat is owed.
                "تنبيهات فورية على تيليجرام لكل حدث",
                "تقارير أداء حقيقية من جوجل",
                "اعتماد أو تعديل أي مقال بضغطة",
                "حملات إيميل تسويقية لعملائك",
              ].map((line, i) => (
                <li key={i} className="flex items-start gap-2 text-[14.5px] md:text-[13.5px] text-foreground leading-[1.65]">
                  {/* `items-start` + a nudge, not `items-center`: on the two-line item a
                      centred dot floats between the lines instead of marking the first. */}
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-success shrink-0" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            {/* A rule on the start edge from `md` up, replacing the horizontal one that
                separated these lists when they were stacked. */}
            <div className="border-t border-t-border pt-4">
              {/* No `font-mono` on Arabic. A monospace face forces every glyph into the
                  same advance width, which pulls the joined letters of an Arabic word
                  apart — the label rendered as و مـحـتـواك يـنـتـشـر, disjointed and
                  tracked out, exactly the letter-spacing Arabic never takes. Mono is for
                  the numerals and Latin identifiers elsewhere on the page. */}
              {/* Label and qualifier on one line. Stacked, "مشمول في كل الباقات" read as
                  a second heading under the first; inline after a separator it reads as
                  what it is — a note on the same sentence. */}
              <div className="mb-3 flex items-center gap-1.5 text-[12.5px] md:text-[11.5px] leading-[1.6]">
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-success" strokeWidth={2.5} aria-hidden />
                {/* "تلقائياً" carries the weight that the third row used to: two channels
                    under a bare "ينتشر على" read as a short list, the same two under
                    "ينتشر تلقائياً" read as a capability. The paid third channel moved to
                    the premium card where it belongs. */}
                <span className="font-bold text-success">ومحتواك ينتشر تلقائياً على</span>
                {/* One qualifier instead of a "مشمول" chip repeated on every row. The chip
                    said the same word twice, and at this width it was taking ~55px from
                    the channel name — which is what clipped both names to "…عل". */}
                <span className="text-muted-foreground">· مشمول في كل الباقات</span>
              </div>
              <ul className="space-y-2">
                {[
                  {
                    icon: Newspaper,
                    name: "مقالاتك على منصة مدونتي",
                    desc: "مدوّنة عامة يقرأها عملاء كل المنصة",
                  },
                  {
                    icon: Share2,
                    // "المقال الرئيسي", not "محتواك".
                    // "محتواك على سوشال مدونتي · توزيع تلقائي" promised that everything
                    // written for the client goes out on the social accounts. One article
                    // does. Naming it costs a word and saves the conversation where a
                    // customer counts four articles and one post.
                    name: "المقال الرئيسي على سوشال مدونتي",
                    desc: "ينشر على حسابات المنصة",
                  },
                ].map((row, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 md:gap-2.5 border-0 md:border md:border-border rounded-none md:rounded-xl md:bg-card px-0 md:px-3 py-1.5 md:py-2.5"
                  >
                    {/* Mobile: plain bullet dot. Desktop: icon chip. */}
                    <span className="md:hidden mt-1.5 w-1.5 h-1.5 rounded-full bg-success shrink-0" aria-hidden />
                    <span className="shrink-0 hidden md:inline-flex items-center justify-center w-7 h-7 rounded-lg bg-success/10 text-success">
                      <row.icon className="w-3.5 h-3.5" strokeWidth={2.2} aria-hidden />
                    </span>
                    <div className="flex-1 min-w-0 text-start">
                      {/* Wraps instead of truncating. A channel name cut to "مقالاتك عل…"
                          hides the one word that identifies it, and a clipped line reads
                          as a rendering fault rather than a summary. */}
                      <div className="text-[14.5px] md:text-[13px] font-medium md:font-semibold text-foreground leading-[1.6] text-balance">{row.name}</div>
                      {/* Shown everywhere now. On a phone the two channels were bare names
                          — a reader saw where we publish but not who reads it there, which
                          is the whole reason the channel is worth listing. Below the body
                          size because a caption that matched the name above it would stop
                          being a caption, but at body line-height: two wrapped lines of
                          Arabic at 1.38 collide. */}
                      <div className="text-[11.5px] text-muted-foreground mt-0.5 leading-[1.65]">{row.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            </div>

            {/* Exit CTA to the full features page, inside this card rather than on a
                strip of its own below both.
                Loose under the grid it cost 139px of page — 32 of gap, 67 of button, 40
                of padding — to say one thing, while this card ended 145px short of its
                neighbour and showed the gap as dead space. Moving it in spends that
                space instead of adding more, and gives the card the closing action its
                neighbour already had. `flex-1` centres it in whatever room is left, so
                it stays put if either column grows. */}
            <div className="mt-4 flex flex-1 flex-col items-center justify-center text-center">
              <Link
                href="/features"
                className="inline-flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 transition-colors px-5 py-2.5 rounded-xl text-[14px] font-semibold no-underline md:shadow-[0_16px_36px_-14px_color-mix(in_oklch,var(--foreground)_50%,transparent)]"
              >
                <span>شوف كل تفاصيل المنظومة</span>
                <span aria-hidden>←</span>
              </Link>
            </div>
          </details>
          </div>
        </div>
      </section>
  );
}
