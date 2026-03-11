import type { Metadata } from "next";
import { headers } from "next/headers";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { StaffAvatar } from "@/app/components/StaffAvatar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com";
const teamTitle = "فريق JBRSEO | الأشخاص وراء المنصة";
const teamDescription =
  "تعرّف على الفريق الذي يقف وراء منصة JBRSEO، خبرات في المتاجر الإلكترونية، SEO والمحتوى، يعملون معاً لبناء نمو مستدام لمشروعك.";

export const metadata: Metadata = {
  title: teamTitle,
  description: teamDescription,
  alternates: { canonical: `${siteUrl}/team` },
  openGraph: { title: teamTitle, description: teamDescription, url: `${siteUrl}/team` },
  twitter: { title: teamTitle, description: teamDescription },
};

export default async function TeamPage() {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const staticLanding = await getStaticLandingWithOverrides(country);
  const { coreTeam, executionTeam } = staticLanding.team;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      <section className="space-y-3 text-center">
        <p className="text-xs font-semibold tracking-widest text-primary/70">فريق JBRSEO</p>
        <h1 className="text-2xl font-bold leading-relaxed text-foreground sm:text-3xl">
          الأشخاص الذين يعملون معك في كواليس النمو بالمحتوى والـ SEO
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
          نؤمن أن النتائج الممتازة تبدأ بفريق صغير متخصص ومتفاهم. هذه الصفحة تعطيك صورة أوضح عن الأدوار الأساسية
          داخل JBRSEO. الأسماء والوظائف هنا نموذجية ويمكنك تخصيصها بحسب فريقك الفعلي لاحقاً.
        </p>
      </section>

      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {coreTeam.map((member, i) => (
            <div
              key={`core-${i}-${member.name}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 text-sm"
            >
              <div className="aspect-square w-full max-w-[14rem] shrink-0 sm:max-w-[16rem]">
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
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {executionTeam.map((member, i) => (
            <div
              key={`exec-${i}-${member.name}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 text-sm"
            >
              <div className="aspect-square w-full max-w-[14rem] shrink-0 sm:max-w-[16rem]">
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

