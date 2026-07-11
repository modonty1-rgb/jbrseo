#!/usr/bin/env node
/**
 * Real Google Autocomplete for Saudi Arabia (Arabic).
 * Hits the public suggest endpoint with gl=sa & hl=ar.
 * Output: scripts/research/autocomplete-sa.json
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, "research");
mkdirSync(outDir, { recursive: true });

const SEEDS = [
  "شركة سيو",
  "افضل شركة سيو",
  "افضل شركة seo",
  "خدمات سيو",
  "سعر سيو",
  "كم يكلف سيو",
  "كم سعر خدمة سيو",
  "هل السيو",
  "متى تظهر نتائج سيو",
  "سيو 2026",
  "سيو الرياض",
  "سيو جدة",
  "seo السعودية",
  "seo قوقل",
  "شركة seo في السعودية",
  "كيف اظهر في قوقل",
  "كيف اتصدر جوجل",
  "تحسين محركات البحث",
  "سيو مقابل اعلانات",
  "chatgpt seo",
  "AEO",
  "سيو للعيادات",
  "سيو للمتاجر",
  "سيو للمطاعم",
  "اشتراك سيو شهري",
  "ما هو السيو",
  "الفرق بين سيو",
  "هل السيو انتهى",
  "هل السيو مضمون",
];

async function suggest(q) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=ar&gl=sa&q=${encodeURIComponent(q)}`;
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) return { seed: q, error: `HTTP ${r.status}` };
    const j = await r.json();
    return { seed: q, suggestions: j[1] || [] };
  } catch (e) {
    return { seed: q, error: String(e) };
  }
}

async function main() {
  const results = [];
  for (const s of SEEDS) {
    const r = await suggest(s);
    results.push(r);
    console.log(`✓ ${s} → ${r.suggestions?.length ?? 0} suggestions`);
    await new Promise((res) => setTimeout(res, 200)); // gentle
  }
  const outPath = path.join(outDir, "autocomplete-sa.json");
  writeFileSync(outPath, JSON.stringify(results, null, 2), "utf8");

  const flat = new Set();
  for (const r of results) for (const s of r.suggestions || []) flat.add(s);
  const flatPath = path.join(outDir, "autocomplete-sa.flat.txt");
  writeFileSync(flatPath, [...flat].sort().join("\n"), "utf8");

  console.log(`\n✅ Wrote ${outPath}`);
  console.log(`✅ Wrote ${flatPath} (${flat.size} unique suggestions)`);
}
main();
