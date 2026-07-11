import type { ReactNode } from "react";

// Focus mode: no marketing nav, no sticky CTA, no footer noise.
// Only the minimal chrome the checkout page owns via CheckoutHeader.
export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
