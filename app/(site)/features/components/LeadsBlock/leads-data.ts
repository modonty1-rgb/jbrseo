export type LeadTag = "hot" | "warm" | "cold";

export type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  whatsapp: boolean;
  source: string;
  article: string;
  date: string;
  tag: LeadTag;
  tagLabel: string;
};

export const LEADS: Lead[] = [
  {
    id: 1,
    name: "أحمد العمري",
    email: "a.omari@nabdco.com.sa",
    phone: "0550123456",
    whatsapp: true,
    source: "تعليق",
    article: "كيف يرفع المحتوى مبيعات شركتك",
    date: "منذ ١٠ دقائق",
    tag: "hot",
    tagLabel: "عميل محتمل ساخن",
  },
  {
    id: 2,
    name: "عبدالله السبيعي",
    email: "a.subaie@alsubaie.sa",
    phone: "0512345678",
    whatsapp: true,
    source: "سؤال",
    article: "أفضل استراتيجيات تسويق B2B",
    date: "منذ يومين",
    tag: "hot",
    tagLabel: "عميل محتمل ساخن",
  },
  {
    id: 3,
    name: "سارة الدوسري",
    email: "s.dosari@visionco.sa",
    phone: "0501234567",
    whatsapp: true,
    source: "سؤال",
    article: "صفحة الشركة",
    date: "منذ ٣ ساعات",
    tag: "warm",
    tagLabel: "مهتم",
  },
  {
    id: 4,
    name: "فهد الحربي",
    email: "f.harbi@alharbi-co.com",
    phone: "0543219876",
    whatsapp: true,
    source: "تعليق",
    article: "استراتيجيات تسويق B2B",
    date: "أمس",
    tag: "warm",
    tagLabel: "مهتم",
  },
  {
    id: 5,
    name: "منى العجمي",
    email: "m.ajmi@gulf-retail.com",
    phone: "0567891234",
    whatsapp: false,
    source: "تسجيل",
    article: "النشرة الإخبارية",
    date: "منذ يومين",
    tag: "cold",
    tagLabel: "مشترك",
  },
  {
    id: 6,
    name: "ريم الزهراني",
    email: "r.zahrani@maroof-sa.com",
    phone: "0598765432",
    whatsapp: true,
    source: "تعليق",
    article: "كيف يرفع المحتوى مبيعات شركتك",
    date: "منذ أسبوع",
    tag: "cold",
    tagLabel: "مشترك",
  },
];

export const TAG_STYLE: Record<LeadTag, { row: string; badge: string; avatar: string }> = {
  hot: { row: "border-red-200 bg-red-50/50", badge: "border-red-200 bg-red-50 text-red-700", avatar: "from-red-600 to-red-800" },
  warm: { row: "border-amber-200 bg-amber-50/50", badge: "border-amber-200 bg-amber-50 text-amber-700", avatar: "from-amber-600 to-amber-800" },
  cold: { row: "border-border bg-background", badge: "border-sky-200 bg-sky-50 text-sky-700", avatar: "from-sky-600 to-sky-800" },
};

export const TAG_ICON: Record<LeadTag, string> = { hot: "🔥", warm: "⚡", cold: "❄️" };

export const leadsStats = [
  { icon: "👥", label: "إجمالي الـ Leads", val: LEADS.length, color: "text-foreground", bg: "bg-muted/40" },
  { icon: "🔥", label: "ساخنون", val: LEADS.filter((l) => l.tag === "hot").length, color: "text-red-600", bg: "bg-red-50" },
  { icon: "⚡", label: "مهتمون", val: LEADS.filter((l) => l.tag === "warm").length, color: "text-amber-600", bg: "bg-amber-50" },
  { icon: "💬", label: "لديهم واتساب", val: LEADS.filter((l) => l.whatsapp).length, color: "text-green-600", bg: "bg-green-50" },
];

export const emailRecipients = LEADS.filter((l) => l.tag !== "cold");
export const whatsappRecipients = LEADS.filter((l) => l.whatsapp);
