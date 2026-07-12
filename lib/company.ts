/**
 * Single source of truth for company legal identity.
 * Authority: CR certificate (public/trust/jabr-cr-certificate.png).
 *
 * `legalName` (with "للمقاولات") = the exact CR-registered form; use ONLY where
 *   the full legal registration is being cited (identity card, certificate alt).
 * `marketingName` = customer-facing brand; use everywhere else (headers, footer,
 *   trust chips, terms/privacy prose).
 */
export const COMPANY = {
  legalName: "شركة جبر الجنوبية للمقاولات",
  marketingName: "شركة جبر الجنوبية",
  unifiedNumber: "7036024383",
  capital: "٨,٠٠٠,٠٠٠",
  currency: "ر.س",
  foundedGregorian: "٢٠٢٣",
  city: "جدة",
  country: "المملكة العربية السعودية",
  address: "٨١٧١، علي سليمان علي حقوي، ٣١٥٦، جدة 23816",
  email: "support@jbrseo.com",
  crCertificatePath: "/trust/jabr-cr-certificate.png",
  certificateIssuedAt: "13/09/2023",
} as const;
