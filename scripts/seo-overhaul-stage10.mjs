// Stage 10 · I-15 : whyNow — add AI risk 4th cost
import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const url = env.DATABASE_URL;
if ((url.match(/\.net\/([^?]+)/)?.[1]) !== 'modonty_dev') { console.error('SAFETY GUARD'); process.exit(1); }

const client = new MongoClient(url); await client.connect(); const db = client.db();

const NEW_COSTS = [
  { month: 'الشهر ١', label: 'فرص ضائعة',
    desc: 'منافسك يكتب اليوم مقالاً يجاوب على سؤال عميلك — كل مقال ما كتبته هو باب فتحه غيرك قبلك',
    icon: '👥' },
  { month: 'الشهر ٣', label: 'تراكم التأخر',
    desc: 'جوجل يكافئ اللي بدأ قبلك — منافسك اللي بدأ قبل ٣ أشهر الحين يظهر فوقك بثلاثة أضعاف',
    icon: '📈' },
  { month: 'الشهر ٦', label: 'فجوة لا تُسد',
    desc: 'بعد ٦ أشهر تصبح الفجوة شبه مستحيلة أن تسدها — الأول في البحث يأخذ ٧١٪ من الضغطات',
    icon: '🏆' },
  { month: 'كل يوم', label: 'يذكر منافسك — لا أنت',
    desc: 'ChatGPT و Perplexity الحين يجاوبون على أسئلة عملائك — إذا محتواك مو حاضر، منافسك يذكرك مو',
    icon: '🤖' },
];

const res = await db.collection('LandingSection').updateOne(
  { section: 'whyNow' },
  { $set: {
    'data.title1': 'كل شهر تنتظر',
    'data.subtitle': 'التأخير يكلفك عملاء — في جوجل وفي الذكاء الاصطناعي',
    'data.costs': NEW_COSTS,
    updatedAt: new Date(),
  } },
);
console.log('matched:', res.matchedCount, 'modified:', res.modifiedCount);

const after = await db.collection('LandingSection').findOne({ section: 'whyNow' });
console.log('costs count:', after?.data?.costs?.length);
after?.data?.costs?.forEach((c, i) => console.log(`  ${i + 1}. ${c.month} · ${c.label}`));

await client.close();
