# Deploy & Marketing Campaign — Final Checklist

Use this list to confirm the app is ready for deploy and marketing (Egypt + Saudi Arabia).

---

## 1. Build & config (done)

- [x] `pnpm run build` passes (Next.js 16.1.1)
- [x] `revalidateTag` uses second argument `"default"` (Next.js 16 API)
- [x] `.env` is in `.gitignore` (secrets not committed)
- [x] Proxy protects `/admin` and `/admin/*` except `/admin/login`

---

## 2. Env vars (you must set in production)

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | MongoDB connection string |
| `ADMIN_PASSWORD` | Yes | Strong password (e.g. 20+ chars). Change from default before launch. |
| `NEXT_PUBLIC_SITE_URL` | Yes for SEO | Final site URL, e.g. `https://jbrseo.com` (no trailing slash) |
| `NEXT_PUBLIC_WHITELIST_URL` | Optional | Whitelist CTA button URL |
| `NEXT_PUBLIC_SOCIAL_*` | Optional | Footer + JSON-LD social links (7 vars in `.env.example`) |

Set these in Vercel (or your host) **Environment Variables** for Production (and Preview if needed).

---

## 3. Before first deploy

1. **Rotate secrets**  
   If `.env` was ever committed: change `ADMIN_PASSWORD`, rotate MongoDB user password if needed, and ensure `.env` is ignored from now on.

2. **DB seed**  
   After first deploy with correct `DATABASE_URL`, run seed once (e.g. from CI or locally against prod DB):  
   `pnpm db:seed`  
   So SA and EG have initial landing + SEO content.

3. **OG image**  
   Add `public/og-image.png` (1200×630 px) for social sharing, or set OG image URL in Admin → SEO tab after seed.

---

## 4. SEO & social (ready)

- [x] Home: `generateMetadata()` with full OG + Twitter from DB (Admin SEO tab)
- [x] Pricing + Testimonials: `generateMetadata()` with title/description
- [x] Signup + Thank-you: metadata with noindex
- [x] Root layout: `metadataBase`, default title/description, default OG/twitter image
- [x] `app/robots.ts` → `/robots.txt` (allow /, disallow /admin, /api)
- [x] `app/sitemap.ts` → `/sitemap.xml` (home, pricing, testimonials, signup)
- [x] Footer social links: `target="_blank"` and `rel="noopener noreferrer"`
- [x] JSON-LD: organization `sameAs` from env social URLs

---

## 5. Security (ready)

- [x] Admin: proxy requires valid `admin_session` cookie for `/admin` and `/admin/*` (except login)
- [x] Landing mutations: all guarded by `isAdmin()` in server actions
- [x] `ADMIN_PASSWORD` unset: `lib/admin-auth` throws (no silent fallback)
- [x] Subscribers CRUD: admin-only in server actions

---

## 6. Marketing campaign (after deploy)

1. **Confirm live site**  
   Open `NEXT_PUBLIC_SITE_URL`, check RTL, country (EG/SA), pricing, signup, thank-you.

2. **Admin**  
   Log in at `/admin/login`, set country (SA/EG), fill SEO tab (title, description, OG/Twitter, canonical), save. Optionally fill other sections and re-seed if you prefer DB over seed defaults.

3. **Social preview**  
   Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or [Twitter Card Validator](https://cards-dev.twitter.com/validator) with your home URL to confirm OG/Twitter.

4. **Analytics / GTM**  
   If you use `NEXT_PUBLIC_GTM_*`, set them in production env and confirm events in the dashboard.

5. **Uptime**  
   Use your host’s health check or a simple cron hitting `/` or `/robots.txt`.

---

## 7. Quick “100% confirm” list

- [ ] Env vars set in production (at least `DATABASE_URL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`)
- [ ] `ADMIN_PASSWORD` is strong and not the default
- [ ] Seed run once so SA/EG have content
- [ ] `public/og-image.png` added or OG image URL set in Admin SEO
- [ ] Visit `/` and `/pricing` and `/signup` — no errors, correct language/direction
- [ ] Visit `/admin` — redirects to login when not logged in; after login, dashboard and SEO tab work
- [ ] Submit signup form once — lands on thank-you and subscriber appears in Admin → Subscribers
- [ ] `/robots.txt` and `/sitemap.xml` return expected content

When all items above are checked, the app is ready for deploy and marketing campaign (100% confirm).
