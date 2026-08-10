import type { Metadata } from "next";
import { LegalMarkdownArticle } from "@/app/(site)/_components/LegalMarkdownArticle";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { siteOgImages } from "@/lib/getGlobalSeo";
import {
  buildPageJsonLd,
  DEFAULT_PUBLIC_SITE_ORIGIN,
  SHARED_OPEN_GRAPH,
  PUBLIC_INDEX_FOLLOW_ROBOTS,
  sharedLanguages,
} from "@/lib/seo-meta";
import type { LegalSectionBlock } from "@/app/content/landing/types";
import {
  FileText,
  CheckCircle,
  BookOpen,
  UserCheck,
  UserCog,
  CreditCard,
  XOctagon,
  FileCheck,
  AlertTriangle,
  Search,
  Scale,
  RefreshCw,
  Landmark,
  Mail,
  Calendar,
  Info,
  type LucideIcon,
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const landing = await getStaticLandingWithOverrides();
  const title = landing.terms?.title ?? "شروط الاستخدام";
  const siteUrl = DEFAULT_PUBLIC_SITE_ORIGIN;
  const description =
    "شروط استخدام اشتراك جبر سيو كاملة — الاشتراك، الفوترة، الإلغاء، ملكية المحتوى، وحدود المسؤولية. مكتوبة بلغة واضحة وصريحة.";
  return {
    title,
    description,
    robots: PUBLIC_INDEX_FOLLOW_ROBOTS,
    alternates: {
      canonical: `${siteUrl}/terms`,
      languages: sharedLanguages(`${siteUrl}/terms`),
    },
    openGraph: { ...SHARED_OPEN_GRAPH, title, description, url: `${siteUrl}/terms`, images: await siteOgImages() },
    // `card` is explicit: Next picks the card type before it back-fills the image from
    // openGraph, so a twitter block without its own images resolves to the small
    // `summary` — the share then renders a thumbnail beside the text, not a banner.
    twitter: { card: "summary_large_image", title, description, images: await siteOgImages() },
  };
}

const ICON_MAP: Record<string, LucideIcon> = {
  "check-circle": CheckCircle,
  "book-open": BookOpen,
  "user-check": UserCheck,
  "user-cog": UserCog,
  "credit-card": CreditCard,
  "x-octagon": XOctagon,
  "file-check": FileCheck,
  "alert-triangle": AlertTriangle,
  search: Search,
  scale: Scale,
  "refresh-cw": RefreshCw,
  landmark: Landmark,
};

export default async function TermsPage() {
  const landing = await getStaticLandingWithOverrides();
  const terms = landing.terms;
  if (!terms) {
    return (
      <main className="bg-background text-foreground">
        <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">شروط الاستخدام</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            هذه الصفحة قيد التحديث. يرجى المحاولة لاحقاً.
          </p>
        </section>
      </main>
    );
  }
  const { title, updatedAt, intro, sections, body } = terms;
  const hasStructured = Array.isArray(sections) && sections.length > 0;

  return (
    <main className="bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildPageJsonLd({
              url: `${DEFAULT_PUBLIC_SITE_ORIGIN}/terms`,
              name: title ?? "شروط الاستخدام",
              description: intro ?? "شروط استخدام منصة JBRSEO.",
              breadcrumbName: "شروط الاستخدام",
            }),
          ),
        }}
      />
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-4 py-1.5 text-xs font-bold text-success mb-4">
            <FileText className="w-4 h-4" />
            <span>شروط الاستخدام</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight text-foreground mb-4">
            {title}
          </h1>
          {updatedAt && (
            <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>آخر تحديث: {updatedAt}</span>
            </div>
          )}
          {intro && (
            <p className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground mt-6">
              {intro}
            </p>
          )}
        </section>

        {hasStructured ? (
          <>
            {/* Table of contents */}
            <nav className="mb-12 rounded-2xl border border-border bg-card p-5">
              <div className="text-xs font-bold tracking-wide text-muted-foreground mb-3">
                محتويات الشروط
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {sections!.map((s: LegalSectionBlock) => {
                  const Icon = ICON_MAP[s.icon] ?? Info;
                  return (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-muted-foreground hover:bg-success/5 hover:text-foreground transition-colors"
                    >
                      <Icon className="w-4 h-4 shrink-0 text-success/80" />
                      <span className="truncate">{s.title}</span>
                    </a>
                  );
                })}
              </div>
            </nav>

            {/* Sections */}
            <div className="flex flex-col gap-4">
              {sections!.map((s: LegalSectionBlock) => {
                const Icon = ICON_MAP[s.icon] ?? Info;
                return (
                  <section
                    key={s.id}
                    id={s.id}
                    className="rounded-2xl border border-border bg-card p-5 sm:p-6 scroll-mt-24"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-success/12 text-success flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h2 className="text-base sm:text-lg font-extrabold text-foreground leading-snug pt-1.5">
                        {s.title}
                      </h2>
                    </div>
                    <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-headings:font-bold prose-headings:text-sm prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-sm prose-li:text-muted-foreground prose-li:leading-relaxed prose-li:text-sm prose-strong:text-foreground prose-strong:font-bold prose-a:text-success prose-a:no-underline hover:prose-a:underline">
                      <LegalMarkdownArticle content={s.body} />
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6">
            <LegalMarkdownArticle content={body} />
          </div>
        )}

        {/* Contact footer */}
        <div className="mt-12 rounded-2xl border-2 border-success/30 bg-gradient-to-b from-success/10 to-transparent px-6 py-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-success/15 text-success mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            أي استفسار حول هذه الشروط أو حقوقك؟
            <br />
            راسلنا على{" "}
            <a
              href="mailto:support@jbrseo.com"
              className="text-success font-bold hover:underline"
            >
              support@jbrseo.com
            </a>{" "}
            — نرد خلال ٤٨ ساعة كحد أقصى.
          </p>
        </div>
      </div>
    </main>
  );
}
