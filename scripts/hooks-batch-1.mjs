// Hooks batch 1: howItWorks Step 03 · hero.sub · whyNow (full replacement)
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const url = env.DATABASE_URL;
if ((url.match(/\.net\/([^?]+)/)?.[1]) !== 'modonty_dev') { console.error('SAFETY GUARD — not dev'); process.exit(1); }
process.env.DATABASE_URL = url;

const p = new PrismaClient();

// ── 1. howItWorks · Step 03 : mention 28 QC checks (H6) ──
const how = await p.landingSection.findFirst({ where: { section: 'howItWorks' } });
const newSteps = [
  how.data.steps[0],
  how.data.steps[1],
  {
    num: '03',
    title: 'محتواك يمرّ على ٢٨ فحصاً — قبل ما يوصلك',
    line: 'كل مقال يعبر ٢٨ فحصاً تلقائياً (سيو · قراءة · روابط · صور · Schema) — تراجع بضغطة، وننشر ونتابع أداءك في البحث والذكاء الاصطناعي.',
  },
];
await p.landingSection.update({ where: { id: how.id }, data: { data: { ...how.data, steps: newSteps }, updatedAt: new Date() } });
console.log('✅ 1. howItWorks · Step 03 → ٢٨ فحصاً');

// ── 2. hero.sub : four-pillar value line (H1 + H4 + H8) ──
const hero = await p.landingSection.findFirst({ where: { section: 'hero' } });
const newHeroData = {
  ...hero.data,
  sub: 'اشتراك واحد يشمل: محتوى SEO احترافي · موقع مصغّر كامل · نظام تقييم زوّار HOT/WARM/COLD · تنبيهات تليجرام فورية — فريقنا يشتغل، أنت تركّز على البيع.',
};
await p.landingSection.update({ where: { id: hero.id }, data: { data: newHeroData, updatedAt: new Date() } });
console.log('✅ 2. hero.sub → ٤ قيم حقيقية');

// ── 3. whyNow : full replacement to outcomes (H1 + H2 + H3 + H7) ──
const why = await p.landingSection.findFirst({ where: { section: 'whyNow' } });
const newWhyData = {
  title1: 'مش مجرد ترتيب — نتائج تشوفها',
  subtitle: 'اشتراك مدونتي يعطيك ٤ قيم تقيسها بصريّاً كل يوم — من داخل لوحتك.',
  costs: [
    {
      month: '🔥 الزوّار',
      label: 'سكور HOT / WARM / COLD',
      desc: 'كل زائر يحصل سكور ٠-١٠٠ تلقائياً — تعرف الجاهز للشراء قبل ما يتصل بك، ولا تضيع وقتك على البارد.',
      icon: '🎯',
    },
    {
      month: '📊 التحليل',
      label: 'GA4 مباشر داخل لوحتك',
      desc: 'من داخل موقعك الآن، من أي بلد، وأي مقال جالب أعلى تحويل — بدون فتح جوجل تحليلات.',
      icon: '📈',
    },
    {
      month: '💚 الصحة',
      label: 'Site Health A+ يومي',
      desc: 'فحص تلقائي كل يوم: SSL · DNS · سرعة · Core Web Vitals — درجة A+ محفوظة، نبّهك قبل ما يتأثر ترتيبك.',
      icon: '🛡️',
    },
    {
      month: '⭐ الثقة',
      label: 'نجوم مقيّمة في جوجل',
      desc: 'AggregateRating (Schema.org) تحت اسم نشاطك في نتائج البحث — ثقة من أول نظرة، قبل ما يضغط.',
      icon: '⭐',
    },
  ],
};
await p.landingSection.update({ where: { id: why.id }, data: { data: newWhyData, updatedAt: new Date() } });
console.log('✅ 3. whyNow → outcomes (Leads · GA4 · Health · Reviews)');

console.log('\n🎉 Batch 1 done. Refresh /sa on the browser.');
await p.$disconnect();
