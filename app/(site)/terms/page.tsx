import type { Metadata } from "next";
import { LegalMarkdownArticle } from "@/app/(site)/_components/LegalMarkdownArticle";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { DEFAULT_PUBLIC_SITE_ORIGIN, PUBLIC_INDEX_FOLLOW_ROBOTS } from "@/lib/seo-meta";

export async function generateMetadata(): Promise<Metadata> {
  const landing = await getStaticLandingWithOverrides();
  const title = landing.terms?.title ?? "شروط الاستخدام لمنصة مدونتي";
  const siteUrl = DEFAULT_PUBLIC_SITE_ORIGIN;
  const description =
    "اقرأ شروط وأحكام استخدام منصة JBRSEO، بما في ذلك حقوقك والتزاماتك وحدود مسؤوليتنا.";
  return {
    title,
    description,
    robots: PUBLIC_INDEX_FOLLOW_ROBOTS,
    alternates: { canonical: `${siteUrl}/terms` },
    openGraph: { title, description, url: `${siteUrl}/terms` },
    twitter: { title, description },
  };
}

export default async function TermsPage() {
  const landing = await getStaticLandingWithOverrides();
  const terms = landing.terms;
  if (!terms) {
    return (
      <main className="bg-background text-foreground">
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">شروط الاستخدام</h1>
          <p className="mt-4 text-sm text-muted-foreground">هذه الصفحة قيد التحديث. يرجى المحاولة لاحقاً.</p>
        </section>
      </main>
    );
  }
  const { title, updatedAt, body } = terms;

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

