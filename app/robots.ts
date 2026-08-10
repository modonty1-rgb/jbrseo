import type { MetadataRoute } from "next";
import { ARTICLES_SITEMAP_URL, articlesSitemapIsLive } from "@/lib/modonty-articles";
import { DEFAULT_PUBLIC_SITE_ORIGIN } from "@/lib/seo-meta";

/**
 * Re-asked once an hour, not once per crawler visit.
 *
 * This file is a cached Route Handler, so without this the answer below would be frozen
 * at build time and the articles sitemap could only ever appear via a deploy. An hour is
 * the same window the article fetches use, and it is far below how often any crawler
 * re-reads robots.txt.
 */
export const revalidate = 3600;

/**
 * One group for every crawler, human or machine.
 *
 * There is deliberately no per-bot group. A `User-agent: GPTBot` block would REPLACE the
 * `*` group for that bot, not add to it — every Disallow below would have to be repeated
 * inside it, and the day one is forgotten a crawler walks into checkout. One group means
 * one rule set, and the AI crawlers (OAI-SearchBot, ChatGPT-User, ClaudeBot,
 * Claude-User, Claude-SearchBot, PerplexityBot, Google-Extended) are allowed by the same
 * lines that allow Googlebot. Blocking any of them is a business decision, not a default.
 *
 * `/_next/static/` and `/_next/image/` are NOT disallowed, on Google's own instruction:
 * "if the absence of these resources make the page harder for Google's crawler to
 * understand the page, don't block them, or else Google won't do a good job of analyzing
 * pages that depend on those resources." Those two paths ARE the stylesheets, the
 * scripts, and every optimised image on this site.
 *
 * `/plain` is absent on purpose: it carries `robots: { index: false }` in its metadata,
 * and a page disallowed here can never be read — so the noindex would never be seen.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  // Ours always; theirs only while it is actually being served (see below).
  const sitemap = [`${DEFAULT_PUBLIC_SITE_ORIGIN}/sitemap.xml`];
  if (await articlesSitemapIsLive()) sitemap.push(ARTICLES_SITEMAP_URL);

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/sa/", "/eg/", "/articles/"],
      disallow: [
        "/admin",
        "/admin/",
        "/api/",
        // Checkout is a transaction, not content — and it is per country, so both.
        "/sa/checkout",
        "/sa/checkout/",
        "/eg/checkout",
        "/eg/checkout/",
      ],
    },
    // Ours for the pages this repo owns, Modonty's for the articles they maintain on our
    // behalf. That second line is the entire integration — Google: "adding a line like
    // `Sitemap: https://example.com/my_sitemap.xml` anywhere in robots.txt also
    // eliminates the parent directory constraint", which is what lets a file on their
    // host declare URLs on ours.
    //
    // It is conditional because publishing is switched on per site at their end, and
    // until it is, the URL answers 403. A robots.txt that names an unreadable sitemap
    // teaches Google nothing and costs it a fetch, so the line simply is not written —
    // and writes itself the hour after they switch it on, with no deploy from us.
    sitemap,
  };
}
