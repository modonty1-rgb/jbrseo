// Stage 12 · L-17 : Entity signals for AEO — Vision 2030 · Mada · STC Pay
import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const url = env.DATABASE_URL;
if ((url.match(/\.net\/([^?]+)/)?.[1]) !== 'modonty_dev') { console.error('SAFETY GUARD'); process.exit(1); }

const client = new MongoClient(url); await client.connect(); const db = client.db();

// Update PriceSectionMeta.trustItems to include KSA payment entities (SA)
const saMeta = await db.collection('PriceSectionMeta').findOne({ country: 'SA' });
const newSATrustItems = [
  { icon: '🔒', label: 'دفع آمن — مدى + STC Pay' },
  { icon: '↩️', label: 'استرجاع كامل ١٤ يوم' },
  { icon: '💬', label: 'دعم عربي ١٠٠٪' },
  { icon: '🇸🇦', label: 'ضمن رؤية ٢٠٣٠' },
  { icon: '⚡', label: 'Uptime 99.9٪' },
];
await db.collection('PriceSectionMeta').updateOne(
  { country: 'SA' },
  { $set: { trustItems: newSATrustItems, updatedAt: new Date() } },
);

// Update SA footer to mention Mada + Vision 2030
const footerBefore = await db.collection('LandingSection').findOne({ section: 'footer' });
await db.collection('LandingSection').updateOne(
  { section: 'footer' },
  { $set: {
    'data.tagline': 'حضور في البحث والذكاء الاصطناعي',
    'data.desc': 'اشتراك محتوى سيو شهري للسوق السعودي والعربي — نكتب وننشر ونحسّن للبحث و ChatGPT. دفع آمن مدى · STC Pay · فيزا.',
    updatedAt: new Date(),
  } },
);
console.log('SA trustItems updated (Mada + STC Pay + Vision 2030)');
console.log('footer updated (Mada + STC Pay mention)');

await client.close();
