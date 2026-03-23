import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "@/app/components/link";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { StaffAvatar } from "@/app/components/StaffAvatar";
import { Card } from "@/app/components/ui/card";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com";
const aboutTitle = "عن منصة JBRSEO | من نحن وسبب وجودنا";
const aboutDescription =
  "تعرف على قصة منصة JBRSEO، مهمتنا لمساعدة المتاجر الإلكترونية في السعودية ومصر على الاعتماد على المحتوى والـ SEO للنمو المستدام بعيداً عن الاعتماد الكامل على الإعلانات.";

export const metadata: Metadata = {
  title: aboutTitle,
  description: aboutDescription,
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: { title: aboutTitle, description: aboutDescription, url: `${siteUrl}/about` },
  twitter: { title: aboutTitle, description: aboutDescription },
};

export default async function AboutPage() {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const staticLanding = await getStaticLandingWithOverrides(country);
  const about = staticLanding.about;
  const { hero, storyBlocks, values, fitFor, notFitFor, legalInfo, cta } = about;
  const teamPreview = staticLanding.team.coreTeam.slice(0, 3);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      {/* Hero */}
      <section className="space-y-4 text-center">
        <p className="text-xs font-semibold tracking-widest text-primary/70">عن منصة JBRSEO</p>
        <h1 className="text-2xl font-bold leading-relaxed text-foreground sm:text-3xl">
          {hero.title}
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {hero.subtitle}
        </p>
      </section>

      {/* Story */}
      <Card className="space-y-6 rounded-2xl border-border/60 bg-card/40 px-5 py-6 sm:px-7 sm:py-7 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">قصتنا باختصار</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {storyBlocks.map((block) => (
            <div key={block.label} className="space-y-1 rounded-xl bg-background/40 p-4 text-sm">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary/70">
                {block.label}
              </p>
              <p className="text-xs font-semibold text-muted-foreground">{block.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {block.body}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Values */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">ما الذي يميز طريقة عملنا؟</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((value) => (
            <Card key={value.title} className="rounded-2xl border-border/60 bg-card/40 p-4 text-sm shadow-sm">
              <p className="text-xs font-semibold text-foreground">{value.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {value.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">الفريق وراء JBRSEO</h2>
        <p className="text-xs leading-relaxed text-muted-foreground">
          فريق صغير لكن مركز — كل شخص فيه متخصص في دوره، ويشتغلون معاً على نشاطك من أول يوم.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {teamPreview.map((member, i) => (
            <Card
              key={`${i}-${member.name}`}
              className="flex flex-col overflow-hidden rounded-2xl border-border/60 bg-card/40 p-0 text-sm shadow-sm"
            >
              <div className="aspect-square w-full shrink-0">
                <StaffAvatar
                  avatarUrl={member.avatarUrl}
                  avatarColor={member.avatarColor}
                  name={member.name}
                  size="full"
                />
              </div>
              <div className="flex flex-col items-start p-4">
                <p className="text-xs font-semibold text-foreground">{member.name}</p>
                <p className="text-[11px] text-muted-foreground">{member.role}</p>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  {member.bio}
                </p>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-start">
          <Link
            href="/team"
            className="text-xs font-semibold text-primary hover:underline"
          >
            شاهد بقية الفريق
          </Link>
        </div>
      </section>

      {/* Fit / Not Fit */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="rounded-2xl border-border/60 bg-emerald-500/5 p-4 text-sm shadow-sm">
          <p className="text-xs font-semibold text-emerald-300">مناسب لك إذا</p>
          <ul className="mt-2 space-y-1 text-xs leading-relaxed text-muted-foreground">
            {fitFor.map((item) => (
              <li key={item}>✅ {item}</li>
            ))}
          </ul>
        </Card>
        <Card className="rounded-2xl border-border/60 bg-destructive/5 p-4 text-sm shadow-sm">
          <p className="text-xs font-semibold text-destructive">قد لا يكون مناسباً إذا</p>
          <ul className="mt-2 space-y-1 text-xs leading-relaxed text-muted-foreground">
            {notFitFor.map((item) => (
              <li key={item}>✖ {item}</li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Legal / Trust */}
      <Card className="space-y-3 rounded-2xl border-border/60 bg-card/40 px-5 py-6 text-sm sm:px-7 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">
          معلومات قانونية عن الشركة
        </h2>
        <p className="text-xs leading-relaxed text-muted-foreground">
          نؤمن أن الشفافية جزء أساسي من بناء الثقة، لذلك نشارك معك بيانات التسجيل الأساسية لشركتنا.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1 rounded-xl bg-background/40 p-3">
            <p className="text-[11px] font-semibold text-muted-foreground">الاسم القانوني</p>
            <p className="text-xs text-foreground">{legalInfo.legalName}</p>
          </div>
          <div className="space-y-1 rounded-xl bg-background/40 p-3">
            <p className="text-[11px] font-semibold text-muted-foreground">بلد التسجيل</p>
            <p className="text-xs text-foreground">{legalInfo.registrationCountry}</p>
          </div>
          <div className="space-y-1 rounded-xl bg-background/40 p-3">
            <p className="text-[11px] font-semibold text-muted-foreground">رقم السجل التجاري (CR)</p>
            <p className="text-xs text-foreground">{legalInfo.crNumber}</p>
          </div>
          <div className="space-y-1 rounded-xl bg-background/40 p-3">
            <p className="text-[11px] font-semibold text-muted-foreground">تاريخ التأسيس</p>
            <p className="text-xs text-foreground">{legalInfo.foundedAt}</p>
          </div>
          <div className="space-y-1 rounded-xl bg-background/40 p-3">
            <p className="text-[11px] font-semibold text-muted-foreground">العنوان البريدي</p>
            <p className="text-xs text-foreground">{legalInfo.address}</p>
          </div>
          <div className="space-y-1 rounded-xl bg-background/40 p-3">
            <p className="text-[11px] font-semibold text-muted-foreground">قنوات التواصل الرسمية</p>
            <p className="text-xs text-foreground">{legalInfo.email}</p>
            <p className="text-xs text-muted-foreground">{legalInfo.phone}</p>
          </div>
        </div>
        {legalInfo.note && (
          <p className="pt-1 text-[11px] leading-relaxed text-muted-foreground">
            {legalInfo.note}
          </p>
        )}
      </Card>

      {/* Soft CTA */}
      <Card className="rounded-2xl border-border/60 bg-card/60 px-5 py-6 text-center sm:px-7 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">{cta.title}</h2>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{cta.body}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <a
            href={cta.primaryHref}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            {cta.primaryLabel}
          </a>
          <a
            href={cta.secondaryHref}
            className="text-xs font-semibold text-primary hover:underline"
          >
            {cta.secondaryLabel}
          </a>
        </div>
      </Card>
    </div>
  );
}

