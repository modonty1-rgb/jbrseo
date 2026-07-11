/**
 * GA4 Data API — read-only, site-wide footer stats.
 * Ported from Modonty (modonty/lib/analytics/ga4.ts), simplified for JBRSEO.
 *
 * Reads env vars: GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY_BASE64 (fallback GA4_PRIVATE_KEY).
 * Cached 5 minutes via unstable_cache so /sa never blocks on GA4 or burns quota.
 * Any failure returns null — the landing gracefully hides the stats bar.
 */
import { createSign } from "node:crypto";
import { unstable_cache } from "next/cache";

// Reads MODONTY's GA4 property (for Impact Bar + per-client case studies on the
// public site). Distinct from GA4_PROPERTY_ID which lib/analytics.ts uses to read
// JBRSEO's OWN property for the admin dashboard. Falls back to GA4_PROPERTY_ID
// only for local dev convenience — production must set both.
const PROPERTY_ID = process.env.MODONTY_GA4_PROPERTY_ID ?? process.env.GA4_PROPERTY_ID;
const CLIENT_EMAIL = process.env.GA4_CLIENT_EMAIL;
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

// Cumulative since Modonty launch — number only grows over time.
const SINCE = "2025-01-01";

// Real human interactions only — exclude auto/technical events that would inflate the count.
const ENGAGEMENT_EVENTS = new Set([
  "outbound_click",
  "article_like",
  "article_favorite",
  "article_share",
  "comment_submit",
  "comment_reply",
  "client_favorite",
  "client_share",
  "client_comment_submit",
  "follow_client",
  "ask_client_submit",
  "contact_submit",
  "newsletter_subscribe",
  "conversion_complete",
]);

function getPrivateKey(): string | null {
  const b64 = process.env.GA4_PRIVATE_KEY_BASE64;
  if (b64) return Buffer.from(b64, "base64").toString("utf8");
  const raw = process.env.GA4_PRIVATE_KEY;
  if (raw) return raw.replace(/\\n/g, "\n").replace(/\\r/g, "").trim();
  return null;
}

function base64url(data: string | Buffer): string {
  const buf = typeof data === "string" ? Buffer.from(data) : data;
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.token;
  const privateKey = getPrivateKey();
  if (!privateKey || !CLIENT_EMAIL) throw new Error("GA4: missing credentials");

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: CLIENT_EMAIL,
      scope: SCOPE,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const toSign = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(toSign);
  const jwt = `${toSign}.${base64url(signer.sign(privateKey))}`;

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = (await resp.json()) as { access_token?: string; expires_in?: number };
  if (!resp.ok || !data.access_token) throw new Error(`GA4 token HTTP ${resp.status}`);
  cachedToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return data.access_token;
}

interface ReportResponse {
  rows?: Array<{ dimensionValues?: Array<{ value: string }>; metricValues?: Array<{ value: string }> }>;
}

async function runReport(body: unknown): Promise<ReportResponse> {
  if (!PROPERTY_ID) throw new Error("GA4_PROPERTY_ID not set");
  const token = await getAccessToken();
  const resp = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!resp.ok) throw new Error(`GA4 runReport HTTP ${resp.status}`);
  return (await resp.json()) as ReportResponse;
}

export interface ModontyImpactStats {
  sessions: number;
  pageViews: number;
  events: number;
  interactions: number;
  users: number;
  avgSessionSeconds: number;
  grandTotal: number;
}

async function fetchImpactStats(): Promise<ModontyImpactStats | null> {
  try {
    const [totals, events] = await Promise.all([
      runReport({
        dateRanges: [{ startDate: SINCE, endDate: "today" }],
        metrics: [
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "eventCount" },
          { name: "averageSessionDuration" },
          { name: "totalUsers" },
        ],
      }),
      runReport({
        dateRanges: [{ startDate: SINCE, endDate: "today" }],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        limit: 100,
      }),
    ]);

    const m = totals.rows?.[0]?.metricValues ?? [];
    const sessions = Number(m[0]?.value ?? 0);
    const pageViews = Number(m[1]?.value ?? 0);
    const eventCount = Number(m[2]?.value ?? 0);
    const avgSessionSeconds = Math.round(Number(m[3]?.value ?? 0));
    const users = Number(m[4]?.value ?? 0);

    let interactions = 0;
    for (const row of events.rows ?? []) {
      const name = row.dimensionValues?.[0]?.value ?? "";
      if (ENGAGEMENT_EVENTS.has(name)) interactions += Number(row.metricValues?.[0]?.value ?? 0);
    }

    if (!sessions && !pageViews) return null;

    return {
      sessions,
      pageViews,
      events: eventCount,
      interactions,
      users,
      avgSessionSeconds,
      grandTotal: sessions + pageViews + eventCount + interactions,
    };
  } catch {
    return null;
  }
}

// Cache 5 minutes — a proof number that updates hourly is more than fresh enough,
// and even at high traffic the API is hit at most ~12 times/hour.
export const getModontyImpactStats = unstable_cache(
  fetchImpactStats,
  ["modonty-impact-stats"],
  { revalidate: 300, tags: ["ga4-impact"] },
);

// ─── PER-CLIENT CASE STUDY STATS ────────────────────────────────────────────

export interface ClientCaseStudyStats {
  key: string;
  users: number;
  sessions: number;
  pageViews: number;
  avgSessionSeconds: number;
  engagementRate: number;
  countriesCount: number;
  organicSessions: number;
  organicPercent: number;
  /** For smile-town-style: hits on the "احجز موعد" (book) page — a real conversion signal. */
  bookingPageViews: number;
  /** Views on the client's single best-performing article — a "one piece pulled X readers" hook. */
  topArticleViews: number;
  /** Users of that top article — for the "how many people came from ONE piece of content" story. */
  topArticleUsers: number;
}

