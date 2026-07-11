// Stage 6 · C-11 : socialProof.subtitle (remove startup framing)
import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const url = env.DATABASE_URL;
if ((url.match(/\.net\/([^?]+)/)?.[1]) !== 'modonty_dev') { console.error('SAFETY GUARD'); process.exit(1); }

const client = new MongoClient(url); await client.connect(); const db = client.db();

const before = await db.collection('LandingSection').findOne({ section: 'socialProof' });
console.log('BEFORE:');
console.log('  eyebrow: ', JSON.stringify(before?.data?.eyebrow));
console.log('  title:   ', JSON.stringify(before?.data?.title));
console.log('  subtitle:', JSON.stringify(before?.data?.subtitle));

const res = await db.collection('LandingSection').updateOne(
  { section: 'socialProof' },
  { $set: {
    'data.eyebrow':  'شهادات العملاء',
    'data.title':    'أصوات حقيقية من عملائنا',
    'data.subtitle': 'تجارب حقيقية من علامات تجارية سعودية وعربية اختارت الاستثمار في محتوى السيو معنا',
    updatedAt: new Date(),
  } },
);
console.log('\nmatched:', res.matchedCount, 'modified:', res.modifiedCount);

const after = await db.collection('LandingSection').findOne({ section: 'socialProof' });
console.log('\nAFTER:');
console.log('  eyebrow: ', JSON.stringify(after?.data?.eyebrow));
console.log('  title:   ', JSON.stringify(after?.data?.title));
console.log('  subtitle:', JSON.stringify(after?.data?.subtitle));

await client.close();
