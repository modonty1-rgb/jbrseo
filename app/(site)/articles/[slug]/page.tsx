import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getArticle, getArticles } from "@/lib/modonty-articles";

export const revalidate = 3600;

/**
 * Pre-render what exists at build time, and allow the rest.
 *
 * A new article appears on Modonty's side between our deploys — blocking it until we
 * rebuild would make their editor's publish button a lie.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "المقال غير موجود | JBRSEO" };

  return {
    title: article.seo.title ?? article.title,
    description: article.seo.description ?? article.excerpt ?? undefined,
    // The canonical is the one Modonty baked — it already points at this exact page on
    // this domain. Rebuilding it here would be a second source that can drift.
    alternates: { canonical: article.canonicalUrl ?? `/articles/${article.slug}` },
    // Printed from the payload — Modonty decides whether an article is indexable, and a
    // page that silently omits it leaves Google to guess.
    robots: article.seo.robots ?? undefined,
    openGraph: {
      type: "article",
      title: article.seo.title ?? article.title,
      description: article.seo.description ?? article.excerpt ?? undefined,
      url: article.canonicalUrl ?? undefined,
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt,
      images: article.image
        ? [{ url: article.image.url, width: article.image.width ?? 1200, height: article.image.height ?? 630, alt: article.image.alt ?? article.title }]
        : undefined,
    },
  };
}

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("ar", { dateStyle: "long" }).format(new Date(value));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      {/* The card is printed exactly as it arrived. It is built on this domain and
          carries the author, publisher, breadcrumb and image nodes — editing it here
          would break the one thing we are paying Modonty to get right. */}
      {article.jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: article.jsonLd }} />
      )}

      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/articles" className="hover:underline">
          المقالات
        </Link>
        <span className="mx-2" aria-hidden="true">
          ›
        </span>
        <span className="text-foreground">{article.title}</span>
      </nav>

      <header className="space-y-3">
        <h1 className="text-2xl font-bold leading-tight md:text-4xl">{article.title}</h1>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          {article.author && (
            <span>
              بقلم{" "}
              {article.author.url ? (
                <a
                  href={article.author.url}
                  target="_blank"
                  rel="noopener"
                  className="font-medium text-foreground hover:underline"
                >
                  {article.author.name}
                </a>
              ) : (
                <span className="font-medium text-foreground">{article.author.name}</span>
              )}
            </span>
          )}
          {article.publishedAt && (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </>
          )}
          {article.readingTimeMinutes && (
            <>
              <span aria-hidden="true">·</span>
              <span>{article.readingTimeMinutes} دقائق قراءة</span>
            </>
          )}
        </div>
      </header>

      {article.image && (
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={article.image.url}
            alt={article.image.alt ?? article.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
            placeholder={article.image.blurDataURL ? "blur" : undefined}
            blurDataURL={article.image.blurDataURL ?? undefined}
          />
        </div>
      )}

      {/* The body arrives sanitised from Modonty's editor. */}
      <div
        className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-headings:scroll-mt-24"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {article.tags.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
