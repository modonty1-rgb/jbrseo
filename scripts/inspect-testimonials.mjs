import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rows = await prisma.landingSection.findMany({
  where: { section: "socialProof" },
});

for (const r of rows) {
  console.log(`\n══════ section=socialProof — country=${r.country} ══════`);
  const data = r.data;
  console.log(`title:    ${data.title ?? "(none)"}`);
  console.log(`subtitle: ${data.subtitle ?? "(none)"}`);
  console.log(`founding: ${data.founding ?? "(none)"}`);
  console.log(`eyebrow:  ${data.eyebrow ?? "(none)"}`);
  const ts = data.testimonials ?? [];
  console.log(`testimonials: ${ts.length} items\n`);
  ts.forEach((t, i) => {
    console.log(`  ── [${i}] ${t.name ?? "(no name)"} ──`);
    console.log(`    role:        ${t.role ?? ""}`);
    console.log(`    company:     ${t.company ?? ""}`);
    console.log(`    quote:       ${(t.quote ?? "").slice(0, 80)}${(t.quote ?? "").length > 80 ? "…" : ""}`);
    console.log(`    avatarImg:   ${t.avatarImg ?? "(empty)"}`);
    console.log(`    videoUrl:    ${t.videoUrl ?? "(empty)"}`);
    console.log(`    videoLabel:  ${t.videoLabel ?? "(empty)"}`);
    console.log(`    mediaImage:  ${t.mediaImage ?? "(empty)"}`);
    console.log(`    siteLink:    ${t.siteLink ?? "(empty)"}`);
    console.log(`    metric:      ${t.metric ?? ""}`);
    console.log(`    stars:       ${t.stars ?? ""}`);
    console.log(`    tag:         ${t.tag ?? ""}`);
    console.log();
  });
}

await prisma.$disconnect();
