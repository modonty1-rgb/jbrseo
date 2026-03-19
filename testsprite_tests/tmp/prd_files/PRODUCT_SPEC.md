## Product Specification – JBRSEO / Modonty Content Service

### 1. Product Overview
- **Product name**: JBRSEO (exclusive Modonty agent for KSA and EG).
- **Core offering**: Subscription-based SEO content service that publishes optimized blog content to the Modonty authority domain and drives qualified traffic/leads to client sites.
- **Primary audience**: Business owners and e‑commerce operators in Saudi Arabia and Egypt who want predictable, organic growth instead of relying only on paid ads.
- **Business goals**:
  - Generate and convert leads for the JBRSEO/Modonty content subscription.
  - Communicate the “18 months for the price of 12” offer and exclusive agency positioning.
  - Provide a transparent console and analytics view for subscribers.

### 2. Key Value Propositions
- **18-Month Lever (Financial)**: Clients pay for 12 months but receive 18 months of content delivery.
- **Authority Engine (SEO)**: Content is published on the central Modonty domain, leveraging shared domain authority and backlinks.
- **Zero-Touch Promise (Operational)**: JBRSEO owns strategy, writing, optimization, and publishing; the client mainly reviews/approves content.
- **Glass Box Transparency (Trust)**: Live analytics via GTM and a client console to monitor views, clicks, and leads.
- **DNA Intake (Quality)**: 100+ question intake to capture brand, tone, goals, and competitors for high-fidelity content.
- **Exclusive Agent (Exclusivity)**: JBRSEO is the only gateway to Modonty in Saudi Arabia (and localized for Egypt).

### 3. Target Users & Segmentation
- **Primary segments**:
  - SMEs and clinics in KSA seeking long-term SEO growth.
  - E‑commerce brands in KSA/EG needing consistent organic traffic.
  - Service businesses that cannot manage writers/freelancers internally.
- **Key user needs**:
  - Predictable, compounding organic traffic and leads.
  - Clarity on what is being delivered each month.
  - Simple onboarding without heavy content production from their side.
  - Transparent performance reporting.

### 4. User Journeys (High-Level)
- **Marketing visitor → Lead → Subscriber**:
  1. Lands on Arabic homepage (`/(site)`) via paid/organic sources.
  2. Consumes hero, “Why now”, “How it works”, outcomes, and social proof sections with localized imagery/pricing.
  3. Uses the main navigation “Pricing” item to scroll to the embedded pricing section on the homepage via an in‑page anchor (`/#pricing`). A separate `/pricing` route may exist for deep links, but the **primary designed behavior from the global navigation is anchor‑based scrolling on `/`, not a full page change to `/pricing`.**
  4. Selects plan (Starter/Growth/Scale or free tier), then proceeds to `/signup`.
  5. Completes signup form and lands on `/signup/thank-you` with confirmation/next steps.
  6. Receives onboarding instructions for intake and console access (handled off-app or via future flows).
- **Admin editor → Live landing content**:
  1. Admin logs in via `/admin/login` and reaches the admin dashboard.
  2. From `/admin` dashboard, navigates to settings and content sections.
  3. Uses forms under `admin/(dashboard)/content` and `admin/(dashboard)/settings` to edit localized site content (hero, outcomes, FAQ, pricing copy, images, logos, SEO metadata, etc.).
  4. Saves changes; server actions persist configuration (Prisma) and public site reflects updates for SA/EG markets.

### 5. Main Surface Areas / Pages
- **Public site**:
  - `/` (home): Arabic landing page with hero, “Why now”, “How it works”, outcomes, social proof, pricing teaser, FAQ, and final CTA. Country is inferred (SA/EG) via headers and affects pricing, content, and imagery. The primary “Pricing / الأسعار” navigation item lives here and scrolls to the in‑page pricing section via `/#pricing` (no route change).
  - `/pricing`: Optional deep‑link pricing page driven by static landing content; may be used from campaigns or direct links, and supports highlighting a plan via `?plan=` query param. The **main site navigation is not required to route to `/pricing`**, and tests should treat anchor‑based pricing on `/` as the primary behavior.
  - `/about`, `/team`: Brand/story and team positioning (details defined in content models).
  - `/signup`: Signup form to capture prospective clients and their plan preference.
  - `/signup/thank-you`: Confirmation page summarizing next steps.
  - `/privacy`, `/terms`: Legal pages for compliance.
