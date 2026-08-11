import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

import { getArticle, getArticles } from "@/lib/modonty-articles";
import { DEFAULT_PUBLIC_SITE_ORIGIN, safeJsonLd, SHARED_OPEN_GRAPH, sharedLanguages } from "@/lib/seo-meta";

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
  // A named title, not notFound(), on purpose — measured 2026-08-09.
  //
  // Next's rule is that notFound() must run "before any await that may suspend, as
  // response headers are set at this point". It cannot here: `app/(site)/layout.tsx`
  // wraps the whole group in its own <Suspense> so the header and footer stream
  // immediately, which locks the status at 200 before this file runs at all. Moving the
  // call into generateMetadata was tried and measured: still 200, and it cost the page
  // its title. So the response stays 200 with the noindex Next injects — which is the
  // remedy Google documents by name: "Add a <meta name="robots" content="noindex"> to
  // error pages". `absolute` skips the layout template, which would append "| JBRSEO" twice.
  if (!article) return { title: { absolute: "المقال غير موجود | JBRSEO" } };

  // One resolved URL for the canonical, the hreflang cluster and og:url.
  //
  // The canonical used to be Modonty's `canonicalUrl` taken on trust. It points at this
  // page on this domain today, but it is a string from another system's database: the day
  // it carries their origin instead of ours, every article on this site canonicalises
  // off-domain and drops out of the index — silently, with no error anywhere. Verified
  // against our own origin before use, and the local path is the fallback. `og:url` reads
  // the same value, which also closes the case where the canonical existed and og:url
  // did not.
  const localPath = `${DEFAULT_PUBLIC_SITE_ORIGIN}/articles/${article.slug}`;
  const canonical = (() => {
    if (!article.canonicalUrl) return localPath;
    try {
      return new URL(article.canonicalUrl).origin === DEFAULT_PUBLIC_SITE_ORIGIN
        ? article.canonicalUrl
        : localPath;
    } catch {
      return localPath;
    }
  })();

  // Allow-listed, not printed. `article.seo.robots` is a free-text field in someone
  // else's CMS; a stray "noindex" deindexes our page and a malformed string lands in the
  // meta tag verbatim. Only an explicit, well-formed noindex is honoured — anything else
  // falls back to the site default of index/follow.
  const remoteRobots = article.seo.robots?.toLowerCase() ?? "";
  const robots = remoteRobots.includes("noindex")
    ? { index: false, follow: !remoteRobots.includes("nofollow") }
    : { index: true, follow: true };

  return {
    title: article.seo.title ?? article.title,
    description: article.seo.description ?? article.excerpt ?? undefined,
    alternates: { canonical, languages: sharedLanguages(canonical) },
    robots,
    openGraph: {
      ...SHARED_OPEN_GRAPH,
      // `type` overrides the shared "website" — this one really is an article.
      type: "article",
      title: article.seo.title ?? article.title,
      description: article.seo.description ?? article.excerpt ?? undefined,
      url: canonical,
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

  // Validate-then-reserialise. A card that does not parse is dropped rather than printed.
  const remoteJsonLd = (() => {
    if (!article.jsonLd) return null;
    try {
      return safeJsonLd(JSON.parse(article.jsonLd));
    } catch {
      console.error("modonty article: jsonLd did not parse", article.slug);
      return null;
    }
  })();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      {/* Parsed before it is printed, and escaped on the way out.
          `article.jsonLd` is a string from another company's API. It used to be written
          into the page verbatim: one `</script` anywhere in it — an article title, an alt
          text — would close the tag early and hand the rest of the payload to the HTML
          parser as markup, on our domain. Round-tripping it through JSON.parse also means
          a malformed card is dropped instead of shipped broken. The content is unchanged;
          only its framing is now ours.
          It does carry the author, publisher and image nodes — but NOT a BreadcrumbList,
          despite this page rendering a visible trail, so that one is added below. */}
      {remoteJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: remoteJsonLd }} />
      )}

      {/* The breadcrumb Modonty's card omits, matching the trail rendered under it. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${DEFAULT_PUBLIC_SITE_ORIGIN}/sa` },
              { "@type": "ListItem", position: 2, name: "المقالات", item: `${DEFAULT_PUBLIC_SITE_ORIGIN}/articles` },
              { "@type": "ListItem", position: 3, name: article.title, item: `${DEFAULT_PUBLIC_SITE_ORIGIN}/articles/${article.slug}` },
            ],
          }),
        }}
      />

      {/* A back button, then the trail — not the trail alone.
          The only way out of an article was the word «المقالات» set in muted 14px with a
          hover underline: a link a reader has to go looking for, at the end of a page where
          the next thing they want is almost always the list they came from. The crumb stays
          for orientation and for the breadcrumb reading, but the exit is now a control with
          a border and a 44px target.

          `ArrowRight`, unmirrored: in RTL the page runs right-to-left, so forward is left
          and back is right — the same reason CostHook's forward link uses `ArrowLeft`. */}
      <Link
        href="/articles"
        className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm font-semibold text-foreground no-underline transition-colors hover:bg-muted"
      >
        <ArrowRight className="size-4 shrink-0" strokeWidth={2.5} aria-hidden />
        كل المقالات
      </Link>

      <nav aria-label="مسار التصفح" className="mb-6 text-sm text-muted-foreground">
        <Link href="/articles" className="hover:underline">
          المقالات
        </Link>
        <span className="mx-2" aria-hidden="true">
          ›
        </span>
        <span className="text-foreground">{article.title}</span>
      </nav>

      <header className="space-y-3">
        {/* 1.35, not `leading-tight`. An Arabic headline wraps here, and at 1.25 the
            diacritics of the second line touch the descenders of the first. */}
        <h1 className="text-2xl font-bold leading-[1.35] md:text-4xl">{article.title}</h1>
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
