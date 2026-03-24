export const PLAN_STYLES: Record<string, string> = {
  الانطلاقة: "bg-primary/10 text-primary border-primary/20",
  "مجاني تجربة":
    "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  المجانية: "bg-muted text-muted-foreground border-border",
  default: "bg-muted text-muted-foreground border-border",
};

export function planBadgeClass(planName: string): string {
  const key = planName.trim();
  return PLAN_STYLES[key] ?? PLAN_STYLES.default;
}
