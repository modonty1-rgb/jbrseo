import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET(): Promise<Response> {
  const htmlPath = join(
    process.cwd(),
    "public",
    "html",
    "modonty-marketing-plan-v1.html",
  );
  const html = await readFile(htmlPath, "utf-8");

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
