# Image inventory

Where images are defined, consumed, and how the avatar fallback is applied.

## Env and defaults

| Key | Purpose | Default (if unset) |
|-----|---------|--------------------|
| `NEXT_PUBLIC_AVATAR_FALLBACK_URL` | Avatar/contact fallback when backend has no image | Cloudinary URL with `f_auto,q_auto,w_96,c_fill,g_face` |

Defined in [app/content/landing-images.ts](app/content/landing-images.ts). Used as `landingImages.contactAvatar` and inside `StaffAvatar` when `avatarUrl` is missing or fails.

---

## Avatar (fallback applied)

| Location | Source | Fallback |
|----------|--------|----------|
| [app/components/StaffAvatar.tsx](app/components/StaffAvatar.tsx) | `avatarUrl` (team/exec from DB or content) | `landingImages.contactAvatar` (env or optimized Cloudinary URL) |
| Used by [app/(site)/team/page.tsx](app/(site)/team/page.tsx), [app/(site)/about/page.tsx](app/(site)/about/page.tsx) | `member.avatarUrl` | Same; on load error falls back to initials |

---

## Logos (no avatar fallback)

| Location | Source | Notes |
|----------|--------|------|
| [app/content/landing-images.ts](app/content/landing-images.ts) | `logoWhite`, `logoLight` | Cloudinary SVG; no transform |
| [app/components/layout/Footer.tsx](app/components/layout/Footer.tsx) | `landingImages.logoWhite` / `logoLight`; else `DEFAULT_LOGO` | Logo only |
| [app/components/layout/HeaderLogo.tsx](app/components/layout/HeaderLogo.tsx) | `landingImages.logoLight` / `logoWhite` | Logo only |
| [app/components/layout/HeaderLogoClient.tsx](app/components/layout/HeaderLogoClient.tsx) | Props + `FALLBACK_LIGHT` / `FALLBACK_DARK` | Logo only |
| [app/layout.tsx](app/layout.tsx) | `LOGO_URL` (favicon/metadata) | Logo only |
| [app/components/shared/LandingJsonLd.tsx](app/components/shared/LandingJsonLd.tsx) | `content.landingImages.logoWhite` | Logo only |

---

## Testimonial / social proof avatars (content URLs, no env fallback)

| Location | Source | Notes |
|----------|--------|------|
| [app/components/landing/SocialProof/SocialProofCard.tsx](app/components/landing/SocialProof/SocialProofCard.tsx) | `avatarImg` from testimonial | Content or DiceBear URL |
| [app/components/landing/SocialProof/SocialProofTabs.tsx](app/components/landing/SocialProof/SocialProofTabs.tsx) | `t.avatarImg` | Same |
| [app/content/landing/landing-eg.ts](app/content/landing/landing-eg.ts), [landing-sa.ts](app/content/landing/landing-sa.ts) | `avatarImg` in testimonials | DiceBear or custom URL |

---

## Section / hero images (settings or empty)

| Source | Keys | Consumed in |
|--------|------|-------------|
| [lib/getLandingContent.ts](lib/getLandingContent.ts) → `sectionImages` | hero, whyNow, howItWorks, outcomes, socialProof, faq, finalCta | Section components that render section images |
| [lib/site-settings.types.ts](lib/site-settings.types.ts) | `SiteSettingsSectionImages` | Admin [ImagesForm](app/admin/(dashboard)/components/ImagesForm.tsx) (contactAvatar label: "صورة الهيرو") |

---

## Other

| Location | Asset | Notes |
|----------|--------|------|
| [app/components/shared/PricingBillingToggle.tsx](app/components/shared/PricingBillingToggle.tsx) | `/curncy/Saudi_Riyal_Symbol-2.svg` | Static local SVG |
| [app/components/landing/SocialProof/SocialProofVideo.tsx](app/components/landing/SocialProof/SocialProofVideo.tsx) | `thumb`, iframe `src` | Video thumbnail / embed URL |
| [app/admin/(dashboard)/components/ImagesForm.tsx](app/admin/(dashboard)/components/ImagesForm.tsx) | `urls[key]` for preview | Admin image previews |
| [app/admin/(dashboard)/components/GeneralForm.tsx](app/admin/(dashboard)/components/GeneralForm.tsx) | `logoWhite`, `logoLight` | Admin logo preview |

---

## Cloudinary URLs in code (no env)

- Logo (SVG): `v1771973886/jbrser_svg_ikxmnn.svg`
- Logo dark variant: `v1772803131/darrk-jbrseo_gsvavm.svg` (HeaderLogoClient)
- Avatar fallback (optimized): `f_auto,q_auto,w_96,c_fill,g_face/v1771979297/modonatyAvatar_scfhac.png` (default when env not set)
