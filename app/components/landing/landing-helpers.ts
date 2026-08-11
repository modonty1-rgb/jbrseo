import type { ClientCaseStudyStats } from "@/lib/analytics/ga4";

// ─── Number / string formatters ───────────────────────────────────────────
const ARABIC_DIGITS = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"] as const;

export function toArabicDigits(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}

export function formatNum(n: number): string {
  return n.toLocaleString("en-US");
}

/**
 * A price in Eastern Arabic numerals, grouped in thousands.
 *
 * The pricing cards read "٤ مقالات / شهر" above "2,394" — two numeral systems an inch
 * apart, and the Western one was the figure the whole decision rests on. Every other
 * number on the page is Eastern, so the price was the odd element, and an odd-looking
 * price is the last thing a page selling a subscription can afford.
 *
 * Grouping first, then transliteration: `toLocaleString` puts the separators in the right
 * places and the digit swap does not move them. Always render inside `dir="ltr"` — a
 * number never mirrors, in either script.
 */
export function formatPrice(n: number): string {
  return toArabicDigits(n.toLocaleString("en-US"));
}

const YT_ID = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/;

/** The eleven-character video id, or null if this is not a YouTube URL we recognise. */
export function ytId(url?: string): string | null {
  if (!url) return null;
  return url.match(YT_ID)?.[1] ?? null;
}

// `ytEmbed(url)` lived here and returned the full embed URL. Its one caller — the
// testimonial iframe — was replaced by VideoFacade, which builds the embed URL itself
// only after someone presses play, so the helper had no callers left. `ytId` is what
// both the facade and its poster need.

