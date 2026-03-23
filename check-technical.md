# Technical & performance — landing `/sa` (remaining)

**Product:** مدونتي / JBRSEO · **Last review:** Mar 2026  
**Content/copy:** [check-content.md](./check-content.md) · **Full report:** [check.md](./check.md)

---

## Severity

- **🟠 High:** conversion / speed
- **🟡 Medium:** trust / a11y
- **🔵 Later:** SEO depth

---

## Remaining

| # | Item | Priority |
|---|------|----------|
| — | **Load time** — `domInteractive` high (~historical 4–5s); target &lt; 3s; re-measure after dynamic pricing, then tune (preload, less work above fold, Cloudinary `f_auto,q_auto`) | 🟠 |
| 1 | **Chat (HEYO):** launcher / widget image `alt` — configure in HEYO dashboard (not in repo) | 🟡 |
| 2 | LCP &lt; 2.5s — re-run Lighthouse | 🔵 |
| 3 | Deploy: set `NEXT_PUBLIC_SITE_URL` to production origin (fallback when CMS canonical empty / invalid) | 🔵 |

**Done (Mar 2026):** Layout copy — `text-sm` (≥14px). **SEO CMS** — meta description ≤160; **canonical / `metadataBase`** — when `seo.canonical` is a valid absolute `http(s)` URL, country home + root [`metadataBase`](app/layout.tsx) use it ([`resolveCanonicalForMetadata`](lib/seo-meta.ts), [`getGlobalSeo`](lib/getGlobalSeo.ts) `canonical`); else `NEXT_PUBLIC_SITE_URL` + path. **JSON-LD** — [`LandingJsonLd`](app/components/shared/LandingJsonLd.tsx); root [`layout.tsx`](app/layout.tsx) baseline `Organization`.

---

## Details (open)

### Production URL
Set env on Vercel/hosting; optional: full **Canonical URL** in Admin SEO (SA drives global `metadataBase` origin when valid URL).

---

## Suggested order

1. Re-measure load → tune  
2. LCP  

---

*Reference: `https://test-jbrseo.vercel.app/sa`*
