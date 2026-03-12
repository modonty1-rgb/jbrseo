import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { ThemeProvider } from "@/app/helpers/useTheme";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0E065A" },
    { media: "(prefers-color-scheme: dark)", color: "#0E065A" },
  ],
};

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
  preload: true,
});

const LOGO_URL =
  "https://res.cloudinary.com/dfegnpgwx/image/upload/v1771973886/jbrser_svg_ikxmnn.svg";

const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "JBRSEO | خبراء السيو لنمو أعمالك",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com"),
  title: {
    default: "JBRSEO | خبراء السيو لنمو أعمالك",
    template: "%s | JBRSEO",
  },
  description: "JBRSEO – وكالة سيو متخصصة تساعدك على الظهور الأول في نتائج البحث وتنمية أعمالك في السعودية ومصر.",
  icons: {
    icon: LOGO_URL,
    shortcut: LOGO_URL,
    apple: LOGO_URL,
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "JBRSEO",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable} suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="afterInteractive">
          {`(function(){var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',s==='dark'||(!s&&d));})();`}
        </Script>
      </head>
      <body className={`${tajawal.className} bg-background text-foreground`}>
        <Link
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-9999 focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded focus:shadow-lg"
        >
          انتقل للمحتوى الرئيسي
        </Link>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}


