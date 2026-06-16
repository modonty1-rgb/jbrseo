import type { ReactNode } from "react";

export default function MarketingShellLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="marketing-surface text-foreground overflow-x-clip">
      <main id="main-content">{children}</main>
    </div>
  );
}
