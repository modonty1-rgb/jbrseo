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

function apiBase(): string | null {
  return process.env.MODONTY_API_BASE?.replace(/\/+$/, "") ?? null;
}

function authHeaders(): Record<string, string> | null {
  const key = process.env.MODONTY_API_KEY;
  if (!key) return null;

  const headers: Record<string, string> = { Authorization: `Bearer ${key}` };

  // Preview deployments of Modonty's console sit behind Vercel's login page, which
  // answers a plain fetch with HTML instead of data. This header is the documented way
  // through, and it exists ONLY while we test against a preview — the production
  // endpoint needs nothing but the key.
  const bypass = process.env.MODONTY_PREVIEW_BYPASS;
  if (bypass) headers["x-vercel-protection-bypass"] = bypass;

  return headers;
}

/**
 * Returns an empty list rather than throwing.
 *
 * A content feed being unreachable must never take the page down: the visitor gets a
 * page that says there is nothing yet, which is true from where they stand, instead of
 * an error screen. The failure is logged for us, not shown to them.
 */
export async function getArticles(): Promise<ModontyArticle[]> {
  const base = apiBase();
  const headers = authHeaders();
  if (!base || !headers) return [];

  try {
    const res = await fetch(`${base}/articles`, {
      headers,
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

export async function getArticle(slug: string): Promise<ModontyArticle | null> {
  const base = apiBase();
  const headers = authHeaders();
  if (!base || !headers) return null;

  try {
    const res = await fetch(`${base}/articles/${encodeURIComponent(slug)}`, {
      headers,
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
