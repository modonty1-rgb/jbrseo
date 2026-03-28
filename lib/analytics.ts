import { createSign } from "node:crypto";

export type AnalyticsData = {
  pageviews7d: number;
  activeUsersToday: number;
  signupStart7d: number;
  pricingView7d: number;
  whatsappClick7d: number;
  topPages: { page: string; views: number }[];
};

const EMPTY: AnalyticsData = {
  pageviews7d: 0,
  activeUsersToday: 0,
  signupStart7d: 0,
  pricingView7d: 0,
  whatsappClick7d: 0,
  topPages: [],
};

// ─── Step 1: Build JWT and exchange for OAuth2 access token ──────────────────

function base64url(data: string | Buffer): string {
  const buf = typeof data === "string" ? Buffer.from(data) : data;
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function getAccessToken(): Promise<string> {
  const clientEmail = process.env.GA4_CLIENT_EMAIL ?? "";
  const privateKey = (process.env.GA4_PRIVATE_KEY ?? "")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "")
    .trim();

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );

  const toSign = `${header}.${payload}`;
  const sign = createSign("RSA-SHA256");
  sign.update(toSign);
  const signature = base64url(sign.sign(privateKey));
  const jwt = `${toSign}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OAuth2 token error: ${err}`);
  }

  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

// ─── Step 2: Call GA4 Data API via REST ──────────────────────────────────────

async function runReport(
  accessToken: string,
  propertyId: string,
  body: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GA4 runReport error ${res.status}: ${err}`);
  }
  return res.json() as Promise<Record<string, unknown>>;
}

// ─── Step 3: getAnalyticsData ─────────────────────────────────────────────────

export async function getAnalyticsData(country?: string): Promise<AnalyticsData> {
  const rawId = (process.env.GA4_PROPERTY_ID ?? "").trim();
  const propertyId = rawId.startsWith("properties/") ? rawId : `properties/${rawId}`;

  const pagePathFilter = country
    ? {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "CONTAINS", value: `/${country.toLowerCase()}` },
        },
      }
    : undefined;

  const dateRange = { startDate: "7daysAgo", endDate: "today" };

  try {
    const token = await getAccessToken();

    const [metricsResp, eventsResp, pagesResp] = await Promise.all([
      runReport(token, propertyId, {
        dateRanges: [dateRange],
        metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
        ...(pagePathFilter ? { dimensionFilter: pagePathFilter } : {}),
      }),

      runReport(token, propertyId, {
        dateRanges: [dateRange],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: pagePathFilter
          ? {
              andGroup: {
                expressions: [
                  {
                    filter: {
                      fieldName: "eventName",
                      inListFilter: {
                        values: ["signup_start", "pricing_view", "whatsapp_click", "signup_complete"],
                      },
                    },
                  },
                  pagePathFilter,
                ],
              },
            }
          : {
              filter: {
                fieldName: "eventName",
                inListFilter: {
                  values: ["signup_start", "pricing_view", "whatsapp_click", "signup_complete"],
                },
              },
            },
      }),

      runReport(token, propertyId, {
        dateRanges: [dateRange],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 5,
        ...(pagePathFilter ? { dimensionFilter: pagePathFilter } : {}),
      }),
    ]);

    type GARow = { metricValues: { value: string }[] };
    const totalsRows = (metricsResp.rows as GARow[] | undefined) ?? [];
    const pageviews7d = parseInt(totalsRows[0]?.metricValues[0]?.value ?? "0", 10);
    const activeUsersToday = parseInt(totalsRows[0]?.metricValues[1]?.value ?? "0", 10);

    type GADimRow = {
      dimensionValues: { value: string }[];
      metricValues: { value: string }[];
    };
    const eventRows = (eventsResp.rows as GADimRow[] | undefined) ?? [];
    const eventMap = Object.fromEntries(
      eventRows.map((r) => [r.dimensionValues[0].value, parseInt(r.metricValues[0].value, 10)]),
    );
    const signupStart7d = eventMap["signup_start"] ?? 0;
    const pricingView7d = eventMap["pricing_view"] ?? 0;
    const whatsappClick7d = eventMap["whatsapp_click"] ?? 0;

    const pageRows = (pagesResp.rows as GADimRow[] | undefined) ?? [];
    const topPages = pageRows.map((r) => ({
      page: r.dimensionValues[0].value,
      views: parseInt(r.metricValues[0].value, 10),
    }));

    return {
      pageviews7d,
      activeUsersToday,
      signupStart7d,
      pricingView7d,
      whatsappClick7d,
      topPages,
    };
  } catch (error) {
    console.error(
      "[Analytics] getAnalyticsData failed:",
      error instanceof Error ? error.message : String(error),
    );
    return EMPTY;
  }
}

// ─── Step 4: getAllAnalyticsData — keep exact same signature ──────────────────

export type AllAnalyticsData = {
  all: AnalyticsData;
  sa: AnalyticsData;
  eg: AnalyticsData;
};

export async function getAllAnalyticsData(): Promise<AllAnalyticsData> {
  const [all, sa, eg] = await Promise.all([
    getAnalyticsData(),
    getAnalyticsData("SA"),
    getAnalyticsData("EG"),
  ]);
  return { all, sa, eg };
}

export async function getCountryBreakdown(): Promise<{ country: string; views: number }[]> {
  const rawId = (process.env.GA4_PROPERTY_ID ?? "").trim();
  const propertyId = rawId.startsWith("properties/") ? rawId : `properties/${rawId}`;

  try {
    const token = await getAccessToken();

    const res = await runReport(token, propertyId, {
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "country" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 8,
    });

    type GADimRow = {
      dimensionValues: { value: string }[];
      metricValues: { value: string }[];
    };
    const rows = (res.rows as GADimRow[] | undefined) ?? [];

    return rows.map((r) => ({
      country: r.dimensionValues[0].value,
      views: parseInt(r.metricValues[0].value, 10),
    }));
  } catch (error) {
    console.error(
      "[Analytics] getCountryBreakdown failed:",
      error instanceof Error ? error.message : String(error),
    );
    return [];
  }
}
