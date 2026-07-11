// READ-ONLY: find current stored ctaLabel in jbrseo's own DB
import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => {
      const [k, ...rest] = l.split('=');
      return [k.trim(), rest.join('=').trim().replace(/^"|"$/g, '')];
    })
);

const url = env.DATABASE_URL;
console.log('Target:', url.match(/\.net\/([^?]+)/)?.[1]);

const client = new MongoClient(url);
await client.connect();
const db = client.db();

const rows = await db.collection('LandingSection').find({ section: 'ctaLabel' }).toArray();
console.log(`Found ${rows.length} ctaLabel documents:\n`);
for (const r of rows) {
  console.log('  data:', JSON.stringify(r.data));
  console.log('  updatedAt:', r.updatedAt);
  console.log('  _id:', r._id.toString());
  console.log('');
}

await client.close();
