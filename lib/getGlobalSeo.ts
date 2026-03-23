import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { DEFAULT_OG_IMAGE_URL } from "./constants";

const DEFAULT_TITLE = "JBRSEO | خبراء السيو لنمو أعمالك";
const DEFAULT_DESCRIPTION =
  "مدونتي — منصة المحتوى العربي. مقالات تتصدر جوجل، صفحة شركتك في الشبكة، وقاعدة Leads مصنّفة — بدون كتابة حرف واحد.";

export const getGlobalSeo = unstable_cache(
  async () => {
    const row = await prisma.landingSection.findUnique({
      where: { country_section: { country: "SA", section: "seo" } },
    });
    const data = row?.data as Record<string, string> | null;
    return {
      title: data?.title?.trim() || DEFAULT_TITLE,
      description: data?.description?.trim() || DEFAULT_DESCRIPTION,
      ogImage: data?.ogImage?.trim() || DEFAULT_OG_IMAGE_URL,
      canonical: data?.canonical?.trim() ?? "",
    };
  },
  ["global-seo"],
  { revalidate: 3600, tags: ["global-seo"] },
);
