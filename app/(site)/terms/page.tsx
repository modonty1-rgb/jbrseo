import type { Metadata } from "next";
import { headers } from "next/headers";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const landing = await getStaticLandingWithOverrides(country);
  const { title } = landing.terms;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com";
  const description =
    "اقرأ شروط وأحكام استخدام منصة JBRSEO، بما في ذلك حقوقك والتزاماتك وحدود مسؤوليتنا.";
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/terms` },
    openGraph: { title, description, url: `${siteUrl}/terms` },
    twitter: { title, description },
  };
}

export default async function TermsPage() {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const landing = await getStaticLandingWithOverrides(country);
  const { title, updatedAt, body } = landing.terms;

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
        <article className="prose prose-invert max-w-none text-right prose-p:leading-loose prose-p:text-sm">
          {body.split("\n\n").map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </article>
      </section>
    </main>
  );
}

