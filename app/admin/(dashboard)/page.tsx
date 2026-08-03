import { SubscribersPageClient } from "./subscribers/SubscribersPageClient";
import { getAllPlans } from "@/app/actions/pricing";

// Admin home = subscribers. The analytics dashboard moved to /admin/analytics
// (reachable via the "📊 التحليلات" button in the top nav).
export default async function AdminHomePage() {
  // Saudi plans (payment is SA-only — EG is WhatsApp leads) drive the plan
  // toggles + the revenue amount shown on each. Passed from the server so the
  // toggles always match the real pricing plans (shown even at 0 subscribers).
  const saPlans = await getAllPlans("SA");
  const plans = saPlans.map((p) => ({
    name: p.name.trim(),
    slug: p.slug,
    priceMonthly: p.priceMonthly,
    priceYearly: p.priceYearly,
  }));

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-bold text-foreground">المشتركون</h1>
      <SubscribersPageClient plans={plans} />
    </div>
  );
}
