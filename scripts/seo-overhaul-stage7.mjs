// Stage 7 · I-12 : PriceSectionMeta ctaSubheadline (SA + EG) — remove hardcoded "+120"
import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const url = env.DATABASE_URL;
if ((url.match(/\.net\/([^?]+)/)?.[1]) !== 'modonty_dev') { console.error('SAFETY GUARD'); process.exit(1); }

const client = new MongoClient(url); await client.connect(); const db = client.db();

// SA
await db.collection('PriceSectionMeta').updateOne(
  { country: 'SA' },
  { $set: {
    'ctaHeadline': 'منافسك ينشر الحين — وأنت؟',
    'ctaSubheadline': '{clientCount} علامة تجارية سعودية وعربية اختارت العميل يجيها من البحث و ChatGPT — انضم لهم اليوم.',
    updatedAt: new Date(),
  } },
);

// EG
await db.collection('PriceSectionMeta').updateOne(
  { country: 'EG' },
  { $set: {
    'ctaHeadline': 'منافسك بينشر دلوقتي — وانت؟',
    'ctaSubheadline': '{clientCount} علامة تجارية عربية اختارت العميل ييجيلها من البحث و ChatGPT — انضم لهم النهارده.',
    updatedAt: new Date(),
  } },
);

const sa = await db.collection('PriceSectionMeta').findOne({ country: 'SA' });
const eg = await db.collection('PriceSectionMeta').findOne({ country: 'EG' });
console.log('SA.ctaSubheadline:', JSON.stringify(sa?.ctaSubheadline));
console.log('EG.ctaSubheadline:', JSON.stringify(eg?.ctaSubheadline));

await client.close();
