import type { Metadata } from "next";
import { ShieldCheck, Clock, XCircle, MessageCircle, CheckCircle } from "lucide-react";
import { siteOgImages } from "@/lib/getGlobalSeo";
import { buildPageJsonLd, DEFAULT_PUBLIC_SITE_ORIGIN, PUBLIC_INDEX_FOLLOW_ROBOTS, safeJsonLd, SHARED_OPEN_GRAPH, sharedLanguages } from "@/lib/seo-meta";
import { getWhatsAppLink } from "@/lib/site-links";
import { WhatsAppIcon } from "@/app/components/icons/WhatsAppIcon";

const SITE_URL = DEFAULT_PUBLIC_SITE_ORIGIN;
const TITLE = "سياسة الفوترة والتسليم";
const DESCRIPTION =
  "التزامنا بإعداد حسابك من ٧٢ ساعة إلى ١٤ يوم كحد أقصى. لو تأخّرنا عن ذلك، نمدّد اشتراكك مجاناً — لا رعب استرداد، لا مماطلة.";

export async function generateMetadata(): Promise<Metadata> {
  const images = await siteOgImages();
  return {
    title: TITLE,
    description: DESCRIPTION,
    robots: PUBLIC_INDEX_FOLLOW_ROBOTS,
    alternates: {
      canonical: `${SITE_URL}/billing-policy`,
      languages: sharedLanguages(`${SITE_URL}/billing-policy`),
    },
    openGraph: {
      ...SHARED_OPEN_GRAPH,
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}/billing-policy`,
      images,
    },
    twitter: { title: TITLE, description: DESCRIPTION, images },
  };
}

// Deep-link message pre-fills the WhatsApp text so the user only sends.
function buildRefundRequestLink(waHref: string): string {
  const message = [
    "مرحباً، أرغب في طلب تمديد اشتراكي وفق سياسة التزام التسليم.",
    "",
    "• إيميل الحساب:",
    "• رقم الفاتورة:",
    "• سبب طلب التمديد:",
  ].join("\n");
  const separator = waHref.includes("?") ? "&" : "?";
  return `${waHref}${separator}text=${encodeURIComponent(message)}`;
}

export default function BillingPolicyPage() {
  const waHref = getWhatsAppLink("SA");
  const waWithMessage = buildRefundRequestLink(waHref);

  return (
    <main className="bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            buildPageJsonLd({
              url: `${SITE_URL}/billing-policy`,
              name: TITLE,
              description: DESCRIPTION,
              breadcrumbName: "سياسة الفوترة",
            }),
          ),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        {/* HERO */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-4 py-1.5 text-xs font-bold text-success mb-4">
            <ShieldCheck className="h-4 w-4" />
            <span>التزام موثّق · قابل للتحقق</span>
          </div>
          <h1 className="text-3xl font-black text-foreground sm:text-4xl mb-4">
            {TITLE}
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            بدل ما نعدك بـ"استرداد نقدي" مبهم، نعدك بشي ملموس: <strong className="text-foreground">تسليم من ٧٢ ساعة إلى ١٤ يوم كحد أقصى</strong>. لو تجاوزنا الحد الأقصى، تكسب أنت.
          </p>
        </section>

        {/* PROMISE — what we commit to */}
        <section className="mb-10 rounded-2xl border border-success/25 bg-success/5 p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="rounded-lg bg-success/15 p-2">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">
                نتعهّد لك بالتالي
              </h2>
              <p className="text-[13px] text-muted-foreground mt-1">
                التزامان صريحان يبدآن لحظة إتمام الدفع
              </p>
            </div>
          </div>
          <ul className="space-y-3 text-[14px] leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="mt-1 text-success font-black" aria-hidden>①</span>
              <span>
                إنشاء حسابك في مدونتي عادةً <strong className="text-success">خلال ٧٢ ساعة</strong>، وبحدّ أقصى مطلق <strong className="text-success">١٤ يوم</strong> من لحظة إتمام الدفع.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1 text-success font-black" aria-hidden>②</span>
              <span>
                بدء العمل على مخرجات باقتك (المقالات، التحسينات التقنية، إلخ) حسب المدة المذكورة في وصف الباقة.
              </span>
            </li>
          </ul>
        </section>

        {/* IF WE DELAY — what happens */}
        <section className="mb-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="rounded-lg bg-accent/15 p-2">
              <Clock className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">
                إذا تأخّرنا
              </h2>
              <p className="text-[13px] text-muted-foreground mt-1">
                مسؤوليتنا كاملة — تعويضك تلقائي
              </p>
            </div>
          </div>
          <ul className="space-y-3 text-[14px] leading-relaxed text-foreground">
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 text-accent" aria-hidden>✓</span>
              <span>
                إذا تجاوزنا <strong>حدّ ١٤ يوم</strong>، نُمدّد مدة اشتراكك <strong>مجاناً</strong> بمقدار مدة التأخير — بدون تكلفة إضافية.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 text-accent" aria-hidden>✓</span>
              <span>
                ننبّهك بالإيميل ونشرح سبب التأخير — لا مماطلة، لا اختفاء.
              </span>
            </li>
          </ul>
        </section>

        {/* WHAT WE DON'T COMMIT TO — honest boundaries */}
        <section className="mb-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="rounded-lg bg-destructive/12 p-2">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">
                ما لا يشمله هذا التعهّد
              </h2>
              <p className="text-[13px] text-muted-foreground mt-1">
                الصدق أفضل من الوعود الفارغة
              </p>
            </div>
          </div>
          <ul className="space-y-4 text-[14px] leading-relaxed text-muted-foreground">
            <li>
              <span className="font-semibold text-foreground">عدم ظهور موقعك في نتائج Google.</span>
              {" "}السيو يحتاج ٣-٦ أشهر ويعتمد على المنافسة وخوارزميات Google — هذا خارج نطاق تحكّمنا الكامل، ولا يعقل أن نضمن نتيجة نصفها بيد طرف آخر.
            </li>
            <li>
              <span className="font-semibold text-foreground">انخفاض حركة الزوار لأسباب خارجة عن تأثيرنا.</span>
              {" "}تحديثات خوارزمية جوجل، دخول منافسين جدد، تغيّرات موسمية، أو توقّف حملات إعلانية قد تُقلّص الزيارات.
            </li>
            <li>
              <span className="font-semibold text-foreground">انسحاب العميل بعد اكتمال التسليم.</span>
              {" "}بعد ما نُسلّم مخرجات الباقة، الاشتراك يكمل مدّته حتى نهايتها. لا استرداد نقدي بعد بدء التسليم.
            </li>
          </ul>
        </section>

        {/* HOW TO REQUEST — clear channel */}
        <section className="mb-10 rounded-2xl border border-info/25 bg-info/5 p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="rounded-lg bg-info/15 p-2">
              <MessageCircle className="h-5 w-5 text-info" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">
                كيف تُطالب بالتمديد
              </h2>
              <p className="text-[13px] text-muted-foreground mt-1">
                قناة واحدة · رد بشري خلال ساعات العمل
              </p>
            </div>
          </div>
          <p className="text-[14px] leading-relaxed text-foreground mb-5">
            تواصل معنا على واتساب مع <strong>رقم فاتورتك</strong>. نتحقق من الالتزام ونمدّد فوراً — بدون نماذج معقّدة، بدون انتظار طويل.
          </p>
          <a
            href={waWithMessage}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-success px-6 py-3 text-sm font-black text-success-foreground shadow-lg shadow-success/25 hover:bg-success/90 transition-colors no-underline"
          >
            <WhatsAppIcon className="h-5 w-5" />
            <span>أطلب تمديد عبر واتساب</span>
          </a>
        </section>

        {/* CLOSING NOTE */}
        <section className="rounded-2xl border border-border/60 bg-muted/20 p-6 text-center">
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            هذه السياسة جزء من{" "}
            <a href="/terms" className="text-foreground underline underline-offset-2 hover:text-success">
              الشروط والأحكام
            </a>
            {" "}لخدمة JBRSEO. آخر تحديث: <span className="font-mono" dir="ltr">2026-07-12</span>.
          </p>
        </section>
      </div>
    </main>
  );
}
