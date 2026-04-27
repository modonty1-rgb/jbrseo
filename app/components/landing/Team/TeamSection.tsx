import Image from "next/image";
import type { StaticLanding, TeamPageMember } from "@/app/content/landing/types";

type TeamSectionProps = {
  staticLanding: StaticLanding;
};

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
function toArabicNumeral(n: number): string {
  return String(n)
    .padStart(2, "0")
    .split("")
    .map((c) => ARABIC_DIGITS[Number(c)] ?? c)
    .join("");
}

function extractDepartment(role: string): string {
  const arabic = role.split("|")[0]?.trim() ?? role;
  return arabic;
}

function extractEnglishRole(role: string): string | null {
  const parts = role.split("|");
  if (parts.length < 2) return null;
  return parts[1]?.trim() ?? null;
}

export default function TeamSection({ staticLanding }: TeamSectionProps) {
  const { coreTeam, executionTeam } = staticLanding.team;
  if (!coreTeam?.length && !executionTeam?.length) return null;

  const totalCount = (coreTeam?.length ?? 0) + (executionTeam?.length ?? 0);
  const departmentsCount = new Set(
    [...(coreTeam ?? []), ...(executionTeam ?? [])].map((m) => extractDepartment(m.role)),
  ).size;

  return (
    <section
      id="team"
      aria-labelledby="team-title"
      dir="rtl"
      className="
        relative overflow-hidden border-t border-border bg-background
        px-5 pt-24 pb-24
        sm:px-8
        lg:px-10 lg:pt-[112px] lg:pb-[104px]
      "
    >
      {/* Aurora gradient mesh background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(640px 320px at 12% -10%, color-mix(in oklch, var(--primary) 22%, transparent) 0%, transparent 60%),
            radial-gradient(540px 280px at 92% 8%, color-mix(in oklch, var(--accent) 18%, transparent) 0%, transparent 60%),
            radial-gradient(720px 380px at 50% 110%, color-mix(in oklch, var(--primary) 14%, transparent) 0%, transparent 65%)
          `,
        }}
      />
      {/* Diagonal grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(45deg, transparent 48%, currentColor 49%, currentColor 51%, transparent 52%)",
          backgroundSize: "32px 32px",
          color: "var(--foreground)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px]">
        {/* Header — editorial, asymmetric */}
        <div className="mb-14 grid items-end gap-8 md:grid-cols-[1fr_auto] md:gap-10">
          <div className="landing-reveal-eyebrow">
            <div className="mb-5 flex items-center gap-3">
              <span
                className="h-[1px] w-12 shrink-0"
                style={{
                  background:
                    "linear-gradient(to left, color-mix(in oklch, var(--primary) 80%, transparent), transparent)",
                }}
                aria-hidden
              />
              <span className="text-[11px] font-black uppercase tracking-[.28em] text-primary">
                THE TEAM · الفريق
              </span>
            </div>
            <h2
              id="team-title"
              className="landing-reveal-title font-black tracking-[-0.035em] text-foreground"
              style={{ fontSize: "clamp(32px, 4.4vw, 56px)", lineHeight: 1.05 }}
            >
              مش روبوت.
              <br />
              <span className="bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent">
                ناس حقيقية وراء كل مقال.
              </span>
            </h2>
            <p className="landing-reveal-content mt-5 max-w-[560px] text-[15px] leading-[1.85] text-muted-foreground">
              فريق من المتخصصين، كل واحد عنده دور محدد في رحلة نمو نشاطك. مش outsourcing،
              مش مكتب وسيط — هذول هم الناس اللي شغل عليهم اليوم وأنت بتقرأ.
            </p>
          </div>

          {/* Stats pill column */}
          <div className="flex gap-3 md:flex-col md:items-end md:gap-4">
            <StatPill value={toArabicNumeral(totalCount)} label="متخصص" highlight />
            <StatPill value={toArabicNumeral(departmentsCount)} label="تخصص" />
            <StatPill value="٢٤/٧" label="جاهزية" />
          </div>
        </div>

        {/* Bento grid — leaders span larger */}
        {coreTeam?.length ? (
          <div className="mb-5 grid gap-4 md:grid-cols-2 md:gap-5">
            {coreTeam.slice(0, 2).map((m, i) => (
              <LeaderCard key={`core-${i}-${m.name}`} member={m} index={i + 1} />
            ))}
          </div>
        ) : null}

        {executionTeam?.length ? (
          <div
            className="grid gap-4 md:gap-5"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            }}
          >
            {executionTeam.map((m, i) => (
              <MemberCard
                key={`exec-${i}-${m.name}`}
                member={m}
                index={(coreTeam?.length ?? 0) + i + 1}
              />
            ))}
          </div>
        ) : null}

        {/* Closing line */}
        <div className="mt-14 flex items-center justify-center gap-3 text-center">
          <span
            className="h-[1px] w-16"
            style={{
              background:
                "linear-gradient(to right, transparent, color-mix(in oklch, var(--primary) 60%, transparent))",
            }}
            aria-hidden
          />
          <span className="text-[12px] font-medium tracking-[.18em] text-muted-foreground">
            نشتغل معاك مباشرة. بدون وسطاء.
          </span>
          <span
            className="h-[1px] w-16"
            style={{
              background:
                "linear-gradient(to left, transparent, color-mix(in oklch, var(--primary) 60%, transparent))",
            }}
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}

