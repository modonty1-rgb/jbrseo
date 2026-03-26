import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

export const metadata = { title: "خطة التسويق" };

type Tone = "green" | "gold" | "blue" | "red";

type Pill = { text: string; tone: Tone };
type TeamRole = { name: string; role: string; tasks: string[]; kpis: Pill[] };

type StatCard = { value: string; label: string; tone: Tone };

type KeyValueRow = { key: string; value: string; tone: Tone };

type SimpleTable = { headers: string[]; rows: string[][] };

type DataSourceRow = {
  index: string;
  source: string;
  dataTaken: string;
  href: string;
  linkText: string;
};

type MarketCard = { label: string; rows: KeyValueRow[] };

const STATIC_HTML_PATH = join(
  process.cwd(),
  "public",
  "html",
  "modonty-marketing-plan-v1.html",
);

const STATIC_HTML = readFileSync(STATIC_HTML_PATH, "utf8");

const KPI_SECTION_HTML_MATCH =
  /<div id="sec-kpi" class="sec">[\s\S]*?<\/div><\/div><!-- \/KPI -->/;

const KPI_SECTION_HTML: string = STATIC_HTML.match(KPI_SECTION_HTML_MATCH)?.[0] ?? "";

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)));
}

function stripTags(input: string): string {
  return decodeHtmlEntities(input.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}

function stripCell(input: string): string {
  return stripTags(input).replace(/\s+/g, " ").trim();
}

function extractBetween(html: string, startToken: string, endToken: string): string {
  const start = html.indexOf(startToken);
  if (start === -1) return "";
  const end = html.indexOf(endToken, start + startToken.length);
  if (end === -1) return "";
  return html.slice(start, end);
}

function parseToneFromClass(classAttr: string): Tone {
  const classes = classAttr.split(/\s+/g).filter(Boolean);
  if (classes.includes("kpg") || classes.includes("krvg") || classes.includes("ig")) return "green";
  if (classes.includes("kpo") || classes.includes("krvo") || classes.includes("io")) return "gold";
  if (classes.includes("kpb") || classes.includes("cib") || classes.includes("bb")) return "blue";
  return "red";
}

function toneToChipClasses(tone: Tone): string {
  switch (tone) {
    case "green":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    case "gold":
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";
    case "blue":
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";
    case "red":
      return "border-rose-500/20 bg-rose-500/10 text-rose-400";
    default:
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";
  }
}

function parseTeamRoles(teamBlockHtml: string): TeamRole[] {
  const cardStarts: number[] = [];
  let idx = 0;
  while (true) {
    const found = teamBlockHtml.indexOf('<div class="mc">', idx);
    if (found === -1) break;
    cardStarts.push(found);
    idx = found + 1;
  }
  if (cardStarts.length === 0) return [];

  const cards = cardStarts.map((start, i) =>
    teamBlockHtml.slice(start, cardStarts[i + 1] ?? teamBlockHtml.length),
  );

  return cards.map((cardHtml) => {
    const name = stripCell(cardHtml.match(/<div class="mc-name">([\s\S]*?)<\/div>/)?.[1] ?? "");
    const role = stripCell(cardHtml.match(/<div class="mc-role">([\s\S]*?)<\/div>/)?.[1] ?? "");

    const tasksUl = cardHtml.match(/<ul class="tl">([\s\S]*?)<\/ul>/)?.[1] ?? "";
    const tasks = [...tasksUl.matchAll(/<li[\s\S]*?>([\s\S]*?)<\/li>/g)].map((m) => stripCell(m[1]));

    const pillsDiv = cardHtml.match(/<div class="kpills">([\s\S]*?)<\/div>/)?.[1] ?? "";
    const pillMatches = [...pillsDiv.matchAll(/<span class="kp\s+([^"]+)">([\s\S]*?)<\/span>/g)];
    const kpis: Pill[] = pillMatches.map((m) => {
      const tone = parseToneFromClass(m[1]);
      const text = stripCell(m[2]);
      return { text, tone };
    });

    return { name, role, tasks, kpis };
  });
}

function parseStatCards(statsBlockHtml: string): StatCard[] {
  const statMatches = [...statsBlockHtml.matchAll(/<div style="font-size:20px[^"]*color:var\(--([a-z]+)\)">([\s\S]*?)<\/div>\s*<div style="font-size:11px[^"]*margin-top:2px">([\s\S]*?)<\/div>/g)];
  return statMatches.map((m) => {
    const varName = m[1];
    const value = stripCell(m[2]);
    const label = stripCell(m[3]);
    const tone: Tone =
      varName === "green" ? "green" : varName === "gold" ? "gold" : varName === "red" ? "red" : "blue";
    return { value, label, tone };
  });
}

function parseObjectiveCards(objectivesBlockHtml: string): KeyValueRow[][] {
  const cardStarts: number[] = [];
  let idx = 0;
  while (true) {
    const found = objectivesBlockHtml.indexOf('<div class="card">', idx);
    if (found === -1) break;
    cardStarts.push(found);
    idx = found + 1;
  }
  const cards = cardStarts.map((start, i) =>
    objectivesBlockHtml.slice(start, cardStarts[i + 1] ?? objectivesBlockHtml.length),
  );
  if (cards.length === 0) return [];

  return cards.map((cardHtml) => {
    const rows: KeyValueRow[] = [];
    const rowMatches = [...cardHtml.matchAll(/<div class="kr">[\s\S]*?<span class="krl">([\s\S]*?)<\/span>\s*<span class="krv([^"]*)">([\s\S]*?)<\/span>/g)];
    for (const m of rowMatches) {
      const key = stripCell(m[1]);
      const classAttr = m[2] ?? "";
      const value = stripCell(m[3]);
      const tone = parseToneFromClass(classAttr.includes("krvg") ? "krvg" : classAttr.includes("krvo") ? "krvo" : "krvb");
      rows.push({ key, value, tone });
    }
    return rows;
  });
}

function parseSimpleTable(tableHtml: string): SimpleTable {
  const thead = tableHtml.match(/<thead>[\s\S]*?<\/thead>/)?.[0] ?? "";
  const headers = [...thead.matchAll(/<th[\s\S]*?>([\s\S]*?)<\/th>/g)].map((x) => stripCell(x[1]));

  const rows: string[][] = [];
  const tbodyMatch = tableHtml.match(/<tbody>[\s\S]*?<\/tbody>/);
  const tbody = tbodyMatch?.[0] ?? "";
  const trMatches = [...tbody.matchAll(/<tr[\s\S]*?>([\s\S]*?)<\/tr>/g)];
  for (const tr of trMatches) {
    const trHtml = tr[1];
    const tdMatches = [...trHtml.matchAll(/<td[\s\S]*?>([\s\S]*?)<\/td>/g)];
    const rowCells = tdMatches.map((d) => stripCell(d[1]));
    if (rowCells.length > 0) rows.push(rowCells);
  }

  return { headers, rows };
}

function parseSourcesTable(sourcesBlockHtml: string): DataSourceRow[] {
  const tableMatch = sourcesBlockHtml.match(/<table>[\s\S]*?<\/table>/);
  if (!tableMatch) return [];
  const tableHtml = tableMatch[0] ?? "";
  const tbody = tableHtml.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0] ?? "";

  const trMatches = [...tbody.matchAll(/<tr[\s\S]*?>([\s\S]*?)<\/tr>/g)];
  return trMatches.map((m) => {
    const rowHtml = m[1] ?? "";
    const tds = [...rowHtml.matchAll(/<td[\s\S]*?>([\s\S]*?)<\/td>/g)].map((td) => td[1] ?? "");
    const index = stripCell(tds[0] ?? "");
    const source = stripCell(tds[1] ?? "");
    const dataTaken = stripCell(tds[2] ?? "");

    const linkMatch = tds[3]?.match(/<a[\s\S]*?href="([^"]+)"[\s\S]*?>([\s\S]*?)<\/a>/);
    const href = linkMatch?.[1] ? stripCell(linkMatch[1]) : "";
    const linkText = linkMatch?.[2] ? stripCell(linkMatch[2]) : "";

    return { index, source, dataTaken, href, linkText };
  });
}

