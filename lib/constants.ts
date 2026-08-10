export const PRICING_CTA_LINK = "/checkout";

export const SITE_LOGO_URL =
  "https://res.cloudinary.com/dfegnpgwx/image/upload/f_auto,q_auto/v1771973886/jbrser_svg_ikxmnn.svg";

/**
 * Modonty wordmark — proper rectangular asset (M + "odonty" text).
 * We strip transparent padding via `e_trim` and cap the served width at 400px
 * (any container up to that width renders at native aspect ratio, no forced-square collapse).
 * Long-term fix: upload a dark-mode variant so the CSS `invert(1)` hack can be dropped.
 */
export const MODONTY_LOGO_URL =
  "https://res.cloudinary.com/dfegnpgwx/image/upload/f_auto,q_auto,e_trim,w_400,c_fit/v1768724643/final-05_ukjgff.png";

/**
 * Default Open Graph / Twitter image when the CMS `seo.ogImage` field is empty.
 *
 * NOT the plain logo URL: that one serves at its natural 143×46, and Facebook and
 * WhatsApp drop any image below 200×200 while a large Twitter card needs at least
 * 300×157 — so the share rendered as an empty box even though the tag was present.
 * Cloudinary rasterizes the SVG and pads it onto a 1200×630 canvas, the size every
 * platform documents, on white so the dark wordmark stays legible in both themes.
 *
 * This is the floor, not the ceiling: a real designed image pasted into the admin
 * field wins over it everywhere, on every page, with no deploy.
 */
export const DEFAULT_OG_IMAGE_URL =
  "https://res.cloudinary.com/dfegnpgwx/image/upload/f_png,w_1200,h_630,c_pad,b_white/v1771973886/jbrser_svg_ikxmnn.svg";

const FAVICON_BASE =
  "https://res.cloudinary.com/dfegnpgwx/image/upload/f_auto,q_auto/v1773533817/favicon_uzm7lz.webp";

export const FAVICON_URLS = {
  icon32: FAVICON_BASE.replace("q_auto/v", "q_auto,w_32,h_32,c_fit/v"),
  apple180: FAVICON_BASE.replace("q_auto/v", "q_auto,w_180,h_180,c_fit/v"),
  any: FAVICON_BASE,
} as const;
