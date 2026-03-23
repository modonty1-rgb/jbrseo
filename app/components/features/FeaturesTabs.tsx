import Link from "next/link";
import type { ReactElement } from "react";

import { ActivityDashboardBlock } from "@/app/(site)/features/components/ActivityDashboardBlock";
import { ArticleExtrasBlock } from "@/app/(site)/features/components/ArticleExtrasBlock";
import { ClientPageBlock } from "@/app/(site)/features/components/ClientPageBlock";
import { ExclusiveFeaturesBlock } from "@/app/(site)/features/components/ExclusiveFeaturesBlock";
import { WhyNowCommentsBlock } from "@/app/(site)/features/components/WhyNowCommentsBlock";
import { WhyNowDirectInquiryBlock } from "@/app/(site)/features/components/WhyNowDirectInquiryBlock";
import { WhyNowDistributionBlock } from "@/app/(site)/features/components/WhyNowDistributionBlock";
import {
  LeadsEmailCampaignSection,
  LeadsOverviewSection,
  LeadsWhatsAppCampaignSection,
} from "@/app/(site)/features/components/LeadsBlock";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
function TabCtaRow({ primary, secondary }: { primary: string; secondary: string }): ReactElement {
  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:gap-3">
      <Button asChild className="flex-1">
        <Link href="/sa/signup">{primary}</Link>
      </Button>
      <Button asChild variant="outline" className="flex-1">
        <Link href="/sa/pricing">{secondary}</Link>
      </Button>
    </div>
  );
}

function CampaignExtrasCards(): ReactElement {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="rounded-2xl border border-border bg-muted/30 p-5">
        <p className="mb-2 text-[13px] font-bold text-foreground">تقسيم الجمهور</p>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          صفِّ leads حسب السخونة والمصدر والاهتمام — ثم أطلق حملة لكل شريحة بدقة.
        </p>
      </Card>
      <Card className="rounded-2xl border border-border bg-muted/30 p-5">
        <p className="mb-2 text-[13px] font-bold text-foreground">تتبع الأداء</p>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          تابع معدلات الفتح والرد والتحويل لكل حملة من لوحة واحدة — بدون جداول خارجية.
        </p>
      </Card>
    </div>
  );
}

function DashboardTrafficStrip(): ReactElement {
  const bars = [
    { label: "بحث جوجل", pct: 72 },
    { label: "مباشر", pct: 45 },
    { label: "سوشال", pct: 38 },
    { label: "إحالة", pct: 22 },
  ];
  const sources = [
    { name: "Google / Organic", share: "٤٢٪" },
    { name: "Direct", share: "٢٨٪" },
    { name: "Social", share: "١٨٪" },
    { name: "Referral", share: "١٢٪" },
  ];

  return (
    <Card className="overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-sm">
      <div className="border-b border-border bg-muted/40 px-6 py-4">
        <p className="text-[13px] font-bold text-foreground">الزيارات حسب المصدر</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">عرض ثابت توضيحي — يتغير حسب نشاطك الفعلي</p>
      </div>
      <div className="px-6 py-6">
        <div className="mb-6 flex h-40 items-end gap-2 sm:gap-3" dir="ltr">
          {bars.map((b) => (
            <div key={b.label} className="flex h-full min-h-0 flex-1 flex-col items-center justify-end gap-2">
              <div
                className="w-full max-w-[56px] rounded-t-md bg-linear-to-t from-primary/80 to-primary/40"
                style={{ height: `${Math.round((b.pct / 100) * 120)}px` }}
              />
              <span className="text-center text-[10px] font-semibold text-muted-foreground">{b.label}</span>
            </div>
          ))}
        </div>
        <p className="mb-3 text-[12px] font-bold text-foreground">مصادر الزيارات</p>
        <ul className="space-y-2">
          {sources.map((s) => (
            <li key={s.name} className="flex items-center justify-between border-b border-border/60 py-2 text-[12px] last:border-b-0">
              <span className="text-muted-foreground">{s.name}</span>
              <span className="font-extrabold text-foreground">{s.share}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function DashboardStatsStrip(): ReactElement {
  const items = [
    { icon: "📄", label: "مقالات", val: "٤٣" },
    { icon: "👁", label: "زيارات", val: "١٢٤" },
    { icon: "🎯", label: "leads", val: "٦" },
    { icon: "🔥", label: "ساخن", val: "٢" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((it) => (
        <Card key={it.label} className="rounded-xl border border-border bg-muted/30 p-4 text-center">
          <div className="mb-2 text-lg">{it.icon}</div>
          <p className="text-[20px] font-black text-foreground">{it.val}</p>
          <p className="mt-1 text-[11px] font-semibold text-muted-foreground">{it.label}</p>
        </Card>
      ))}
    </div>
  );
}

export function FeaturesTabs(): ReactElement {
  return (
    <div className="bg-background px-5 pb-12 pt-2 text-foreground" dir="rtl">
      <Tabs defaultValue="content" className="mx-auto max-w-[960px]">
        <div className="mb-8 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList className="inline-flex h-auto min-w-min flex-nowrap justify-start gap-1 bg-muted p-1.5 sm:w-full sm:justify-center">
            <TabsTrigger value="content" className="shrink-0 px-4 py-2 text-sm">
              المحتوى
            </TabsTrigger>
            <TabsTrigger value="comms" className="shrink-0 px-4 py-2 text-sm">
              التواصل
            </TabsTrigger>
            <TabsTrigger value="leads" className="shrink-0 px-4 py-2 text-sm">
              قاعدة Leads
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="shrink-0 px-4 py-2 text-sm">
              الحملات
            </TabsTrigger>
            <TabsTrigger value="dash" className="shrink-0 px-4 py-2 text-sm">
              لوحة التحكم
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="content" className="mt-0 space-y-6 focus-visible:outline-none">
          <WhyNowDistributionBlock />
          <ExclusiveFeaturesBlock />
          <ArticleExtrasBlock />
          <ClientPageBlock />
          <TabCtaRow primary="ابدأ مجاناً" secondary="شوف الأسعار" />
        </TabsContent>

        <TabsContent value="comms" className="mt-0 space-y-6 focus-visible:outline-none">
          <WhyNowDirectInquiryBlock />
          <WhyNowCommentsBlock />
          <ExclusiveFeaturesBlock includeIds={["reviews", "followers"]} />
          <TabCtaRow primary="جرّب التواصل المباشر" secondary="شوف صفحة الشركة" />
        </TabsContent>

        <TabsContent value="leads" className="mt-0 space-y-6 focus-visible:outline-none">
          <Card className="overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-sm">
            <LeadsOverviewSection tailDivider={false} />
          </Card>
          <TabCtaRow primary="ابدأ وبناء قاعدة عملائك" secondary="شوف الأسعار" />
        </TabsContent>

        <TabsContent value="campaigns" className="mt-0 space-y-6 focus-visible:outline-none">
          <Card className="overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-sm">
            <LeadsEmailCampaignSection />
            <LeadsWhatsAppCampaignSection />
          </Card>
          <CampaignExtrasCards />
          <TabCtaRow primary="أطلق أول حملة مجاناً" secondary="شوف الأسعار" />
        </TabsContent>

        <TabsContent value="dash" className="mt-0 space-y-6 focus-visible:outline-none">
          <DashboardStatsStrip />
          <ActivityDashboardBlock />
          <DashboardTrafficStrip />
          <TabCtaRow primary="ابدأ وادخل لوحتك اليوم" secondary="شوف الأسعار" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