function parseMarketStats(marketStatsRangeHtml: string): {
  infoText: string;
  cards: MarketCard[];
} {
  const infoText = stripCell(
    marketStatsRangeHtml.match(/<div class="info ib"[\s\S]*?>([\s\S]*?)<\/div>/)?.[1] ?? "",
  );

  const cardStarts: number[] = [];
  let idx = 0;
  while (true) {
    const found = marketStatsRangeHtml.indexOf('<div class="card"', idx);
    if (found === -1) break;
    cardStarts.push(found);
    idx = found + 1;
  }

  const cards = cardStarts.map((start, i) =>
    marketStatsRangeHtml.slice(start, cardStarts[i + 1] ?? marketStatsRangeHtml.length),
  );

  const parsedCards: MarketCard[] = cards.map((cardHtml) => {
    const label = stripCell(cardHtml.match(/<div style="font-size:11px[\s\S]*?">([\s\S]*?)<\/div>/)?.[1] ?? "");
    const rowMatches = [...cardHtml.matchAll(/<div class="kr">[\s\S]*?<span class="krl">([\s\S]*?)<\/span><span class="krv([^"]*)">([\s\S]*?)<\/span><\/div>/g)];
    const rows: KeyValueRow[] = rowMatches.map((m) => {
      const key = stripCell(m[1]);
      const tone = parseToneFromClass(m[2] ?? "");
      const value = stripCell(m[3]);
      return { key, value, tone };
    });
    return { label, rows };
  });

  return { infoText, cards: parsedCards };
}

