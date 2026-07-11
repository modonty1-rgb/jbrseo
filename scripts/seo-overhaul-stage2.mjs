// Stage 2 · C-03 + C-04 + C-05 : Hero (h1Line1 + h1Line2 + sub + proof)
import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const url = env.DATABASE_URL;
if ((url.match(/\.net\/([^?]+)/)?.[1]) !== 'modonty_dev') { console.error('SAFETY GUARD: modonty_dev only'); process.exit(1); }

const client = new MongoClient(url); await client.connect(); const db = client.db();

const before = await db.collection('LandingSection').findOne({ section: 'hero' });
console.log('BEFORE:');
console.log('  h1Line1:', JSON.stringify(before?.data?.h1Line1));
console.log('  h1Line2:', JSON.stringify(before?.data?.h1Line2));
console.log('  sub:    ', JSON.stringify(before?.data?.sub));
console.log('  proof:  ', JSON.stringify(before?.data?.proof));

const res = await db.collection('LandingSection').updateOne(
  { section: 'hero' },
  { $set: {
    'data.h1Line1': 'شركاء سعوديون في البحث والذكاء الاصطناعي',
    'data.h1Line2': 'اشتراك محتوى شهري · بدون إعلانات · بدون فريق داخلي',
    'data.sub':     'فريق سعودي يكتب وينشر ويحسّن محتواك للبحث و ChatGPT و Perplexity — أنت تركّز على البيع.',
    'data.proof':   '{clientCount} علامة تجارية سعودية تنمو معنا — امتى دورك؟',
    updatedAt: new Date(),
  } },
);
console.log('\nmatched:', res.matchedCount, 'modified:', res.modifiedCount);

const after = await db.collection('LandingSection').findOne({ section: 'hero' });
console.log('\nAFTER:');
console.log('  h1Line1:', JSON.stringify(after?.data?.h1Line1));
console.log('  h1Line2:', JSON.stringify(after?.data?.h1Line2));
console.log('  sub:    ', JSON.stringify(after?.data?.sub));
console.log('  proof:  ', JSON.stringify(after?.data?.proof));

await client.close();
