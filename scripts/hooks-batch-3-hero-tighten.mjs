// Tighten hero.sub — remove the redundant "customers ready" line since 31 bookings already covers it
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const url = env.DATABASE_URL;
if ((url.match(/\.net\/([^?]+)/)?.[1]) !== 'modonty_dev') { console.error('SAFETY GUARD'); process.exit(1); }
process.env.DATABASE_URL = url;
const p = new PrismaClient();

const hero = await p.landingSection.findFirst({ where: { section: 'hero' } });
const oldSub = hero.data.sub;
const newSub = 'عيادة سمايل تاون · ٣١ مريض حقيقي حجز موعد في ٩٠ يوم — بدون ريال إعلانات. شوف الأرقام لايف من Google Analytics تحت.';

console.log('BEFORE:', oldSub);
console.log('AFTER :', newSub);

await p.landingSection.update({
  where: { id: hero.id },
  data: { data: { ...hero.data, sub: newSub }, updatedAt: new Date() },
});
console.log('\n✅ hero.sub tightened');
await p.$disconnect();
