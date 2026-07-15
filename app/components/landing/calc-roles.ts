import {
  PenTool,
  Palette,
  Search,
  Smartphone,
  Video,
  Code,
  type LucideIcon,
} from "lucide-react";

export type CalcRole = {
  key: string;
  label: string;
  icon: LucideIcon;
  def: number;
  min: number;
  max: number;
};

// Team-salary roles powering the "cost of an in-house team" calculator.
// Shared between Landing (math section + salaries seed) and the lazy modal,
// so the numbers stay in one place.
export const CALC_ROLES: ReadonlyArray<CalcRole> = [
  { key: "writer",   label: "كاتب محتوى سيو",       icon: PenTool,    def: 2500, min: 2000, max: 12000 },
  { key: "designer", label: "مصمم جرافيك",         icon: Palette,    def: 3500, min: 2500, max: 12000 },
  { key: "seo",      label: "متخصص سيو",           icon: Search,     def: 3500, min: 2500, max: 14000 },
  { key: "social",   label: "مدير سوشال ميديا",    icon: Smartphone, def: 3000, min: 2500, max: 12000 },
  { key: "video",    label: "مونتير / منتج فيديو", icon: Video,      def: 3000, min: 2500, max: 14000 },
  { key: "dev",      label: "مطور مواقع",          icon: Code,       def: 4500, min: 3000, max: 18000 },
];
