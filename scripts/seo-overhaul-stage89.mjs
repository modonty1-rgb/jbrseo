// Stage 8+9 · I-13 outcomes stat softened + I-14 Plan taglines/hooks SEO-optimized
import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const url = env.DATABASE_URL;
if ((url.match(/\.net\/([^?]+)/)?.[1]) !== 'modonty_dev') { console.error('SAFETY GUARD'); process.exit(1); }

const client = new MongoClient(url); await client.connect(); const db = client.db();

// ─── I-13: outcomes — soften hardcoded "+3700%" to a factual claim ─────────
const beforeO = await db.collection('LandingSection').findOne({ section: 'outcomes' });
const outcomesData = beforeO?.data ?? {};
const newOutcomes = (outcomesData.outcomes ?? []).map((o, i) => {
  if (i === 0) return { ...o, metric: 'نمو عضوي', title: 'زيارات عضوية متسارعة',
    line: 'محتوى محسّن للبحث والذكاء الاصطناعي يجلب زوار مهتمين بما تقدمه — بدون إعلانات.' };
  return o;
});
await db.collection('LandingSection').updateOne(
  { section: 'outcomes' },
  { $set: { 'data.outcomes': newOutcomes, 'data.title': 'ماذا يحدث لنشاطك خلال ٩٠ يوماً؟', updatedAt: new Date() } },
);
console.log('outcomes[0].metric was:', beforeO?.data?.outcomes?.[0]?.metric, '→', newOutcomes[0]?.metric);

// ─── I-14: Plan taglines + hooks — SEO-friendly per plan ───────────────────
const PLAN_UPDATES = [
  // SA
  { country: 'SA', slug: 'presence',
    tagline: 'أرخص باقة اشتراك سيو شهري — للبحث والذكاء الاصطناعي',
    hook: 'اشتراك محتوى شهري بأقل تكلفة — بدون التزام طويل' },
  { country: 'SA', slug: 'starter',
    tagline: '٤ مقالات سيو احترافية شهرياً — للبحث و ChatGPT',
    hook: 'نكتب وننشر — العميل السعودي يجيك من البحث لحاله' },
  { country: 'SA', slug: 'growth',
    tagline: 'اشتراك محتوى شامل — للبحث والذكاء الاصطناعي',
    hook: 'نعرّفك على العميل الجاهز للشراء قبل غيرك' },
  { country: 'SA', slug: 'scale',
    tagline: 'باقة الريادة — فريق سيو متكامل للأنشطة الكبرى',
    hook: 'فريق متفرّغ يشتغل معاك — أنت تركّز على البيع' },
  // EG
  { country: 'EG', slug: 'presence',
    tagline: 'أرخص باقة اشتراك سيو شهري — للبحث والذكاء الاصطناعي',
    hook: 'اشتراك محتوى شهري بأقل تكلفة — من غير التزام طويل' },
  { country: 'EG', slug: 'starter',
    tagline: '٤ مقالات سيو احترافية شهرياً — للبحث و ChatGPT',
    hook: 'إحنا بنكتب وبننشر — العميل ييجيلك من البحث لوحده' },
  { country: 'EG', slug: 'growth',
    tagline: 'اشتراك محتوى شامل — للبحث والذكاء الاصطناعي',
    hook: 'بنعرّفك على العميل الجاهز للشراء قبل غيرك' },
  { country: 'EG', slug: 'scale',
    tagline: 'باقة الريادة — فريق سيو متكامل للأنشطة الكبرى',
    hook: 'فريق متفرّغ بيشتغل معاك — انت بتركّز على البيع' },
];

for (const p of PLAN_UPDATES) {
  await db.collection('Plan').updateOne(
    { country: p.country, slug: p.slug },
    { $set: { tagline: p.tagline, hook: p.hook, updatedAt: new Date() } },
  );
}
console.log(`updated ${PLAN_UPDATES.length} plans`);

await client.close();
