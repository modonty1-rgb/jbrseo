# Plan: 3-Tier Pricing (Starter, Professional, Enterprise)

**Goal:** Implement Starter / Professional / Enterprise pricing in the dashboard and on user-facing pages with minimal, clear changes.

---

## 1. Scope

| Where | What |
|-------|------|
| **Dashboard (admin)** | One-click "Use 3-tier template" loads 3 plans: Starter, Professional, Enterprise. Admin can edit names, forWho, price, badge, features as today. |
| **User pages** | Landing pricing section and `/pricing` page already render whatever plans exist in DB; no layout change. Ensure 3 cards look correct (middle = highlighted). |

No change to plan count logic: admin can still add/remove plans; the template is a convenience to get to 3 tiers quickly.

---

## 2. Data Shape (unchanged)

- `PricingPlan`: `name`, `forWho`, `cta`, `price?`, `badge?`, `highlight?`, `features?[]`
- Plans stored in DB as JSON under `pricingTeaser.plans` (per country).
- Types in [lib/landing-content.types.ts](lib/landing-content.types.ts) stay as-is.

---

## 3. Implementation Steps

### 3.1 Add 3-tier template constant

- **File:** [lib/constants.ts](lib/constants.ts) or new [lib/pricing-templates.ts](lib/pricing-templates.ts).
- **Content:** Export a constant array of 3 `PricingPlan` objects:
  - **Starter** – name: `"Starter"`, forWho: e.g. `"شركات صغيرة وناشئة"`, cta: placeholder, features: `[]`, highlight: `false`.
  - **Professional** – name: `"Professional"`, forWho: e.g. `"شركات نامية (الأكثر شيوعاً)"`, highlight: `true`, badge: `"الأكثر شيوعاً"`.
  - **Enterprise** – name: `"Enterprise"`, forWho: e.g. `"شركات كبيرة ووكالات"`, highlight: `false`.
- Use consistent `cta` (e.g. `"احجز استشارتك"`) and empty `features` so admin can fill or use "Add dummy".

### 3.2 Dashboard: "Use 3-tier template" button

- **File:** [app/admin/(dashboard)/AdminDashboardTabs.tsx](app/admin/(dashboard)/AdminDashboardTabs.tsx).
- **Where:** Pricing Plans tab, near the "Add plan" button (e.g. same row or above the list).
- **Action:** New button "Use 3-tier template" (or "Starter / Professional / Enterprise") that calls `setPlans(THREE_TIER_PLANS_TEMPLATE)` so current plans are replaced by the 3-tier template. No form submit until user clicks Save.
- **Copy:** Optional short note: "Resets to Starter, Professional, Enterprise. Unsaved changes will be lost."

### 3.3 Seed / static fallback (optional but recommended)

- **File:** [app/content/landing.ts](app/content/landing.ts).
- **Change:** Set `pricingTeaser.plans` to the same 3 plans (Starter, Professional, Enterprise) with Arabic forWho and optional price placeholders, so new seeds and static fallback show the 3-tier naming. If you use a shared constant from 3.1, import it here for consistency.

### 3.4 User-facing pages (no structural change)

- **Landing:** [app/components/landing/PricingTeaser.tsx](app/components/landing/PricingTeaser.tsx) – already `sm:grid-cols-3` and `isHighlighted = plan.highlight ?? i === 1` (middle plan). No change.
- **Pricing page:** [app/pricing/page.tsx](app/pricing/page.tsx) – already maps over `landing.pricingTeaser.plans`; 3 plans render in grid. No change.
- **Highlight:** Default highlight on index 1 (Professional) is correct for "Good, Better, Best" middle option.

---

## 4. Files to Touch

| File | Action |
|------|--------|
| [lib/pricing-templates.ts](lib/pricing-templates.ts) | **Create** – export `THREE_TIER_PLANS_TEMPLATE: PricingPlan[]`. |
| [app/admin/(dashboard)/AdminDashboardTabs.tsx](app/admin/(dashboard)/AdminDashboardTabs.tsx) | **Edit** – add "Use 3-tier template" button; import template; on click set plans to template. |
| [app/content/landing.ts](app/content/landing.ts) | **Edit** – set `pricingTeaser.plans` to 3 plans named Starter, Professional, Enterprise (reuse template or mirror copy). |

---

## 5. Verification

- In admin, "Use 3-tier template" replaces current plans with 3 plans (Starter, Professional, Enterprise). Save persists to DB.
- Landing and `/pricing` show 3 cards; middle card (Professional) shows highlight badge when `highlight` is true.
- Existing behaviour (add plan, remove plan, edit fields, Add dummy) unchanged.
- No new env or dependencies; types remain strict.
