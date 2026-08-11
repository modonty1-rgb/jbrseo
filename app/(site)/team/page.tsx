import type { Metadata } from "next";
import Image from "next/image";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { siteOgImages } from "@/lib/getGlobalSeo";
import { buildPageJsonLd, DEFAULT_PUBLIC_SITE_ORIGIN, PUBLIC_INDEX_FOLLOW_ROBOTS, safeJsonLd, SHARED_OPEN_GRAPH, sharedLanguages } from "@/lib/seo-meta";
import { Users, Crown, ArrowLeft } from "lucide-react";

const siteUrl = DEFAULT_PUBLIC_SITE_ORIGIN;
// The site name arrives from the layout's title template — spelling it here too printed
// "فريق JBRSEO … | JBRSEO".
const teamTitle = "الفريق — الأشخاص وراء المنصة";
const teamDescription =
  "تعرّف على الفريق الذي يقف وراء منصة JBRSEO، خبرات في المتاجر الإلكترونية، السيو والمحتوى، يعملون معاً لبناء نمو مستدام لمشروعك.";

export async function generateMetadata(): Promise<Metadata> {
  const images = await siteOgImages();
  return {
    title: teamTitle,
    description: teamDescription,
    robots: PUBLIC_INDEX_FOLLOW_ROBOTS,
    alternates: {
      canonical: `${siteUrl}/team`,
      languages: sharedLanguages(`${siteUrl}/team`),
    },
    openGraph: {
      ...SHARED_OPEN_GRAPH,
      title: teamTitle,
      description: teamDescription,
      url: `${siteUrl}/team`,
      images,
    },
    twitter: { title: teamTitle, description: teamDescription, images },
  };
}

export default async function TeamPage() {
  const staticLanding = await getStaticLandingWithOverrides();
  const { coreTeam = [], executionTeam = [] } = staticLanding.team ?? {};
  const totalCount = coreTeam.length + executionTeam.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            buildPageJsonLd({
              url: `${siteUrl}/team`,
              name: teamTitle,
              description: teamDescription,
              breadcrumbName: "الفريق",
            }),
          ),
        }}
      />
      {/* HERO */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-4 py-1.5 text-xs font-bold text-success mb-4">
          <Users className="w-4 h-4" />
          <span>{totalCount} شخص يعمل عليك</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight text-foreground mb-4">
          الأشخاص الذين يعملون معك في كواليس النمو
        </h1>
        <p className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
          لما تشترك في JBRSEO، هؤلاء هم الأشخاص الذين يشتغلون على نشاطك — كل واحد متخصص في دوره، وكلهم يشتغلون معاً عشانك.
        </p>
      </section>

      {/* CORE TEAM */}
      {coreTeam.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-success/12 text-success flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                القيادة
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                المؤسسون + المدير التنفيذي
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 max-w-3xl mx-auto">
            {coreTeam.map((member, i) => (
              <MemberCardLarge key={`core-${i}-${member.name}`} member={member} />
            ))}
          </div>
        </section>
      )}

      {/* EXECUTION TEAM */}
      {executionTeam.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-success/12 text-success flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                فريق التنفيذ
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                محتوى · تصميم · سيو · تطوير · ميديا — كل تخصّص وله شخص متفرّغ
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {executionTeam.map((member, i) => (
              <MemberCardSmall key={`exec-${i}-${member.name}`} member={member} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="text-center rounded-2xl border-2 border-success/30 bg-gradient-to-b from-success/10 to-transparent px-6 py-10 sm:px-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mb-3">
          مستعد تبدأ مع فريق يشتغل معك؟
        </h2>
        <p className="mx-auto max-w-xl text-sm sm:text-[15px] text-muted-foreground leading-relaxed mb-6">
          {totalCount} شخص متخصّص جاهزون يشتغلون على نشاطك من أول يوم اشتراك — بلا انتظار.
        </p>
        <a
          href="/sa#pricing"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-success px-6 py-3 text-sm font-bold text-success-foreground hover:opacity-90 transition no-underline"
        >
          <span>اختر باقتك</span>
          <ArrowLeft className="w-4 h-4" />
        </a>
      </section>
    </div>
  );
}

type Member = {
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  avatarColor?: string;
};

function MemberCardLarge({ member }: { member: Member }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center text-center">
      <MemberAvatar member={member} size={128} sizeClass="w-32 h-32" ringClass="ring-2 ring-success/25" />
      <div className="text-sm font-bold text-foreground mt-4">{member.name}</div>
      <div className="text-xs text-success font-semibold mt-1">{member.role}</div>
      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
        {member.bio}
      </p>
    </div>
  );
}

function MemberCardSmall({ member }: { member: Member }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex flex-col items-center text-center">
      <MemberAvatar member={member} size={80} sizeClass="w-20 h-20" ringClass="ring-1 ring-border" />
      <div className="text-[13px] font-bold text-foreground mt-3 leading-tight">{member.name}</div>
      <div className="text-xs text-success font-semibold mt-1">{member.role}</div>
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
        {member.bio}
      </p>
    </div>
  );
}

function MemberAvatar({
  member,
  size,
  sizeClass,
  ringClass,
}: {
  member: Member;
  size: number;
  sizeClass: string;
  ringClass: string;
}) {
  return (
    // bg-muted is theme-adaptive (dark in dark mode, light in light mode) —
    // fallback initials stay readable in both. Hardcoded neutrals would look
    // out of place on light theme.
    <div className={`relative ${sizeClass} rounded-full overflow-hidden bg-muted ${ringClass}`}>
      {member.avatarUrl ? (
        <Image
          src={member.avatarUrl}
          alt={member.name}
          fill
          className="object-cover object-top"
          sizes={`${size}px`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl font-black">
          {member.name?.charAt(0)}
        </div>
      )}
    </div>
  );
}
