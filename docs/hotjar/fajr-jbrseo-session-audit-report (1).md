# Al-Fajr (jbrseo.com/eg) — Session Replay UX Audit & Rebuild Report

> Source: Contentsquare Session Replay (project 753724)
> Scope: All available sessions for pages starting with https://www.jbrseo.com/eg
> Sessions analyzed: 3 (1 Desktop bounce, 1 Desktop deep, 1 Mobile deep)
> Detected stack: Tailwind CSS + shadcn/ui + Lucide icons
> JS errors found: 0 (all issues are UX / structural)
> Prepared for: rebuild of the website. Hand this file to Claude in VS Code.

---

## 1. Sessions Overview

| # | Date | Device | Viewport | Country | Duration | Pages | Headline problem |
|---|------|--------|----------|---------|----------|-------|------------------|
| 1 | May 22, 2026 10:51 PM | Desktop | 1536x864 | Egypt | 0:52 | 1 | Intrusive modal -> 52s idle -> bounce |
| 2 | May 20, 2026 12:30 PM | Desktop | 1920x1080 | Egypt | 7:31 | 9 | Rage clicks on /features + region thrashing |
| 3 | May 17, 2026 4:20 PM | Mobile | 360x780 | MENA | 8:05 | 12 | Dead tap + navigation thrashing + confused scroll |

---

## 2. Detailed Findings

### Session 1 — Desktop, immediate modal bounce
- Landed on /eg. Blocking modal appeared immediately on load.
- "No events in this pageview" — NO clicks, NO scroll, NO dismiss for full 0:52, then left.

### Session 2 — Desktop, rage clicks + region thrashing
Flow: /eg -> /features -> /eg -> /eg(5s) -> /sa -> /eg -> /features -> /sa/pricing -> /eg/pricing(7s) -> exit.
RAGE CLICKS on /features: ~5 clicks on same element in ~2s (03:27-03:29; also 03:23/24, 02:54/54).
Target selector (rage-clicked label):
\`\`\`
main#main-content > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(4) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > ul:nth-of-type(1) > li:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1) > label:nth-of-type(1)
\`\`\`
A <label> deep in <li>, clicked repeatedly but did not respond.
Region thrashing: bounced /eg <-> /sa, compared /sa/pricing vs /eg/pricing, exited on pricing.

### Session 3 — Mobile (360x780) — worst session
Flow (12 pages): /eg x4 (0:00,0:19,2:33,3:45) -> /sa(4:42) -> /sa(4:49) -> /features(5:49) -> /sa(6:03) -> /features(6:09) -> /sa(6:11) -> /features(6:13) -> /sa(6:15).
DEAD TAP: Tap at 04:49 on /sa with EMPTY CSS selector (no actionable element).
NAVIGATION THRASHING: /sa<->/features x5 in ~12s, each 2-5s ("Limited activity due to short duration").
CONFUSED SCROLL: swipe-up then run of swipe-downs (05:30,31,32,37).
STRUCTURAL: scroll targets = bare utility classes (mt-0.5, h-2, role-5, flex, lucide) -> nested utility-div soup, no semantic landmarks/ids.
Repeated /eg reloads x4 at start -> possible back-loops / slow first paint.

---

## 3. Root Causes
1. Intrusive on-load modal blocking value prop. (S1)
2. Non-interactive-looking elements -> rage/dead clicks (label not wired; tappable-looking zones w/o handlers). (S2,S3)
3. Region/geo confusion: /eg and /sa near-identical, links cross regions silently. (S2,S3)
4. Weak IA/navigation: thrash between /features and /pricing. (S2,S3)
5. Non-semantic deeply-nested utility DOM: no landmarks/roles/ids. (S3)
6. Mobile findability: long pages, ambiguous tiny tap targets. (S3)
7. Dense 4-column pricing comparison without clear action. (S2)

---

## 4. Fixes (for rebuild)

### Fix 1 — Modal (S1): defer + dismissible
- No auto-open. Trigger on intent (exit-intent / scroll >50% / 15s dwell), cap once per session.
- Visible X, ESC, click-outside, focus trap.

### Fix 2 — Rage/dead clicks (S2,S3): real controls
- /features label must be a real interactive control (Accordion/button/linked checkbox).
- Anything that LOOKS tappable (card/icon) = real <a>/<button> with handler, >=44x44px hit area.

### Fix 3 — Region/locale (S2,S3)
- Persistent EG/SA switcher in header; persist choice; never cross regions silently.
- Next.js i18n routing + hreflang tags.

### Fix 4 — Navigation/IA (S2,S3)
- Unambiguous, consistent nav (Features, Pricing). In-page anchors/sticky sub-nav. Mobile breadcrumbs.

### Fix 5 — Semantic DOM (S3)
- header/nav/main/section/footer landmarks. Stable ids/data-testid on CTAs, nav, accordion, pricing cards. Keyboard focus + visible focus ring.

### Fix 6 — Mobile findability (S3)
- Shorter hero, value+CTA above fold. Sticky bottom CTA bar. Larger tap targets.

### Fix 7 — Pricing (S2)
- Simpler tiered layout, highlight recommended plan, collapsible compare table, one CTA per plan, locale-consistent currency.

---

## 5. Rebuild Priority
| Priority | Item | Sessions |
|----------|------|----------|
| P0 | Real controls (rage/dead clicks) | S2,S3 |
| P0 | Region/locale switcher | S2,S3 |
| P1 | Defer+dismissible modal | S1 |
| P1 | Semantic DOM + ids/roles | S3 |
| P1 | Mobile sticky CTA + above-fold | S3 |
| P2 | Simplify pricing | S2 |
| P2 | Navigation/IA + breadcrumbs | S2,S3 |

---

## 6. Notes
- Replay text was privacy-masked; findings based on event types, selectors, timing, flow, layout.
- Contentsquare AI Summarize was gated behind a higher plan; analysis done manually.
- No JS errors observed; issues are interaction-design and structural.
