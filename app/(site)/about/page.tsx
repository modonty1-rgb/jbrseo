import type { Metadata } from "next";
import Link from "@/app/components/link";
import Image from "next/image";
import { AboutPageJsonLd } from "@/app/(site)/about/_components/AboutPageJsonLd";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { DEFAULT_PUBLIC_SITE_ORIGIN, PUBLIC_INDEX_FOLLOW_ROBOTS } from "@/lib/seo-meta";
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

const aboutTitle = "من نحن — مدونتي منصة المحتوى العربي لجذب العملاء";
const aboutDescription =
  "تعرف على قصة منصة JBRSEO ومهمتنا لمساعدة المتاجر في السعودية ومصر على النمو بالمحتوى والسيو بعيداً عن الاعتماد الكامل على الإعلانات.";

export const metadata: Metadata = {
  title: aboutTitle,
  description: aboutDescription,
  alternates: {
    canonical: `${DEFAULT_PUBLIC_SITE_ORIGIN}/about`,
    languages: {
      "ar-SA": `${DEFAULT_PUBLIC_SITE_ORIGIN}/about`,
      "ar-EG": `${DEFAULT_PUBLIC_SITE_ORIGIN}/about`,
    },
  },
  robots: PUBLIC_INDEX_FOLLOW_ROBOTS,
  openGraph: {
    title: aboutTitle,
    description: aboutDescription,
    url: `${DEFAULT_PUBLIC_SITE_ORIGIN}/about`,
  },
  twitter: { title: aboutTitle, description: aboutDescription },
};

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
  const staticLanding = await getStaticLandingWithOverrides();
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
          <Compass className="w-3.5 h-3.5" />
          <span>{hero.eyebrow || "عن منصة JBRSEO"}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight text-foreground mb-4">
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
                <span className="text-[11px] font-bold tracking-wide text-success bg-success/12 px-2.5 py-1 rounded-md">
                  {mission.taglineOne}
                </span>
              )}
              {mission.taglineTwo && (
                <span className="text-[11px] font-bold tracking-wide text-success bg-success/12 px-2.5 py-1 rounded-md">
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
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
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
                <div className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold tracking-wide text-success bg-success/12 px-2.5 py-1 rounded-md mb-3">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{block.label}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2 leading-snug">
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
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
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
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
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
                <div className="relative w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 ring-2 ring-success/25 mb-4">
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
                <p className="text-[12.5px] text-muted-foreground mt-3 leading-relaxed">
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
                      className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 ring-1 ring-border"
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
                <p className="text-[12.5px] text-muted-foreground mt-3 leading-relaxed">
                  ميديا · محتوى · تصميم · تطوير · SEO — كل تخصّص وله شخص متفرّغ.
                </p>
                <div className="inline-flex items-center gap-1.5 text-[13px] font-bold text-success mt-4 group-hover:gap-2 transition-all">
                  <span>شاهد الفريق كامل</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
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
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              هل JBRSEO مناسبة لمشروعك؟
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

      {/* LEGAL */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-success/12 text-success flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
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
              <div className="text-[11px] font-bold text-muted-foreground/80 tracking-wide mb-1">
                قنوات التواصل الرسمية
              </div>
              <div className="text-[13.5px] text-foreground font-medium break-all">
                {legalInfo.email}
              </div>
              <div className="text-[12.5px] text-muted-foreground mt-1 flex items-center gap-1.5">
                <Phone className="w-3 h-3" />
                <span>{legalInfo.phone}</span>
              </div>
            </div>
          </div>
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
            href={cta.primaryHref}
            className="inline-flex items-center gap-2 rounded-xl bg-success px-6 py-3 text-sm font-bold text-success-foreground hover:opacity-90 transition"
          >
            <span>{cta.primaryLabel}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link
            href={cta.secondaryHref}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-bold text-foreground hover:bg-card transition"
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
        <div className="text-[11px] font-bold text-muted-foreground/80 tracking-wide mb-1">
          {label}
        </div>
        <div className="text-[13.5px] text-foreground font-medium">{value}</div>
      </div>
    </div>
  );
}
