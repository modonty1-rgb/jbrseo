// Deep probe of Smile Town Dental (سمايل تاون)
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const prodUrl = env.MODONTY_PROD_DATABASE_URL;
const p = new PrismaClient({ datasourceUrl: prodUrl });

const target = await p.$runCommandRaw({
  find: 'clients',
  filter: { slug: 'عيادات-سمايل-تاون-لطب-الفم-و-الأسنان' },
});
const c = target.cursor?.firstBatch?.[0];
if (!c) { console.error('not found'); process.exit(1); }
console.log('=== CLIENT ===');
console.log(JSON.stringify({
  name: c.name, slug: c.slug, subdomain: c.subdomain, industry: c.industry,
  createdAt: c.createdAt, city: c.city, country: c.country,
  planTier: c.planTier, plan: c.plan,
}, null, 2));
const cid = c._id.$oid;
console.log('\nclientId:', cid);

// TOTALS
const totalViews = (await p.$runCommandRaw({ count: 'analytics', query: { clientId: { $oid: cid } } })).n;
console.log('\n📊 TOTAL PAGE VIEWS:', totalViews);

const uniqueSess = await p.$runCommandRaw({
  aggregate: 'analytics',
  pipeline: [
    { $match: { clientId: { $oid: cid }, sessionId: { $ne: null } } },
    { $group: { _id: '$sessionId' } }, { $count: 'unique' },
  ],
  cursor: {},
});
console.log('👥 UNIQUE VISITORS:', uniqueSess.cursor?.firstBatch?.[0]?.unique ?? 0);

// TRAFFIC SOURCES
const bySource = await p.$runCommandRaw({
  aggregate: 'analytics',
  pipeline: [
    { $match: { clientId: { $oid: cid } } },
    { $group: { _id: '$source', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ],
  cursor: {},
});
console.log('\n🌐 TRAFFIC SOURCES:');
for (const s of bySource.cursor?.firstBatch ?? []) console.log(`  ${s._id}: ${s.count}`);

// SEARCH ENGINES
const bySearch = await p.$runCommandRaw({
  aggregate: 'analytics',
  pipeline: [
    { $match: { clientId: { $oid: cid }, searchEngine: { $ne: null } } },
    { $group: { _id: '$searchEngine', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ],
  cursor: {},
});
console.log('\n🔎 SEARCH ENGINES:');
for (const s of bySearch.cursor?.firstBatch ?? []) console.log(`  ${s._id}: ${s.count}`);

// REFERRERS
const byRef = await p.$runCommandRaw({
  aggregate: 'analytics',
  pipeline: [
    { $match: { clientId: { $oid: cid }, referrerDomain: { $ne: null } } },
    { $group: { _id: '$referrerDomain', count: { $sum: 1 } } },
    { $sort: { count: -1 } }, { $limit: 15 },
  ],
  cursor: {},
});
console.log('\n📌 REFERRER DOMAINS:');
for (const r of byRef.cursor?.firstBatch ?? []) console.log(`  ${r._id}: ${r.count}`);

// GEO
const byCity = await p.$runCommandRaw({
  aggregate: 'analytics',
  pipeline: [
    { $match: { clientId: { $oid: cid }, city: { $ne: null } } },
    { $group: { _id: '$city', count: { $sum: 1 } } },
    { $sort: { count: -1 } }, { $limit: 15 },
  ],
  cursor: {},
});
console.log('\n🌍 TOP CITIES:');
for (const g of byCity.cursor?.firstBatch ?? []) console.log(`  ${g._id}: ${g.count}`);

const byCountry = await p.$runCommandRaw({
  aggregate: 'analytics',
  pipeline: [
    { $match: { clientId: { $oid: cid }, country: { $ne: null } } },
    { $group: { _id: '$country', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ],
  cursor: {},
});
console.log('\n🗺️  COUNTRIES:');
for (const g of byCountry.cursor?.firstBatch ?? []) console.log(`  ${g._id}: ${g.count}`);

// ENGAGEMENT
const eng = await p.$runCommandRaw({
  aggregate: 'analytics',
  pipeline: [
    { $match: { clientId: { $oid: cid } } },
    { $group: { _id: '$bounced', count: { $sum: 1 }, avgTime: { $avg: '$timeOnPage' }, avgScroll: { $avg: '$scrollDepth' } } },
  ],
  cursor: {},
});
console.log('\n⏱️  ENGAGEMENT:');
for (const e of eng.cursor?.firstBatch ?? []) {
  console.log(`  bounced=${e._id}: count=${e.count} · avgTime=${e.avgTime?.toFixed(1)}s · avgScroll=${e.avgScroll?.toFixed(1)}%`);
}

// SUBSCRIBERS
const subs = (await p.$runCommandRaw({ count: 'subscribers', query: { clientId: { $oid: cid } } })).n;
console.log('\n📧 EMAIL SUBSCRIBERS:', subs);

// EXTRA MODELS
console.log('\n🔍 OTHER ENGAGEMENT MODELS:');
for (const coll of ['comments', 'reactions', 'shares', 'contacts', 'leads', 'inquiries', 'ctaClicks', 'contactRequests', 'leadScores', 'visitors', 'articleReactions', 'articleComments']) {
  try {
    const r = await p.$runCommandRaw({ count: coll, query: { clientId: { $oid: cid } } });
    if (r.n > 0) console.log(`  ${coll}: ${r.n} ✓`);
  } catch (e) {}
}

// ARTICLES
const arts = await p.$runCommandRaw({
  find: 'articles',
  filter: { clientId: { $oid: cid } },
  projection: { title: 1, slug: 1, publishedAt: 1, status: 1, targetKeyword: 1, keyword: 1, viewsCount: 1 },
});
console.log('\n📄 ARTICLES:', arts.cursor?.firstBatch?.length);
for (const a of arts.cursor?.firstBatch ?? []) {
  console.log(`  · "${a.title}" [${a.status}] kw=${a.targetKeyword ?? a.keyword ?? '?'}`);
}

// DATE RANGE
const range = await p.$runCommandRaw({
  aggregate: 'analytics',
  pipeline: [
    { $match: { clientId: { $oid: cid } } },
    { $group: { _id: null, min: { $min: '$timestamp' }, max: { $max: '$timestamp' } } },
  ],
  cursor: {},
});
console.log('\n📅 ACTIVE DATE RANGE:');
console.log(JSON.stringify(range.cursor?.firstBatch, null, 2));

await p.$disconnect();
