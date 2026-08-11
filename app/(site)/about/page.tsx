import type { Metadata } from "next";
import Link from "@/app/components/link";
import Image from "next/image";
import { AboutPageJsonLd } from "@/app/(site)/about/_components/AboutPageJsonLd";
import { headers } from "next/headers";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getLandingContent } from "@/lib/getLandingContent";
import { getWhatsAppLink } from "@/lib/site-links";
import { siteOgImages } from "@/lib/getGlobalSeo";
import { COMPANY } from "@/lib/company";
import { DEFAULT_PUBLIC_SITE_ORIGIN, PUBLIC_INDEX_FOLLOW_ROBOTS, SHARED_OPEN_GRAPH, sharedLanguages } from "@/lib/seo-meta";
import {
  Compass,
  Target,
  Scroll,
  Heart,
  Users,
  CheckCircle2,
  XCircle,
  Shield,
  Briefcase,
  Globe,
  Hash,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ArrowLeft,
  Sparkles,
  BarChart3,
  MessageSquare,
  Handshake,
  type LucideIcon,
} from "lucide-react";

const aboutTitle = "من نحن — جبر سيو لصناعة المحتوى العربي وجذب العملاء";
const aboutDescription =
  "تعرف على قصة منصة JBRSEO ومهمتنا لمساعدة المتاجر في السعودية ومصر على النمو بالمحتوى والسيو بعيداً عن الاعتماد الكامل على الإعلانات.";

export async function generateMetadata(): Promise<Metadata> {
  const images = await siteOgImages();
  return {
    title: aboutTitle,
    description: aboutDescription,
    // `sharedLanguages`, not a hand-written pair. This page inlined its own cluster and
    // so was the one page on the site missing `x-default` — measured: 2 hreflang tags
    // here against 3 everywhere else. Using the helper also means the next change to the
    // cluster reaches this page instead of leaving it behind again.
    alternates: {
      canonical: `${DEFAULT_PUBLIC_SITE_ORIGIN}/about`,
      languages: sharedLanguages(`${DEFAULT_PUBLIC_SITE_ORIGIN}/about`),
    },
    robots: PUBLIC_INDEX_FOLLOW_ROBOTS,
    openGraph: {
      ...SHARED_OPEN_GRAPH,
      title: aboutTitle,
      description: aboutDescription,
      url: `${DEFAULT_PUBLIC_SITE_ORIGIN}/about`,
      images,
    },
    twitter: { title: aboutTitle, description: aboutDescription, images },
  };
}

// Story labels → Lucide icons (parallels the mockup)
const STORY_LABEL_ICONS: Record<string, LucideIcon> = {
  "البداية": Sparkles,
  "التحول": BarChart3,
  "اليوم": Globe,
};

// Value titles → Lucide icons (parallels the mockup)
const VALUE_TITLE_ICONS: Record<string, LucideIcon> = {
  "تركيز على النتائج الحقيقية": Target,
  "فهم للسوق العربي": Globe,
  "شراكة طويلة المدى": Handshake,
  "وضوح في التواصل": MessageSquare,
};

function pickIcon(map: Record<string, LucideIcon>, key: string, fallback: LucideIcon): LucideIcon {
  return map[key] ?? fallback;
}

