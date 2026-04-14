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

export async function getAnalyticsData(country?: string, days = 7): Promise<AnalyticsData> {
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

  const dateRange = { startDate: `${days}daysAgo`, endDate: "today" };

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

export async function getAllAnalyticsData(days = 7): Promise<AllAnalyticsData> {
  try {
    const [all, sa, eg] = await Promise.all([
      getAnalyticsData(undefined, days),
      getAnalyticsData("SA", days),
      getAnalyticsData("EG", days),
    ]);
    return { all, sa, eg };
  } catch {
    const empty: AnalyticsData = {
      pageviews7d: 0,
      activeUsersToday: 0,
      signupStart7d: 0,
      pricingView7d: 0,
      whatsappClick7d: 0,
      topPages: [],
    };
    return { all: { ...empty }, sa: { ...empty }, eg: { ...empty } };
  }
}

export async function getCountryBreakdown(days = 7): Promise<{ country: string; views: number }[]> {
  const rawId = (process.env.GA4_PROPERTY_ID ?? "").trim();
  const propertyId = rawId.startsWith("properties/") ? rawId : `properties/${rawId}`;

  try {
    const token = await getAccessToken();

    const res = await runReport(token, propertyId, {
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
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

export type RealtimeData = {
  total: number;
  sa: number;
  eg: number;
};

export async function getRealtimeUsers(): Promise<RealtimeData> {
  const rawId = (process.env.GA4_PROPERTY_ID ?? "").trim();
  const propertyId = rawId.startsWith("properties/") ? rawId : `properties/${rawId}`;

  try {
    const token = await getAccessToken();
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runRealtimeReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dimensions: [{ name: "country" }],
          metrics: [{ name: "activeUsers" }],
        }),
      },
    );
    if (!res.ok) throw new Error(`Realtime API error ${res.status}`);
    type RTRow = { dimensionValues: { value: string }[]; metricValues: { value: string }[] };
    const data = (await res.json()) as { rows?: RTRow[] };
    const rows = data.rows ?? [];

    let total = 0;
    let sa = 0;
    let eg = 0;

    for (const row of rows) {
      const country = row.dimensionValues[0].value;
      const count = parseInt(row.metricValues[0].value, 10);
      total += count;
      if (country === "Saudi Arabia") sa += count;
      if (country === "Egypt") eg += count;
    }

    return { total, sa, eg };
  } catch (error) {
    console.error(
      "[Analytics] getRealtimeUsers failed:",
      error instanceof Error ? error.message : String(error),
    );
    return { total: 0, sa: 0, eg: 0 };
  }
}

export async function getTrafficSources(days = 7): Promise<{ channel: string; views: number }[]> {
  const rawId = (process.env.GA4_PROPERTY_ID ?? "").trim();
  const propertyId = rawId.startsWith("properties/") ? rawId : `properties/${rawId}`;

  try {
    const token = await getAccessToken();
    const res = await runReport(token, propertyId, {
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    });

    type GADimRow = {
      dimensionValues: { value: string }[];
      metricValues: { value: string }[];
    };
    const rows = (res.rows as GADimRow[] | undefined) ?? [];

    return rows.map((r) => ({
      channel: r.dimensionValues[0].value,
      views: parseInt(r.metricValues[0].value, 10),
    }));
  } catch (error) {
    console.error(
      "[Analytics] getTrafficSources failed:",
      error instanceof Error ? error.message : String(error),
    );
    return [];
  }
}

export type PlanInterestData = {
  byPlan: { name: string; clicks: number; signups: number }[];
  billing: { annual: number; monthly: number };
};

export async function getPlanInterestData(days = 7): Promise<PlanInterestData> {
  const rawId = (process.env.GA4_PROPERTY_ID ?? "").trim();
  const propertyId = rawId.startsWith("properties/") ? rawId : `properties/${rawId}`;

  const empty: PlanInterestData = { byPlan: [], billing: { annual: 0, monthly: 0 } };

  try {
    const token = await getAccessToken();
    type GADimRow = {
      dimensionValues: { value: string }[];
      metricValues: { value: string }[];
    };

    const [planClicksRes, signupPlansRes, billingRes] = await Promise.all([
      // plan_click breakdown by plan_name
      runReport(token, propertyId, {
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
        dimensions: [{ name: "customEvent:plan_name" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "plan_click" } },
        },
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      }),
      // signup_start breakdown by plan_name
      runReport(token, propertyId, {
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
        dimensions: [{ name: "customEvent:plan_name" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "signup_start" } },
        },
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      }),
      // billing_mode breakdown
      runReport(token, propertyId, {
        dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
        dimensions: [{ name: "customEvent:billing_mode" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "plan_click" } },
        },
      }),
    ]);

    const clickRows = (planClicksRes.rows as GADimRow[] | undefined) ?? [];
    const signupRows = (signupPlansRes.rows as GADimRow[] | undefined) ?? [];
    const billingRows = (billingRes.rows as GADimRow[] | undefined) ?? [];

    // merge clicks + signups by plan name
    const planMap = new Map<string, { clicks: number; signups: number }>();
    for (const r of clickRows) {
      const name = r.dimensionValues[0].value;
      if (name && name !== "(not set)") {
        planMap.set(name, { clicks: parseInt(r.metricValues[0].value, 10), signups: 0 });
      }
    }
    for (const r of signupRows) {
      const name = r.dimensionValues[0].value;
      if (name && name !== "(not set)") {
        const existing = planMap.get(name) ?? { clicks: 0, signups: 0 };
        planMap.set(name, { ...existing, signups: parseInt(r.metricValues[0].value, 10) });
      }
    }
    const byPlan = Array.from(planMap.entries())
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.clicks - a.clicks);

    // billing mode
    let annual = 0;
    let monthly = 0;
    for (const r of billingRows) {
      const mode = r.dimensionValues[0].value;
      const count = parseInt(r.metricValues[0].value, 10);
      if (mode === "annual") annual = count;
      if (mode === "monthly") monthly = count;
    }

    return { byPlan, billing: { annual, monthly } };
  } catch (error) {
    console.error(
      "[Analytics] getPlanInterestData failed:",
      error instanceof Error ? error.message : String(error),
    );
    return empty;
  }
}

export async function getTopEvents(days = 7): Promise<{ event: string; count: number }[]> {
  const rawId = (process.env.GA4_PROPERTY_ID ?? "").trim();
  const propertyId = rawId.startsWith("properties/") ? rawId : `properties/${rawId}`;

  try {
    const token = await getAccessToken();
    const res = await runReport(token, propertyId, {
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 10,
    });

    type GADimRow = {
      dimensionValues: { value: string }[];
      metricValues: { value: string }[];
    };
    const rows = (res.rows as GADimRow[] | undefined) ?? [];

    const noiseEvents = [
      "page_view",
      "session_start",
      "first_visit",
      "user_engagement",
      "scroll",
      "click",
    ];

    return rows
      .map((r) => ({
        event: r.dimensionValues[0].value,
        count: parseInt(r.metricValues[0].value, 10),
      }))
      .filter((e) => !noiseEvents.includes(e.event));
  } catch (error) {
    console.error(
      "[Analytics] getTopEvents failed:",
      error instanceof Error ? error.message : String(error),
    );
    return [];
  }
}