- **Admin console**:
  - `/admin/login`: Auth gateway to dashboard. **Login is intentionally implemented as a password‑only form (no email/username field). For this environment, the shared admin password is `admin123`.**
  - `/admin`: Overview dashboard with subscriber stats (total, by country, last 7 days) and activity visualization.
  - `/admin/subscribers`: Management and inspection of subscriber list (segmented by country).
  - `/admin/settings`: General and tracking settings (logos, base site configuration, GTM/script IDs) per country.
  - `/admin/settings/seo`: SEO metadata (title, description, OG/Twitter, canonical) per country.
  - `/admin/settings/images`: Central management of landing section imagery (hero, why now, how it works, outcomes, social proof, FAQ, final CTA).
  - `/admin/content/*`: Per-section content forms for hero, why now, how it works, outcomes, FAQ, final CTA, header/footer, privacy, and other landing sections, localized for SA/EG.

### 6. Functional Requirements
- **Localization & Country Awareness**
  - Detect user country (SA/EG) from request headers. The app prefers an explicit `x-country-code` header when present, and otherwise falls back to common geo headers (e.g. `x-vercel-ip-country`, `cf-ipcountry`), defaulting to Saudi Arabia (SA) when no signal is available.
  - The `?country=` query parameter on public URLs is used only as a **developer/testing convenience** (for tools that may inject matching headers); the product does **not** treat `?country=sa|eg` as part of the public localization contract.
  - Load landing and pricing content from static content + database overrides for the detected country.
  - Allow admin override per country for all key surfaces (hero, FAQ, pricing, CTA text, meta tags, section imagery).
- **Pricing & Plans**
  - Support at least three paid tiers (Starter, Growth, Scale) plus an optional free tier.
  - For each plan: name, audience, monthly price, benefits, and CTA label must be editable from admin.
  - Display “Pay 12, get 18 months” value messaging clearly on pricing and homepage.
- **Lead Capture / Signup**
  - `/signup` is primarily a **marketing conversion surface**, not a traditional long form; the UI may use highly styled or embedded components instead of plain HTML `input` elements.
  - Captures **contact name**, **email** and **phone number** as required fields; business name and activity type are optional context fields.
  - Plan labels are localized and marketing‑driven (Arabic plan names); tests and tooling should treat any selected plan as valid and SHOULD NOT depend on specific English labels like “Basic”.
  - Collects basic lead intent and **plan preference**; additional contact details may be captured off‑app or in later flows.
  - When a `plan` query parameter is present (for example from Pricing CTAs), it is **advisory** and used to highlight the corresponding plan visually; absence of `plan` means no plan is preselected and the user chooses one on the page.
  - Persist leads/subscribers in the database with country and plan metadata.
  - Show a confirmation thank‑you page with guidance on next steps (intake, console setup).
- **Admin Content Management**
  - Allow authenticated admins to:
    - Edit hero copy, subheadline, benefits, proof line, and primary CTA.
    - Manage “Why now”, “How it works” steps, and outcome cards.
    - Manage testimonials, stats, and social proof imagery.
    - Configure FAQ questions/answers and final CTA block.
    - Update SEO metadata and global site settings per country.
  - All changes must be persisted through server actions and reflected on the public site without code changes.
- **Analytics & Reporting**
  - Track total subscribers, counts per country, and last 7-day activity.
  - Visualize subscriber distribution and 7‑day activity on the admin dashboard.

- **Admin Authentication**
  - Admin access is intentionally **password‑only** for this environment (no email/username field); tests and tooling should not expect an email input on `/admin/login`.
  - The shared admin password for non‑production testing environments is `admin123`; successful login is defined as reaching the dashboard when this password is submitted.

### 7. Non-Functional Requirements
- **Performance**: Use Next.js App Router with static/SSR where appropriate; keep landing pages fast and responsive across mobile/desktop.
- **Localization**: Arabic-first UX with correct RTL styling; ensure typography and layouts are responsive and legible.
- **SEO**: Strong metadata defaults, canonical URLs, OG/Twitter support, and JSON‑LD for main landing page.
- **Reliability**: Content and settings stored in Prisma-backed database; admin changes should be durable and auditable.
- **Security**: Admin surfaces are protected by authentication; subscriber and analytics data not exposed publicly.

### 8. Out of Scope (Current Version)
- Self-serve billing and payments inside the app (assumed handled via external tooling or later phase).
- Full client console for article review/approval (only referenced conceptually in marketing copy).
- Multi-language beyond Arabic (English or additional locales would be a future phase).

