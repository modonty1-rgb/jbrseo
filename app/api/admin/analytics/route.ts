import { type NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/app/actions/auth";
import { getAllAnalyticsData, getCountryBreakdown, getTopEvents } from "@/lib/analytics";

const VALID_DAYS = [7, 14, 30, 60, 90] as const;
type ValidDays = (typeof VALID_DAYS)[number];

function parseDays(raw: string | null): ValidDays {
  const n = Number(raw);
  return (VALID_DAYS.includes(n as ValidDays) ? n : 7) as ValidDays;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const days = parseDays(req.nextUrl.searchParams.get("days"));

  try {
    const [analyticsData, countryBreakdown, topEvents] = await Promise.all([
      getAllAnalyticsData(days),
      getCountryBreakdown(days),
      getTopEvents(days),
    ]);

    return NextResponse.json({
      ...analyticsData,
      countryBreakdown,
      topEvents,
    });
  } catch {
    return NextResponse.json({ error: "Analytics fetch failed" }, { status: 500 });
  }
}
