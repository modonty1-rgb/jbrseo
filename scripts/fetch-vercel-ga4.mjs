// Pull GA4 creds from Vercel Shared Env Vars (paginate full list)
const TOKEN = process.env.VERCEL_TOKEN;
if (!TOKEN) { console.error('VERCEL_TOKEN missing in env'); process.exit(1); }

// Discover team by listing projects (first team we see)
const projRes = await fetch('https://api.vercel.com/v9/projects?limit=1', {
  headers: { Authorization: `Bearer ${TOKEN}` },
});
const projData = await projRes.json();
if (!projRes.ok) { console.error('projects list error:', projData); process.exit(1); }
const teamId = projData.projects?.[0]?.accountId;
console.log('teamId:', teamId);

// Paginate shared env vars (25 per page)
const wanted = new Set(['GA4_PROPERTY_ID', 'GA4_CLIENT_EMAIL', 'GA4_PRIVATE_KEY_BASE64', 'GA4_PRIVATE_KEY']);
const found = {};
let cursor = null; let page = 0;
do {
  page++;
  const qs = new URLSearchParams({ teamId });
  if (cursor) qs.set('until', cursor);
  const r = await fetch(`https://api.vercel.com/v1/env?${qs}`, { headers: { Authorization: `Bearer ${TOKEN}` } });
  const j = await r.json();
  if (!r.ok) { console.error('env fetch error:', j); process.exit(1); }
  const envs = j.envs ?? j.data ?? [];
  console.log(`page ${page}: ${envs.length} vars`);
  for (const e of envs) {
    if (wanted.has(e.key)) {
      found[e.key] = { id: e.id, hasValue: !!e.value, valueLen: e.value?.length ?? 0, decrypted: !!e.value };
      if (e.value) found[e.key].value = e.value;
    }
  }
  cursor = j.pagination?.next;
} while (cursor);

console.log('\n=== FOUND ===');
for (const k of Object.keys(found)) {
  const f = found[k];
  console.log(`${k}: id=${f.id} · len=${f.valueLen} · decrypted=${f.decrypted}`);
}

// If values weren't decrypted in list, fetch each by ID
for (const [key, meta] of Object.entries(found)) {
  if (meta.decrypted) continue;
  const r = await fetch(`https://api.vercel.com/v1/env/${meta.id}?teamId=${teamId}&decrypt=true`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const j = await r.json();
  if (r.ok) { found[key].value = j.value; found[key].decrypted = true; found[key].valueLen = j.value?.length ?? 0; }
  else console.error(`decrypt ${key} error:`, j);
}

// Write to a local file for reuse (gitignored path — scratchpad)
import { writeFileSync } from 'node:fs';
writeFileSync('scripts/.ga4-secrets.json', JSON.stringify(
  Object.fromEntries(Object.entries(found).map(([k, v]) => [k, v.value])),
  null, 2,
));
console.log('\nSaved decrypted creds to: scripts/.ga4-secrets.json');
console.log('Missing:', [...wanted].filter(k => !found[k]));
