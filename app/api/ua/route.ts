import { NextResponse } from "next/server";

/**
 * TEMP diagnostic — echoes the requesting browser's User-Agent.
 * Used to identify the exact Chromium/WebView build on Khalid's phone
 * (rendering corruption investigation 2026-07-14). DELETE after diagnosis.
 */
export async function GET(req: Request) {
  const ua = req.headers.get("user-agent") ?? "unknown";
  console.log("[UA-DIAG]", ua);
  const chromeMatch = ua.match(/Chrom(?:e|ium)\/(\d+)/);
  const wv = ua.includes("; wv)") ? "YES (in-app WebView)" : "no";
  return new NextResponse(
    `<!doctype html><html dir="rtl"><body style="font-family:monospace;padding:20px;background:#111;color:#0f0">
      <h2>تشخيص المتصفح</h2>
      <p style="font-size:20px">Chromium version: <b>${chromeMatch?.[1] ?? "؟؟"}</b></p>
      <p style="font-size:20px">WebView داخل تطبيق: <b>${wv}</b></p>
      <p style="word-break:break-all;color:#888;font-size:12px">${ua}</p>
    </body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
