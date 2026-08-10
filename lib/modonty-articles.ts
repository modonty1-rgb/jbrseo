import "server-only";

/**
 * Articles come from Modonty — we print, we do not think.
 *
 * Every field a page needs to render and to be indexed arrives ready: the title, the
 * body, the meta description, the image with its real dimensions and alt text, and the
 * structured-data card already built on OUR domain. Nothing here recomputes any of it,
 * because the moment this file starts deciding SEO, the quality we are paying for
 * becomes the quality of this file.
 */

export interface ModontyArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  url: string | null;
  canonicalUrl: string | null;
  seo: { title: string | null; description: string | null; robots: string | null };
  jsonLd: string | null;
  image: {
    url: string;
    alt: string | null;
    width: number | null;
    height: number | null;
    blurDataURL: string | null;
  } | null;
  author: { name: string; url: string | null } | null;
  category: { name: string; slug: string } | null;
  tags: string[];
  readingTimeMinutes: number | null;
  wordCount: number | null;
  publishedAt: string | null;
  updatedAt: string;
  isMainArticle: boolean;
}

interface ListResponse {
  client: { name: string; articlesBaseUrl: string | null };
  count: number;
  articles: ModontyArticle[];
}

/** One hour. Their editor's change appears here within the hour without a deploy. */
const REVALIDATE_SECONDS = 3600;

/**
 * Our address at Modonty — a constant, not configuration.
 *
 * There is no key and no header: everything behind it ends up printed on this site's own
 * public pages, so Modonty identifies us by the id in the path. That is what makes this
 * file installable by copying it — nothing to set on the server, nothing to forget, and
 * no value that can be right on one machine and missing on the deployed one.
 *
 * ⚠️ The id below is this client's row in Modonty's DEV database. Production has a
 * different id for the same client, and it has to be swapped in when the endpoint goes
 * live — a dev id in production returns 404, which this file turns into an empty list.
 *
 * The override exists for one reason: pointing at a preview or a local console during a
 * test. Production sets nothing.
 */
export const SITE_ENDPOINT = (
  process.env.MODONTY_SITE_ENDPOINT ?? "https://api.modonty.com/v1/sites/69d5ec61e2087dee91fe99a1"
).replace(/\/+$/, "");

/**
 * The sitemap Modonty publishes for the articles it maintains on our domain.
 *
 * Derived from the endpoint above rather than written out again in `robots.ts`, so the
 * dev→production id swap warned about there happens in exactly one place. A second copy
 * of that id is a second chance to forget it.
 */
export const ARTICLES_SITEMAP_URL = `${SITE_ENDPOINT}/sitemap.xml`;

/**
 * Whether that sitemap is actually being served right now.
 *
 * Modonty gates publishing per site: until it is switched on, every path under the
 * endpoint answers `403 {"error":"Publishing is not enabled for this site"}`. Announcing
 * a sitemap in that state points Google at a URL it cannot read, so `robots.ts` asks
 * first. Any failure — 403, network, timeout — answers false, because the safe direction
 * is to say nothing rather than to promise a file that is not there.
 */
export async function articlesSitemapIsLive(): Promise<boolean> {
  try {
    const res = await fetch(ARTICLES_SITEMAP_URL, {
      signal: AbortSignal.timeout(3000),
      next: { revalidate: REVALIDATE_SECONDS, tags: ["modonty-articles"] },
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Vercel preview deployments sit behind a login page that answers a plain fetch with
 * HTML instead of data. This is the documented way through, and it is set only while we
 * test against a preview.
 */
function previewHeaders(): Record<string, string> | undefined {
  const bypass = process.env.MODONTY_PREVIEW_BYPASS;
  return bypass ? { "x-vercel-protection-bypass": bypass } : undefined;
}

/**
 * Returns an empty list rather than throwing.
 *
 * A content feed being unreachable must never take the page down: the visitor gets a
 * page that says there is nothing yet, which is true from where they stand, instead of
 * an error screen. The failure is logged for us, not shown to them.
 */
export async function getArticles(): Promise<ModontyArticle[]> {
  try {
    const res = await fetch(`${SITE_ENDPOINT}/articles`, {
      headers: previewHeaders(),
      next: { revalidate: REVALIDATE_SECONDS, tags: ["modonty-articles"] },
    });
    if (!res.ok) {
      console.error("modonty articles: list failed", res.status);
      return [];
    }
    const data = (await res.json()) as ListResponse;
    return data.articles ?? [];
  } catch (error) {
    console.error("modonty articles: list threw", error);
    return [];
  }
}

/**
 * Encode a slug for the URL exactly once.
 *
 * The route hands this function a slug that is already percent-encoded, and encoding it
 * again turns every `%` into `%25` — an address the endpoint rightly answers with 404.
 * A Latin slug hides the bug completely, because encoding it twice changes nothing; the
 * first Arabic slug published broke its own page while the article list kept working.
 * Decoding first makes the step idempotent whichever form arrives.
 */
function encodeSlugOnce(slug: string): string {
  try {
    return encodeURIComponent(decodeURIComponent(slug));
  } catch {
    // Not valid percent-encoding — treat it as a raw slug.
    return encodeURIComponent(slug);
  }
}

export async function getArticle(slug: string): Promise<ModontyArticle | null> {
  try {
    const res = await fetch(`${SITE_ENDPOINT}/articles/${encodeSlugOnce(slug)}`, {
      headers: previewHeaders(),
      next: { revalidate: REVALIDATE_SECONDS, tags: ["modonty-articles", `modonty-article-${slug}`] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { article: ModontyArticle };
    return data.article ?? null;
  } catch (error) {
    console.error("modonty articles: single threw", error);
    return null;
  }
}
