import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import { getAllPlans } from "@/app/actions/pricing";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getLandingContent } from "@/lib/getLandingContent";
import { featuresCatalog } from "@/lib/features-catalog.mjs";
import { getWhatsAppLink } from "@/lib/site-links";
import { DEFAULT_PUBLIC_SITE_ORIGIN, PUBLIC_INDEX_FOLLOW_ROBOTS } from "@/lib/seo-meta";
import { DEFAULT_CTA_LABEL } from "@/lib/site-settings.types";

const TITLE = "مزايا اشتراك مدونتي — منظومة كاملة | JBRSEO";
const DESCRIPTION =
  "لوحة تحكم كاملة · صفحة عميل احترافية · مقالات تبيع · حماية YMYL · تنبيهات فورية. كل شي في اشتراك واحد على مدونتي.";

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
.fx-page{background:#0a0a0a;color:#fff}
.fx-page a{color:#4ade80;text-decoration:none}
.fx-container{max-width:1180px;margin:0 auto;padding:0 20px}

/* Hero */
.fx-hero{padding:70px 0 50px;text-align:center;background:radial-gradient(ellipse at top,rgba(4,120,87,.2),transparent 60%);border-bottom:1px solid rgba(255,255,255,.06)}
.fx-hero h1{font-size:44px;font-weight:900;line-height:1.15;margin-bottom:14px;letter-spacing:-1px}
.fx-hero h1 .accent{color:#4ade80}
.fx-hero-sub{font-size:17px;color:rgba(255,255,255,.7);max-width:640px;margin:0 auto 28px}
.fx-stats{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;max-width:900px;margin:0 auto}
.fx-stat{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:18px 22px;min-width:170px;flex:1}
.fx-stat b{display:block;font-size:26px;font-weight:900;color:#4ade80;margin-bottom:2px}
.fx-stat span{font-size:12.5px;color:rgba(255,255,255,.65);font-weight:600}

/* Section */
.fx-sec{padding:70px 0;border-top:1px solid rgba(255,255,255,.06)}
.fx-eyebrow{color:#4ade80;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;font-family:'IBM Plex Mono',monospace}
.fx-sec h2{font-size:34px;font-weight:900;line-height:1.2;margin-bottom:10px;letter-spacing:-.5px}
.fx-lead{font-size:16px;color:rgba(255,255,255,.7);max-width:640px;margin-bottom:28px}

/* Screenshot frame */
.fx-shot{background:linear-gradient(135deg,rgba(74,222,128,.05),rgba(59,130,246,.05));border:1px solid rgba(74,222,128,.2);border-radius:16px;padding:18px;margin:20px 0}
.fx-shot-cap{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px}
.fx-shot-cap h4{font-size:14px;font-weight:800;color:#4ade80;margin-top:4px}
.fx-shot-cap a{font-size:12px;color:rgba(255,255,255,.6)}
.fx-shot-cap small{font-size:11px;color:rgba(255,255,255,.5)}
.fx-badge-real{background:#4ade80;color:#0a0a0a;font-size:10.5px;font-weight:900;padding:3px 8px;border-radius:6px;display:inline-block;margin-bottom:6px;letter-spacing:.5px}
.fx-shot img{border:1px solid rgba(255,255,255,.08);border-radius:8px;display:block;width:100%;height:auto}

/* Group cards grid */
.fx-groups{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:18px}
.fx-gcard{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:20px}
.fx-gcard .icon{font-size:24px;margin-bottom:8px}
.fx-gcard h3{font-size:15px;font-weight:800;margin-bottom:6px}
.fx-gcard p{font-size:13px;color:rgba(255,255,255,.65);line-height:1.65}
.fx-gcard ul{margin-top:8px;padding-inline-start:14px;list-style:disc}
.fx-gcard li{font-size:12px;color:rgba(255,255,255,.55);margin-bottom:2px}

/* Split layout */
.fx-split{display:grid;grid-template-columns:1.2fr 1fr;gap:28px;align-items:start;margin-top:20px}
.fx-split-feats{display:grid;grid-template-columns:1fr;gap:10px}

/* YMYL */
.fx-ymyl{background:linear-gradient(135deg,#f8fafc,#e2e8f0);color:#0f172a;padding:30px;border-radius:16px;margin-top:20px}
.fx-ymyl h3{color:#065f46;font-size:22px;margin-bottom:6px}
.fx-ymyl p{color:#334155;font-size:14.5px;line-height:1.7}
.fx-sectors{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px}
.fx-scard{background:#fff;color:#0f172a;border-radius:12px;padding:18px;text-align:center;border:1px solid #e2e8f0}
.fx-scard .icon{font-size:32px;margin-bottom:6px}
.fx-scard h4{font-size:15px;font-weight:900;margin-bottom:4px;color:#065f46}
.fx-scard p{font-size:12.5px;color:#334155}

/* Pricing */
.fx-pkg{overflow-x:auto;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:16px;margin-top:20px}
.fx-pkg table{width:100%;border-collapse:collapse;font-size:13px;min-width:600px}
.fx-pkg th,.fx-pkg td{padding:12px 10px;text-align:right;border-bottom:1px solid rgba(255,255,255,.06)}
.fx-pkg th{background:rgba(255,255,255,.03);font-weight:800;color:#4ade80}
.fx-pkg th.rec{background:rgba(74,222,128,.15)}
.fx-pkg th .th-inner{display:inline-flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}
.fx-pkg tr.cat-row td{background:rgba(74,222,128,.06);color:#4ade80;font-weight:800;font-size:12px;padding:10px 12px;letter-spacing:.5px;text-align:right}
.fx-pkg .rec-badge{background:linear-gradient(135deg,#059669,#047857);color:#fff;font-size:11px;font-weight:900;padding:4px 10px;border-radius:99px;box-shadow:0 6px 18px -6px rgba(74,222,128,.55);letter-spacing:.3px;white-space:nowrap}
.fx-pkg td.plan-name{font-weight:800;color:#fff}
.fx-pkg .price{color:#4ade80;font-weight:900;font-size:17px}

/* Included in all */
.fx-included{background:rgba(74,222,128,.05);border:1px solid rgba(74,222,128,.2);border-radius:14px;padding:20px;margin-top:20px}
.fx-included-title{font-size:13px;font-weight:800;color:#4ade80;letter-spacing:.5px;margin-bottom:14px;font-family:'IBM Plex Mono',monospace;text-transform:uppercase}
.fx-included-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.fx-included-item{font-size:13px;color:rgba(255,255,255,.85);padding:6px 0;line-height:1.6}

/* Compare */
.fx-cmp{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px}
.fx-cc{border-radius:16px;padding:24px;border:1px solid rgba(255,255,255,.1)}
.fx-cc.bad{background:rgba(220,38,38,.06);border-color:rgba(220,38,38,.25)}
.fx-cc.good{background:rgba(4,120,87,.12);border-color:rgba(74,222,128,.35)}
.fx-cc h3{font-size:16px;font-weight:900;margin-bottom:14px}
.fx-cc ul{list-style:none;padding:0}
.fx-cc li{font-size:13.5px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.fx-cc.bad li::before{content:"✗ ";color:#f87171;font-weight:900}
.fx-cc.good li::before{content:"✓ ";color:#4ade80;font-weight:900}

/* Final CTA */
.fx-final{background:linear-gradient(135deg,#064e3b,#047857);border-radius:20px;padding:60px 30px;text-align:center;margin:40px 0 20px}
.fx-final h2{font-size:30px;font-weight:900;margin-bottom:10px}
.fx-final p{font-size:15px;color:rgba(255,255,255,.85);margin-bottom:24px;max-width:520px;margin-inline:auto}
.fx-final .fx-btn-p{display:inline-block;background:#fff;color:#064e3b;font-weight:900;font-size:15px;padding:14px 28px;border-radius:10px;text-decoration:none}
.fx-final .fx-btn-s{display:inline-block;background:transparent;color:#fff;border:1px solid rgba(255,255,255,.4);font-weight:600;font-size:14px;padding:14px 24px;border-radius:10px;margin-inline-start:8px;text-decoration:none}

/* Telegram */
.fx-tg{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:20px}
.fx-tgc{background:rgba(37,99,235,.08);border:1px solid rgba(59,130,246,.25);border-radius:12px;padding:14px;text-align:center}
.fx-tgc .ico{font-size:22px;margin-bottom:6px}
.fx-tgc h4{font-size:13px;font-weight:800;margin-bottom:4px}
.fx-tgc p{font-size:11.5px;color:rgba(255,255,255,.6)}

/* Mobile */
@media (max-width:900px){
  .fx-groups{grid-template-columns:repeat(2,1fr)}
  .fx-split{grid-template-columns:1fr;gap:20px}
  .fx-tg{grid-template-columns:repeat(2,1fr)}
  .fx-included-grid{grid-template-columns:1fr}
}
@media (max-width:600px){
  .fx-hero h1{font-size:32px}
  .fx-sec h2{font-size:26px}
  .fx-hero{padding:50px 0 30px}
  .fx-sec{padding:50px 0}
  .fx-groups{grid-template-columns:1fr}
  .fx-sectors{grid-template-columns:1fr}
  .fx-cmp{grid-template-columns:1fr}
  .fx-final{padding:40px 20px}
  .fx-final h2{font-size:22px}
}
`;

export default async function FeaturesPage() {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const [content, plans] = await Promise.all([
    getLandingContent(country),
    getAllPlans(country),
  ]);
  const whatsappLink = getWhatsAppLink(country, content.siteSettings?.whatsappNumber);
  const ctaLabel = content.siteSettings?.ctaLabel?.trim() || DEFAULT_CTA_LABEL;
  const countrySlug = country === "EG" ? "eg" : "sa";
  const pricingHref = `/${countrySlug}#pricing`;
  const currency = country === "EG" ? "ج.م" : "ر.س";

  // Plans for pricing table (from DB) — plans is already filtered to `visible: true`.
  const displayPlans = plans.slice(0, 4);
  const visibleCount = plans.length; // used for hero stats + pricing lead — reflects reality, not schema max
  const arNum = (n: number) => n.toLocaleString("ar-EG");
  const recommendedIndex = displayPlans.findIndex((p) => Boolean(p.featuredBadge)) ;
  const recIdx = recommendedIndex >= 0 ? recommendedIndex : 1;

  // Comparison data — single source of truth: lib/features-catalog.mjs
  //  - category row = section separator (no values)
  //  - feature row = label + values array (one per plan, ordered by PLAN_SLUGS)
  const rows = featuresCatalog.rows as Array<{
    label?: string;
    values?: string[];
    category?: string;
  }>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLE_BLOCK }} />
      <div className="fx-page">

        {/* ─── HERO ─── */}
        <section className="fx-hero">
          <div className="fx-container">
            <h1>
              اشتراك واحد <span className="accent">—</span> منظومة كاملة
            </h1>
            <p className="fx-hero-sub">
              لوحة تحكّم · صفحة عميل احترافية · مقالات تبيع · حماية YMYL · تنبيهات تيليجرام. كل شي في مدونتي.
            </p>
            <div className="fx-stats">
              <div className="fx-stat"><b>{arNum(visibleCount)}</b><span>باقات</span></div>
              <div className="fx-stat"><b>٢٩</b><span>ميزة رئيسية</span></div>
              <div className="fx-stat"><b>٢٣</b><span>تنبيه فوري</span></div>
              <div className="fx-stat"><b>٤</b><span>قطاعات YMYL</span></div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 1: CONSOLE ─── */}
        <section className="fx-sec">
          <div className="fx-container">
            <div className="fx-eyebrow">٠١ · لوحة التحكم</div>
            <h2>لوحة تحكّمك — كل شي أمام عينك</h2>
            <p className="fx-lead">
              تفتح لوحتك، تلقى شغلك مباشر: أرقامك من جوجل، محتواك الجاي، عملاءك، فوترتك.
            </p>

            <div className="fx-shot">
              <div className="fx-shot-cap">
                <div>
                  <span className="fx-badge-real">✓ من لوحتك</span>
                  <h4>لوحة تحكّم سمايل تاون — ٥ مقالات · ١٦٦ مشاهدة · ٤١ ظهور (+٨٪) · تحويلات ١</h4>
                </div>
                <small>صورة من لوحة عميل فعلي</small>
              </div>
              <Image src="/features/console-dashboard.png" alt="لوحة تحكم مدونتي - سمايل تاون" width={1920} height={950} priority={false} />
            </div>

            <div className="fx-groups">
              <div className="fx-gcard">
                <div className="icon">📊</div>
                <h3>نظرة عامة سريعة</h3>
                <p>مقال منشور · مشاهدات · مشتركين — كل شي في السطر الأول.</p>
                <ul>
                  <li>هذا الشهر: ٥ مقال · ١٦٦ مشاهدة</li>
                  <li>الإحصائيات (٤١ ظهور +٨٪)</li>
                  <li>معدل الارتداد (٧.٩٪)</li>
                </ul>
              </div>
              <div className="fx-gcard">
                <div className="icon">⚠️</div>
                <h3>يحتاج انتباهك</h3>
                <p>يلفت انتباهك للأمور المنتظرة قرارك — بلا فوت.</p>
                <ul>
                  <li>المقالات (موافقات)</li>
                  <li>التعليقات (مراجعة)</li>
                  <li>الدعم (رسائل)</li>
                </ul>
              </div>
              <div className="fx-gcard">
                <div className="icon">📈</div>
                <h3>الأداء الأسبوعي</h3>
                <p>٤ مؤشرات موثّقة قدامك مباشرة.</p>
                <ul>
                  <li>الإحصائيات (Impressions)</li>
                  <li>درجة التفاعل (٣٣/١٠٠)</li>
                  <li>التحويلات (١، ٠.٦٪)</li>
                  <li>نسبة الارتداد</li>
                </ul>
              </div>
              <div className="fx-gcard">
                <div className="icon">✍️</div>
                <h3>محتواك</h3>
                <p>كل حاجة تخص محتوى صفحتك — منظّمة.</p>
                <ul>
                  <li>بيانات نشاطك (+YMYL)</li>
                  <li>معلومات · محتوى الصفحة</li>
                  <li>معرض الصور · الملفات</li>
                  <li>المقالات · أسئلة الصفحة</li>
                </ul>
              </div>
              <div className="fx-gcard">
                <div className="icon">👥</div>
                <h3>عملاءك</h3>
                <p>كل تفاعل عميل في مكان واحد.</p>
                <ul>
                  <li>مشتركو النشرة</li>
                  <li>العملاء المحتملون (Leads)</li>
                  <li>الحجوزات</li>
                  <li>الأسئلة · الآراء · التقييمات</li>
                </ul>
              </div>
              <div className="fx-gcard">
                <div className="icon">🛡️</div>
                <h3>الموثوقية والصحة</h3>
                <p>مدى جاهزية موقعك.</p>
                <ul>
                  <li>صحة موقعك</li>
                  <li>الحملات (قريباً 🚀)</li>
                  <li>YMYL badge</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 2: PUBLIC PAGE ─── */}
        <section className="fx-sec">
          <div className="fx-container">
            <div className="fx-eyebrow">٠٢ · صفحتك</div>
            <h2>صفحتك العامة — بديل موقعك الإلكتروني</h2>
            <p className="fx-lead">
              ما عندك موقع؟ ما مشكلة. مدونتي تعطيك صفحة كاملة تشوفها عملاءك: هويّتك، خدماتك، حجزك، تقييماتك.
            </p>

            <div className="fx-shot">
              <div className="fx-shot-cap">
                <div>
                  <span className="fx-badge-real">✓ صفحة حقيقية</span>
                  <h4>عيادات سمايل تاون — أعلى أثر رقمي على مدونتي (١٠,٦٨٤ من جوجل)</h4>
                </div>
                <a href="https://www.modonty.com/clients/عيادات-سمايل-تاون-لطب-الفم-و-الأسنان" target="_blank" rel="noopener noreferrer">
                  شوف الصفحة الحقيقية ←
                </a>
              </div>
              <Image src="/features/client-page.png" alt="صفحة عميل حقيقية - سمايل تاون" width={1920} height={950} />
            </div>

            <div className="fx-groups">
              <div className="fx-gcard">
                <div className="icon">📌</div>
                <h3>هوية كاملة + شارة موثّق</h3>
                <p>لوگو · اسم · تخصص · موقع · شارة "موثّق ✓" · سنة التأسيس.</p>
              </div>
              <div className="fx-gcard">
                <div className="icon">🎨</div>
                <h3>Hero banner برندي</h3>
                <p>صورة رئيسية احترافية بتصميم يعبّر عن هويّتك.</p>
              </div>
              <div className="fx-gcard">
                <div className="icon">📞</div>
                <h3>أزرار CTA بارزة</h3>
                <p>احجز الآن · متابعة · مشاركة · واتساب عائم.</p>
              </div>
              <div className="fx-gcard">
                <div className="icon">📊</div>
                <h3>الأثر الرقمي من Google</h3>
                <p>كارت "١٠,٦٨٤ الأثر الرقمي" مع شعار G — دليل مصداقية فوري.</p>
              </div>
              <div className="fx-gcard">
                <div className="icon">🗂️</div>
                <h3>٩ أقسام غنية</h3>
                <p>نظرة عامة · آراء · مقالات · عن الشركة · FAQ · تواصل · ساعات · موثوقية · نشرة.</p>
              </div>
              <div className="fx-gcard">
                <div className="icon">🔍</div>
                <h3>SEO/AEO مدمج</h3>
                <p>JSON-LD · Sitemap · Open Graph · Structured Data — لِلظهور في جوجل و ChatGPT.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 3: ARTICLES ─── */}
        <section className="fx-sec">
          <div className="fx-container">
            <div className="fx-eyebrow">٠٣ · المقالات</div>
            <h2>مقالاتك — محتوى يبيع فعلاً</h2>
            <p className="fx-lead">
              مقال احترافي مع صور high-res، إحصائيات قراءة، أزرار تفاعل، وشارة العميل الموثّقة — كل شي مصمّم يخلي القارئ ينحوّل لعميل.
            </p>

            <div className="fx-shot">
              <div className="fx-shot-cap">
                <div>
                  <span className="fx-badge-real">✓ مقال حقيقي</span>
                  <h4>ابتسامة هوليود قبل وبعد (سمايل تاون) — 1189 كلمة · 6 دقائق قراءة</h4>
                </div>
                <a href="https://www.modonty.com/articles/ابتسامة-هوليود-قبل-وبعد" target="_blank" rel="noopener noreferrer">
                  شوف المقال الحقيقي ←
                </a>
              </div>
              <Image src="/features/article.png" alt="مقال حقيقي على مدونتي" width={1920} height={950} />
            </div>

            <div className="fx-groups">
              <div className="fx-gcard">
                <div className="icon">📝</div>
                <h3>Header احترافي</h3>
                <p>عنوان بارز · وصف SEO · تاريخ · اسم المنصة.</p>
              </div>
              <div className="fx-gcard">
                <div className="icon">📈</div>
                <h3>إحصائيات كاملة</h3>
                <p>عدد الكلمات · وقت القراءة · مشاهدات · تعليقات.</p>
              </div>
              <div className="fx-gcard">
                <div className="icon">🖼️</div>
                <h3>صور + معرض</h3>
                <p>Hero image high-quality · صور داخلية · Open Graph لِلمشاركة.</p>
              </div>
              <div className="fx-gcard">
                <div className="icon">🎯</div>
                <h3>Sidebar تفاعل</h3>
                <p>اشترك · مشاركة · تعليق · حفظ · إعجاب.</p>
              </div>
              <div className="fx-gcard">
                <div className="icon">🏥</div>
                <h3>شارة العميل الموثّقة</h3>
                <p>بطاقة العميل مع صورة، تخصص، وموقع — رابط لِصفحته.</p>
              </div>
              <div className="fx-gcard">
                <div className="icon">🚀</div>
                <h3>SEO + AEO كامل</h3>
                <p>JSON-LD · Meta tags · ٢٨ فحص جودة · طلب فهرسة Google.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 4: YMYL ─── */}
        <section className="fx-sec">
          <div className="fx-container">
            <div className="fx-eyebrow">٠٤ · الثقة</div>
            <h2>مصداقيتك محميّة</h2>
            <p className="fx-lead">
              القطاعات الحساسة (طبية · مالية · قانونية) تحتاج معايير أعلى. إحنا نطبّقها — عشان جوجل يثق فيك، وعميلك يشتري منك.
            </p>

            <div className="fx-ymyl">
              <h3>YMYL — المحتوى الحساس (Your Money or Your Life)</h3>
              <p>
                أي محتوى يمس <strong>صحة</strong> أو <strong>مال</strong> أو <strong>حقوق</strong> العميل — جوجل يطبّق عليه معايير أعلى (E-E-A-T). إحنا نحمي مصداقيتك.
              </p>
              <div className="fx-sectors">
                <div className="fx-scard">
                  <div className="icon">⚕️</div>
                  <h4>القطاع الطبي</h4>
                  <p>عيادات · مستشفيات · أطباء — توثيق كامل + التزام أخلاقيات.</p>
                </div>
                <div className="fx-scard">
                  <div className="icon">⚖️</div>
                  <h4>القطاع القانوني</h4>
                  <p>محامون · مكاتب قانونية — توثيق التخصص + المرجعية.</p>
                </div>
                <div className="fx-scard">
                  <div className="icon">💰</div>
                  <h4>القطاع المالي</h4>
                  <p>استشارات مالية · محاسبة · تأمين — معايير SAMA/ZATCA.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 5: TELEGRAM ─── */}
        <section className="fx-sec">
          <div className="fx-container">
            <div className="fx-eyebrow">٠٥ · التنبيهات</div>
            <h2>٢٣ تنبيه فوري على تيليجرام</h2>
            <p className="fx-lead">
              لا تفوت شي. أي حدث مهم — يوصلك على تيليجرام في ثوان.
            </p>

            <div className="fx-tg">
              <div className="fx-tgc"><div className="ico">📈</div><h4>SEO</h4><p>ترتيب · impressions · clicks · errors</p></div>
              <div className="fx-tgc"><div className="ico">📝</div><h4>المحتوى</h4><p>مقال جاهز · نشر · تحديث</p></div>
              <div className="fx-tgc"><div className="ico">👥</div><h4>العملاء</h4><p>Lead جديد · حجز · تقييم</p></div>
              <div className="fx-tgc"><div className="ico">💳</div><h4>الفوترة</h4><p>فاتورة · تجديد · ترقية</p></div>
              <div className="fx-tgc"><div className="ico">🛡️</div><h4>الأمان</h4><p>دخول · تغيير · موقع مكسور</p></div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 6: PRICING + COMPARE + CTA ─── */}
        <section className="fx-sec">
          <div className="fx-container">
            <div className="fx-eyebrow">٠٦ · اختر</div>
            <h2>اختر ما يناسب نموّك</h2>
            <p className="fx-lead">
              {arNum(visibleCount)} باقات لمراحل نمو مختلفة. الاشتراك السنوي = ٦ شهور هدية.
            </p>

            {displayPlans.length > 0 ? (
              <div className="fx-pkg">
                <table>
                  <thead>
                    <tr>
                      <th>الميزة</th>
                      {displayPlans.map((p, i) => (
                        <th key={p.id} className={i === recIdx ? "rec" : ""}>
                          <div className="th-inner">
                            {i === recIdx && <span className="rec-badge">🔥 الأكثر شيوعاً</span>}
                            <span>{p.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Row 1: Monthly price (from Plan.priceMonthly) */}
                    <tr>
                      <td>السعر الشهري</td>
                      {displayPlans.map((p, i) => (
                        <td key={p.id} className={i === recIdx ? "rec" : ""}>
                          <span className="price">{p.priceMonthly} {currency}</span>
                        </td>
                      ))}
                    </tr>
                    {/* Row 2: Articles label (from Plan.articlesLabel) */}
                    <tr>
                      <td>المقالات</td>
                      {displayPlans.map((p, i) => (
                        <td key={p.id} className={i === recIdx ? "rec" : ""}>
                          {p.articlesLabel || "—"}
                        </td>
                      ))}
                    </tr>
                    {/* Rows 3+: Comparison matrix (from LandingSection "featuresComparison") */}
                    {rows.map((row, ridx) =>
                      row.category ? (
                        <tr key={ridx} className="cat-row">
                          <td colSpan={displayPlans.length + 1}>{row.category}</td>
                        </tr>
                      ) : (
                        <tr key={ridx}>
                          <td>{row.label}</td>
                          {displayPlans.map((p, i) => {
                            const SLUG_ORDER = ["presence", "starter", "growth", "scale"];
                            const dataIdx = SLUG_ORDER.indexOf(p.slug);
                            return (
                              <td key={p.id} className={i === recIdx ? "rec" : ""}>
                                {row.values?.[dataIdx] ?? "—"}
                              </td>
                            );
                          })}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{color:"rgba(255,255,255,.6)",padding:"20px",textAlign:"center"}}>
                لا توجد باقات متاحة حالياً — تواصل معنا للتفاصيل.
              </p>
            )}

            <h3 style={{fontSize:"22px",fontWeight:900,margin:"44px 0 8px",textAlign:"center"}}>إيش الفرق فعلاً؟</h3>
            <p style={{textAlign:"center",color:"rgba(255,255,255,.65)",fontSize:"14.5px",marginBottom:"20px"}}>
              قارن بين توظيف فريق داخلي vs اشتراك مدونتي.
            </p>
            <div className="fx-cmp">
              <div className="fx-cc bad">
                <h3>❌ توظّف فريق محتوى داخلي</h3>
                <ul>
                  <li>راتب كاتب: ٦-١٠ آلاف ريال/شهر</li>
                  <li>راتب مصمم: ٥-٨ آلاف ريال/شهر</li>
                  <li>راتب متخصص SEO: ٨-١٥ ألف/شهر</li>
                  <li>تجهيزات · تدريب · إدارة</li>
                  <li>مسؤولية العمل · الإجازات</li>
                  <li>= ٢٠-٣٥ ألف ريال/شهر</li>
                </ul>
              </div>
              <div className="fx-cc good">
                <h3>✅ اشتراك واحد — نظام كامل</h3>
                <ul>
                  <li>اشتراك سنوي: ٦ أشهر مجاناً</li>
                  <li>فريق كامل جاهز</li>
                  <li>لوحة تحكم شفافة ٢٤/٧</li>
                  <li>تنبيهات فورية · دعم مباشر</li>
                  <li>بلا مسؤوليات موظفين</li>
                  <li>= توفير ٩٥٪+ من التكلفة</li>
                </ul>
              </div>
            </div>

            <div className="fx-final">
              <h2>جاهز ترى ترتيبك يتحرّك؟</h2>
              <p>اشترك سنوياً واكسب ٦ أشهر مجاناً — أو تكلّم معنا عن باقة مخصصة.</p>
              <a href={pricingHref} className="fx-btn-p">{ctaLabel} ←</a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="fx-btn-s">تكلّم معنا على واتساب</a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
