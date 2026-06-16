# Al-Fajr (jbrseo.com/eg) — Session Replay UX Audit & Rebuild Report

> Source: Contentsquare Session Replay (project 753724)
> Scope: All available sessions for pages starting with https://www.jbrseo.com/eg
> Sessions analyzed: 3 (1 Desktop bounce, 1 Desktop deep, 1 Mobile deep)
> Detected stack: Tailwind CSS + shadcn/ui + Lucide icons (Next.js-style app)
> JS errors found: 0 (all issues are UX / structural, not crashes)
> Prepared for: rebuild of the website. Hand this file to Claude in VS Code.

---

## 1. Sessions Overview

| # | Date | Device | Viewport | Country | Duration | Pages | Headline problem |
|---|------|--------|----------|---------|----------|-------|------------------|
| 1 | May 22, 2026 10:51 PM | Desktop | 1536x864 | Egypt | 0:52 | 1 (/eg) | Intrusive modal -> 52s idle -> bounce, zero interaction |
| 2 | May 20, 2026 12:30 PM | Desktop | 1920x1080 | Egypt | 7:31 | 9 | Rage clicks on /features + region thrashing (/eg <-> /sa) |
| 3 | May 17, 2026 4:20 PM | Mobile | 360x780 | (MENA) | 8:05 | 12 | Dead tap + navigation thrashing (/sa <-> /features), confused scrolling |

---

## 2. Detailed Findings

### Session 1 — Desktop, immediate modal bounce
- Landed on /eg. A blocking modal/pop-up appeared immediately on load.
- Event log: "No events in this pageview" — NO clicks, NO scroll, NO dismiss for the full 0:52.
- User then left. Classic intrusive-modal bounce.

**Interpretation:** The modal launches too early (on load), blocks the hero/value proposition, and gives the user nothing to act on -> they abandon.

### Session 2 — Desktop, rage clicks + region thrashing
Page flow: /eg(0:00) -> /features(2:26) -> /eg(3:49) -> /eg(3:54, ~5s) -> /sa(5:14) -> /eg(5:39) -> /features(6:08) -> /sa/pricing(6:16) -> /eg/pricing(7:24, 7s) -> exit.

**RAGE CLICKS on /features (high severity):**
- Click cluster: 03:27, 03:28, 03:29, 03:29, 03:29 = ~5 clicks on the SAME element in ~2 seconds. Also a pair at 03:23/03:24 and 02:54/02:54.
- Target CSS selector (the rage-clicked element):
```
main#main-content > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2)
 > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(1)
 > div:nth-of-type(1) > div:nth-of-type(2) > ul:nth-of-type(1) > li:nth-of-type(1)
 > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1) > label:nth-of-type(1)
```
- It is a <label> deep inside a <li>. The user clicked it repeatedly expecting it to do something (expand / toggle / navigate) but it did not respond.

**Region thrashing:** User bounced between /eg (Egypt) and /sa (Saudi) versions, and compared /sa/pricing vs /eg/pricing, then exited on pricing. Strong signal of region/geo confusion and a dense 4-column pricing comparison that did not convert.

### Session 3 — Mobile (360x780), dead tap + navigation thrashing (worst session)
Page flow (12 pages): /eg x4 at start (0:00, 0:19, 2:33, 3:45) -> /sa(4:42) -> /sa(4:49) -> /features(5:49) -> /sa(6:03) -> /features(6:09) -> /sa(6:11) -> /features(6:13) -> /sa(6:15).

**DEAD TAP (high severity):** On /sa, a Tap event at 04:49 had an EMPTY CSS selector — the user tapped a spot with no actionable element. Dead tap = user expected something interactive there.

**NAVIGATION THRASHING (critical):** /sa <-> /features <-> /sa <-> /features <-> /sa within ~12 seconds (06:03 -> 06:15), each page lasting 2-5s. Contentsquare itself flagged "Limited activity may be shown due to the short duration." User could not find what they wanted.

**Confused scrolling:** swipe-up then a run of swipe-downs (05:30, 05:31, 05:32, 05:37) = scrolling down then repeatedly back to top, hunting for content.

**Structural smell:** swipe/scroll targets resolved to bare utility-class elements (mt-0.5, h-2, role-5, flex, lucide). The DOM is deeply nested utility-div soup with no semantic landmarks, no stable ids, no aria roles. This hurts usability, accessibility, and analytics targeting.

**Repeated /eg reloads:** 4 /eg pageviews in the first ~4 minutes suggests reloads / repeated returns to home on mobile (possible back-button loops or slow first paint).

---

## 3. Root-Cause Summary

1. Intrusive on-load modal blocking first paint and value prop. (S1)
2. Non-interactive-looking elements that LOOK clickable -> rage/dead clicks. A <label> not wired to its control; tappable-looking areas with no handler. (S2, S3)
3. Region/geo architecture confusion: /eg and /sa expose near-identical pages with no clear locale switch, links cross regions unexpectedly. (S2, S3)
4. Weak information architecture / navigation: users thrash between /features and /sa/pricing trying to find one thing. (S2, S3)
5. Non-semantic, deeply-nested utility-div DOM: no landmarks, no roles, no stable ids -> poor a11y and confusing hit targets. (S3)
6. Mobile findability: long pages, confused scroll, tiny/ambiguous tap targets. (S3)
7. Dense 4-column pricing comparison that does not drive a clear action. (S2)

