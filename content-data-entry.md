# Content — backend / CMS data entry

**Purpose:** Single checklist for what to enter in **Admin** (per country **SA** / **EG**). Not a full audit — see [check.md](./check.md) and [check-content.md](./check-content.md) for narrative and UX strategy.

**Rule:** Pick **country** in the admin UI before saving. Data is stored in **`landingSection`** (`country` + `section`) except global items noted below.

---

## Global (not per country)

| Where | What to set |
|-------|-------------|
| **Admin → Settings → Tracking** (`/admin/settings/tracking`) | GTM, Hotjar, Facebook Pixel IDs (`siteSettings` table) |
| **Admin → Settings → General** (`/admin/settings?country=…`) | WhatsApp number, CTA label (`ctaLabel` in `landingSection` + `siteSettings.whatsappNumber`) |

---

## SEO & social cards (per country)

**Path:** `/admin/settings/seo?country=SA` or `EG`  
**Section key:** `seo`

| Field | Notes |
|-------|--------|
| **Title** | Browser + Google title; avoid placeholder words like “test”. |
| **Description** | **Max 160 characters** (enforced in UI + server). Benefit + optional CTA. |
| **Canonical URL** | Full absolute `https://…` for this market’s **home** landing. Drives `metadataBase` origin (SA row) when valid; else `NEXT_PUBLIC_SITE_URL`. |
| **OG image URL** | `https://…` — 1200×630 preferred; used for Open Graph / Twitter. |

---

## Header + footer (combined)

**Path:** `/admin/content/header-footer?country=…`  
**Sections:** `header` (partial), `footer`

| Field | Notes |
|-------|--------|
| **سطر الهيدر / banner** | Same line as accent strip + Final CTA line (`header.bannerText`). Empty = hide strip. |
| Footer tagline + description | Brand line + short paragraph. |

---

## Landing sections (per country)

**Path pattern:** `/admin/content/[section]?country=SA|EG`

| Section key | Admin label (approx.) | What to maintain |
|-------------|----------------------|------------------|
| `hero` | Hero | H1, subheadline, proof, benefits, CTA — **align audience and dialect** with `/sa` vs `/eg`. Includes **trust bar**: headline text + up to 8 clients (name, logo URL, optional site link). Leave `logoUrl` empty for text-pill fallback. |
| `whyNow` | Why now | Urgency lines. |
| `howItWorks` | How it works | Steps copy. |
| `outcomes` | Outcomes | Result lines. |
| `socialProof` | Social proof | Testimonials, founding line, stats. |
| `faq` | FAQ | Q&A pairs — **one dialect** per country page. |
| `finalCta` | Final CTA | Headlines, benefits, subtitle, WhatsApp line (seats bar removed; use header banner string). |
| `header` | Header (standalone form) | If used: only fields still in form; banner text is mainly **header-footer** above. |
| `footer` | Footer (standalone) | If not using combined form. |
| `pricing` | Pricing | Plans JSON — ensure no raw placeholders (`{n}` `{c}`) in production copy. |
| `pricingPage` | Pricing page | Title, description, H1, intro. |
| `pricingTeaser` | Pricing teaser | Teaser headings + CTA line. |
| `about` | About | Story, team, legal blocks as per form. |
| `team` | Team | Team page. |
| `privacy` | Privacy | Full legal text. |
| `terms` | Terms | Full legal text. |

---

## Images (per country)

**Path:** `/admin/settings` → Images (or flow linked from settings)  
**Uses:** Hero avatar, logos, section images — **set `alt` text** where the form exposes it.

---

## Copy reminders (from audit)

1. **One audience per country page** — don’t mix “Saudi growth” and “Egyptian company entering KSA” in the same `/sa` hero.  
2. **One dialect** per page (e.g. Saudi Arabic vs Egyptian) in FAQ and body copy.  
3. **Meta description** — value-first, optional CTA; stay ≤ 160 chars.  
4. **Canonical** — production URL when site is live; must be valid `https://` if you rely on it for metadata.

---

## Not editable via this CMS

- **Code** (components, layout order, performance) — see [check-technical.md](./check-technical.md).  
- **HEYO chat** launcher image `alt` — vendor dashboard.  
- **Env `NEXT_PUBLIC_SITE_URL`** — hosting / Vercel (fallback when canonical missing).

---

*Last aligned with landing sections in `lib/landing-sections.ts` · Mar 2026*
