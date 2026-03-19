import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  reactCompiler: true,
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
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "api.dicebear.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default withBundleAnalyzer(nextConfig);



