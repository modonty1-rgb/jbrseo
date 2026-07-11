// Explore Modonty's GA4 property — real numbers
import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';

const s = JSON.parse(readFileSync('scripts/.ga4-secrets.json', 'utf8'));
const PROP = s.GA4_PROPERTY_ID;
const EMAIL = s.GA4_CLIENT_EMAIL;
const PK = Buffer.from(s.GA4_PRIVATE_KEY_BASE64, 'base64').toString('utf8');

function b64url(x) { return Buffer.from(x).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,''); }

async function getToken() {
  const now = Math.floor(Date.now()/1000);
  const h = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const p = b64url(JSON.stringify({ iss: EMAIL, scope: 'https://www.googleapis.com/auth/analytics.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now+3600 }));
  const sig = createSign('RSA-SHA256'); sig.update(`${h}.${p}`);
  const jwt = `${h}.${p}.${sig.sign(PK).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'')}`;
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  const j = await r.json(); if (!r.ok) throw new Error(JSON.stringify(j));
  return j.access_token;
}

async function runReport(token, body) {
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${PROP}:runReport`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!r.ok) { console.error('GA4 error:', j); process.exit(1); }
  return j;
}

const token = await getToken();
console.log('✓ token acquired · property:', PROP);

// 1. Whole property, last 90 days
console.log('\n═══ WHOLE PROPERTY · LAST 90 DAYS ═══');
const total = await runReport(token, {
  dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
  metrics: [
    { name: 'totalUsers' }, { name: 'newUsers' }, { name: 'sessions' },
    { name: 'screenPageViews' }, { name: 'engagedSessions' },
    { name: 'averageSessionDuration' }, { name: 'engagementRate' },
  ],
});
console.log(JSON.stringify(total.rows?.[0]?.metricValues, null, 2));

// 2. Top pages by views
console.log('\n═══ TOP 20 PAGES (last 90d) ═══');
const pages = await runReport(token, {
  dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
  dimensions: [{ name: 'pagePath' }],
  metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }, { name: 'engagementRate' }],
  orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
  limit: 20,
});
for (const row of pages.rows ?? []) {
  const [path] = row.dimensionValues.map(d => d.value);
  const [views, users, eng] = row.metricValues.map(m => m.value);
  console.log(`  ${views.padStart(6)} views · ${users.padStart(5)} users · eng=${(Number(eng)*100).toFixed(0)}% · ${path}`);
}

// 3. Traffic sources
console.log('\n═══ TRAFFIC SOURCES ═══');
const sources = await runReport(token, {
  dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
  dimensions: [{ name: 'sessionDefaultChannelGroup' }],
  metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
  orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
});
for (const row of sources.rows ?? []) {
  console.log(`  ${row.metricValues[0].value.padStart(6)} sessions · ${row.dimensionValues[0].value}`);
}

// 4. Countries
console.log('\n═══ TOP COUNTRIES ═══');
const geo = await runReport(token, {
  dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
  dimensions: [{ name: 'country' }],
  metrics: [{ name: 'totalUsers' }, { name: 'sessions' }],
  orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
  limit: 10,
});
for (const row of geo.rows ?? []) {
  console.log(`  ${row.metricValues[0].value.padStart(5)} users · ${row.dimensionValues[0].value}`);
}