const kpiData = (() => {
  const headerTitle =
    stripCell(KPI_SECTION_HTML.match(/<div class="ph-title">([\s\S]*?)<\/div>/)?.[1] ?? "");
  const headerSub =
    stripCell(KPI_SECTION_HTML.match(/<div class="ph-sub">([\s\S]*?)<\/div>/)?.[1] ?? "");

  const headerTagsDiv = KPI_SECTION_HTML.match(/<div class="ph-tags">([\s\S]*?)<\/div>/)?.[1] ?? "";
  const tagMatches = [...headerTagsDiv.matchAll(/<span class="b\s+[^"]*">([\s\S]*?)<\/span>/g)];
  const tags = tagMatches.map((m) => stripCell(m[1]));

  const accountingPrinciple = stripCell(
    KPI_SECTION_HTML.match(/<div class="info ib">\s*<strong>مبدأ المحاسبة:<\/strong>\s*([\s\S]*?)<\/div>/)?.[1] ?? "",
  );

  const statsBlock = extractBetween(
    KPI_SECTION_HTML,
    "<!-- إجمالي الأصول الشهرية -->",
    "<!-- الفريق -->",
  );
  const stats = parseStatCards(statsBlock);

  const teamBlock = extractBetween(
    KPI_SECTION_HTML,
    "<!-- الفريق -->",
    "<!-- قائمة ما قبل الإطلاق -->",
  );
  const team = parseTeamRoles(teamBlock);

  const objectivesBlock = extractBetween(
    KPI_SECTION_HTML,
    "<!-- الأهداف الإجمالية -->",
    "<!-- ═══ جدول KPIs الشهرية المفصلة ═══ -->",
  );
  const objectiveRows = parseObjectiveCards(objectivesBlock);

  const saRange = extractBetween(
    KPI_SECTION_HTML,
    '<div class="slbl">🇸🇦 السعودية — تطور KPIs شهر بشهر</div>',
    '<div class="slbl">🇪🇬 مصر — تطور KPIs شهر بشهر</div>',
  );
  const saTableHtml = saRange.match(/<table>[\s\S]*?<\/table>/)?.[0] ?? "";
  const saTable = saTableHtml ? parseSimpleTable(saTableHtml) : { headers: [], rows: [] };

  const egRange = extractBetween(
    KPI_SECTION_HTML,
    '<div class="slbl">🇪🇬 مصر — تطور KPIs شهر بشهر</div>',
    '<div class="slbl">مقارنة SA vs EG — الفروقات الجوهرية في الـ KPIs</div>',
  );
  const egTableHtml = egRange.match(/<table>[\s\S]*?<\/table>/)?.[0] ?? "";
  const egTable = egTableHtml ? parseSimpleTable(egTableHtml) : { headers: [], rows: [] };

  const comparisonRange = extractBetween(
    KPI_SECTION_HTML,
    '<div class="slbl">مقارنة SA vs EG — الفروقات الجوهرية في الـ KPIs</div>',
    "<!-- اجتماع الأحد -->",
  );
  const comparisonTableHtml = comparisonRange.match(/<table>[\s\S]*?<\/table>/)?.[0] ?? "";
  const comparisonTable = comparisonTableHtml ? parseSimpleTable(comparisonTableHtml) : { headers: [], rows: [] };

  const meetingRange = extractBetween(KPI_SECTION_HTML, "<!-- اجتماع الأحد -->", "<!-- تقارير -->");
  const meetingTableHtml = meetingRange.match(/<table>[\s\S]*?<\/table>/)?.[0] ?? "";
  const meetingTable = meetingTableHtml ? parseSimpleTable(meetingTableHtml) : { headers: [], rows: [] };

  const reportsRange = extractBetween(
    KPI_SECTION_HTML,
    "<!-- تقارير -->",
    "<!-- إحصائيات السوق المصري-السعودي -->",
  );
  const reportsTableHtml = reportsRange.match(/<table>[\s\S]*?<\/table>/)?.[0] ?? "";
  const reportsTable = reportsTableHtml ? parseSimpleTable(reportsTableHtml) : { headers: [], rows: [] };

  const marketStatsRange = extractBetween(
    KPI_SECTION_HTML,
    "<!-- إحصائيات السوق المصري-السعودي -->",
    "<!-- مصادر البيانات -->",
  );

  const sourcesRange = extractBetween(
    KPI_SECTION_HTML,
    "<!-- مصادر البيانات -->",
    "<!-- 🔥 SALES FUNNEL + MARKETING FUNNEL + SALES PROCESS",
  );

  const sources = parseSourcesTable(sourcesRange);

  const gaLine =
    KPI_SECTION_HTML.match(/<div class="info ig"[\s\S]*?<strong>GA4:<\/strong>[\s\S]*?<\/div>/)?.[0] ?? "";
  const gaText = gaLine
    ? stripCell(gaLine.replace(/.*?<strong>GA4:<\/strong>/, ""))
    : "";

  return {
    headerTitle,
    headerSub,
    tags,
    accountingPrinciple,
    stats,
    team,
    objectiveRows,
    saTable,
    egTable,
    comparisonTable,
    meetingTable,
    reportsTable,
    marketStats: parseMarketStats(marketStatsRange),
    sources,
    gaText,
  };
})();

function ToneChip({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold",
        toneToChipClasses(tone),
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function SimpleSectionTitle({ title }: { title: string }) {
  return <h2 className="text-base font-bold text-foreground">{title}</h2>;
}

export default function MarketingPage() {
  const saObjective = kpiData.objectiveRows[0];
  const egObjective = kpiData.objectiveRows[1];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            JBRSEO — {kpiData.headerTitle || "KPI والفريق"}
          </h1>
          {kpiData.headerSub && !kpiData.headerSub.includes("فريق واحد") ? (
            <p className="mt-1 text-sm text-muted-foreground">{kpiData.headerSub}</p>
          ) : null}
        </div>

        <a
          href="/admin/marketing/static"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-primary underline underline-offset-4"
        >
          افتح الخطة التسويقية الكاملة
        </a>
      </div>

      <Card className="border-amber-500/35 bg-amber-500/10">
        <CardContent className="pt-5">
          <p className="text-sm text-amber-100">
            <span className="font-bold text-amber-300">🛠️ إعداد المهندس خالد:</span> الخطة قابلة للتعديل.
            الموافقة تعني الالتزام والمحاسبة.
          </p>
        </CardContent>
      </Card>

      <Card className="border-rose-500/35 bg-rose-500/10">
        <CardContent className="pt-5">
          <p className="text-sm text-rose-100">
            <span className="font-bold text-rose-300">🚨 تنبيه إداري:</span> الاعتذار بعدم استلام المهمة من المسؤول
            المباشر غير مقبول. واجبك المتابعة الاستباقية مع الجهة المسؤولة عن تسليم المهام، لأن التقييم
            والمحاسبة يكونان على نتائجك النهائية.
          </p>
        </CardContent>
      </Card>

      {(() => {
        const tagsToHide = new Set(["Designer", "Video Editor", "Media Buyer", "Dev Manager"]);
        const visibleTags = kpiData.tags.filter((t) => !tagsToHide.has(t));
        if (visibleTags.length === 0) return null;

        return (
          <div className="flex flex-wrap gap-2">
            {visibleTags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-md border border-border/60 bg-muted/20 px-2.5 py-0.5 text-[11px] font-semibold text-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        );
      })()}

      {kpiData.accountingPrinciple ? (
        <Card>
          <CardContent className="pt-5">
            <div className="text-sm">
              <span className="font-bold">مبدأ المحاسبة:</span> {kpiData.accountingPrinciple}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {kpiData.stats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kpiData.stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-6">
                <div className="text-2xl font-extrabold text-foreground">
                  <span className={s.tone === "green" ? "text-emerald-400" : s.tone === "gold" ? "text-amber-400" : s.tone === "red" ? "text-rose-400" : "text-blue-400"}>
                    {s.value}
                  </span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {kpiData.team.length > 0 ? (
        <section className="space-y-4">
          <SimpleSectionTitle title="أدوار الفريق — التاسكات والـ KPIs" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {kpiData.team.map((role) => (
              <Card key={role.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{role.name}</CardTitle>
                  {role.role ? <div className="mt-1 text-xs text-muted-foreground font-medium">{role.role}</div> : null}
                </CardHeader>
                <CardContent className="space-y-4">
                  {role.tasks.length > 0 ? (
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground">التاسكات الأسبوعية</div>
                      <ul className="mt-2 space-y-1 text-sm text-foreground/90">
                        {role.tasks.map((t) => (
                          <li key={t} className="flex gap-2">
                            <span className="text-emerald-400">›</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {role.kpis.length > 0 ? (
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground">الـ KPIs</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {role.kpis.map((p) => (
                          <ToneChip key={p.text} tone={p.tone}>
                            {p.text}
                          </ToneChip>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <SimpleSectionTitle title="KPIs الأهداف الإجمالية — نهاية 90 يوم" />
        {(saObjective && egObjective) ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="font-bold">🇸🇦 السعودية</div>
                <div className="mt-4 space-y-3">
                  {saObjective.map((r) => (
                    <div key={r.key} className="flex items-center justify-between gap-4">
                      <div className="text-sm text-foreground/90">{r.key}</div>
                      <div className="text-sm font-mono font-semibold whitespace-nowrap">
                        <span className={r.tone === "green" ? "text-emerald-400" : "text-amber-400"}>{r.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="font-bold">🇪🇬 مصر</div>
                <div className="mt-4 space-y-3">
                  {egObjective.map((r) => (
                    <div key={r.key} className="flex items-center justify-between gap-4">
                      <div className="text-sm text-foreground/90">{r.key}</div>
                      <div className="text-sm font-mono font-semibold whitespace-nowrap">
                        <span className={r.tone === "green" ? "text-emerald-400" : "text-amber-400"}>{r.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </section>

      {kpiData.saTable.headers.length > 0 ? (
        <section className="space-y-4">
          <SimpleSectionTitle title="KPIs الشهرية المفصلة — السعودية" />
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    {kpiData.saTable.headers.map((h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpiData.saTable.rows.map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => (
                        <TableCell key={j}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {kpiData.egTable.headers.length > 0 ? (
        <section className="space-y-4">
          <SimpleSectionTitle title="KPIs الشهرية المفصلة — مصر" />
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    {kpiData.egTable.headers.map((h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpiData.egTable.rows.map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => (
                        <TableCell key={j}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {kpiData.comparisonTable.headers.length > 0 ? (
        <section className="space-y-4">
          <SimpleSectionTitle title="مقارنة SA vs EG — الفروقات الجوهرية" />
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    {kpiData.comparisonTable.headers.map((h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpiData.comparisonTable.rows.map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => (
                        <TableCell key={j}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {kpiData.meetingTable.headers.length > 0 ? (
        <section className="space-y-4">
          <SimpleSectionTitle title="اجتماع الأحد الأسبوعي — 45 دقيقة" />
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    {kpiData.meetingTable.headers.map((h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpiData.meetingTable.rows.map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => (
                        <TableCell key={j}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {kpiData.reportsTable.headers.length > 0 ? (
        <section className="space-y-4">
          <SimpleSectionTitle title="نظام التقارير" />
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    {kpiData.reportsTable.headers.map((h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpiData.reportsTable.rows.map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => (
                        <TableCell key={j}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {kpiData.marketStats.cards.length > 0 ? (
        <section className="space-y-4">
          <SimpleSectionTitle title="إحصائيات السوق — السياحة السعودية لمصر" />
          {kpiData.marketStats.infoText ? (
            <Card>
              <CardContent className="pt-5">
                <div className="text-sm text-muted-foreground">{kpiData.marketStats.infoText}</div>
              </CardContent>
            </Card>
          ) : null}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {kpiData.marketStats.cards.map((c) => (
              <Card key={c.label}>
                <CardContent className="pt-6 space-y-4">
                  {c.label ? <div className="text-sm font-bold">{c.label}</div> : null}
                  {c.rows.length > 0 ? (
                    <div className="space-y-3">
                      {c.rows.map((r) => (
                        <div key={r.key} className="flex items-center justify-between gap-4">
                          <div className="text-sm text-foreground/90">{r.key}</div>
                          <div className="text-sm font-mono font-semibold whitespace-nowrap">
                            <span
                              className={
                                r.tone === "green"
                                  ? "text-emerald-400"
                                  : r.tone === "gold"
                                    ? "text-amber-400"
                                    : r.tone === "red"
                                      ? "text-rose-400"
                                      : "text-blue-400"
                              }
                            >
                              {r.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {kpiData.sources.length > 0 ? (
        <section className="space-y-4">
          <SimpleSectionTitle title="مصادر البيانات" />
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>المصدر</TableHead>
                    <TableHead>البيانات المأخوذة منه</TableHead>
                    <TableHead>الرابط المباشر</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpiData.sources.map((s) => (
                    <TableRow key={s.index}>
                      <TableCell>{s.index}</TableCell>
                      <TableCell>{s.source}</TableCell>
                      <TableCell>{s.dataTaken}</TableCell>
                      <TableCell>
                        {s.href ? (
                          <a
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline underline-offset-4"
                          >
                            {s.linkText}
                          </a>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {kpiData.gaText ? (
                <div className="mt-4 text-sm text-muted-foreground">
                  <span className="font-semibold">GA4:</span> {kpiData.gaText}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
