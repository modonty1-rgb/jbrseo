import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const p = new PrismaClient({ datasourceUrl: env.MODONTY_PROD_DATABASE_URL });
const target = await p.$runCommandRaw({
  find: 'clients',
  filter: { slug: 'عيادات-سمايل-تاون-لطب-الفم-و-الأسنان' },
});
const c = target.cursor?.firstBatch?.[0];
console.log(JSON.stringify({
  logoUrl: c.logoUrl,
  logo: c.logo,
  subdomain: c.subdomain,
  domain: c.domain,
  website: c.website,
  city: c.city,
  location: c.location,
  address: c.address,
}, null, 2));
await p.$disconnect();
