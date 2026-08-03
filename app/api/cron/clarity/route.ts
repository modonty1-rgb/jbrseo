import { NextResponse } from "next/server";
import { syncClarityDaily } from "@/lib/clarity/syncDaily";

// Prisma + external fetch → Node runtime, never cached, always dynamic.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Daily Clarity sync — triggered by Vercel Cron (see vercel.json, 00:00 UTC =
 * 03:00 Riyadh). Vercel attaches `Authorization: Bearer <CRON_SECRET>` to cron
 * invocations; we reject anything else so the endpoint can't be pulled manually
 * to burn the day's few Clarity calls.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await syncClarityDaily();
  const httpStatus = result.status === "failed" ? 502 : 200;
  return NextResponse.json(result, { status: httpStatus });
}
