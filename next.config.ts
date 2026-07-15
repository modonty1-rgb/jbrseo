import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  compiler: {
    // Strip console.* (except error/warn) from the production bundle — smaller JS,
    // less main-thread work. Matches modonty.com.
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    // Barrel-optimize the heavy UI deps we actually use (carousels, dialogs,
    // sliders, icons) so only the used code ships — cuts First Load JS / TBT.
    optimizePackageImports: [
      "lucide-react",
      "embla-carousel-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-slider",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-slot",
      "@radix-ui/react-tabs",
      "@radix-ui/react-select",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-separator",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-label",
      "@radix-ui/react-avatar",
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin/settings/general",
        destination: "/admin/settings",
        permanent: true,
      },
      {
        source: "/admin/settings/tracking",
        destination: "/admin/settings",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "api.dicebear.com", pathname: "/**" },
      { protocol: "https", hostname: "api.qrserver.com", pathname: "/**" },
    ],
    // WebP only — AVIF decode is software-path on older Android SoCs (slow,
    // battery-heavy, and implicated in GPU raster pressure on weak devices).
    formats: ["image/webp"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withBundleAnalyzer(nextConfig);
