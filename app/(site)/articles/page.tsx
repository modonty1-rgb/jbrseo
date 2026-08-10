import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getArticles } from "@/lib/modonty-articles";
import { siteOgImages } from "@/lib/getGlobalSeo";
import { DEFAULT_PUBLIC_SITE_ORIGIN, PUBLIC_INDEX_FOLLOW_ROBOTS, SHARED_OPEN_GRAPH } from "@/lib/seo-meta";

export const revalidate = 3600;

const CANONICAL = `${DEFAULT_PUBLIC_SITE_ORIGIN}/articles`;
const DESCRIPTION =
  "مقالات عن السيو وتسويق المحتوى ونمو الأعمال — يكتبها فريق المحتوى وتُنشر هنا لجمهور السعودية ومصر.";

export async function generateMetadata(): Promise<Metadata> {
  const images = await siteOgImages();
  return {
    // No "| JBRSEO" — the root layout's template appends it.
    title: "المقالات",
    description: DESCRIPTION,
    robots: PUBLIC_INDEX_FOLLOW_ROBOTS,
    alternates: { canonical: CANONICAL },
    openGraph: {
      ...SHARED_OPEN_GRAPH,
      title: "المقالات",
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
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: DEFAULT_PUBLIC_SITE_ORIGIN },
          { "@type": "ListItem", position: 2, name: "المقالات", item: CANONICAL },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="space-y-3">
        <h1 className="text-2xl font-bold md:text-3xl">المقالات</h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          نكتب عن السيو وتسويق المحتوى ونمو الأعمال — تجارب وأرقام من شغلنا اليومي، لا نظريات.
        </p>
      </header>

      {articles.length === 0 ? (
        <p className="mt-10 rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
          ما نزلت مقالات بعد. قريباً.
        </p>
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
