import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/app/helpers/useTheme";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

const LOGO_URL =
  "https://res.cloudinary.com/dfegnpgwx/image/upload/v1771973886/jbrser_svg_ikxmnn.svg";

export const metadata: Metadata = {
  title: "JBRSEO - قريباً",
  description: "صفحة قريباً لـ JBRSEO - شيء استثنائي قادم",
  icons: {
    icon: LOGO_URL,
    shortcut: LOGO_URL,
    apple: LOGO_URL,
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
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',s==='dark'||(!s&&d));})();`}
        </Script>
      </head>
      <body className={`${tajawal.className} bg-background text-foreground`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}


