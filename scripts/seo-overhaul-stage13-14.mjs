// Stage 13+14 · L-20 delete legacy pricing section · L-19 update about copy
import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const url = env.DATABASE_URL;
if ((url.match(/\.net\/([^?]+)/)?.[1]) !== 'modonty_dev') { console.error('SAFETY GUARD'); process.exit(1); }

const client = new MongoClient(url); await client.connect(); const db = client.db();

// L-20: Delete legacy 'pricing' section from LandingSection (duplicated with Plan model)
const legacyPricing = await db.collection('LandingSection').findOne({ section: 'pricing' });
if (legacyPricing) {
  const del = await db.collection('LandingSection').deleteOne({ section: 'pricing' });
  console.log('L-20 legacy pricing deleted:', del.deletedCount);
} else {
  console.log('L-20 legacy pricing already gone');
}

// L-19: About page — update key SEO fields (hero + values-driven copy)
const about = await db.collection('LandingSection').findOne({ section: 'about' });
if (about) {
  const beforeMission = about?.data?.mission?.body;
  console.log('L-19 about.mission.body was:', JSON.stringify(beforeMission?.slice(0, 60)));

  await db.collection('LandingSection').updateOne(
    { section: 'about' },
    { $set: {
      'data.mission.title': 'من نحن',
      'data.mission.body': 'JBRSEO شركة سعودية متخصّصة في محتوى السيو للسوق السعودي والعربي. نساعد الشركات والمتاجر والعيادات على بناء حضور مستدام في محركات البحث (جوجل · Bing) والذكاء الاصطناعي (ChatGPT · Perplexity · Gemini) — عبر اشتراك محتوى شهري يشمل الكتابة والنشر والتحسين التقني.',
      'data.mission.taglineOne': 'ضمن رؤية ٢٠٣٠',
      'data.mission.taglineTwo': 'محتوى للبحث والذكاء الاصطناعي',
      updatedAt: new Date(),
    } },
  );
  const afterM = await db.collection('LandingSection').findOne({ section: 'about' });
  console.log('L-19 after mission.body:', JSON.stringify(afterM?.data?.mission?.body?.slice(0, 60)));
} else {
  console.log('L-19 about section not found — skipped');
}

await client.close();
