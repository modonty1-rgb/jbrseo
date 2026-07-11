// Update hero.sub to lead with the strongest real proof (31 bookings)
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const url = env.DATABASE_URL;
if ((url.match(/\.net\/([^?]+)/)?.[1]) !== 'modonty_dev') { console.error('SAFETY GUARD'); process.exit(1); }
process.env.DATABASE_URL = url;
const p = new PrismaClient();

const hero = await p.landingSection.findFirst({ where: { section: 'hero' } });
const newData = {
  ...hero.data,
  sub: 'عيادة سمايل تاون · ٣١ مريض حقيقي حجز موعد في ٩٠ يوم — بدون ريال إعلانات. اشتراك محتوى شهري يشتغل، وأنت تستقبل عملاء جاهزين.',
};
await p.landingSection.update({ where: { id: hero.id }, data: { data: newData, updatedAt: new Date() } });
console.log('✅ hero.sub → 31 مريض حجز حقيقي');
await p.$disconnect();
