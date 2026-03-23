export const PRICING_CTA_LINK = "/signup";

export const SITE_LOGO_URL =
  "https://res.cloudinary.com/dfegnpgwx/image/upload/f_auto,q_auto/v1771973886/jbrser_svg_ikxmnn.svg";

/** Modonty wordmark — same asset as footer `https://modonty.com` link. */
export const MODONTY_LOGO_URL =
  "https://res.cloudinary.com/dfegnpgwx/image/upload/v1769683590/modontyLogo_ftf4yf.png";

/**
 * Default Open Graph / Twitter image when CMS `seo.ogImage` is empty.
 * Cloudinary CDN (`f_auto,q_auto`) — no local disk, no DB read in root layout.
 */
export const DEFAULT_OG_IMAGE_URL = SITE_LOGO_URL;

const FAVICON_BASE =
  "https://res.cloudinary.com/dfegnpgwx/image/upload/f_auto,q_auto/v1773533817/favicon_uzm7lz.webp";

export const FAVICON_URLS = {
  icon32: FAVICON_BASE.replace("q_auto/v", "q_auto,w_32,h_32,c_fit/v"),
  apple180: FAVICON_BASE.replace("q_auto/v", "q_auto,w_180,h_180,c_fit/v"),
  any: FAVICON_BASE,
} as const;
