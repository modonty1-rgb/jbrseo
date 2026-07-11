// Stage 3 · C-06 : pricingPage (title + description + h1 + intro)
import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const url = env.DATABASE_URL;
if ((url.match(/\.net\/([^?]+)/)?.[1]) !== 'modonty_dev') { console.error('SAFETY GUARD'); process.exit(1); }

const client = new MongoClient(url); await client.connect(); const db = client.db();

const before = await db.collection('LandingSection').findOne({ section: 'pricingPage' });
console.log('BEFORE:', JSON.stringify(before?.data, null, 2));

const res = await db.collection('LandingSection').updateOne(
  { section: 'pricingPage' },
  { $set: {
    'data.title':       'أسعار خدمات السيو في السعودية · اشتراك شهري من 110 ريال | JBRSEO',
    'data.description': 'اختر خطة اشتراك سيو شهري تناسب نشاطك — من الحضور إلى الريادة. جميع الخطط تشمل كتابة ونشر وتحسين للبحث والذكاء الاصطناعي.',
    'data.h1':          'خطط اشتراك السيو الشهري',
    'data.intro':       '٤ خطط شهرية بدون التزام طويل. الاشتراك السنوي = ٦ أشهر مجانية.',
    updatedAt: new Date(),
  } },
  { upsert: true },
);
console.log('\nmatched:', res.matchedCount, 'modified:', res.modifiedCount, 'upserted:', res.upsertedCount);

const after = await db.collection('LandingSection').findOne({ section: 'pricingPage' });
console.log('\nAFTER:', JSON.stringify(after?.data, null, 2));

await client.close();
