import type { Metadata, Viewport } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { Tajawal } from "next/font/google";
import Link from "@/app/components/link";
import { FAVICON_URLS } from "@/lib/constants";
import { getGlobalSeo } from "@/lib/getGlobalSeo";
import { getSiteGtmId } from "@/lib/getLandingContent";
import { ensureWwwJbrseoUrl, resolveSiteOriginFromSeoCanonical } from "@/lib/seo-meta";
import { ThemeProvider } from "@/app/helpers/useTheme";
import "./globals.css";

const SITE_URL = ensureWwwJbrseoUrl(
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jbrseo.com").replace(/\/$/, ""),
);

export const viewport: Viewport = {
  themeColor: "#0c0c12",
};

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-tajawal",
  display: "swap",
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeo();
  const metadataOrigin = resolveSiteOriginFromSeoCanonical(seo.canonical, SITE_URL.replace(/\/$/, ""));
  const ogImage = { url: seo.ogImage, width: 1200, height: 630, alt: seo.title };
  return {
    metadataBase: new URL(metadataOrigin),
    title: { default: seo.title, template: "%s | JBRSEO" },
    description: seo.description,
    icons: {
      icon: [
        { url: FAVICON_URLS.icon32, sizes: "32x32", type: "image/webp" },
        { url: FAVICON_URLS.any, sizes: "any", type: "image/webp" },
      ],
      shortcut: FAVICON_URLS.icon32,
      apple: [
        { url: FAVICON_URLS.apple180, sizes: "180x180", type: "image/webp" },
      ],
    },
    openGraph: {
      type: "website",
      locale: "ar_SA",
      siteName: "JBRSEO",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = await getSiteGtmId();

  return (
    <html lang="ar" dir="rtl" className={tajawal.variable} suppressHydrationWarning>
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://static.hotjar.com" />
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',s==='dark'||(!s&&d));})();`,
          }}
        />
      </head>
      <body className={`${tajawal.className} bg-background text-foreground`}>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <Link
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-9999 focus:bg-accent focus:text-accent-foreground focus:px-4 focus:py-2 focus:rounded focus:shadow-lg"
        >
          انتقل للمحتوى الرئيسي
        </Link>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}