---

## 4. Fixes (actionable for rebuild)

### Fix 1 — Tame the modal (S1)
- Do NOT auto-open on load. Trigger on intent (exit-intent, scroll >50%, or 15s+ dwell) and cap to once per session via storage.
- Ensure visible close (X), ESC to close, click-outside to dismiss, and focus trap for a11y.
```tsx
// Open only after intent, once per session
const [open, setOpen] = useState(false);
useEffect(() => {
  if (sessionStorage.getItem("promoSeen")) return;
  const onScroll = () => {
    if (window.scrollY > window.innerHeight * 0.5) {
      setOpen(true); sessionStorage.setItem("promoSeen", "1");
      window.removeEventListener("scroll", onScroll);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);
// shadcn <Dialog open={open} onOpenChange={setOpen}> ... with <DialogClose/>
```

### Fix 2 — Kill rage/dead clicks: make clickable things actually clickable (S2, S3)
- The /features <label> must be associated and interactive. Wire it to its control (accordion/checkbox/link) and add cursor-pointer + an onClick on the actual control.
```tsx
// If it is an accordion item: use shadcn Accordion / a real <button>
<AccordionItem value="feature-1">
  <AccordionTrigger>{title}</AccordionTrigger>   {/* real button, keyboard + click */}
  <AccordionContent>{body}</AccordionContent>
</AccordionItem>

// If it is a label for a control: link them explicitly
<label htmlFor="opt-1" className="cursor-pointer">{text}</label>
<input id="opt-1" type="checkbox" />
```
- For the mobile dead-tap: any element that LOOKS tappable (card, icon) must be a real <a>/<button> with a handler and >=44x44px hit area. Remove decorative elements that imply interactivity.
```css
.tap-target { min-width: 44px; min-height: 44px; }
```

### Fix 3 — Fix region/locale architecture (S2, S3)
- Add a clear, persistent locale/region switcher (EG / SA) in the header. Persist choice (cookie/localStorage) and never silently cross regions.
- Keep links within the active locale; if a user must switch, show an explicit confirmation/redirect.
- Use Next.js i18n routing (e.g. /eg, /sa as locales) with hreflang tags for SEO.
```html
<link rel="alternate" hreflang="ar-EG" href="https://www.jbrseo.com/eg" />
<link rel="alternate" hreflang="ar-SA" href="https://www.jbrseo.com/sa" />
```

### Fix 4 — Strengthen navigation & IA (S2, S3)
- Make the primary nav (Features, Pricing) unambiguous and consistent across pages.
- Add in-page anchors/sticky sub-nav so users do not bounce between /features and /pricing to compare.
- Add breadcrumbs on mobile so users always know where they are.

### Fix 5 — Semantic, accessible DOM in the rebuild (S3)
- Replace utility-div soup with semantic landmarks: <header> <nav> <main> <section aria-labelledby> <footer>.
- Add stable ids / data-testid on key interactive elements (CTAs, nav, accordion triggers, pricing cards) — improves a11y AND analytics targeting.
- Ensure every interactive element is a <button> or <a> with role/aria, keyboard focusable, visible focus ring.

### Fix 6 — Mobile findability (S3)
- Shorten the mobile hero; surface key value + primary CTA above the fold.
- Add a sticky bottom CTA bar on mobile so the action is always reachable (reduces scroll thrashing).
- Increase tap target sizes; avoid tiny h-2 / mt-0.5 sized interactive zones.

### Fix 7 — Pricing that converts (S2)
- Replace the dense 4-column comparison with a simpler tiered layout (highlight recommended plan) + a collapsible "compare all features" table.
- One clear primary CTA per plan; keep currency/region consistent with active locale.

---

## 5. Suggested rebuild priority

| Priority | Item | Sessions |
|----------|------|----------|
| P0 | Make clickable-looking elements real controls (rage/dead clicks) | S2, S3 |
| P0 | Fix region/locale switcher & stop silent cross-region links | S2, S3 |
| P1 | Defer + make modal dismissible | S1 |
| P1 | Semantic DOM + stable ids/roles | S3 |
| P1 | Mobile sticky CTA + above-the-fold value | S3 |
| P2 | Simplify pricing comparison | S2 |
| P2 | Navigation/IA + breadcrumbs | S2, S3 |

---

## 6. Notes / limitations
- Replay text was privacy-masked (shown as "aaaa"); findings are based on event types, CSS selectors, timing, page flow, and layout — not literal copy.
- Contentsquare AI "Summarize" was gated behind a higher plan, so analysis was done manually from the replays.
- No JS errors were observed; problems are interaction-design and structural.
