import type { ReactNode } from "react";
import { Card } from "@/app/components/ui/card";

import { LeadsBlockFooter } from "./LeadsBlockFooter";
import { LeadsEmailCampaignSection } from "./LeadsEmailCampaignSection";
import { LeadsOverviewSection } from "./LeadsOverviewSection";
import { LeadsWhatsAppCampaignSection } from "./LeadsWhatsAppCampaignSection";

export { LeadsEmailCampaignSection } from "./LeadsEmailCampaignSection";
export { LeadsOverviewSection } from "./LeadsOverviewSection";
export { LeadsWhatsAppCampaignSection } from "./LeadsWhatsAppCampaignSection";

export function LeadsBlock(): ReactNode {
  return (
    <div className="mx-auto mb-6 max-w-[960px]" dir="rtl">
      <Card className="overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-sm">
        <LeadsOverviewSection />
        <LeadsEmailCampaignSection />
        <LeadsWhatsAppCampaignSection />
        <LeadsBlockFooter />
      </Card>
    </div>
  );
}
