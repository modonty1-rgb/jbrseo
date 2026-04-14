import "server-only";
import { DEFAULT_OG_IMAGE_URL } from "./constants";

/**
 * Global root-layout SEO — fixed defaults only.
 * Per-country SEO (SA/EG) is handled independently in each country page via getLandingContent().
 * Do NOT read from LandingSection here — that would bleed one country's settings into the root.
 */
export async function getGlobalSeo() {
  return {
    title: "JBRSEO | خبراء السيو لنمو أعمالك",
    description:
      "مدونتي — منصة المحتوى العربي. مقالات تتصدر جوجل، صفحة شركتك في الشبكة، وقاعدة Leads مصنّفة — بدون كتابة حرف واحد.",
    ogImage: DEFAULT_OG_IMAGE_URL,
    canonical: "",
  };
}
