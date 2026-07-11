// Read current state via Prisma
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const url = env.DATABASE_URL;
if ((url.match(/\.net\/([^?]+)/)?.[1]) !== 'modonty_dev') { console.error('SAFETY GUARD — not dev'); process.exit(1); }
process.env.DATABASE_URL = url;

const p = new PrismaClient();

console.log('=== HERO ===');
console.log(JSON.stringify((await p.landingSection.findFirst({ where: { section: 'hero' } }))?.data, null, 2));

console.log('\n=== HOW IT WORKS ===');
console.log(JSON.stringify((await p.landingSection.findFirst({ where: { section: 'howItWorks' } }))?.data, null, 2));

console.log('\n=== WHY NOW ===');
console.log(JSON.stringify((await p.landingSection.findFirst({ where: { section: 'whyNow' } }))?.data, null, 2));

console.log('\n=== PLANS ===');
const plans = await p.plan.findMany({ orderBy: { displayOrder: 'asc' } });
for (const pl of plans) {
  console.log(`\n  ${pl.slug} · ${pl.name}`);
  console.log(`  highlights:`, JSON.stringify(pl.highlights, null, 4));
}

await p.$disconnect();
