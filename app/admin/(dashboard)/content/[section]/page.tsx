import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { StaticLanding } from "@/app/content/landing/types";
import { getNavLinks, getFooterLinks, LEGAL_LINKS } from "@/lib/site-links";
import { getLandingSectionOverride } from "@/lib/landing-sections";
import { updateSection } from "@/app/actions/content-sections";
import { SocialProofSectionForm } from "./_components/SocialProofSectionForm";
import { TeamSectionForm } from "./_components/TeamSectionForm";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { AdminFormFeedback } from "../../_components/AdminFormFeedback";

const CONTENT_KEYS = [
  "hero",
  "socialProof",
  "faq",
  "finalCta",
  "header",
  "footer",
  "pricingPage",
  "privacy",
  "terms",
  "about",
  "team",
] as const;

type ContentKey = (typeof CONTENT_KEYS)[number];

// Text sections now live in the numbered reference editor (/admin/review).
// Only media sections (صور/فيديو) keep a dedicated form here.
const MOVED_TO_REVIEW = new Set<string>(["hero", "faq", "finalCta", "about", "privacy", "terms"]);

const SECTION_LABELS: Record<ContentKey, string> = {
  hero: "قسم الهيرو",
  socialProof: "قسم الشهادات",
  faq: "قسم الأسئلة الشائعة",
  finalCta: "قسم الدعوة النهائية",
  header: "Header section",
  footer: "Slogan",
  pricingPage: "Pricing page section",
  privacy: "Privacy page",
  terms: "Terms page",
  about: "About page",
  team: "Team page",
};

const PAGE_HEADING_OVERRIDES: Partial<Record<ContentKey, { h1: string }>> = {
  team: { h1: "فريق العمل" },
};

function isContentKey(s: string): s is ContentKey {
  return CONTENT_KEYS.includes(s as ContentKey);
}

async function getCountry(searchParams: Promise<{ country?: string }>): Promise<SupportedCountry> {
  const params = await searchParams;
  return params.country === "EG" ? "EG" : "SA";
}

export default async function AdminContentSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ country?: string }>;
}) {
  const { section } = await params;
  const country = await getCountry(searchParams);
  const isLinksSection = section === "links";
  if (!isLinksSection && !isContentKey(section)) notFound();

  // Text sections are edited from the reference page — send old links there.
  if (MOVED_TO_REVIEW.has(section)) redirect(`/admin/review?country=${country}`);

  // DB is the single source of truth. Missing section → empty object, admin fills it.
  let sectionData: unknown;

  if (isLinksSection) {
    sectionData = {
      navLinks: getNavLinks(country as SupportedCountry),
      footerLinks: getFooterLinks(country as SupportedCountry),
      legal: LEGAL_LINKS,
    };
  } else {
    const override = await getLandingSectionOverride(section as ContentKey);
    sectionData = override ?? {};
  }

  const headingOverride = isContentKey(section) ? PAGE_HEADING_OVERRIDES[section] : undefined;
  const label = headingOverride
    ? headingOverride.h1
    : isLinksSection
      ? "Links section"
      : SECTION_LABELS[section as ContentKey];

  // Minimal, focused editor: one title, a constrained column, a single light card.
  return (
    <div className="mx-auto max-w-3xl p-5 sm:p-6">
      <h1 className="mb-4 text-lg font-semibold text-foreground">{label}</h1>
      <Suspense fallback={null}>
        <AdminFormFeedback />
      </Suspense>
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        {!isLinksSection && section === "socialProof" && (
          <SocialProofSectionForm
            key={country}
            section={sectionData as StaticLanding["socialProof"]}
            country={country}
          />
        )}
        {!isLinksSection && section === "team" && (
          <TeamSectionForm
            key={country}
            section={sectionData as StaticLanding["team"]}
            country={country}
          />
        )}
        {!isLinksSection && section !== "socialProof" && section !== "team" && (
          <form key={country} action={updateSection} className="space-y-3">
            <input type="hidden" name="country" value={country} />
            <input type="hidden" name="section" value={section} />
            <input
              type="hidden"
              name="redirect"
              value={`/admin/content/${section}?country=${country}`}
            />
            <h2 className="text-sm font-semibold text-muted-foreground">
              Edit raw JSON for this section
            </h2>
            <Textarea
              name="data"
              defaultValue={JSON.stringify(sectionData, null, 2)}
              className="min-h-[260px] w-full font-mono text-xs focus-visible:ring-primary"
            />
            <Button type="submit" size="sm">
              Save section
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
