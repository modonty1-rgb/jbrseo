import type { ReactNode } from "react";

// Foundation-layer edit: wrap entire marketing shell (announcement + navbar + landing + footer + sticky)
// inside .marketing-surface so they all inherit Readex Pro font + correct surface tokens.
// text-[#0A0A0A] pairs with .marketing-surface (which intentionally does NOT set color) so descendants
// can still override with text-white etc. overflow-x-clip prevents off-canvas children leaking.
export default function MarketingShellLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="marketing-surface text-[#0A0A0A] overflow-x-clip">
      <main id="main-content">{children}</main>
    </div>
  );
}
