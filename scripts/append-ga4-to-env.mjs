// Append GA4 secrets to .env.local (idempotent — skip if already present)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const secrets = JSON.parse(readFileSync('scripts/.ga4-secrets.json', 'utf8'));
const envPath = '.env.local';
let content = existsSync(envPath) ? readFileSync(envPath, 'utf8') : '';
const keys = ['GA4_PROPERTY_ID', 'GA4_CLIENT_EMAIL', 'GA4_PRIVATE_KEY_BASE64'];
const toAdd = [];
for (const k of keys) {
  if (new RegExp(`^${k}=`, 'm').test(content)) continue;
  const v = secrets[k];
  if (!v) continue;
  toAdd.push(`${k}="${v}"`);
}
if (toAdd.length) {
  if (!content.endsWith('\n')) content += '\n';
  content += '\n# GA4 (fetched from Vercel Shared Env — 2026-07-10)\n';
  content += toAdd.join('\n') + '\n';
  writeFileSync(envPath, content);
  console.log(`✅ appended ${toAdd.length} keys to .env.local`);
} else {
  console.log('all GA4 keys already present — nothing to add');
}
