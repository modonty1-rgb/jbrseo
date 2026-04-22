import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const ALLOWED = new Set(["snb", "cib"]);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const base = name.replace(/\.svg$/i, "");

  if (!ALLOWED.has(base)) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "logos", `${base}.svg`);
    const content = await readFile(filePath);
    return new NextResponse(content, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
