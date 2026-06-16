import type { Metadata } from "next";
import { LegalMarkdownArticle } from "@/app/components/legal/LegalMarkdownArticle";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { DEFAULT_PUBLIC_SITE_ORIGIN, PUBLIC_INDEX_FOLLOW_ROBOTS } from "@/lib/seo-meta";

const privacyTitleAbsolute =
  "سياسة الخصوصية وحماية بياناتك الشخصية — مدونتي | JBRSEO";
const privacyDescription =
  "سياسة الخصوصية لمنصة مدونتي. نوضح كيف نجمع بياناتك ونحميها ونستخدمها. بياناتك أمانة عندنا ولن تُشارك مع أي طرف ثالث بدون إذنك.";

export async function generateMetadata(): Promise<Metadata> {
  const canonical = `${DEFAULT_PUBLIC_SITE_ORIGIN}/privacy`;
  return {
    title: { absolute: privacyTitleAbsolute },
    description: privacyDescription,
    alternates: {
      canonical,
      languages: {
        "ar-SA": canonical,
        "ar-EG": canonical,
      },
    },
    robots: PUBLIC_INDEX_FOLLOW_ROBOTS,
    openGraph: {
      title: privacyTitleAbsolute,
      description: privacyDescription,
      url: canonical,
    },
    twitter: { title: privacyTitleAbsolute, description: privacyDescription },
  };
}

export default async function PrivacyPage() {
  const landing = await getStaticLandingWithOverrides();
  const { title, updatedAt, body } = landing.privacy;

  return (
    <main className="bg-background text-foreground">
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-8 text-right">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            {title}
          </h1>
          {updatedAt && (
            <p className="mt-2 text-xs text-muted-foreground">
              آخر تحديث: {updatedAt}
            </p>
          )}
        </header>
        <LegalMarkdownArticle content={body} />
      </section>
    </main>
  );
}

