import type { ReactNode } from "react";

export function LeadsBlockFooter(): ReactNode {
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-border bg-muted/40 px-6 py-4">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] text-white"
        style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)" }}
      >
        ✦
      </div>
      <p className="flex-1 text-[12px] font-semibold leading-relaxed text-foreground">
        الموظف يكتب المقال فقط — مدونتي تكتب المقال وتبني لك قاعدة leads حقيقية جاهزة للحملات من نفس اللحظة.
      </p>
      <span className="rounded-full border border-border bg-background px-3.5 py-1.5 text-[11px] font-bold text-muted-foreground">٣ أدوات · ٦ leads</span>
    </div>
  );
}
