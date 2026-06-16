import type { Metadata } from "next";
import { headers } from "next/headers";
import { getAllPlans } from "@/app/actions/pricing";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getLandingContent } from "@/lib/getLandingContent";
import { getWhatsAppLink } from "@/lib/site-links";
import { DEFAULT_PUBLIC_SITE_ORIGIN, PUBLIC_INDEX_FOLLOW_ROBOTS } from "@/lib/seo-meta";
import { Card } from "@/app/components/ui/card";

const TITLE = "كل المزايا — مدوّنتي";
const DESCRIPTION =
  "الدليل الكامل لكل ما تحصل عليه: لوحة التحكم، صفحتك العامة، مقالاتك، التصاميم والإنتاج، 23 تنبيه تيليجرام، وأسعار الباقات.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: PUBLIC_INDEX_FOLLOW_ROBOTS,
  alternates: {
    canonical: `${DEFAULT_PUBLIC_SITE_ORIGIN}/features`,
    languages: {
      "ar-SA": `${DEFAULT_PUBLIC_SITE_ORIGIN}/sa`,
      "ar-EG": `${DEFAULT_PUBLIC_SITE_ORIGIN}/eg`,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${DEFAULT_PUBLIC_SITE_ORIGIN}/features`,
    siteName: "JBRSEO",
    locale: "ar_SA",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const STYLE_BLOCK = `
:focus{outline:none}
:focus-visible{outline:2px solid #0E9F6E;outline-offset:3px;border-radius:6px}
a:focus-visible,button:focus-visible{outline:2px solid #0E9F6E;outline-offset:3px}
.feat-container{max-width:1080px;margin:0 auto;padding:0 28px}
.feat-mono{font-family:'IBM Plex Mono', monospace}

.feat-hero{padding:64px 0 40px;text-align:center;max-width:780px;margin:0 auto}
.feat-eyebrow{display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:99px;border:1px solid #E5E5DC;background:#fff;font-family:'IBM Plex Mono', monospace;font-size:11.5px;color:#3F3F38;margin-bottom:24px}
.feat-eyebrow-dot{width:7px;height:7px;border-radius:99px;background:#0E9F6E;box-shadow:0 0 0 3px rgba(14,159,110,.16)}
.feat-hero h1{font-size:52px;line-height:1.12;font-weight:600;letter-spacing:-1.6px;margin-bottom:20px;padding:0 18px}
.feat-hero h1 .accent{color:#0E9F6E;background:linear-gradient(180deg,transparent 0%,transparent 78%,rgba(14,159,110,.16) 78%,rgba(14,159,110,.16) 100%);padding:0 4px}
.feat-hero p{font-size:18px;line-height:1.7;color:#3F3F38;max-width:580px;margin:0 auto;padding:0 18px;font-weight:400}

.feat-hero-stats{margin-top:40px;display:inline-flex;flex-wrap:wrap;gap:30px;justify-content:center;padding:18px 26px;background:#fff;border:1px solid #E5E5DC;border-radius:16px}
.feat-hs{text-align:center;min-width:96px}
.feat-hs-n{font-family:'IBM Plex Mono', monospace;font-size:22px;font-weight:600;color:#0A0A0A}
.feat-hs-l{font-size:11.5px;color:#6B6B62;margin-top:3px;font-family:'IBM Plex Mono', monospace}

.feat-systems{padding:24px 0 8px}
.feat-sys-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.feat-sys-card{background:#fff;border:1px solid #E5E5DC;border-radius:16px;padding:20px 18px;text-align:center;transition:transform .15s,box-shadow .15s}
.feat-sys-card:hover{transform:translateY(-3px);box-shadow:0 18px 40px -28px rgba(10,10,10,.28)}
.feat-sys-emoji{font-size:24px;margin-bottom:10px}
.feat-sys-card h3,.feat-sys-card .feat-sys-title{font-size:15px;font-weight:600;margin-bottom:6px}
.feat-sys-card p{font-size:12px;color:#6B6B62;line-height:1.6}

.feat-sec{padding:60px 0}
.feat-sec.alt{background:#fff;border-top:1px solid #E5E5DC;border-bottom:1px solid #E5E5DC}
.feat-sec-head{margin-bottom:34px}
.feat-sec-eyebrow{font-family:'IBM Plex Mono', monospace;font-size:12px;color:#0E9F6E;letter-spacing:1px;margin-bottom:10px;font-weight:600}
.feat-sec-title{font-size:32px;font-weight:600;letter-spacing:-.8px;line-height:1.2}
.feat-sec-sub{font-size:15.5px;color:#3F3F38;line-height:1.75;margin-top:12px;max-width:640px}

.feat-group-label{display:flex;align-items:center;gap:10px;margin:30px 0 14px;font-size:13px;font-weight:600;color:#0A0A0A;font-family:'IBM Plex Mono', monospace;letter-spacing:.3px}
.feat-group-label::after{content:"";flex:1;height:1px;background:#E5E5DC}

.feat-cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.feat-bcard{background:#FAFAF7;border:1px solid #E5E5DC;border-radius:14px;padding:18px;transition:border-color .15s,transform .15s}
.feat-sec.alt .feat-bcard{background:#FAFAF7}
.feat-bcard:hover{border-color:#0A0A0A;transform:translateY(-1px)}
.feat-bcard-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.feat-bcard-ico{font-size:18px;flex-shrink:0}
.feat-bcard h3{font-size:14px;font-weight:600;flex:1}
.feat-bcard p{font-size:12.5px;color:#3F3F38;line-height:1.7}
.feat-bcard ul{list-style:none;display:flex;flex-direction:column;gap:6px}
.feat-bcard ul li{display:flex;align-items:flex-start;gap:6px;font-size:12.5px;color:#3F3F38;line-height:1.55}
.feat-bcard ul li svg{flex-shrink:0;margin-top:3px}
.feat-tag-live{font-family:'IBM Plex Mono', monospace;font-size:10px;font-weight:600;background:#E6F7EF;border:1px solid #B5E5D0;color:#07744F;padding:2px 7px;border-radius:5px;margin-inline-start:auto}

/* YMYL highlight */
.feat-ymyl{position:relative;overflow:hidden;background:#0A0A0A;color:#fff;border-radius:28px;padding:56px 36px;max-width:920px;margin:0 auto;box-shadow:0 40px 90px -40px rgba(10,10,10,.5)}
.feat-ymyl::before{content:"";position:absolute;top:-120px;right:-120px;width:340px;height:340px;border-radius:50%;background:radial-gradient(closest-side,rgba(14,159,110,.32),transparent 70%);pointer-events:none}
.feat-ymyl::after{content:"";position:absolute;bottom:-140px;left:-100px;width:300px;height:300px;border-radius:50%;background:radial-gradient(closest-side,rgba(14,159,110,.18),transparent 70%);pointer-events:none}
.feat-ymyl-head{position:relative;text-align:center;margin-bottom:36px}
.feat-ymyl-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:99px;border:1px solid rgba(61,220,140,.32);background:rgba(14,159,110,.12);font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:#3DDC8C;margin-bottom:18px;font-weight:600;letter-spacing:.5px}
.feat-ymyl-shield{display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:linear-gradient(135deg,rgba(14,159,110,.28),rgba(14,159,110,.08));border:1px solid rgba(61,220,140,.4);margin-bottom:22px}
.feat-ymyl h2{font-size:34px;font-weight:600;letter-spacing:-.9px;line-height:1.2;margin-bottom:14px}
.feat-ymyl h2 .accent{color:#3DDC8C}
.feat-ymyl-sub{font-size:16px;color:#A5A599;max-width:580px;margin:0 auto;line-height:1.75}
.feat-ymyl-grid{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:8px}
.feat-ymyl-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.10);border-radius:16px;padding:22px 20px;transition:all .2s}
.feat-ymyl-card:hover{background:rgba(61,220,140,.06);border-color:rgba(61,220,140,.32);transform:translateY(-2px)}
.feat-ymyl-emoji{font-size:24px;margin-bottom:12px}
.feat-ymyl-card h3{font-size:15px;font-weight:600;margin-bottom:8px;color:#fff}
.feat-ymyl-card p{font-size:13px;color:#A5A599;line-height:1.7}
.feat-ymyl-foot{position:relative;display:flex;align-items:center;justify-content:center;gap:14px;margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,.08);flex-wrap:wrap}
.feat-ymyl-foot-item{display:inline-flex;align-items:center;gap:8px;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#A5A599}
.feat-ymyl-foot-item .dot{width:6px;height:6px;border-radius:99px;background:#3DDC8C}

/* Telegram alerts */
.feat-tg-wrap{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.feat-tg-col{background:#fff;border:1px solid #E5E5DC;border-radius:14px;padding:16px}
.feat-tg-col-title{font-size:13px;font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px;font-family:'IBM Plex Mono', monospace}
.feat-tg-count{font-family:'IBM Plex Mono', monospace;font-size:11px;background:#0A0A0A;color:#fff;padding:2px 8px;border-radius:99px;font-weight:600}
.feat-tg-chip{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#FAFAF7;border:1px solid #E5E5DC;border-radius:8px;font-size:12.5px;color:#3F3F38;margin-bottom:6px}
.feat-tg-chip .e{font-size:14px;flex-shrink:0}

/* Pricing table */
.feat-pkg{overflow-x:auto;-webkit-overflow-scrolling:touch;background:#fff;border:1px solid #E5E5DC;border-radius:16px;padding:6px;max-width:100%;width:100%}
.feat-pkg-table{width:100%;border-collapse:separate;border-spacing:0;min-width:680px}
.feat-pkg-table th,.feat-pkg-table td{padding:14px 12px;text-align:center;font-size:13px;border-bottom:1px solid #F4F4EE}
.feat-pkg-table th.feat-feat,.feat-pkg-table td.feat-feat{text-align:right;color:#3F3F38;font-weight:500}
.feat-pkg-table thead th{vertical-align:bottom;padding-bottom:18px}
.feat-pkg-name{font-size:14px;font-weight:600;color:#0A0A0A}
.feat-pkg-name.pop{color:#0E9F6E}
.feat-pkg-price{font-family:'IBM Plex Mono', monospace;font-size:12px;color:#6B6B62;margin-top:4px}
.feat-pkg-price b{font-size:18px;color:#0A0A0A;font-weight:600}
.feat-pkg-pop-badge{display:inline-block;background:#0E9F6E;color:#fff;font-family:'IBM Plex Mono', monospace;font-size:10px;font-weight:600;padding:3px 8px;border-radius:99px;margin-bottom:6px}
.feat-yes{color:#0E9F6E;font-weight:700;font-size:16px}
.feat-no{color:#B0B0A5;font-size:16px}
.feat-pkg-note{font-size:12px;color:#6B6B62;text-align:center;margin-top:16px;line-height:1.7}

/* Comparison */
.feat-compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:920px;margin:0 auto}
.feat-cc{background:#fff;border:1px solid #E5E5DC;border-radius:20px;padding:32px 28px}
.feat-cc.win{background:#0A0A0A;color:#fff;border-color:#0A0A0A;position:relative;box-shadow:0 30px 70px -28px rgba(10,10,10,.5)}
.feat-cc.win::before{content:"الحل";position:absolute;top:-13px;right:24px;background:#0E9F6E;color:#fff;font-family:'IBM Plex Mono', monospace;font-size:10.5px;font-weight:700;padding:5px 12px;border-radius:99px;letter-spacing:.3px}
.feat-cc-eyebrow{font-family:'IBM Plex Mono', monospace;font-size:11.5px;letter-spacing:.5px;margin-bottom:8px}
.feat-cc.win .feat-cc-eyebrow{color:#3DDC8C}
.feat-cc:not(.win) .feat-cc-eyebrow{color:#8A8A81}
.feat-cc h3{font-size:22px;font-weight:600;margin-bottom:8px;letter-spacing:-.4px}
.feat-cc-price{font-family:'IBM Plex Mono', monospace;font-size:14px;color:#6B6B62;margin-bottom:18px}
.feat-cc.win .feat-cc-price{color:#A5A599}
.feat-cc-list{list-style:none;display:flex;flex-direction:column;gap:10px}
.feat-cc-list li{font-size:14px;line-height:1.6;display:flex;gap:8px;align-items:flex-start}
.feat-cc-list li svg{flex-shrink:0;margin-top:3px}

/* Final CTA */
.feat-final{padding:60px 28px 90px;text-align:center}
.feat-final-card{max-width:880px;margin:0 auto;background:#0A0A0A;color:#fff;border-radius:24px;padding:56px 32px}
.feat-final h2{font-size:36px;font-weight:600;letter-spacing:-1px;margin-bottom:14px}
.feat-final p{font-size:16px;color:#A5A599;max-width:520px;margin:0 auto 28px}
.feat-final .feat-ctas{display:inline-flex;gap:12px;flex-wrap:wrap;justify-content:center}
.feat-final .feat-btn-white{background:#fff;color:#0A0A0A;padding:14px 28px;border-radius:12px;font-size:15px;font-weight:600;text-decoration:none}
.feat-final .feat-btn-ghost{background:rgba(255,255,255,.08);color:#fff;padding:14px 22px;border-radius:12px;font-size:15px;font-weight:500;border:1px solid rgba(255,255,255,.14);text-decoration:none}

/* Mobile */
@media (max-width:880px){
  .feat-container{padding:0 20px}
  .feat-hero{padding:48px 0 36px}
  .feat-hero h1{font-size:34px;letter-spacing:-1.2px}
  .feat-hero p{font-size:16px}
  .feat-hero-stats{gap:18px;padding:14px 18px}
  .feat-hs-n{font-size:18px}
  .feat-sys-grid{grid-template-columns:repeat(2,1fr)}
  .feat-sec{padding:48px 0}
  .feat-sec-title{font-size:24px}
  .feat-cat-grid{grid-template-columns:1fr;gap:10px}
  .feat-bcard{padding:14px}
  .feat-tg-wrap{grid-template-columns:1fr;gap:10px}
  .feat-compare-grid{grid-template-columns:1fr}
  .feat-final{padding:48px 20px 70px}
  .feat-final-card{padding:40px 22px;border-radius:22px}
  .feat-final h2{font-size:24px}
  .feat-ymyl{padding:40px 22px;border-radius:22px}
  .feat-ymyl h2{font-size:24px}
  .feat-ymyl-grid{grid-template-columns:1fr;gap:10px}
  .feat-ymyl-foot{flex-direction:column;gap:10px;align-items:center}
}
@media (max-width:480px){
  .feat-container{padding:0 16px}
  .feat-hero{padding:36px 0 28px}
  .feat-hero h1{font-size:28px;letter-spacing:-1px;padding:0 8px}
  .feat-hero p{font-size:15px;padding:0 8px}
  .feat-hero-stats{gap:14px;padding:12px 14px;margin-top:28px}
  .feat-hs{min-width:70px}
  .feat-hs-n{font-size:16px}
  .feat-hs-l{font-size:10.5px}
  .feat-sys-grid{grid-template-columns:1fr;gap:10px}
  .feat-sec-title{font-size:22px}
  .feat-sec-sub{font-size:14.5px}
  .feat-ymyl{padding:32px 18px}
  .feat-ymyl h2{font-size:22px}
  .feat-cc{padding:24px 20px}
  .feat-final-card{padding:32px 18px}
  .feat-final h2{font-size:22px}
}
`;

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E9F6E" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5l5 5L20 7" />
  </svg>
);

const X = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D67878" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
);

const CheckWhite = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3DDC8C" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5l5 5L20 7" />
  </svg>
);

export const revalidate = 60;

export default async function FeaturesPage() {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const [content, plans] = await Promise.all([
    getLandingContent(country),
    getAllPlans(country),
  ]);

  const countrySlug = country === "EG" ? "eg" : "sa";
  const basePath = `/${countrySlug}`;
  const pricingHref = `${basePath}#pricing`;
  const signupHref = `${basePath}/signup`;
  const whatsappLink = getWhatsAppLink(country, content.siteSettings?.whatsappNumber);
  const ctaLabel = content.siteSettings?.ctaLabel?.trim() || "ابدأ مجاناً — بدون بطاقة";
  const currency = country === "EG" ? "ج.م" : "ر.س";

  const visiblePlans = [...plans]
    .filter((p) => p.visible)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const PILLAR_FEATURES = [
    { label: "صفحتك المصغّرة + شارة موثّق", all: true },
    { label: "لوحة التحكم + تحليلات GA4", all: true },
    { label: "نسخة صوتية + صور لكل مقال", paid: true },
    { label: "Leads + حجوزات + تنبيهات تيليجرام", paid: true },
    { label: "بوّابة جودة 28 فحص + فهرسة Google", paid: true },
    { label: "التوثيق المهني (YMYL) — للقطاعات الحسّاسة", paid: true },
  ];

  return (
    <div suppressHydrationWarning>
      <style dangerouslySetInnerHTML={{ __html: STYLE_BLOCK }} />
        {/* HERO */}
        <section className="feat-hero">
          <div className="feat-eyebrow">
            <span className="feat-eyebrow-dot"></span>
            <span>كل ما تحصل عليه باشتراكك — الدليل الكامل</span>
          </div>
          <h1>
            اشتراك واحد —<br />
            <span className="accent">منظومة كاملة</span>
          </h1>
          <p>من لوحة تحكّمك، إلى صفحتك العامة في مدوّنتي، إلى التصاميم والإنتاج التقني — كل مزية تحصل عليها فعليًا، مشروحة بالتفصيل.</p>
          <div className="inline-flex gap-4 items-center mt-7 flex-wrap justify-center">
            <a href="#packages" className="bg-[#0A0A0A] text-white px-[26px] py-[14px] rounded-xl text-[15px] font-medium no-underline">
              شوف الباقات
            </a>
            <a href="#systems" className="text-[#3F3F38] text-[15px] font-medium no-underline px-1 py-2">
              استعرض المزايا ←
            </a>
          </div>
          <div className="feat-hero-stats">
            <div className="feat-hs"><div className="feat-hs-n">4</div><div className="feat-hs-l">منظومات متكاملة</div></div>
            <div className="feat-hs"><div className="feat-hs-n">23</div><div className="feat-hs-l">تنبيه فوري</div></div>
            <div className="feat-hs"><div className="feat-hs-n">28</div><div className="feat-hs-l">فحص جودة / مقال</div></div>
            <div className="feat-hs"><div className="feat-hs-n">4</div><div className="feat-hs-l">باقات مرنة</div></div>
          </div>
        </section>

        {/* SYSTEMS OVERVIEW */}
        <section className="feat-systems" id="systems">
          <div className="feat-container">
            <div className="feat-sys-grid">
              <Card className="feat-sys-card"><div className="feat-sys-emoji">📊</div><div className="feat-sys-title">لوحة تحكّمك</div><p>تحليلات حيّة، إدارة المحتوى، Leads، حجوزات، وإشراف كامل.</p></Card>
              <Card className="feat-sys-card"><div className="feat-sys-emoji">🌐</div><div className="feat-sys-title">صفحتك العامة</div><p>موقع مصغّر موثّق داخل شبكة مدوّنتي — مرئي ومفهرس في جوجل.</p></Card>
              <Card className="feat-sys-card"><div className="feat-sys-emoji">✍️</div><div className="feat-sys-title">مقالاتك</div><p>محتوى احترافي بنسخة صوتية وصور والتقاط عملاء من كل مقال.</p></Card>
              <Card className="feat-sys-card"><div className="feat-sys-emoji">🛠️</div><div className="feat-sys-title">التصاميم والإنتاج</div><p>SEO تقني كامل، بيانات منظّمة، وبوّابة جودة قبل كل نشر.</p></Card>
            </div>
          </div>
        </section>

        {/* SYSTEM 01 — CONSOLE */}
        <section className="feat-sec alt" id="console">
          <div className="feat-container">
            <div className="feat-sec-head">
              <div className="feat-sec-eyebrow">المنظومة 01</div>
              <h2 className="feat-sec-title">لوحة تحكّمك — كل شيء في عينك</h2>
              <p className="feat-sec-sub">لوحة كاملة على <span className="feat-mono">console.modonty.com</span> تدير منها نشاطك، تتابع الأرقام الحقيقية، وترد على عملائك — بلغة أعمال بسيطة.</p>
            </div>

            <div className="feat-group-label"><span>📈</span> القياس والتحليل</div>
            <div className="feat-cat-grid">
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🏠</span><h3>اللوحة الرئيسية</h3></div><p>ملخّص شهري لحظي: المشاهدات، التفاعل، أعلى المقالات، وسجل نشاط مباشر.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">📊</span><h3>تحليلات Google Analytics 4</h3></div><ul><li><Check /><span>الجمهور: أجهزة، زائر جديد مقابل عائد</span></li><li><Check /><span>السلوك: وقت القراءة، عمق التمرير، الارتداد</span></li><li><Check /><span>التوقيت: نمط اليوم والساعة + المصادر</span></li></ul></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">⚡</span><h3>زائر مباشر + Core Web Vitals</h3></div><p>عدّاد زوّار لحظي وأهم الصفحات الآن، مع مؤشرات سرعة الموقع (LCP · CLS · INP · TTFB).</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🩺</span><h3>فحص صحة الموقع</h3></div><p>تدقيق تقني فوري: الأمان، الأداء، SEO، الجوال، وسرعة Google PageSpeed.</p></Card>
            </div>

            <div className="feat-group-label"><span>✍️</span> المحتوى والوسائط</div>
            <div className="feat-cat-grid">
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">📝</span><h3>إدارة المقالات</h3></div><p>تراجع وتوافق على كل مقال قبل نشره، وتشوف إحصائيات كل مقال على حدة (مشاهدات، تفاعل، تحويلات).</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">📦</span><h3>خط الإنتاج والحصة</h3></div><p>تتابع حصتك الشهرية، المقالات قيد الكتابة، والمجدولة للنشر — كلها في مكان واحد.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🧩</span><h3>محتوى صفحتك</h3></div><p>تحرّر الخدمات، فريق العمل، الإنجازات، الاعتمادات، والفيديو التعريفي — يظهر مباشرة في صفحتك.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🖼️</span><h3>المعرض ومكتبة الوسائط</h3></div><p>ترفع صور المعرض (مع نص بديل لجوجل صور) وتدير كل وسائطك، وتختار الشعار وصورة الغلاف.</p></Card>
            </div>

            <div className="feat-group-label"><span>🪪</span> ملفك ومصداقيتك</div>
            <div className="feat-cat-grid">
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🏢</span><h3>الملف التجاري</h3></div><p>بياناتك الكاملة: الاسم، الوصف، العنوان، ساعات العمل، السجل التجاري، والرقم الضريبي.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">✅</span><h3>اكتمال + جاهزية SEO</h3></div><p>مؤشّر يبيّن نسبة اكتمال ملفك والحقول الناقصة، وحالة جاهزية بياناتك المنظّمة لمحركات البحث.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🛡️</span><h3>التوثيق المهني (YMYL)</h3></div><p>للقطاعات الحسّاسة (طبي/قانوني/مالي): توثيق التراخيص مع جهة الاعتماد = ثقة فورية + شارة موثّق.</p></Card>
            </div>

            <div className="feat-group-label"><span>💬</span> التفاعل والإشراف</div>
            <div className="feat-cat-grid">
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">⭐</span><h3>تقييمات الزوّار</h3></div><p>تقييمات بنجوم من زوّارك — توافق عليها قبل ظهورها، وتظهر علنًا كتقييم تجميعي على صفحتك.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🗨️</span><h3>إشراف التعليقات</h3></div><p>تعليقات المقالات وتعليقات صفحتك — توافق/ترفض كلٌّ منها قبل النشر، تحكّم كامل.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">❓</span><h3>الأسئلة الشائعة وأسئلة الزوّار</h3></div><p>صندوق أسئلة الزوّار (Q&amp;A) — ترد، وتنشر الإجابة، فتتحوّل لأسئلة شائعة على صفحتك وفي البحث.</p></Card>
            </div>

            <div className="feat-group-label"><span>🎯</span> العملاء والتحويلات</div>
            <div className="feat-cat-grid">
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🔥</span><h3>العملاء المحتملون (Leads)</h3></div><p>تصنيف تلقائي بنقاط حرارة: ساخن / مهتم / بارد / مؤهّل — مع درجة تفاعل لكل عميل.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">📅</span><h3>الحجوزات</h3></div><p>طلبات الحجز من زوّارك بحالة متابعة (جديد → تم التواصل → مكتمل → مؤرشف).</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">📩</span><h3>الدعم والمشتركون</h3></div><p>صندوق رسائل التواصل + قائمة المشتركين في نشرتك مع إحصائيات (نشط، موافقة، نمو).</p></Card>
            </div>

            <div className="feat-group-label"><span>🧰</span> أدوات وتنبيهات</div>
            <div className="feat-cat-grid">
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🔍</span><h3>أدوات SEO</h3></div><p>استمارة نشاطك، الكلمات المستهدفة، وقائمة المنافسين — يستخدمها الفريق عند كتابة محتواك.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🔔</span><h3>تنبيهات تيليجرام الفورية</h3><span className="feat-tag-live">23 حدث</span></div><p>تصلك إشعارات لحظية على تيليجرام لكل حدث مهم (تفاصيلها في قسم التنبيهات أدناه).</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">⚙️</span><h3>الاشتراك والحساب</h3></div><p>تفاصيل باقتك وحالة الدفع والتواريخ، وإدارة كلمة المرور وربط بوت تيليجرام.</p></Card>
            </div>
          </div>
        </section>

        {/* SYSTEM 02 — PUBLIC PAGE */}
        <section className="feat-sec" id="page">
          <div className="feat-container">
            <div className="feat-sec-head">
              <div className="feat-sec-eyebrow">المنظومة 02</div>
              <h2 className="feat-sec-title">صفحتك العامة في مدوّنتي</h2>
              <p className="feat-sec-sub">موقع مصغّر احترافي على <span className="feat-mono">modonty.com/clients/…</span> — داخل شبكة فيها جمهور وزوّار، ومفهرس في جوجل ببيانات منظّمة كاملة.</p>
            </div>

            <div className="feat-group-label"><span>🪟</span> موقعك المصغّر</div>
            <div className="feat-cat-grid">
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🖼️</span><h3>هوية كاملة</h3></div><p>غلاف + شعار + اسم + قطاع + موقع + شريط إحصائيات (متابعون، مقالات، مشاهدات، تقييم).</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🛡️</span><h3>شارة «موثّق»</h3></div><p>شارة توثيق من مدوّنتي + صورة الاعتماد ورقم الترخيص — مصداقية تفصلك عن المنافسين.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🧩</span><h3>أقسام غنية</h3></div><ul><li><Check /><span>خدمات · فريق · إنجازات · اعتمادات</span></li><li><Check /><span>تقييمات بنجوم · أسئلة شائعة · معرض صور</span></li><li><Check /><span>فيديو تعريفي · خريطة · ساعات العمل</span></li></ul></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">👆</span><h3>أزرار تفاعل وتواصل</h3></div><p>متابعة · حفظ · مشاركة · واتساب · حجز · اشتراك في النشرة — كلها تصلك كتنبيه فوري.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">⏰</span><h3>«مفتوح الآن» + تواصل سريع</h3></div><p>حالة العمل الآن، بطاقة تواصل سريع، وبطاقة Google Business — كلها على صفحتك.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">📰</span><h3>نشرتك البريدية</h3></div><p>زوّارك يشتركون مباشرة من صفحتك؛ كل مقال جديد يصلهم تلقائيًا.</p></Card>
            </div>

            <div className="feat-group-label"><span>🕸️</span> شبكة مدوّنتي</div>
            <div className="feat-cat-grid">
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🏠</span><h3>ظهور في الواجهة</h3></div><p>مقالاتك تظهر في الصفحة الرئيسية أمام كل زوّار مدوّنتي — بلا إعلانات ممولة.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🤝</span><h3>شريط الشركاء + فلتر الصناعة</h3></div><p>اسمك وشعارك في قائمة الشركاء، قابلة للتصفية حسب الصناعة = اكتشاف أسهل.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🔢</span><h3>إحصائيات الشبكة</h3></div><p>تفاعلك يضاف لأرقام مدوّنتي العامة (المشاهدات، التفاعلات، الشركاء) = إثبات اجتماعي مشترك.</p></Card>
            </div>

            <div className="feat-group-label"><span>🔎</span> SEO تقني على صفحتك</div>
            <div className="feat-cat-grid">
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🧬</span><h3>بيانات منظّمة (JSON-LD)</h3></div><p>Organization · LocalBusiness · FAQPage · BreadcrumbList · AggregateRating — تظهر صفحتك أغنى في نتائج جوجل.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🗺️</span><h3>خرائط الموقع والصور</h3></div><p>صفحتك ومقالاتك وصورك في خريطة الموقع وخريطة الصور = أرشفة أسرع في جوجل وجوجل صور.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">📤</span><h3>مشاركة احترافية</h3></div><p>صور OG/Twitter بقياس 1200×630 + روابط لغوية (hreflang) للسعودية ومصر = معاينة مرتّبة عند المشاركة.</p></Card>
            </div>
          </div>
        </section>

        {/* SYSTEM 03 — ARTICLES */}
        <section className="feat-sec alt" id="articles">
          <div className="feat-container">
            <div className="feat-sec-head">
              <div className="feat-sec-eyebrow">المنظومة 03</div>
              <h2 className="feat-sec-title">مقالاتك — محتوى يبيع</h2>
              <p className="feat-sec-sub">كل مقال ليس نصًّا فقط — بل تجربة قراءة كاملة وأداة التقاط عملاء.</p>
            </div>
            <div className="feat-cat-grid">
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">📖</span><h3>تجربة قراءة احترافية</h3></div><ul><li><Check /><span>نقاط رئيسية + جدول محتويات</span></li><li><Check /><span>شريط تقدّم القراءة + مسار تنقّل</span></li><li><Check /><span>مصادر/مراجع + بطاقة الكاتب</span></li></ul></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🎧</span><h3>نسخة صوتية</h3></div><p>كل مقال يصدر بنسخة صوتية يستمع لها الزائر — يرفع وقت الجلسة وتجربة الوصول.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🖼️</span><h3>صور ومعرض</h3></div><p>صورة بارزة + صور داخل المحتوى تظهر كمعرض، وكلها في خريطة الصور لجوجل.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">❤️</span><h3>تفاعل الزوّار</h3></div><p>إعجاب · حفظ · مشاركة (6 منصات) · تعليقات بإشراف — كله يبني جمهورك.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🙋</span><h3>سؤال مباشر = Lead</h3></div><p>الزائر يسأل من داخل المقال، فيصلك تنبيه فوري ويُسجّل كعميل محتمل في لوحتك.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">📅</span><h3>حجز من المقال</h3></div><p>زر حجز داخل المقال نفسه = تحويل القارئ لعميل في لحظة الاهتمام.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🔗</span><h3>مقالات ذات صلة</h3></div><p>روابط ذكية لمقالاتك الأخرى (نفس العميل/الكاتب/التصنيف) = جلسات أطول.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🔥</span><h3>صفحة «الرائجة»</h3></div><p>مقالاتك المتفاعلة تظهر في صفحة الرائجة أمام كل زوّار المنصة.</p></Card>
            </div>
          </div>
        </section>

        {/* SYSTEM 04 — PRODUCTION */}
        <section className="feat-sec" id="production">
          <div className="feat-container">
            <div className="feat-sec-head">
              <div className="feat-sec-eyebrow">المنظومة 04</div>
              <h2 className="feat-sec-title">التصاميم والإنتاج التقني</h2>
              <p className="feat-sec-sub">الفريق ينتج لك لكل مقال حزمة تقنية كاملة، ويمرّرها على بوّابة جودة صارمة قبل أي نشر.</p>
            </div>
            <div className="feat-cat-grid">
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🔧</span><h3>SEO كامل لكل مقال</h3></div><p>عنوان + وصف + رابط أساسي (canonical) + عناوين فرعية منظّمة + روابط داخلية.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🧬</span><h3>بيانات منظّمة مولّدة</h3></div><p>JSON-LD (Article + Organization + Breadcrumb + FAQ) يُولَّد ويُتحقّق منه آليًا — صفر عمل منك.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🖼️</span><h3>صور احترافية + OG</h3></div><p>صورة بارزة موثّقة الأبعاد مع نص بديل + صور مشاركة OG/Twitter بقياس 1200×630.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">✅</span><h3>بوّابة جودة 28 فحص</h3></div><p>قبل النشر: قابلية الفهرسة، E-E-A-T، الصور، السكيما، التواريخ، والروابط — كلها 100%.</p></Card>
              <Card className="feat-bcard"><div className="feat-bcard-head"><span className="feat-bcard-ico">🔎</span><h3>طلب فهرسة Google</h3></div><p>بعد اجتياز الجودة، يُطلب فهرسة المقال عبر Google Search Console لظهور أسرع.</p></Card>
            </div>
          </div>
        </section>

        {/* YMYL HIGHLIGHT — sensitive sectors */}
        <section className="feat-sec" id="ymyl">
          <div className="feat-container">
            <div className="feat-ymyl">
              <div className="feat-ymyl-head">
                <div className="feat-ymyl-badge">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC8C]" />
                  <span>ميزة حصرية — YMYL</span>
                </div>
                <div className="feat-ymyl-shield" aria-hidden>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3DDC8C" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <h2>
                  مصداقيتك = ثقة جوجل.<br />
                  <span className="accent">نوثّقها لك — ونحميها.</span>
                </h2>
                <p className="feat-ymyl-sub">
                  جوجل يضع المجالات اللي تمس صحتك أو مالك أو حقوقك تحت معيار أعلى (Your Money or Your Life). أكثر منصات المحتوى ما تتعامل معه — إحنا نتعامل.
                </p>
              </div>

              <div className="feat-ymyl-grid">
                <Card className="feat-ymyl-card">
                  <div className="feat-ymyl-emoji">🩺</div>
                  <h3>القطاع الطبي</h3>
                  <p>عيادات، أطباء، صيدليات — يُطلب توثيق الترخيص + المراجعة المهنية لكل محتوى. نتولاها.</p>
                </Card>
                <Card className="feat-ymyl-card">
                  <div className="feat-ymyl-emoji">⚖️</div>
                  <h3>القطاع القانوني</h3>
                  <p>محامون، مكاتب استشارات قانونية — توثيق العضوية + خبرة الكاتب = ظهور أعلى في النتائج.</p>
                </Card>
                <Card className="feat-ymyl-card">
                  <div className="feat-ymyl-emoji">💰</div>
                  <h3>القطاع المالي</h3>
                  <p>محاسبة، تمويل، استشارات مالية — رخصة الهيئة + توثيق الكاتب = ثقة فورية للقارئ والمحرك.</p>
                </Card>
              </div>

              <div className="feat-ymyl-foot">
                <span className="feat-ymyl-foot-item"><span className="dot"></span><span>توثيق الترخيص مع جهة الاعتماد</span></span>
                <span className="feat-ymyl-foot-item"><span className="dot"></span><span>شارة «موثّق» علنية</span></span>
                <span className="feat-ymyl-foot-item"><span className="dot"></span><span>بيانات منظّمة EAT/EEAT كاملة</span></span>
              </div>
            </div>
          </div>
        </section>

        {/* TELEGRAM ALERTS */}
        <section className="feat-sec alt" id="alerts">
          <div className="feat-container">
            <div className="feat-sec-head">
              <div className="feat-sec-eyebrow">تنبيهات لحظية</div>
              <h2 className="feat-sec-title">23 تنبيه فوري على تيليجرام</h2>
              <p className="feat-sec-sub">تشتغل تجارتك وأنت مطمئن — كل حدث مهم يصلك لحظيًا، وتتحكم في تفعيل/إيقاف كل نوع.</p>
            </div>
            <div className="feat-tg-wrap">
              <div className="feat-tg-col">
                <div className="feat-tg-col-title"><span>أحداث المقالات</span><span className="feat-tg-count">13</span></div>
                <div className="feat-tg-chip"><span className="e">👁</span><span>مشاهدة مقال</span></div>
                <div className="feat-tg-chip"><span className="e">👍</span><span>إعجاب / 👎 عدم إعجاب</span></div>
                <div className="feat-tg-chip"><span className="e">⭐</span><span>حفظ المقال</span></div>
                <div className="feat-tg-chip"><span className="e">↗</span><span>مشاركة</span></div>
                <div className="feat-tg-chip"><span className="e">🎯</span><span>نقرة CTA / 🔗 رابط</span></div>
                <div className="feat-tg-chip"><span className="e">💬</span><span>تعليق / رد / إعجاب تعليق</span></div>
                <div className="feat-tg-chip"><span className="e">🎉</span><span>تحويل / 🔥 عميل عالي الاهتمام</span></div>
              </div>
              <div className="feat-tg-col">
                <div className="feat-tg-col-title"><span>أحداث صفحتك</span><span className="feat-tg-count">6</span></div>
                <div className="feat-tg-chip"><span className="e">👁</span><span>زيارة صفحتك</span></div>
                <div className="feat-tg-chip"><span className="e">➕</span><span>متابع جديد (بالاسم)</span></div>
                <div className="feat-tg-chip"><span className="e">↗</span><span>مشاركة صفحتك (بالمنصة)</span></div>
                <div className="feat-tg-chip"><span className="e">⭐</span><span>حفظ صفحتك</span></div>
                <div className="feat-tg-chip"><span className="e">💬</span><span>تعليق على صفحتك</span></div>
                <div className="feat-tg-chip"><span className="e">📧</span><span>اشتراك في نشرتك</span></div>
              </div>
              <div className="feat-tg-col">
                <div className="feat-tg-col-title"><span>تواصل مباشر</span><span className="feat-tg-count">4</span></div>
                <div className="feat-tg-chip"><span className="e">📩</span><span>رسالة دعم</span></div>
                <div className="feat-tg-chip"><span className="e">📣</span><span>اهتمام بحملة</span></div>
                <div className="feat-tg-chip"><span className="e">🙋</span><span>سؤال مباشر (Lead)</span></div>
                <div className="feat-tg-chip"><span className="e">📅</span><span>طلب حجز <span className="feat-tag-live ms-1.5">افتراضي مفعّل</span></span></div>
              </div>
            </div>
          </div>
        </section>

        {/* PACKAGES — DB-driven */}
        <section className="feat-sec" id="packages">
          <div className="feat-container">
            <div className="feat-sec-head">
              <div className="feat-sec-eyebrow">الباقات</div>
              <h2 className="feat-sec-title">اختر ما يناسب نموّك</h2>
              <p className="feat-sec-sub">كل الباقات تشمل صفحتك الموثّقة + لوحة التحكم الكاملة + التحليلات + التنبيهات. الفرق في حجم المحتوى الشهري.</p>
            </div>
            {visiblePlans.length > 0 ? (
                <div className="feat-pkg">
                <table className="feat-pkg-table">
                  <thead>
                    <tr>
                      <th className="feat-feat">الميزة</th>
                      {visiblePlans.map((p) => {
                        const isFree = p.priceMonthly === 0;
                        const featured = !!p.featuredBadge && p.featuredBadge.trim() !== "";
                        return (
                          <th key={p.id}>
                            {featured && <div className="feat-pkg-pop-badge">{p.featuredBadge || "الأكثر طلبًا"}</div>}
                            <div className={`feat-pkg-name${featured ? " pop" : ""}`}>{p.name}</div>
                            <div className="feat-pkg-price">
                              {isFree ? (
                                <><b>0</b> {currency}</>
                              ) : (
                                <><b>{p.priceMonthly}</b> {currency}/شهر</>
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="feat-feat">مقالات شهريًا</td>
                      {visiblePlans.map((p) => {
                        const isFree = p.priceMonthly === 0;
                        const articles = isFree ? "—" : (p.articlesLabel || "—");
                        return <td key={p.id}>{articles}</td>;
                      })}
                    </tr>
                    {PILLAR_FEATURES.map((f, fi) => (
                      <tr key={fi}>
                        <td className="feat-feat">{f.label}</td>
                        {visiblePlans.map((p) => {
                          const isFree = p.priceMonthly === 0;
                          const has = f.all || (f.paid && !isFree);
                          return (
                            <td key={p.id}>
                              {has ? <span className="feat-yes">✓</span> : <span className="feat-no">—</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
            ) : null}
            <p className="feat-pkg-note">
              الأسعار بالـ{country === "EG" ? "جنيه المصري" : "ريال السعودي"} · مزايا كل باقة قابلة للتخصيص من إدارة المنصة. عدد المقالات لكل باقة هو الفرق الأساسي.
            </p>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="feat-sec alt">
          <div className="feat-container">
            <div className="feat-sec-head text-center">
              <div className="feat-sec-eyebrow text-[#B0B0A5]">مقارنة عملية</div>
              <h2 className="feat-sec-title">إيش الفرق فعلاً؟</h2>
            </div>
            <div className="feat-compare-grid">
              <div className="feat-cc">
                <div className="feat-cc-eyebrow">الطريقة التقليدية</div>
                <h3>توظف فريق محتوى داخلي</h3>
                <div className="feat-cc-price">~444,000 {currency} / سنوياً</div>
                <ul className="feat-cc-list">
                  <li><X /><span>راتب 6 موظفين + توظيف + تدريب + إجازات</span></li>
                  <li><X /><span>أدوات SEO منفصلة بتكلفة إضافية</span></li>
                  <li><X /><span>تأخير 6+ شهور للبدء قبل ظهور أي نتائج</span></li>
                  <li><X /><span>ما في شبكة — تبدأ من صفر</span></li>
                  <li><X /><span>أنت تدير الفريق + تتابع + تشتكي</span></li>
                </ul>
              </div>
              <div className="feat-cc win">
                <div className="feat-cc-eyebrow">مدوّنتي</div>
                <h3>اشتراك واحد — نظام كامل</h3>
                <div className="feat-cc-price">
                  من {((visiblePlans.find((p) => p.priceMonthly > 0)?.priceMonthly ?? 399) * 12).toLocaleString("en-US")} {currency} / سنوياً
                </div>
                <ul className="feat-cc-list">
                  <li><CheckWhite /><span>كتابة + نشر + متابعة + تقارير — كل شي شامل</span></li>
                  <li><CheckWhite /><span>أدوات SEO + GSC + GTM مدمجة باللوحة</span></li>
                  <li><CheckWhite /><span>محتوى احترافي جاهز للنشر — توسع تدريجي حسب الباقة</span></li>
                  <li><CheckWhite /><span>تنضم لشبكة +19 شركة + جمهور موجود</span></li>
                  <li><CheckWhite /><span>أنت توافق، نحن ندير الباقي</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="feat-final">
          <div className="feat-final-card">
            <h2>جاهز ترى ترتيبك يتحرّك؟</h2>
            <p>اشترك اليوم، وابدأ ببناء حضورك الرقمي مع مرونة كاملة في إدارة الباقة من لوحة التحكم.</p>
            <div className="feat-ctas">
              <a href={signupHref} className="feat-btn-white">{ctaLabel}</a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="feat-btn-ghost">كلّمنا على واتساب</a>
            </div>
          </div>
        </section>
    </div>
  );
}
