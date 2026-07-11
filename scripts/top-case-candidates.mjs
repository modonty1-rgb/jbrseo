// Deep probe of top external clients for case-study slider
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const p = new PrismaClient({ datasourceUrl: env.MODONTY_PROD_DATABASE_URL });

const targets = ['كيما-زون', 'متجر-باقتك', 'عيادات-سمايل-تاون-لطب-الفم-و-الأسنان'];

for (const slug of targets) {
  const cRes = await p.$runCommandRaw({ find: 'clients', filter: { slug } });
  const c = cRes.cursor?.firstBatch?.[0];
  if (!c) { console.log(`SKIP: ${slug}`); continue; }
  const cid = c._id;
  console.log(`\n════ ${c.name} ════`);
  console.log(`  slug: ${slug} · created: ${c.createdAt?.$date?.slice(0,10)}`);

  // Views + sessions + engagement
  const agg = await p.$runCommandRaw({
    aggregate: 'analytics',
    pipeline: [
      { $match: { clientId: cid } },
      { $group: {
        _id: null, views: { $sum: 1 },
        engaged: { $sum: { $cond: [{ $eq: ['$bounced', false] }, 1, 0] } },
        avgTime: { $avg: '$timeOnPage' },
        avgScroll: { $avg: '$scrollDepth' },
        sessions: { $addToSet: '$sessionId' },
        minDate: { $min: '$timestamp' },
        maxDate: { $max: '$timestamp' },
      } },
    ],
    cursor: {},
  });
  const s = agg.cursor?.firstBatch?.[0];
  console.log(`  📊 views: ${s.views} · unique: ${s.sessions.length} · engaged: ${Math.round(s.engaged/s.views*100)}%`);
  console.log(`  ⏱ avgTime: ${Math.round(s.avgTime)}s · scroll: ${Math.round(s.avgScroll)}%`);
  console.log(`  📅 ${s.minDate?.$date?.slice(0,10)} → ${s.maxDate?.$date?.slice(0,10)}`);

  // Articles list
  const arts = await p.$runCommandRaw({
    find: 'articles',
    filter: { clientId: cid, status: 'PUBLISHED' },
    projection: { title: 1, targetKeyword: 1, keyword: 1, publishedAt: 1 },
  });
  console.log(`  📄 published articles:`);
  for (const a of arts.cursor?.firstBatch ?? []) {
    console.log(`     · "${a.title}" kw=${a.targetKeyword ?? a.keyword ?? '?'}`);
  }

  // Traffic sources
  const src = await p.$runCommandRaw({
    aggregate: 'analytics',
    pipeline: [
      { $match: { clientId: cid } },
      { $group: { _id: '$source', c: { $sum: 1 } } },
      { $sort: { c: -1 } },
    ],
    cursor: {},
  });
  console.log(`  🌐 sources:`);
  for (const x of src.cursor?.firstBatch ?? []) console.log(`     ${x._id}: ${x.c}`);

  // Shares + subs
  const shares = (await p.$runCommandRaw({ count: 'shares', query: { clientId: cid } })).n;
  const subs = (await p.$runCommandRaw({ count: 'subscribers', query: { clientId: cid } })).n;
  console.log(`  🔗 shares: ${shares} · 📧 subs: ${subs}`);
}

await p.$disconnect();
