import { NextResponse } from "next/server";
import { getCountryBreakdown } from "@/lib/analytics";

export async function GET() {
  const data = await getCountryBreakdown();
  return NextResponse.json(data);
}
