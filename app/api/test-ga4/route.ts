import { createSign } from "node:crypto";
import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, string> = {};

  const email = process.env.GA4_CLIENT_EMAIL ?? "";
  const rawKey = process.env.GA4_PRIVATE_KEY ?? "";
  const propId = process.env.GA4_PROPERTY_ID ?? "";

  results["1_CLIENT_EMAIL"] = email || "MISSING";
  results["2_PROPERTY_ID"] = propId || "MISSING";
  results["3_RAW_KEY_FIRST_40"] = rawKey.substring(0, 40) || "MISSING";
  results["4_RAW_KEY_LENGTH"] = String(rawKey.length);

  const privateKey = rawKey.replace(/\\n/g, "\n").replace(/\\r/g, "").trim();
  results["5_PROCESSED_KEY_STARTS"] = privateKey.substring(0, 27);
  results["6_PROCESSED_KEY_ENDS"] = privateKey.slice(-25);
  results["7_PROCESSED_KEY_LENGTH"] = String(privateKey.length);

  try {
    const h = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
    const p = Buffer.from(JSON.stringify({ test: "test" })).toString("base64url");
    const s = createSign("RSA-SHA256");
    s.update(`${h}.${p}`);
    s.sign(privateKey);
    results["8_JWT_SIGNING"] = "OK ✅";
  } catch (e) {
    results["8_JWT_SIGNING"] = `FAILED ❌: ${e instanceof Error ? e.message : String(e)}`;
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const h = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
    const p = Buffer.from(
      JSON.stringify({
        iss: email,
        scope: "https://www.googleapis.com/auth/analytics.readonly",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      }),
    ).toString("base64url");
    const s = createSign("RSA-SHA256");
    s.update(`${h}.${p}`);
    const jwt = `${h}.${p}.${s.sign(privateKey).toString("base64url")}`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });
    const tokenJson = (await tokenRes.json()) as Record<string, unknown>;
    if (!tokenRes.ok) {
      results["9_OAUTH2"] = `FAILED ❌ ${tokenRes.status}: ${JSON.stringify(tokenJson)}`;
    } else {
      const token = tokenJson["access_token"] as string;
      results["9_OAUTH2"] = `OK ✅ token starts: ${token.substring(0, 20)}...`;

      const rawPropId = (process.env.GA4_PROPERTY_ID ?? "").trim();
      const propertyId = rawPropId.startsWith("properties/") ? rawPropId : `properties/${rawPropId}`;
      const reportRes = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            metrics: [{ name: "screenPageViews" }],
          }),
        },
      );
      const reportJson = (await reportRes.json()) as Record<string, unknown>;
      if (!reportRes.ok) {
        results["A_GA4_REPORT"] = `FAILED ❌ ${reportRes.status}: ${JSON.stringify(reportJson)}`;
      } else {
        const rows = reportJson["rows"] as
          | Array<{ metricValues: Array<{ value: string }> }>
          | undefined;
        results["A_GA4_REPORT"] = `OK ✅ pageviews_7d=${rows?.[0]?.metricValues?.[0]?.value ?? "0"}`;
      }
    }
  } catch (e) {
    results["9_OAUTH2"] = `EXCEPTION ❌: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(results, { status: 200 });
}
