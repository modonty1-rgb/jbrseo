// howItWorks · 3 steps — SEO-strong + AI mention + fixed typo
import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const url = env.DATABASE_URL;
if ((url.match(/\.net\/([^?]+)/)?.[1]) !== 'modonty_dev') { console.error('SAFETY GUARD'); process.exit(1); }

const client = new MongoClient(url); await client.connect(); const db = client.db();

const NEW_STEPS = [
  { num: '01',
    title: 'اختر باقتك في دقيقة',
    line: 'من ١ إلى ١٢ مقال سيو شهرياً — كل باقة تشمل الكتابة والنشر والتحسين للبحث والذكاء الاصطناعي (جوجل · ChatGPT · Perplexity).' },
  { num: '02',
    title: 'استمارة سريعة — مرة واحدة',
    line: 'نتعرّف على نشاطك وعملائك المستهدفين في ١٠ دقائق فقط — بعدها ما تحتاج تشيل هم شي، فريقنا يتكفل بكل حاجة.' },
  { num: '03',
    title: 'استلم محتواك شهرياً',
    line: 'محتوى سيو احترافي جاهز على مدونتك + قنواتنا — تراجع، توافق بضغطة، ونحن ننشر ونتابع أداءك في البحث والـ AI.' },
];

const before = await db.collection('LandingSection').findOne({ section: 'howItWorks' });
console.log('BEFORE steps:');
(before?.data?.steps ?? []).forEach(s => console.log(`  ${s.num}. ${s.title}`));

const res = await db.collection('LandingSection').updateOne(
  { section: 'howItWorks' },
  { $set: { 'data.steps': NEW_STEPS, updatedAt: new Date() } },
);
console.log('\nmatched:', res.matchedCount, 'modified:', res.modifiedCount);

const after = await db.collection('LandingSection').findOne({ section: 'howItWorks' });
console.log('\nAFTER steps:');
after?.data?.steps?.forEach(s => console.log(`  ${s.num}. ${s.title}\n     ${s.line}`));

await client.close();
