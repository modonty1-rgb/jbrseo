import fs from "fs";
import path from "path";

const root = path.resolve("app");

function transform(content) {
  let result = "";
  let i = 0;
  while (i < content.length) {
    const idx = content.indexOf("<input", i);
    if (idx === -1) {
      result += content.slice(i);
      break;
    }
    result += content.slice(i, idx);
    const rest = content.slice(idx);
    const m = rest.match(/^<input[\s\S]*?\/>/);
    if (!m) {
      result += rest.slice(0, 6);
      i = idx + 6;
      continue;
    }
    const tag = m[0];
    const isHidden = /\btype\s*=\s*["']hidden["']/.test(tag);
    const isFile = /\btype\s*=\s*["']file["']/.test(tag);
    if (isHidden || isFile) {
      result += tag;
    } else {
      result += tag.replace("<input", "<Input");
    }
    i = idx + tag.length;
  }
  return result;
}

function ensureInputImport(filePath, content) {
  if (!content.includes("<Input")) return content;
  if (content.includes('@/app/components/ui/input"') || content.includes("@/app/components/ui/input'")) {
    return content;
  }
  const lines = content.split("\n");
  const useClientIdx = lines.findIndex((l) => l.includes('"use client"'));
  const insertAt = useClientIdx >= 0 ? useClientIdx + 1 : 0;
  const importLine = 'import { Input } from "@/app/components/ui/input";';
  if (lines.some((l) => l.includes(importLine))) return content;
  lines.splice(insertAt, 0, importLine);
  return lines.join("\n");
}

function walk(dir, acc) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === "ui") continue;
      walk(p, acc);
    } else if (name.name.endsWith(".tsx")) {
      acc.push(p);
    }
  }
}

const files = [];
walk(root, files);

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  if (!content.includes("<input")) continue;
  const next = ensureInputImport(file, transform(content));
  if (next !== content) {
    fs.writeFileSync(file, next);
    console.log("updated", path.relative(process.cwd(), file));
  }
}
