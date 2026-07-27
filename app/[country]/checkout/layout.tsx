import type { ReactNode } from "react";

// Focus mode: no marketing nav, no sticky CTA, no footer noise.
// Only the minimal chrome the checkout page owns via CheckoutHeader.
//
// translate="no" + notranslate: browser auto-translation (Google Translate)
// reparents bare text nodes into <font> wrappers and runs a live
// MutationObserver; during the payment submit→3DS→status sequence React
// surgically removes a toggled text node whose parent Translate has changed,
// throwing `NotFoundError: removeChild` and crashing the tree to error.tsx
// (React issue #11538). Disabling translation on the money flow kills the
// root cause without touching payment logic. Covers all checkout sub-routes.
export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div translate="no" className="notranslate min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