export default async function AboutPage() {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const [staticLanding, content] = await Promise.all([
    getStaticLandingWithOverrides(),
    getLandingContent(country),
  ]);
  const about = staticLanding.about;
  if (!about) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">من نحن</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          هذه الصفحة قيد التحديث. يرجى المحاولة لاحقاً.
        </p>
      </div>
    );
  }
  const { hero, mission, storyBlocks, values, fitFor, notFitFor, legalInfo, cta } = about;

  /**
   * Both destinations are computed, not read from `cta.primaryHref` / `cta.secondaryHref`.
   *
   * What was stored took the reader nowhere: "/signup" is not a route on this site, so the
   * primary button — the one that says "book an intro call" — answered a convinced visitor
   * by redirecting them to the home page. And "/#pricing" redirects to /sa, and a redirect
   * drops the "#pricing" fragment, so the second button landed at the top of the landing.
   *
   * Neither address can be a fixed string anyway: the contact channel is a WhatsApp number
   * kept in settings, and the pricing section lives under whichever country the reader is
   * browsing. The CMS still owns the words; the code owns where they lead.
   */
  const countrySlug = country === "EG" ? "eg" : "sa";
  const primaryHref = getWhatsAppLink(country, content.siteSettings?.whatsappNumber);
  const secondaryHref = `/${countrySlug}#pricing`;
  const coreTeam = staticLanding.team?.coreTeam ?? [];
  const executionTeam = staticLanding.team?.executionTeam ?? [];
  const teamPreview = coreTeam.slice(0, 2);
  const extraTeam = executionTeam.slice(0, 6);
  const extraCount = coreTeam.length + executionTeam.length - teamPreview.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <AboutPageJsonLd />

      {/* HERO */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-4 py-1.5 text-xs font-bold text-success mb-4">
          <Compass className="w-4 h-4" />
          <span>{hero.eyebrow || "عن منصة JBRSEO"}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-[1.35] text-foreground mb-4">
          {hero.title}
        </h1>
        <p className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
          {hero.subtitle}
        </p>
      </section>

      {/* MISSION STRIP */}
      {mission && (
        <section className="mb-16 rounded-2xl border border-success/30 bg-gradient-to-b from-success/6 to-transparent p-6 sm:p-7">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-6 h-6 text-success" />
            <h2 className="text-base font-extrabold text-foreground">
              {mission.title || "مهمّتنا"}
            </h2>
          </div>
          <p className="text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
            {mission.body}
          </p>
          {(mission.taglineOne || mission.taglineTwo) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {mission.taglineOne && (
                <span className="text-xs font-bold text-success bg-success/12 px-2.5 py-1 rounded-md">
                  {mission.taglineOne}
                </span>
              )}
              {mission.taglineTwo && (
                <span className="text-xs font-bold text-success bg-success/12 px-2.5 py-1 rounded-md">
                  {mission.taglineTwo}
                </span>
              )}
            </div>
          )}
        </section>
      )}

      {/* STORY */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-success/12 text-success flex items-center justify-center">
            <Scroll className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
              قصتنا باختصار
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              ثلاث محطات من البداية إلى اليوم
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {storyBlocks.map((block) => {
            const Icon = pickIcon(STORY_LABEL_ICONS, block.label, Sparkles);
            return (
              <div
                key={block.label}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-success bg-success/12 px-2.5 py-1 rounded-md mb-3">
                  <Icon className="w-4 h-4" />
                  <span>{block.label}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2 leading-relaxed">
                  {block.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {block.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* VALUES */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-success/12 text-success flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
              ما الذي يميّز طريقة عملنا؟
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              قيم نلتزم بها في كل مشروع
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((value) => {
            const Icon = pickIcon(VALUE_TITLE_ICONS, value.title, Target);
            return (
              <div
                key={value.title}
                className="rounded-2xl border border-border bg-card p-5 flex gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-success/12 text-success flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1.5">
                    {value.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {value.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TEAM */}
      {teamPreview.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-success/12 text-success flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                الفريق وراء JBRSEO
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                فريق صغير لكن مركّز — كل شخص متخصص في دوره
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {teamPreview.map((member, i) => (
              <div
                key={`${i}-${member.name}`}
                className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center text-center"
              >
                <div className="relative w-28 h-28 rounded-full overflow-hidden bg-muted ring-2 ring-success/25 mb-4">
                  {member.avatarUrl ? (
                    <Image
                      src={member.avatarUrl}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      sizes="112px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-3xl font-black">
                      {member.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-sm font-bold text-foreground">{member.name}</div>
                <div className="text-xs text-success font-semibold mt-1">{member.role}</div>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}

            {/* 3rd card: preview grid + link to full team page */}
            {extraTeam.length > 0 && (
              <Link
                href="/team"
                className="group rounded-2xl border border-border bg-card p-6 flex flex-col items-center text-center hover:border-success/50 hover:bg-success/5 transition"
              >
                <div className="grid grid-cols-3 gap-2 mb-4 w-full max-w-[180px]">
                  {extraTeam.map((m, i) => (
                    <div
                      key={`${i}-${m.name}`}
                      className="relative aspect-square rounded-lg overflow-hidden bg-muted ring-1 ring-border"
                    >
                      {m.avatarUrl ? (
                        <Image
                          src={m.avatarUrl}
                          alt={m.name}
                          fill
                          className="object-cover object-top"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-black">
                          {m.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-sm font-bold text-foreground">
                  فريق التنفيذ الكامل
                </div>
                <div className="text-xs text-success font-semibold mt-1">
                  {`+${extraCount} عضو متخصّص`}
                </div>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  ميديا · محتوى · تصميم · تطوير · سيو — كل تخصّص وله شخص متفرّغ.
                </p>
                <div className="inline-flex items-center gap-1.5 text-[13px] font-bold text-success mt-4 group-hover:gap-2 transition-all">
                  <span>شاهد الفريق كامل</span>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* FIT / NOT FIT */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-success/12 text-success flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
              هل المنصة مناسبة لمشروعك؟
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              صادقين معك من أول لقاء
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-success/30 bg-success/5 p-5">
            <div className="flex items-center gap-2 text-success text-sm font-extrabold mb-4">
              <CheckCircle2 className="w-5 h-5" />
              <span>مناسب لك إذا</span>
            </div>
            <ul className="flex flex-col gap-2.5">
              {fitFor.map((item) => (
                <li key={item} className="flex gap-2.5 items-start text-[13px] leading-relaxed text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
            <div className="flex items-center gap-2 text-destructive text-sm font-extrabold mb-4">
              <XCircle className="w-5 h-5" />
              <span>قد لا يكون مناسباً إذا</span>
            </div>
            <ul className="flex flex-col gap-2.5">
              {notFitFor.map((item) => (
                <li key={item} className="flex gap-2.5 items-start text-[13px] leading-relaxed text-muted-foreground">
                  <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* LEGAL — the anchor the landing's trust line points at. `scroll-mt` keeps the
          heading clear of the sticky header when arriving from /sa#legal. */}
      <section id="legal" className="mb-16 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-success/12 text-success flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
              معلومات قانونية عن الشركة
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              الشفافية جزء أساسي من الثقة
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <LegalItem icon={Briefcase} label="الاسم القانوني" value={legalInfo.legalName} />
          <LegalItem icon={MapPin} label="بلد التسجيل" value={legalInfo.registrationCountry} />
          <LegalItem icon={Hash} label="رقم السجل التجاري" value={legalInfo.crNumber} />
          <LegalItem icon={Calendar} label="تاريخ التأسيس" value={legalInfo.foundedAt} />
          <LegalItem icon={MapPin} label="العنوان البريدي" value={legalInfo.address} />
          <div className="rounded-xl border border-border bg-card p-4 flex gap-3 items-start">
            <Mail className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-muted-foreground/80 mb-1">
                قنوات التواصل الرسمية
              </div>
              {/* `dir="ltr"`: an address is a Latin run inside an RTL block, and without
                  its own direction the trailing dot or any punctuation beside it reorders.
                  `break-words`, not `break-all` — the latter splits at an arbitrary
                  character, so a wrapped address becomes unreadable and uncopyable. */}
              <div dir="ltr" className="text-sm text-foreground font-medium break-words">
                {legalInfo.email}
              </div>
              {legalInfo.phone && (
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <bdi dir="ltr">{legalInfo.phone}</bdi>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* The certificate itself — moved here from the landing page, where it cost
            1,212px of scroll before anyone reached the prices. It belongs on the page
            a reader opens *because* they want to verify us, not in the path of a reader
            who is still deciding whether to care.

            Desktop only, and not for layout reasons: even the 1290px JPEG corrupted GPU
            raster tiles on older Android phones (verified on device, 2026-07-15). Mobile
            gets the same proof in a form that always renders — the CR number above, which
            is what the ministry portal actually checks. */}
        <div className="hidden md:block mt-8">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border/50">
            <Image
              src={COMPANY.crCertificatePath}
              alt={`شهادة السجل التجاري الرسمية من وزارة التجارة السعودية · الرقم الموحّد ${COMPANY.unifiedNumber} · تاريخ الإصدار ${COMPANY.certificateIssuedAt}`}
              width={1290}
              height={911}
              className="block w-full h-auto rounded-lg"
              sizes="(max-width: 1024px) 90vw, 860px"
            />
          </div>
          <p className="mt-2.5 text-center text-[12px] leading-[1.6] text-muted-foreground">
            شهادة السجل التجاري الرسمية · <span className="font-semibold text-foreground">امسح الـ QR بجوالك</span> للتحقّق المباشر من وزارة التجارة السعودية
          </p>
        </div>

        {legalInfo.note && (
          <p className="mt-4 text-[12px] italic leading-relaxed text-muted-foreground">
            {legalInfo.note}
          </p>
        )}
      </section>

      {/* CTA */}
      <section className="text-center rounded-2xl border-2 border-success/30 bg-gradient-to-b from-success/10 to-transparent px-6 py-10 sm:px-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mb-3">{cta.title}</h2>
        <p className="mx-auto max-w-xl text-sm sm:text-[15px] text-muted-foreground leading-relaxed mb-6">
          {cta.body}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href={primaryHref}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-success px-6 py-3 text-sm font-bold text-success-foreground hover:opacity-90 transition no-underline"
          >
            <span>{cta.primaryLabel}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-bold text-foreground hover:bg-card transition no-underline"
          >
            <span>{cta.secondaryLabel}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

function LegalItem({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex gap-3 items-start">
      <Icon className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
      <div className="min-w-0">
        <div className="text-xs font-bold text-muted-foreground/80 mb-1">
          {label}
        </div>
        {/* `bdi`: these values are registration numbers, dates and addresses — Latin runs
            inside an Arabic block. A bare number is usually fine, but the moment one
            carries a `+`, a slash or a trailing dot the bidi algorithm reorders it, and a
            registration number that reads back wrong is worse than one that is missing. */}
        <bdi className="block text-sm text-foreground font-medium">{value}</bdi>
      </div>
    </div>
  );
}
