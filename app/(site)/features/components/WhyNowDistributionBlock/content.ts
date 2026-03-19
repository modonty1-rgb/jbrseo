export type DistributionChannel = {
  icon: string;
  label: string;
  sub: string;
  employee: boolean;
  employeeNote: string;
  modontyNote: string;
  highlight: boolean;
};

export const DISTRIBUTION_CHANNELS: DistributionChannel[] = [
  {
    icon: "🌐",
    label: "موقعك الإلكتروني",
    sub: "مقالك منشور على نطاقك",
    employee: true,
    employeeNote: "الموظف يفعله",
    modontyNote: "مشمول في كل الباقات",
    highlight: false,
  },
  {
    icon: "📣",
    label: "منصات مدونتي",
    sub: "ينتشر على قنوات مدونتي الخاصة",
    employee: false,
    employeeNote: "لا يملكها",
    modontyNote: "جمهور في نمو مستمر",
    highlight: true,
  },
  {
    icon: "📲",
    label: "منصات التواصل الاجتماعي",
    sub: "X، لينكدإن، إنستغرام، تيك توك...",
    employee: false,
    employeeNote: "تكلفة إضافية",
    modontyNote: "مشمول حسب الباقة",
    highlight: true,
  },
  {
    icon: "💰",
    label: "إعلان ممول (اختياري)",
    sub: "تضخيم المقال بميزانية إعلانية",
    employee: false,
    employeeNote: "تكلفة منفصلة",
    modontyNote: "خيار متاح عند الطلب",
    highlight: true,
  },
];

export const WHY_NOW_DISTRIBUTION_COPY = {
  topIcon: "✦",
  topTitle: "ما لا تحصل عليه بالتوظيف",
  topSubtitle: "مقالك الواحد يصل أبعد بكثير مع مدونتي",
  headerLeft: "قناة التوزيع",
  headerEmployee: "موظف عادي",
  brandLabel: "مدونتي",
  brandChip: "أفضل خيار",
  footerIcon: "💡",
  footerPrefix: "مقالك الواحد يعمل في ",
  footerPlaces: "٤ أماكن",
  footerMiddle: " في نفس الوقت — موظفك يعمل في ",
  footerSinglePlace: "مكان واحد",
  footerSuffix: " فقط.",
} as const;

