# Cloudinary delivery URL optimization — plan (with coverage audit)

## Implementation (unchanged)

1. **`optimizeCloudinaryImageUrl`** in [`helpers/cloudinary.ts`](helpers/cloudinary.ts) — `f_auto`, `q_auto`, idempotent, skip signed URLs; optional `fl_immutable_cache` when versioned.
2. **`optimizeCloudinaryStringsInJson`** + call inside **`upsertLandingSection`** in [`lib/landing-sections.ts`](lib/landing-sections.ts) before `prisma.landingSection.upsert`.
3. Keep **`cl()`** as alias for read-time safety on static/hardcoded URLs.

---

## Coverage audit (repo check)

### What persists image URLs today?

- **Only** [`LandingSection`](prisma/schema.prisma) (`data` JSON) via [`upsertLandingSection`](lib/landing-sections.ts). No other model stores landing image URLs.
- [`SiteSettings`](prisma/schema.prisma) holds **only** `gtmId`, `hotjarId`, `fbPixelId`, `whatsappNumber` — **no image columns**. Types like [`SiteSettingsJson.images`](lib/site-settings.types.ts) are **not** written to Prisma in this codebase.

### Admin → DB paths that include image links (all go through `upsertLandingSection`)

| Source | Image fields | Section key |
|--------|----------------|-------------|
| [`updateSeoFormData`](app/actions/landing.ts) | `ogImage` | `seo` |
| [`updateHeroSection`](app/actions/content-sections.ts) | `trustBarClients[].logoUrl` | `hero` |
| [`updateSocialProofSection`](app/actions/content-sections.ts) | `testimonials[].avatarImg` | `socialProof` |
| [`updateTeamSection`](app/actions/content-sections.ts) | `coreTeam[].avatarUrl`, `executionTeam[].avatarUrl` | `team` |
| [`updateSection`](app/actions/content-sections.ts) | Any string in JSON (e.g. pricing, custom keys) | dynamic |
| Other section actions (`whyNow`, `howItWorks`, …) | No dedicated image URL fields in current form parsers | N/A |

**Conclusion:** A deep JSON pass in **`upsertLandingSection` covers 100% of Cloudinary `/image/upload/` strings saved to `LandingSection`**, including nested arrays/objects and future keys, without listing each field.

### Not covered by this hook (by design or because nothing is saved)

1. **[`ImagesForm`](app/admin/(dashboard)/components/ImagesForm.tsx) / [`updateImagesFormData`](app/actions/landing.ts)** — action is a **stub** (no Prisma write). URLs from this form **never reach the DB**, so the hook cannot optimize them until persistence is implemented (separate task).
2. **Hardcoded / static assets** — e.g. [`app/content/landing-images.ts`](app/content/landing-images.ts), [`HeaderLogo`](app/components/layout/HeaderLogo.tsx). Not in DB; remain handled by **`cl()`** at read sites or in source.
3. **Non–`LandingSection` writes** — [`prisma.subscriber`](app/actions/subscribers.ts) has no image URL fields; [`siteSettings`](app/actions/landing.ts) updates have no images. Nothing else stores Cloudinary URLs.

### Honest “100%” statement

- **Yes — 100%** of **admin-saved image URLs that are stored in `LandingSection.data`** will be normalized on save once the hook exists.
- **No — not 100%** of every Cloudinary URL **shown in admin UI** until `ImagesForm` actually persists and/or `sectionImages` are loaded from DB (today [`getLandingContent`](lib/getLandingContent.ts) uses static `base.sectionImages`, not DB).

---

## Optional follow-ups (outside original plan)

- Wire **`updateImagesFormData`** to Prisma + reuse same optimization (or rely solely on `upsertLandingSection` if images move into a `LandingSection` document).
- If **`SiteSettings` gains image fields**, apply the same helper in those actions (not `upsertLandingSection`).
