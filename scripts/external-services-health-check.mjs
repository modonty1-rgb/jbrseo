#!/usr/bin/env node
/**
 * 🏥 Health check for every external service the app depends on.
 * Runs live probes — no mocks. Any failure = blocker for prod.
 *
 * Usage: node scripts/external-services-health-check.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local first (dev), then .env (prod fallback)
function loadEnv(file) {
  const raw = readFileSync(path.resolve(here, "..", file), "utf8");
  raw.split("\n").forEach((line) => {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (m) {
      const [, k, v] = m;
      if (!process.env[k]) {
        process.env[k] = v.replace(/^["']|["']$/g, "");
      }
    }
  });
}
loadEnv(".env.local");

const results = [];
const P = (name, fn) => results.push({ name, promise: fn() });

// ─── 1. Cloudflare Turnstile server-side verify ─────────────────────────
P("Cloudflare Turnstile (siteverify API)", async () => {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: false, detail: "TURNSTILE_SECRET_KEY missing" };
  const body = new URLSearchParams({
    secret,
    response: "XXXX.DUMMY.TOKEN.XXXX", // always accepted with the 1x-test key
  });
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const data = await res.json();
  return {
    ok: data.success === true || (secret.startsWith("1x") && data["error-codes"]?.length === 0),
    detail: `success=${data.success} · errorCodes=${JSON.stringify(data["error-codes"] ?? [])} · secret=${secret.slice(0, 8)}...`,
  };
});

// ─── 2. Upstash Redis (ping + set/get roundtrip) ────────────────────────
P("Upstash Redis (REST API)", async () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { ok: false, detail: "UPSTASH_* env missing" };
  const headers = { Authorization: `Bearer ${token}` };
  const key = "healthcheck:jbrseo";
  const setRes = await fetch(`${url}/set/${key}/probe`, { headers });
  const setData = await setRes.json();
  const getRes = await fetch(`${url}/get/${key}`, { headers });
  const getData = await getRes.json();
  return {
    ok: setData.result === "OK" && getData.result === "probe",
    detail: `set=${setData.result} · get=${getData.result} · url=${url.slice(0, 40)}...`,
  };
});

// ─── 3. MongoDB dev (Prisma via subscriber count) ───────────────────────
P("MongoDB (dev — modonty_dev)", async () => {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const count = await prisma.subscriber.count();
    const webhookOk = await prisma.webhookEvent.count();
    return {
      ok: typeof count === "number",
      detail: `subscriber=${count} · webhookEvent=${webhookOk}`,
    };
  } finally { await prisma.$disconnect(); }
});

// ─── 4. MongoDB prod read-only (Modonty clients) ────────────────────────
P("MongoDB (prod read-only — Modonty clients)", async () => {
  const url = process.env.MODONTY_PROD_DATABASE_URL;
  if (!url) return { ok: false, detail: "MODONTY_PROD_DATABASE_URL missing" };
  process.env.DATABASE_URL = url;
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const count = await prisma.modontyClient.count();
    return { ok: count > 0, detail: `client rows=${count}` };
  } finally { await prisma.$disconnect(); }
});

// ─── 5. N-Genius Sandbox — access-token endpoint ────────────────────────
P("N-Genius Sandbox (access-token)", async () => {
  const tokenUrl = process.env.NGENIUS_TOKEN_URL;
  const apiKey = process.env.NGENIUS_API_KEY;
  if (!tokenUrl || !apiKey) return { ok: false, detail: "NGENIUS_* env missing" };
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${apiKey}`,
      Accept: "application/vnd.ni-identity.v1+json",
      "Content-Type": "application/vnd.ni-identity.v1+json",
    },
  });
  const data = await res.json();
  return {
    ok: res.ok && !!data.access_token,
    detail: `status=${res.status} · has token=${!!data.access_token} · expires_in=${data.expires_in ?? "?"}s`,
  };
});

// ─── 6. GA4 Data API (Modonty analytics) ────────────────────────────────
P("GA4 Data API (Modonty analytics)", async () => {
  const propertyId = process.env.MODONTY_GA4_PROPERTY_ID ?? process.env.GA4_PROPERTY_ID;
  const clientEmail = process.env.GA4_CLIENT_EMAIL;
  const privateKeyBase64 = process.env.GA4_PRIVATE_KEY_BASE64;
  if (!propertyId || !clientEmail || !privateKeyBase64) {
    return { ok: false, detail: "GA4_* env incomplete" };
  }
  // Minimal probe: try to mint a JWT and hit token endpoint
  const crypto = await import("node:crypto");
  const privateKey = Buffer.from(privateKeyBase64, "base64").toString("utf8");
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 300,
    iat: now,
  })).toString("base64url");
  const sig = crypto
    .createSign("RSA-SHA256")
    .update(`${header}.${payload}`)
    .sign(privateKey)
    .toString("base64url");
  const assertion = `${header}.${payload}.${sig}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const data = await res.json();
  return {
    ok: res.ok && !!data.access_token,
    detail: `status=${res.status} · has token=${!!data.access_token} · property=${propertyId}`,
  };
});

// ─── Run all + print report ─────────────────────────────────────────────
const out = await Promise.all(results.map(async ({ name, promise }) => {
  try {
    const r = await promise;
    return { name, ...r };
  } catch (e) {
    return { name, ok: false, detail: `EXCEPTION: ${e instanceof Error ? e.message : String(e)}` };
  }
}));

console.log("\n═══════════════════════════════════════════════════════════════════════════");
console.log("  EXTERNAL SERVICES HEALTH CHECK — " + new Date().toISOString().slice(0, 19));
console.log("═══════════════════════════════════════════════════════════════════════════\n");

let passed = 0, failed = 0;
for (const r of out) {
  const icon = r.ok ? "✅" : "❌";
  console.log(`  ${icon} ${r.name}`);
  console.log(`      ${r.detail}\n`);
  if (r.ok) passed++; else failed++;
}

console.log("═══════════════════════════════════════════════════════════════════════════");
console.log(`  ${passed}/${out.length} passed  ·  ${failed} failed`);
console.log("═══════════════════════════════════════════════════════════════════════════\n");
process.exit(failed === 0 ? 0 : 1);