export function formatMinSec(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${toArabicDigits(m)}:${toArabicDigits(String(s).padStart(2, "0"))}`;
}

export function formatPct(x: number): string {
  return `${toArabicDigits(Math.round(x * 100))}٪`;
}

// ─── Case studies (GA4-backed, with hard-coded fallbacks) ──────────────────
export type CaseStudy = {
  name: string;
  industry: string;
  tag: string;
  daysActive: number;
  startDate: string;
  endDate: string;
  heroStat: { big: string; label: string; sub: string };
  after: Array<{ label: string; value: string; sub?: string }>;
  quality: Array<{ k: string; v: string; sub: string }>;
};

// Fallback values (used if GA4 fetch failed) — real numbers from probe on 2026-07-10.
const CASE_FALLBACK: Record<string, Omit<CaseStudy, "name" | "industry" | "tag" | "daysActive" | "startDate" | "endDate">> = {
  smileTown: {
    // Same correction as the live builder below: Smile Town is Egyptian, so no riyals.
    heroStat: { big: "٣١", label: "ضغطة على «احجز موعد»", sub: "بدون أي إعلانات مدفوعة · آخر ٩٠ يوم" },
    after: [
      { label: "زوّار من جوجل", value: "٨٣", sub: "عضوي · نية شراء" },
      { label: "مشاهدات صفحات", value: "٣٨٢", sub: "قراءة عميقة" },
      { label: "زوّار الموقع", value: "١٠٠", sub: "٩٠ يوم متتالي" },
      { label: "ضغطات 'احجز موعد'", value: "٣١", sub: "زيارات صفحة الحجز" },
    ],
    quality: [
      { k: "متوسط الجلسة", v: "٢:٥٦", sub: "دقيقة · تصفح جاد" },
      { k: "معدل التفاعل", v: "٧٩٪", sub: "متوسط الصناعة ٥٠٪" },
      { k: "دول وصلها", v: "٥", sub: "مصر · السعودية · الإمارات..." },
      // «صفر», not «٠ ر.س». Smile Town is an Egyptian clinic and Kima Zone an Egyptian
      // factory — neither spends riyals — and the figure means "none at all", which no
      // currency improves. Spelled out for the same reason the BEFORE column is: a lone
      // ٠ renders as a speck, and this line is one of the card's strongest facts.
      { k: "إعلانات مدفوعة", v: "صفر", sub: "كلها عضوي + شفهي" },
    ],
  },
  kimaZone: {
    heroStat: { big: "٦٨", label: "قارئ لمقال 'تصنيع مستحضرات'", sub: "زوّار يبحثون بأنفسهم · آخر ٩٠ يوم" },
    after: [
      { label: "زوّار الموقع", value: "٩٣", sub: "٥٨ زائر جديد" },
      { label: "مشاهدات صفحات", value: "٢٢٥", sub: "قراءة عميقة" },
      { label: "من جوجل مباشرة", value: "٧٦", sub: "مجاني من جوجل" },
      { label: "مقال واحد جذب", value: "٦٨", sub: "زائر يبحث عن تصنيع" },
    ],
    quality: [
      { k: "متوسط الجلسة", v: "٢:٣٢", sub: "دقيقة · قرّاء جادّون" },
      { k: "معدل التفاعل", v: "٨٠٪", sub: "متوسط الصناعة ٥٠٪" },
      { k: "دول وصلها", v: "٤", sub: "مصر · السعودية · الإمارات..." },
      { k: "إعلانات مدفوعة", v: "صفر", sub: "عضوي فقط" },
    ],
  },
  baqatek: {
    heroStat: { big: "٧٧٪", label: "من جوجل مباشرة", sub: "٥ دول وصلها المحتوى · آخر ٩٠ يوم" },
    after: [
      { label: "زوّار الموقع", value: "٨٨", sub: "٦٤ زائر جديد" },
      { label: "مشاهدات صفحات", value: "١٢٧", sub: "٩٩ جلسة" },
      { label: "من جوجل مباشرة", value: "٧٦", sub: "٧٧٪ عضوي" },
      { label: "دول وصلها", value: "٥", sub: "السعودية · مصر · اليمن..." },
    ],
    quality: [
      { k: "متوسط الجلسة", v: "١:٣٧", sub: "دقيقة" },
      { k: "زوّار جدد", v: "٧٣٪", sub: "كلهم أول زيارة" },
      { k: "مقال واحد جذب", v: "٦٦", sub: "زائر عن باقات STC" },
      { k: "إعلانات مدفوعة", v: "صفر", sub: "عضوي فقط" },
    ],
  },
};

const CASE_META: Record<string, Pick<CaseStudy, "name" | "industry" | "tag" | "daysActive" | "startDate" | "endDate">> = {
  smileTown: {
    name: "عيادات سمايل تاون",
    // Egypt, not Saudi. This said «السعودية» — a false statement about a named, real
    // clinic, on the section whose whole claim is that we do not write the numbers.
    industry: "طب الأسنان · مصر",
    tag: "طب الأسنان",
    daysActive: 90,
    startDate: "قبل الاشتراك",
    endDate: "آخر ٩٠ يوم",
  },
  kimaZone: {
    name: "كيما زون",
    industry: "تصنيع مستحضرات التجميل · مصر",
    tag: "مصانع مستحضرات التجميل",
    daysActive: 90,
    startDate: "قبل الاشتراك",
    endDate: "آخر ٩٠ يوم",
  },
  baqatek: {
    name: "متجر باقتك",
    industry: "تجزئة · باقات الاتصالات · السعودية",
    tag: "تجزئة · اتصالات",
    daysActive: 90,
    startDate: "قبل الاشتراك",
    endDate: "آخر ٩٠ يوم",
  },
};

function buildSmileTown(s: ClientCaseStudyStats): CaseStudy {
  return {
    ...CASE_META.smileTown,
    tag: "طب الأسنان",
    heroStat: {
      big: toArabicDigits(s.bookingPageViews),
      label: "ضغطة على «احجز موعد»",
      // Not «بدون ريال إعلانات» — this is Smile Town, an Egyptian clinic.
      sub: "بدون أي إعلانات مدفوعة · آخر ٩٠ يوم",
    },
    after: [
      { label: "زوّار من جوجل", value: toArabicDigits(s.organicSessions), sub: "عضوي · نية شراء" },
      { label: "مشاهدات صفحات", value: toArabicDigits(s.pageViews), sub: "قراءة عميقة" },
      { label: "زوّار الموقع", value: toArabicDigits(s.users), sub: "٩٠ يوم متتالي" },
      { label: "ضغطات 'احجز موعد'", value: toArabicDigits(s.bookingPageViews), sub: "زيارات صفحة الحجز" },
    ],
    quality: [
      { k: "متوسط الجلسة", v: formatMinSec(s.avgSessionSeconds), sub: "دقيقة · تصفح جاد" },
      { k: "معدل التفاعل", v: formatPct(s.engagementRate), sub: "متوسط الصناعة ٥٠٪" },
      { k: "دول وصلها", v: toArabicDigits(s.countriesCount), sub: "مصر · السعودية · الإمارات..." },
      // «صفر», not «٠ ر.س». Smile Town is an Egyptian clinic and Kima Zone an Egyptian
      // factory — neither spends riyals — and the figure means "none at all", which no
      // currency improves. Spelled out for the same reason the BEFORE column is: a lone
      // ٠ renders as a speck, and this line is one of the card's strongest facts.
      { k: "إعلانات مدفوعة", v: "صفر", sub: "كلها عضوي + شفهي" },
    ],
  };
}

function buildKimaZone(s: ClientCaseStudyStats): CaseStudy {
  return {
    ...CASE_META.kimaZone,
    heroStat: {
      big: toArabicDigits(s.topArticleUsers || s.users),
      label: "قارئ لمقال 'تصنيع مستحضرات'",
      sub: "زوّار يبحثون بأنفسهم · آخر ٩٠ يوم",
    },
    after: [
      { label: "زوّار الموقع", value: toArabicDigits(s.users), sub: `${toArabicDigits(s.sessions)} جلسة` },
      { label: "مشاهدات صفحات", value: toArabicDigits(s.pageViews), sub: "قراءة عميقة" },
      { label: "من جوجل مباشرة", value: toArabicDigits(s.organicSessions), sub: "مجاني من جوجل" },
      { label: "مقال واحد جذب", value: toArabicDigits(s.topArticleUsers), sub: `${toArabicDigits(s.topArticleViews)} مشاهدة` },
    ],
    quality: [
      { k: "متوسط الجلسة", v: formatMinSec(s.avgSessionSeconds), sub: "دقيقة · قرّاء جادّون" },
      { k: "معدل التفاعل", v: formatPct(s.engagementRate), sub: "متوسط الصناعة ٥٠٪" },
      { k: "دول وصلها", v: toArabicDigits(s.countriesCount), sub: "مصر · السعودية · الإمارات..." },
      { k: "إعلانات مدفوعة", v: "صفر", sub: "عضوي فقط" },
    ],
  };
}

function buildBaqatek(s: ClientCaseStudyStats): CaseStudy {
  return {
    ...CASE_META.baqatek,
    tag: `تجزئة · ${formatPct(s.organicPercent)} عضوي`,
    heroStat: {
      big: formatPct(s.organicPercent),
      label: "من جوجل مباشرة",
      sub: `${toArabicDigits(s.countriesCount)} دول وصلها المحتوى · آخر ٩٠ يوم`,
    },
    after: [
      { label: "زوّار الموقع", value: toArabicDigits(s.users), sub: `${toArabicDigits(s.sessions)} جلسة` },
      { label: "مشاهدات صفحات", value: toArabicDigits(s.pageViews), sub: `${toArabicDigits(s.sessions)} جلسة` },
      { label: "من جوجل مباشرة", value: toArabicDigits(s.organicSessions), sub: `${formatPct(s.organicPercent)} عضوي` },
      { label: "دول وصلها", value: toArabicDigits(s.countriesCount), sub: "السعودية · مصر · اليمن..." },
    ],
    quality: [
      { k: "متوسط الجلسة", v: formatMinSec(s.avgSessionSeconds), sub: "دقيقة" },
      { k: "معدل التفاعل", v: formatPct(s.engagementRate), sub: "متوسط الصناعة ٥٠٪" },
      { k: "مقال واحد جذب", v: toArabicDigits(s.topArticleUsers), sub: `عن باقات STC` },
      { k: "إعلانات مدفوعة", v: "صفر", sub: "عضوي فقط" },
    ],
  };
}

function fallbackFor(key: "smileTown" | "kimaZone" | "baqatek"): CaseStudy {
  return { ...CASE_META[key], ...CASE_FALLBACK[key] };
}

export function buildCaseStudies(caseStats: Record<string, ClientCaseStudyStats> | null): CaseStudy[] {
  const s = caseStats;
  return [
    s?.smileTown ? buildSmileTown(s.smileTown) : fallbackFor("smileTown"),
    s?.kimaZone ? buildKimaZone(s.kimaZone) : fallbackFor("kimaZone"),
    s?.baqatek ? buildBaqatek(s.baqatek) : fallbackFor("baqatek"),
  ];
}
