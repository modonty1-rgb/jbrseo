export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  avatarColor: string;
  group: "core" | "execution";
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "اسم العضو الأول",
    role: "المؤسس ومدير استراتيجية SEO",
    bio:
      "يقود رؤية المنصة، يحدد إستراتيجية المحتوى والبحث لكل عميل، ويتابع مدى ارتباطها بأهداف المبيعات الحقيقية.",
    avatarColor: "from-primary/70 to-primary",
    group: "core",
  },
  {
    name: "اسم العضو الثاني",
    role: "رئيس فريق المحتوى",
    bio:
      "يدير كتاب المحتوى، ويضمن أن كل قطعة محتوى متوافقة مع SEO، ومقنعة للعميل النهائي في نفس الوقت.",
    avatarColor: "from-emerald-500/80 to-emerald-300",
    group: "core",
  },
  {
    name: "اسم العضو الثالث",
    role: "تحليل البيانات وتجربة المستخدم",
    bio:
      "يراقب أداء الصفحات، يحلل سلوك الزوار، ويقترح تحسينات مستمرة على مسار التحويل في الموقع.",
    avatarColor: "from-sky-500/80 to-sky-300",
    group: "core",
  },
  {
    name: "عضو فريق المحتوى",
    role: "كاتب محتوى SEO",
    bio:
      "يكتب مقالات وصفحات محسّنة لمحركات البحث، مع التركيز على الإجابة عن أسئلة عملائك بلغة بسيطة وواضحة.",
    avatarColor: "from-fuchsia-500/80 to-fuchsia-300",
    group: "execution",
  },
  {
    name: "عضو فريق التقنية",
    role: "تنفيذ التحسينات التقنية",
    bio:
      "يتابع الجوانب التقنية لـ SEO مثل سرعة الموقع، بنية الروابط الداخلية، وملفات الـ sitemap وغيرها.",
    avatarColor: "from-orange-500/80 to-orange-300",
    group: "execution",
  },
  {
    name: "عضو فريق خدمة العملاء",
    role: "الدعم والتنسيق",
    bio:
      "يتواصل معك بشكل دوري، ينسّق الاجتماعات، ويتأكد أن كل شيء يسير حسب الخطة المتفق عليها.",
    avatarColor: "from-teal-500/80 to-teal-300",
    group: "execution",
  },
];

