export interface Section {
  title: string;
  icon: string;
  features: string[];
}

export interface Plan {
  id: string;
  name: string;
  persona: string;
  price: { mo: number; yr: number };
  cta: string;
  ctaClass: string;
  featured: boolean;
  badge: string | null;
  badgeGold?: boolean;
  accent: string;
  accentBg: string;
  articles: string;
  guarantee: boolean;
  highlights: string[];
  sections: Section[];
}

export interface TrustItem {
  icon: string;
  label: string;
}

export interface PricingBottomCta {
  headline: string;
  subheadline: string;
  primaryBtn: string;
  secondaryBtn: string;
  footnote: string;
}

export interface PricingUI {
  freeLabel: string;
  perMonth: string;
  savedYearly: string;
  offer12_18: string;
  billingAnnual: string;
  billingMonthly: string;
  guarantee: string;
  youGet: string;
  moreDetails: string;
  whatsapp: string;
  monthly: string;
  yearly: string;
  save20: string;
  totalAnnual: string;
  /** Effective monthly if spread over 18 months (same total ÷ 18); placeholders {n} {c} */
  annualEquiv18: string;
  /** Shown under annual total; effective monthly on annual plan — {n} {c} */
  annualAvgMonthly: string;
  banner12Title: string;
  banner12Sub: string;
  trustTitle: string;
  /** Line under billing toggle: confirms which cadence applies to prices below */
  pricingBelowHintMonthly: string;
  pricingBelowHintAnnual: string;
  /** `<summary>` for annual price breakdown `<details>` */
  priceDetailsToggle: string;
  /** Single link below plan grid → full pricing / comparison page */
  pricingFullComparisonLabel: string;
}

export interface PricingContent {
  ANNOUNCEMENT: string;
  PLANS: Plan[];
  TRUST_ITEMS: TrustItem[];
  BOTTOM_CTA: PricingBottomCta;
  UI: PricingUI;
}
