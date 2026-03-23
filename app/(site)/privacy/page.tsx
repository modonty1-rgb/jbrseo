import type { Metadata } from "next";
import { headers } from "next/headers";
import { LegalMarkdownArticle } from "@/app/components/legal/LegalMarkdownArticle";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const landing = await getStaticLandingWithOverrides(country);
  const { title } = landing.privacy;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com";
  const description =
    "تعرف على كيفية تعامل منصة JBRSEO مع بياناتك الشخصية، وحماية خصوصيتك أثناء استخدامك للخدمة.";
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/privacy` },
    openGraph: { title, description, url: `${siteUrl}/privacy` },
    twitter: { title, description },
  };
}

export default async function PrivacyPage() {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const landing = await getStaticLandingWithOverrides(country);
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

