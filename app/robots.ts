import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/sa/", "/eg/"],
      disallow: [
        "/admin",
        "/admin/",
        "/api/",
        "/_next/static/",
        "/_next/image/",
        "/sa/checkout",
        "/sa/checkout/",
      ],
    },
    sitemap: "https://www.jbrseo.com/sitemap.xml",
  };
}
