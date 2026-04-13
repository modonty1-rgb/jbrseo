"use server";

import { isAdmin } from "@/app/actions/auth";
import { getAllAnalyticsData, getCountryBreakdown, getTopEvents, getTrafficSources, getRealtimeUsers } from "@/lib/analytics";

const VALID_DAYS = [7, 14, 30, 60, 90] as const;
type ValidDays = (typeof VALID_DAYS)[number];

function parseDays(days: number): ValidDays {
  return (VALID_DAYS.includes(days as ValidDays) ? days : 7) as ValidDays;
}

export async function fetchAnalyticsAction(rawDays: number) {
  const admin = await isAdmin();
  if (!admin) throw new Error("Unauthorized");

  const days = parseDays(rawDays);

  const [analyticsData, countryBreakdown, topEvents, trafficSources] = await Promise.all([
    getAllAnalyticsData(days),
    getCountryBreakdown(days),
    getTopEvents(days),
    getTrafficSources(days),
  ]);

  return { ...analyticsData, countryBreakdown, topEvents, trafficSources };
}

export async function getRealtimeUsersAction(): Promise<number> {
  const admin = await isAdmin();
  if (!admin) throw new Error("Unauthorized");
  return getRealtimeUsers();
}
