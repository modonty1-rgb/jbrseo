import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { getArticles, getArticlesResult } from "@/lib/modonty-articles";
import { siteOgImages } from "@/lib/getGlobalSeo";
import { DEFAULT_PUBLIC_SITE_ORIGIN, PUBLIC_INDEX_FOLLOW_ROBOTS, safeJsonLd, SHARED_OPEN_GRAPH, sharedLanguages } from "@/lib/seo-meta";

export const revalidate = 3600;

const CANONICAL = `${DEFAULT_PUBLIC_SITE_ORIGIN}/articles`;
const DESCRIPTION =
  "مقالات عن السيو وتسويق المحتوى ونمو الأعمال — يكتبها فريق المحتوى وتُنشر هنا لجمهور السعودية ومصر.";

export async function generateMetadata(): Promise<Metadata> {
  // The same call the page body makes. Once the endpoint answers 200 the two share one
  // cached response and this is free; while it is failing nothing is cached, so the
  // build logs the extra attempt. That is the cheap half of the trade — the alternative
  // is a page whose <meta robots> cannot know whether the page has anything on it.
  const [images, result] = await Promise.all([siteOgImages(), getArticlesResult()]);

  return {
    // «المقالات» alone was seventeen characters including the appended suffix — the
    // thinnest title on the site, and the one page whose whole job is to rank for
    // content-marketing queries. Named for what the articles are about.
    // No "| JBRSEO" — the root layout's template appends it.
    title: "مقالات السيو وتسويق المحتوى",
    description: DESCRIPTION,
    // An empty listing is a thin page. Asking Google to index a panel that says "nothing
    // here yet" spends crawl budget to earn a low-quality URL, and the impression it
    // leaves outlives the emptiness. `follow` stays on so the links out still count, and
    // the moment the first article lands this flips back to index on its own.
    //
    // `result.ok` guards it: the list also comes back empty when Modonty's API is down,
    // and a transient 5xx during revalidation must not deindex a page that has content.
    robots: result.ok && result.articles.length === 0
      ? { index: false, follow: true }
      : PUBLIC_INDEX_FOLLOW_ROBOTS,
    alternates: { canonical: CANONICAL, languages: sharedLanguages(CANONICAL) },
    openGraph: {
      ...SHARED_OPEN_GRAPH,
      title: "مقالات السيو وتسويق المحتوى",
      description: DESCRIPTION,
      url: CANONICAL,
      images,
    },
    twitter: { card: "summary_large_image", title: "المقالات", description: DESCRIPTION, images },
  };
}

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("ar", { dateStyle: "long" }).format(new Date(value));
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  // The pillar piece leads the page when there is one — it is the article the rest of
  // them point at, so burying it under the newest post wastes the link structure.
  const main = articles.find((a) => a.isMainArticle) ?? null;
  const rest = main ? articles.filter((a) => a.id !== main.id) : articles;

  // Two nodes, both about THIS page: the list of what is on it, and where it sits in the
  // site. The articles themselves carry their own card, baked by Modonty on this domain —
  // nothing here repeats or contradicts it.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": CANONICAL,
        url: CANONICAL,
        name: "المقالات",
        description: DESCRIPTION,
        inLanguage: "ar",
        // No ItemList while the page is empty — an ItemList of zero items describes
        // nothing, and it would contradict the page a reader actually sees.
        ...(articles.length > 0 && {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: articles.length,
            itemListElement: articles.map((article, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${CANONICAL}/${article.slug}`,
              name: article.title,
            })),
          },
        }),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${DEFAULT_PUBLIC_SITE_ORIGIN}/sa` },
          { "@type": "ListItem", position: 2, name: "المقالات", item: CANONICAL },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      {/* The list is reachable from the header nav, so a reader lands here from the landing
          page and then has no marked way back to it — the header link for «المقالات» is the
          page they are on. This is the return trip. */}
      <Link
        href="/"
        className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-sm font-semibold text-foreground no-underline transition-colors hover:bg-muted"
      >
        <ArrowRight className="size-4 shrink-0" strokeWidth={2.5} aria-hidden />
        الرئيسية
      </Link>

      <header className="space-y-3">
        <h1 className="text-2xl font-bold md:text-3xl">المقالات</h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          نكتب عن السيو وتسويق المحتوى ونمو الأعمال — تجارب وأرقام من شغلنا اليومي، لا نظريات.
        </p>
      </header>

      {articles.length === 0 ? (
        <ComingSoon />
      ) : (
        <div className="mt-8 space-y-8">
          {main && <ArticleCard article={main} featured />}

          {rest.length > 0 && (
            <ul className="grid gap-6 sm:grid-cols-2">
              {rest.map((article) => (
                <li key={article.id}>
                  <ArticleCard article={article} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * What the page shows before the first article exists.
 *
 * The dashed edge is the whole idea: a solid card reads as finished content that happens
 * to be blank, which looks broken. A dashed one reads as a place kept open — the same
 * language a reader already knows from an empty slot anywhere else.
 *
 * It offers two ways out rather than none. A reader who came here for proof we can write
 * should not hit a wall; both links go to pages that exist on every country's site, so
 * neither guesses whether the reader is in Saudi Arabia or Egypt.
 */
function ComingSoon() {
  return (
    <section className="mt-10 rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
      <div
        aria-hidden="true"
        className="mx-auto flex size-14 items-center justify-center rounded-full border border-border bg-background text-muted-foreground"
      >
        <PenLine className="size-6" />
      </div>

      <h2 className="mt-5 text-lg font-semibold md:text-xl">أول مقال في الطريق</h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        فريق المحتوى يجهّز أول دفعة — تجارب وأرقام من شغلنا، مو كلام عام. أول ما تنزل بتلقاها هنا.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/features">شوف اللي نقدمه</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/about">مين إحنا</Link>
        </Button>
      </div>
    </section>
  );
}

function ArticleCard({
  article,
  featured = false,
}: {
  article: Awaited<ReturnType<typeof getArticles>>[number];
  featured?: boolean;
}) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      {article.image && (
        <div className={`relative w-full ${featured ? "aspect-[21/9]" : "aspect-video"} bg-muted`}>
          <Image
            src={article.image.url}
            alt={article.image.alt ?? article.title}
            fill
            sizes={featured ? "(max-width: 1024px) 100vw, 1024px" : "(max-width: 640px) 100vw, 512px"}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            placeholder={article.image.blurDataURL ? "blur" : undefined}
            blurDataURL={article.image.blurDataURL ?? undefined}
          />
        </div>
      )}
      <div className="space-y-2 p-4">
        <h2 className={`font-semibold leading-snug ${featured ? "text-xl md:text-2xl" : "text-base"}`}>
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="line-clamp-3 text-sm text-muted-foreground">{article.excerpt}</p>
        )}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {article.publishedAt && <span>{formatDate(article.publishedAt)}</span>}
          {article.readingTimeMinutes && (
            <>
              <span aria-hidden="true">·</span>
              <span>{article.readingTimeMinutes} دقائق قراءة</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
