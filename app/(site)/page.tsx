import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";

export default async function SiteRootPage() {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const slug = country === "EG" ? "eg" : "sa";
  redirect(`/${slug}`);
}
