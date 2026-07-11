// Per-client GA4 report — sum client page + all their articles
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
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!r.ok) { console.error('GA4 error:', JSON.stringify(j)); return null; }
  return j;
}

const token = await getToken();

const CLIENTS = [
  {
    slug: 'كيما-زون',
    display: 'كيما زون',
    industry: 'تصنيع مستحضرات التجميل · مصر',
    keywords: ['كيما-زون', 'تصنيع-مستحضرات', 'العناية-بالشعر-الكيرلي', 'مصنع', 'عناية-بالشعر'],
  },
  {
    slug: 'متجر-باقتك',
    display: 'متجر باقتك',
    industry: 'تجزئة · باقات الاتصالات · السعودية',
    keywords: ['متجر-باقتك', 'تفعيل-باقات-stc', 'فاتورة-جوالك'],
  },
  {
    slug: 'عيادات-سمايل-تاون-لطب-الفم-و-الأسنان',
    display: 'عيادات سمايل تاون',
    industry: 'طب الأسنان · السعودية',
    keywords: ['سمايل-تاون', 'ابتسامة-هوليود'],
  },
];

for (const c of CLIENTS) {
  console.log(`\n════ ${c.display} ════`);

  // Aggregate metrics across client page + all matching article slugs
  const contains = c.keywords.map(kw => ({
    filter: { fieldName: 'pagePath', stringFilter: { matchType: 'CONTAINS', value: kw } },
  }));
  const filter = { orGroup: { expressions: contains } };

  const r = await runReport(token, {
    dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
    metrics: [
      { name: 'totalUsers' }, { name: 'newUsers' }, { name: 'sessions' },
      { name: 'screenPageViews' }, { name: 'engagedSessions' },
      { name: 'averageSessionDuration' }, { name: 'engagementRate' },
    ],
    dimensionFilter: filter,
  });
  if (!r || !r.rows) { console.log('  no data'); continue; }
  const v = r.rows[0].metricValues.map(x => x.value);
  console.log(`  👥 totalUsers: ${v[0]}`);
  console.log(`  🆕 newUsers: ${v[1]}`);
  console.log(`  🔗 sessions: ${v[2]}`);
  console.log(`  👁️  pageViews: ${v[3]}`);
  console.log(`  ✅ engagedSessions: ${v[4]}`);
  console.log(`  ⏱️  avgSessionDuration: ${Math.round(Number(v[5]))}s`);
  console.log(`  📊 engagementRate: ${(Number(v[6])*100).toFixed(0)}%`);

  // Per-page breakdown
  const pages = await runReport(token, {
    dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }, { name: 'engagementRate' }],
    dimensionFilter: filter,
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 8,
  });
  console.log(`  📄 pages:`);
  for (const row of pages.rows ?? []) {
    const [p] = row.dimensionValues.map(d => d.value);
    const [pv, u, e] = row.metricValues.map(m => m.value);
    console.log(`     ${String(pv).padStart(4)} views · ${String(u).padStart(3)} users · eng=${(Number(e)*100).toFixed(0)}% · ${decodeURIComponent(p).slice(0, 70)}`);
  }

  // Top countries for this client
  const geo = await runReport(token, {
    dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'totalUsers' }],
    dimensionFilter: filter,
    orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
    limit: 5,
  });
  console.log(`  🌍 countries:`);
  for (const row of geo.rows ?? []) {
    console.log(`     ${String(row.metricValues[0].value).padStart(4)} · ${row.dimensionValues[0].value}`);
  }

  // Traffic sources
  const src = await runReport(token, {
    dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [{ name: 'sessions' }],
    dimensionFilter: filter,
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  });
  console.log(`  🌐 sources:`);
  for (const row of src.rows ?? []) {
    console.log(`     ${String(row.metricValues[0].value).padStart(4)} · ${row.dimensionValues[0].value}`);
  }
}