type ClientCfg = {
  key: "smileTown" | "kimaZone" | "baqatek";
  pathContains: string[];
  bookingPathContains?: string;
  topArticlePathContains?: string;
};

const CASE_STUDY_CLIENTS: ClientCfg[] = [
  {
    key: "smileTown",
    pathContains: ["سمايل-تاون", "ابتسامة-هوليود", "%D8%B3%D9%85%D8%A7%D9%8A%D9%84"],
    bookingPathContains: "سمايل-تاون-لطب-الفم-و-الأسنان/book",
  },
  {
    key: "kimaZone",
    pathContains: [
      "كيما-زون",
      "تصنيع-مستحضرات",
      "العناية-بالشعر-الكيرلي",
      "مصنع-منتجات-عناية-بالشعر",
      "%D9%83%D9%8A%D9%85%D8%A7",
    ],
    topArticlePathContains: "تصنيع-مستحضرات-التجميل-للغير-في-مصر",
  },
  {
    key: "baqatek",
    pathContains: ["متجر-باقتك", "تفعيل-باقات-stc", "فاتورة-جوالك", "%D9%85%D8%AA%D8%AC%D8%B1-%D8%A8%D8%A7"],
    topArticlePathContains: "تفعيل-باقات-stc-بأسعار-أقل",
  },
];

function orFilter(paths: string[]) {
  return {
    orGroup: {
      expressions: paths.map((v) => ({
        filter: { fieldName: "pagePath", stringFilter: { matchType: "CONTAINS" as const, value: v } },
      })),
    },
  };
}

async function fetchOneClient(cfg: ClientCfg): Promise<ClientCaseStudyStats | null> {
  try {
    const filter = orFilter(cfg.pathContains);
    const dateRanges = [{ startDate: "90daysAgo", endDate: "today" }];

    const [totals, countries, sources, booking, topArticle] = await Promise.all([
      runReport({
        dateRanges,
        metrics: [
          { name: "totalUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
          { name: "engagementRate" },
        ],
        dimensionFilter: filter,
      }),
      runReport({
        dateRanges,
        dimensions: [{ name: "country" }],
        metrics: [{ name: "totalUsers" }],
        dimensionFilter: filter,
        limit: 25,
      }),
      runReport({
        dateRanges,
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        dimensionFilter: filter,
      }),
      cfg.bookingPathContains
        ? runReport({
            dateRanges,
            metrics: [{ name: "screenPageViews" }],
            dimensionFilter: {
              filter: {
                fieldName: "pagePath",
                stringFilter: { matchType: "CONTAINS" as const, value: cfg.bookingPathContains },
              },
            },
          })
        : Promise.resolve(null),
      cfg.topArticlePathContains
        ? runReport({
            dateRanges,
            metrics: [{ name: "screenPageViews" }, { name: "totalUsers" }],
            dimensionFilter: {
              filter: {
                fieldName: "pagePath",
                stringFilter: { matchType: "CONTAINS" as const, value: cfg.topArticlePathContains },
              },
            },
          })
        : Promise.resolve(null),
    ]);

    const m = totals.rows?.[0]?.metricValues ?? [];
    const users = Number(m[0]?.value ?? 0);
    const sessions = Number(m[1]?.value ?? 0);
    const pageViews = Number(m[2]?.value ?? 0);
    const avgSessionSeconds = Math.round(Number(m[3]?.value ?? 0));
    const engagementRate = Number(m[4]?.value ?? 0);

    const countriesCount = countries.rows?.length ?? 0;

    let organicSessions = 0;
    let totalSourceSessions = 0;
    for (const row of sources.rows ?? []) {
      const name = row.dimensionValues?.[0]?.value ?? "";
      const s = Number(row.metricValues?.[0]?.value ?? 0);
      totalSourceSessions += s;
      if (name === "Organic Search" || name === "Organic Social") organicSessions += s;
    }
    const organicPercent = totalSourceSessions > 0 ? organicSessions / totalSourceSessions : 0;

    const bookingPageViews = Number(booking?.rows?.[0]?.metricValues?.[0]?.value ?? 0);
    const topArticleViews = Number(topArticle?.rows?.[0]?.metricValues?.[0]?.value ?? 0);
    const topArticleUsers = Number(topArticle?.rows?.[0]?.metricValues?.[1]?.value ?? 0);

    return {
      key: cfg.key,
      users,
      sessions,
      pageViews,
      avgSessionSeconds,
      engagementRate,
      countriesCount,
      organicSessions,
      organicPercent,
      bookingPageViews,
      topArticleViews,
      topArticleUsers,
    };
  } catch {
    return null;
  }
}

async function fetchCaseStudiesStats(): Promise<Record<string, ClientCaseStudyStats> | null> {
  try {
    const results = await Promise.all(CASE_STUDY_CLIENTS.map(fetchOneClient));
    const map: Record<string, ClientCaseStudyStats> = {};
    for (const r of results) if (r) map[r.key] = r;
    return Object.keys(map).length > 0 ? map : null;
  } catch {
    return null;
  }
}

// Cache 5 minutes — same rhythm as the impact bar.
export const getCaseStudiesStats = unstable_cache(
  fetchCaseStudiesStats,
  ["modonty-case-studies"],
  { revalidate: 300, tags: ["ga4-cases"] },
);
