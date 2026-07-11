// Probe Modonty PROD DB for real client analytics data volume
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const prodUrl = env.MODONTY_PROD_DATABASE_URL;
if (!prodUrl || !prodUrl.includes('/modonty?')) { console.error('SAFETY: not prod URL'); process.exit(1); }
console.log('READ-ONLY probe of:', prodUrl.match(/\.net\/([^?]+)/)?.[1]);

const p = new PrismaClient({ datasourceUrl: prodUrl });

const analyticsCount = await p.$runCommandRaw({ count: 'analytics' });
console.log('Analytics records total:', analyticsCount.n);

const articleCount = await p.$runCommandRaw({ count: 'articles' });
console.log('Articles total:', articleCount.n);

const clientCount = await p.$runCommandRaw({ count: 'clients' });
console.log('Clients total:', clientCount.n);

// Top 5 clients by article count
const top = await p.$runCommandRaw({
  aggregate: 'articles',
  pipeline: [
    { $group: { _id: '$clientId', articles: { $sum: 1 } } },
    { $sort: { articles: -1 } },
    { $limit: 5 },
  ],
  cursor: {},
});
console.log('\nTop 5 clients by article count:');
console.log(JSON.stringify(top.cursor?.firstBatch, null, 2));

// Top 5 articles by analytics view count
const topArt = await p.$runCommandRaw({
  aggregate: 'analytics',
  pipeline: [
    { $group: { _id: '$articleId', views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $limit: 5 },
  ],
  cursor: {},
});
console.log('\nTop 5 articles by view count:');
console.log(JSON.stringify(topArt.cursor?.firstBatch, null, 2));

// Views last 30 days
const thirtyDaysAgo = new Date(Date.now() - 30 * 86400 * 1000);
const recentViews = await p.$runCommandRaw({
  count: 'analytics',
  query: { timestamp: { $gte: { $date: thirtyDaysAgo.toISOString() } } },
});
console.log('\nViews in last 30 days:', recentViews.n);

// Sample analytics record to see structure
const sample = await p.$runCommandRaw({
  find: 'analytics',
  limit: 2,
});
console.log('\nSample analytics record:');
console.log(JSON.stringify(sample.cursor?.firstBatch, null, 2));

await p.$disconnect();