function StatPill({
  value,
  label,
  highlight,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`
        relative flex items-baseline gap-2 rounded-full border px-4 py-2 backdrop-blur-md
        ${highlight ? "border-primary/40 bg-primary/[0.08]" : "border-border/60 bg-card/40"}
      `}
    >
      <span
        className={`font-black tracking-tight ${highlight ? "text-primary" : "text-foreground"}`}
        style={{ fontSize: "clamp(18px, 2vw, 22px)", lineHeight: 1 }}
      >
        {value}
      </span>
      <span className="text-[11px] font-medium tracking-wide text-muted-foreground">{label}</span>
    </div>
  );
}

function LeaderCard({ member, index }: { member: TeamPageMember; index: number }) {
  const englishRole = extractEnglishRole(member.role);
  const arabicRole = extractDepartment(member.role);
  const photoUrl = member.avatarUrl?.trim();

  return (
    <article
      className="
        group relative isolate overflow-hidden rounded-3xl border border-border/60 bg-card/40
        backdrop-blur-sm transition-all duration-500
        hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10
      "
    >
      <div className="grid grid-cols-[1.1fr_1fr] gap-0">
        {/* Photo column — taller */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={`${member.name} — فريق JBRSEO`}
              fill
              sizes="(max-width: 768px) 50vw, 350px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              unoptimized
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center bg-gradient-to-tr ${member.avatarColor} text-3xl font-black text-white`}
            >
              {member.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("")}
            </div>
          )}
          {/* Gradient overlay for depth */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 40%, color-mix(in oklch, var(--background) 70%, transparent) 100%)",
            }}
          />
          {/* Index badge */}
          <div
            className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-primary/30 bg-background/85 px-2.5 py-1 backdrop-blur-md"
          >
            <span className="text-[10px] font-black tracking-wider text-primary">
              {toArabicNumeral(index)}
            </span>
          </div>
          {/* Leadership stamp */}
          <div className="absolute left-3 top-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-[.18em] text-primary-foreground shadow-lg shadow-primary/30"
            >
              <span className="h-[5px] w-[5px] rounded-full bg-primary-foreground" aria-hidden />
              معاك من اليوم الأول
            </span>
          </div>
        </div>

        {/* Info column */}
        <div className="relative flex flex-col justify-between p-5 sm:p-6">
          <div>
            <p className="text-[15px] font-black leading-tight text-foreground sm:text-[17px]">
              {member.name}
            </p>
            <div className="mt-2 flex flex-col gap-0.5">
              <span className="text-[12px] font-bold text-primary">{arabicRole}</span>
              {englishRole ? (
                <span className="text-[10px] font-medium uppercase tracking-[.14em] text-muted-foreground/80">
                  {englishRole}
                </span>
              ) : null}
            </div>
            <p className="mt-4 text-[12px] leading-[1.7] text-muted-foreground line-clamp-4">
              {member.bio}
            </p>
          </div>
          {/* Decorative quote mark */}
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-3 -left-1 select-none font-black text-primary/[0.07]"
            style={{ fontSize: "120px", lineHeight: 1 }}
          >
            ❞
          </span>
        </div>
      </div>
    </article>
  );
}

function MemberCard({ member, index }: { member: TeamPageMember; index: number }) {
  const englishRole = extractEnglishRole(member.role);
  const arabicRole = extractDepartment(member.role);
  const photoUrl = member.avatarUrl?.trim();

  return (
    <article
      className="
        group relative isolate overflow-hidden rounded-2xl border border-border/60 bg-card/30
        transition-all duration-500
        hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5
      "
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={`${member.name} — فريق JBRSEO`}
            fill
            sizes="(max-width: 768px) 50vw, 220px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-tr ${member.avatarColor} text-2xl font-black text-white`}
          >
            {member.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("")}
          </div>
        )}

        {/* Default gradient — name peeks at bottom */}
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 35%, color-mix(in oklch, var(--background) 25%, transparent) 65%, color-mix(in oklch, var(--background) 92%, transparent) 100%)",
          }}
        />

        {/* Hover overlay — full coverage with bio */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklch, var(--primary) 30%, transparent) 0%, color-mix(in oklch, var(--background) 95%, transparent) 50%, var(--background) 100%)",
          }}
        />

        {/* Index numeral — top-left */}
        <span
          aria-hidden
          className="
            absolute left-3 top-3 select-none font-black text-background/90 mix-blend-difference
            transition-all duration-500 group-hover:-translate-y-1 group-hover:text-primary group-hover:mix-blend-normal
          "
          style={{ fontSize: "20px", lineHeight: 1, letterSpacing: "0.05em" }}
        >
          {toArabicNumeral(index)}
        </span>

        {/* Department dot — top-right */}
        <span
          aria-hidden
          className={`absolute right-3 top-3 h-2 w-2 rounded-full bg-gradient-to-br ${member.avatarColor} shadow-md`}
        />

        {/* Default-state info — peeks from bottom */}
        <div
          className="absolute inset-x-0 bottom-0 p-3 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-2"
        >
          <p className="text-[12px] font-bold leading-tight text-foreground">
            {member.name}
          </p>
          <p className="mt-0.5 truncate text-[10px] font-medium text-primary">{arabicRole}</p>
        </div>

        {/* Hover-state info — slides in */}
        <div
          className="
            absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-2
            transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0
          "
        >
          <p className="text-[12px] font-black leading-tight text-foreground">{member.name}</p>
          <p className="mt-0.5 text-[10px] font-bold text-primary">{arabicRole}</p>
          {englishRole ? (
            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[.14em] text-muted-foreground">
              {englishRole}
            </p>
          ) : null}
          <p className="mt-2 text-[10.5px] leading-[1.6] text-muted-foreground line-clamp-3">
            {member.bio}
          </p>
        </div>
      </div>
    </article>
  );
}
