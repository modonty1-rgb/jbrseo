'use client'

import { useState, type CSSProperties, type ComponentType, type ReactNode } from 'react'

// ══════════════════════════════════════════════════════════════════════════════
// DATA LAYER — عدّل هنا للمحتوى فقط
// ══════════════════════════════════════════════════════════════════════════════

type Color = 'm'|'j'|'r'|'y'|'g'|'p'
type AlertType = 'r'|'g'|'y'|'b'
type SectionId = 'status'|'funnel'|'personas'|'strategy'|'team'|'kpis'|'platforms'|'month1'|'month2'|'month3'|'ads'|'rules'

const NAV_GROUPS = [
  { title:'الموقع', items:[{ id:'status' as SectionId, label:'✅ حالة الموقع' },{ id:'funnel' as SectionId, label:'كيف يعمل النظام' }]},
  { title:'الاستراتيجية', items:[{ id:'personas' as SectionId, label:'الجمهور' },{ id:'strategy' as SectionId, label:'الاستراتيجية' }]},
  { title:'الفريق', items:[{ id:'team' as SectionId, label:'الفريق وKPIs' },{ id:'kpis' as SectionId, label:'KPIs المنصات' }]},
  { title:'المحتوى', items:[{ id:'platforms' as SectionId, label:'قواعد المنصات' },{ id:'month1' as SectionId, label:'شهر 1' },{ id:'month2' as SectionId, label:'شهر 2' },{ id:'month3' as SectionId, label:'شهر 3' }]},
  { title:'الإعلانات', items:[{ id:'ads' as SectionId, label:'خطة الإعلانات' },{ id:'rules' as SectionId, label:'قواعد QA' }]},
]

const TOPBAR_BADGES = [
  { text:'FCP 1,036ms ✅', color:'' },
  { text:'GTM ✅ GA4 ✅', color:'#00c896' },
  { text:'Pixel ⏳', color:'#f5c842' },
  { text:'SA + EG · 7 مشتركين', color:'' },
]

const STATUS = {
  tag:{ color:'g' as Color, text:'حالة الموقع' },
  title:'jbrseo.com — بعد الإصلاحات الكاملة',
  subtitle:'Production build · فحص ميداني كامل · مقارنة قبل وبعد',
  alert:{ type:'g' as AlertType, html:'<strong>Production build ✅</strong> — FCP انتقل من 3,280ms إلى <strong>1,036ms</strong>. كل الإصلاحات التقنية والمحتوى محفوظة.' },
  perfHeaders:['المقياس','قبل','بعد','الهدف'],
  perfRows:[
    ['FCP','3,280ms 🔴','1,036ms ✅','< 1,800ms'],
    ['TTFB','—','87ms ✅','< 200ms'],
    ['JS files','35 🔴','17 ✅','—'],
    ['JS total size','917KB 🔴','211KB ✅','—'],
    ['Font files','12 🔴','4 ✅','≤ 4'],
    ['next-devtools chunk','219KB 🔴','غائب ✅','—'],
    ['theme-color','2 قيمتان 🔴','1 × #0c0c12 ✅','1'],
  ],
  contentHeaders:['الإصلاح','المكان','الحالة'],
  contentRows:[
    ['المهتدس → المهندس','شهادة 1','✅'],
    ['مستحظرات → مستحضرات','شهادة 2','✅'],
    ['ابدأ مجاناً — بدون بطاقة ←','CTA الأساسي','✅'],
    ['ابدأ الحين — ١٤ يوم ضمان كامل ✅','CTA الثانوي','✅'],
    ['احجز مكانك / احجز جلستك','حُذفت كلها','✅'],
    ['LinkedIn /admin/dashboard/ مكشوف','JSON-LD sameAs — أُزيل','✅'],
  ],
  gtmAlert:{ type:'g' as AlertType, html:'<strong>GTM-TT25M3GX (Version 3) + GA4 G-1H4CC4BJBM</strong> — مفعّلان. Tags: page_view · signup_start · whatsapp_click · pricing_view. Admin dashboard: 🌍الكل / 🇸🇦SA / 🇪🇬EG.' },
  gtmCards:[
    { title:'✅ Google Tag Manager — GTM-TT25M3GX', topColor:'#00c896', body:'Version 3 Published\n<strong style="color:#00c896">Tags الفعّالة:</strong>\n• GA4 - All Pages → كل صفحة\n• GA4 - signup_start → click /signup\n• GA4 - whatsapp_click → click wa.me\n• GA4 - pricing_view → visibility #pricing' },
    { title:'✅ GA4 — G-1H4CC4BJBM', topColor:'#00c896', body:'Property: jbrseo.com · SA · SAR\nService Account: jbrseo-analytics@modonty.iam.gserviceaccount.com\nAdmin Dashboard: <strong style="color:#00c896">getAllAnalyticsData()</strong> — 3 مجموعات\n<span style="color:#f5c842">Data API delay: 24-48h</span>' },
  ],
  pixelAlert:{ type:'y' as AlertType, html:'<strong>Facebook Pixel</strong> — الخطوة الأخيرة. GTM: New Tag → Facebook Pixel → Trigger: All Pages + Conversion Event: Lead.' },
  pixelCard:{ title:'⏳ Facebook Pixel — الخطوة التالية', topColor:'#f5c842', steps:['احصل على Pixel ID من Meta Business Manager','في GTM: New Tag → Facebook Pixel → Trigger: All Pages','أضف Conversion Event: Lead → عند signup_complete','تحقق في Meta Events Manager → Test Events'], footer:'بعدها فقط: الضوء أخضر للإعلانات 🟢' },
}

const FUNNEL = {
  tag:{ color:'y' as Color, text:'فهم النظام' },
  title:'كيف يعمل النظام',
  subtitle:'jbrseo.com = صفحة هبوط للمبيعات · modonty.com = المنصة الفعلية',
  systemCard:{ title:'النظام بجملة واحدة', topColor:'#f5c842', body:'<strong>jbrseo.com</strong> — وظيفته الوحيدة: تحويل الزائر لمشترك\n<strong>modonty.com</strong> — وظيفته: تقديم الخدمة والاحتفاظ بالعميل\n\nكل CTA → <strong style="color:#4a8eff">jbrseo.com</strong> فقط' },
  steps:[
    { label:'الزائر يصل لـ jbrseo.com', sub:'من إعلان أو محتوى سوشيال أو بحث', w:'85%', bg:'rgba(74,142,255,.12)', border:'rgba(74,142,255,.3)' },
    { label:'يشوف الأسعار — يقرأ الـ Social Proof + شهادات حقيقية', sub:'', w:'70%', bg:'rgba(74,142,255,.15)', border:'rgba(74,142,255,.4)' },
    { label:'يضغط "ابدأ مجاناً — بدون بطاقة ←"', sub:'', w:'55%', bg:'rgba(245,200,66,.09)', border:'rgba(245,200,66,.3)' },
    { label:'يُفتح له حساب في modonty.com', sub:'', w:'42%', bg:'rgba(0,200,150,.1)', border:'rgba(0,200,150,.35)' },
    { label:'يبدأ الشغل الحقيقي — مقالات، محتوى، SEO', sub:'', w:'34%', bg:'rgba(0,200,150,.15)', border:'rgba(0,200,150,.5)' },
  ],
  statusCards:[
    { badge:'jbrseo.com', badgeColor:'j' as Color, topColor:'#4a8eff', title:'الوضع الحالي', items:['✅ Hero واضح + قوي','✅ مقارنة أسعار + توفير 96%','✅ شهادات حقيقية','✅ FCP 1,036ms','✅ GTM + GA4 مفعّلان','⏳ Facebook Pixel لم يُضف بعد'] },
    { badge:'modonty.com', badgeColor:'m' as Color, topColor:'#00c896', title:'الوضع الحالي', items:['✅ منصة عاملة','✅ 7 مشتركين حاليين (SA كلهم)','✅ 13/20 مقعد متبقٍ بسعر التأسيس','🔴 لا Hero للزائر الجديد','🔴 لا CTA ثابت في نهاية المقالات'] },
  ],
  markets:[
    { title:'🇸🇦 السعودية — الأولوية الأولى', audience:'عيادات، محاماة، استشارات، تقنية', platforms:'Instagram · Snapchat · LinkedIn · Google', language:'عربي + لهجة سعودية', subscribers:'7 (100% SA)' },
    { title:'🇪🇬 مصر — السوق الثاني', audience:'عيادات، مراكز تعليم، محاماة', platforms:'Facebook · Instagram · WhatsApp', language:'لهجة مصرية', subscribers:'0 — فرصة مفتوحة' },
  ],
}

const PERSONAS = {
  tag:{ color:'y' as Color, text:'الجمهور' },
  title:'الـ Personas — 5 أشخاص',
  subtitle:'كل محتوى وكل إعلان يخاطب شخصاً واحداً. لا "محتوى للجميع".',
  list:[
    { emoji:'🏥', bg:'rgba(0,200,150,.13)', name:'أحمد — صاحب خدمة سعودية', badges:[{ color:'j' as Color, text:'jbrseo' }], role:'عيادة / محاماة / استشارات · SA · 35–50', motives:'يريد تقليل الاعتماد على الإعلانات', objection:'"جربت SEO وما نفع"', response:'"أصل رقمي يتراكم — مو خدمة SEO"', journey:'Snap/IG → jbrseo.com → modonty', channel:'Instagram · Snapchat · Google Maps' },
    { emoji:'💼', bg:'rgba(74,142,255,.13)', name:'فهد — مدير تسويق B2B', badges:[{ color:'m' as Color, text:'modonty' }], role:'شركة تقنية · Marketing Manager · SA', motives:'نظام قياس + تقارير تقنع الـ CEO', objection:'"عايز أعرف الـ ROI مسبقاً"', response:'"Dashboard يربط المقالات بالـ Leads"', journey:'LinkedIn → jbrseo.com → يشترك', channel:'LinkedIn · Newsletter' },
    { emoji:'📍', bg:'rgba(255,107,74,.13)', name:'خالد — خدمة محلية تنافسية', badges:[{ color:'j' as Color, text:'jbrseo' }], role:'عيادة/مطعم/صيانة · EG + SA', motives:'المنافسين ظاهرين في الخرائط وهو لأ', objection:'"عايز نتيجة سريعة"', response:'"GBP + Maps + Reviews = نتائج سريعة"', journey:'FB/IG → jbrseo.com → modonty', channel:'Facebook · WhatsApp · Instagram' },
    { emoji:'📊', bg:'rgba(245,200,66,.1)', name:'سارة — Marketing Manager B2B', badges:[{ color:'j' as Color, text:'jbrseo' }], role:'لوجستيات/تقنية · SA', motives:'ربط SEO بالـ Pipeline + تقارير للـ GM', objection:'"فريقنا الداخلي موجود"', response:'"Extension للفريق + تقارير أسبوعية"', journey:'LinkedIn → jbrseo.com', channel:'LinkedIn · Slack' },
    { emoji:'🚀', bg:'rgba(176,106,255,.12)', name:'محمد — صاحب مشروع يعتمد على Ads', badges:[{ color:'m' as Color, text:'modonty' },{ color:'j' as Color, text:'jbrseo' }], role:'متجر إلكتروني · الأعلى LTV', motives:'يحس الطلب "يختفي" لو وقف الإعلانات', objection:'"الإعلانات تجيب سريع — SEO بطيء"', response:'"مدونتي تبني قناة تدوم حتى لو وقفت"', journey:'Ads → jbrseo.com → modonty', channel:'Meta Ads · LinkedIn' },
  ],
}

const STRATEGY = {
  tag:{ color:'y' as Color, text:'الاستراتيجية' },
  title:'الخطة الاستراتيجية — 3 أشهر',
  subtitle:'الموقع جاهز للإطلاق التسويقي',
  alert:{ type:'b' as AlertType, html:'<strong>الوضع الحالي:</strong> 7 مشتركين (SA) · 13 مقعد متبقٍ · FCP 1,036ms · GTM ✅ GA4 ✅ · Pixel ⏳. الهدف: <strong>ملء الـ 20 مقعد الأول</strong>.' },
  months:[
    { title:'الشهر الأول — الأساس', body:'Facebook Pixel ⏳ · أول حملات Meta اختبارية · Case Study من العملاء الـ 7', topColor:'#00c896' },
    { title:'الشهر الثاني — التحسين', body:'مضاعفة ما نجح · Retargeting · LinkedIn Ads · Case Study كامل', topColor:'#4a8eff' },
    { title:'الشهر الثالث — النظام', body:'Funnel كامل · Email Sequences · Content Calendar Q2 · Referral', topColor:'#f5c842' },
  ],
  principles:[
    { n:'01', text:'الهدف الأول: ملء الـ 20 مقعد. ليس متابعين. ليس Likes.' },
    { n:'02', text:'GTM ✅ GA4 ✅ جاهزان. لا إعلان قبل Facebook Pixel ⏳.' },
    { n:'03', text:'أول Case Study حقيقي من العملاء الـ 7 = أقوى أداة تسويق.' },
    { n:'04', text:'كل CTA → jbrseo.com فقط. الـ 2 صياغات المعتمدة فقط.' },
    { n:'05', text:'ميزانية SA منفصلة عن EG. لا خلط.' },
    { n:'06', text:'نطلق ونحسّن. لا ننتظر "perfect content".' },
  ],
  packages:[
    { label:'جرّب مجاناً', price:'0 ريال', note:'1 مقال هدية', color:'#00c896', highlight:false },
    { label:'الانطلاقة', price:'399 ريال/شهر', note:'4 مقالات/شهر', color:'#4a8eff', highlight:false },
    { label:'النمو ✦ الأكثر اختياراً', price:'1,039 ريال/شهر', note:'8 مقالات/شهر', color:'#b06aff', highlight:true },
    { label:'التصدّر', price:'2,399 ريال/شهر', note:'12 مقال/شهر', color:'#f5c842', highlight:false },
  ],
  packagesFooter:'الدفع السنوي = 18 شهراً بسعر 12 · ضمان استرداد 14 يوم · إلغاء بضغطة واحدة',
}

const TEAM = {
  tag:{ color:'g' as Color, text:'الفريق' },
  title:'أدوار الفريق و KPIs الشخصية',
  subtitle:'الهدف المشترك = ملء الـ 20 مقعد في jbrseo.com',
  alert:{ type:'g' as AlertType, html:'يُراجَع هذا القسم مع كل عضو في أول اجتماع. GTM ✅ GA4 ✅ جاهزان. لا يبدأ أي إعلان قبل إضافة Facebook Pixel ⏳' },
  members:[
    { emoji:'📢', bg:'rgba(74,142,255,.13)', name:'ميديا فاير — مشتري الإعلانات', role:'Meta Ads · Google Ads · TikTok Ads · Snap Ads', duties:['لا تطلق إعلاناً قبل تأكيد Pixel + GTM','A/B Test: نسختان لكل حملة → jbrseo.com','مراقبة يومية — إيقاف Ad بـ CPA فوق 200 ريال بعد 14 يوم','تقرير أسبوعي: Spend، Leads، CPL، Best Ad','Retargeting: visitors لم يشتركوا (30 يوم)'], kpis:[['CPL SA (Meta)','أقل من 80 ريال'],['CPL EG (Meta)','أقل من 50 ريال'],['ROAS إجمالي','3x+'],['Leads مؤهلة','60%+'],['A/B Tests','4/شهر']] },
    { emoji:'🎬', bg:'rgba(255,107,74,.13)', name:'موظف الفيديو — Video Creator', role:'TikTok · Instagram Reels · YouTube Shorts · Snap', duties:['3 Reels/TikTok أسبوعياً — CTA → jbrseo.com','1 فيديو قبل/بعد من العملاء الحاليين','1 Long-form YouTube شهرياً','Stories يومية 3–4','Subtitles على كل فيديو — إجباري'], kpis:[['فيديوهات منشورة','12+/شهر'],['Watch Time','40%+'],['Reels Reach','+20%/شهر'],['فيديو 10k+ views','1/شهر'],['تسليم في الموعد','100%']] },
    { emoji:'🎨', bg:'rgba(245,200,66,.1)', name:'موظف التصاميم — Graphic Designer', role:'Feed Posts · Ad Creatives · Stories · Infographics', duties:['5 تصاميم Feed أسبوعياً','Ad Creatives: نسختان لكل حملة','Template Stories قابل للتعديل','Brand consistency صارمة','تسليم أصول الإعلانات للميديا فاير كل أحد'], kpis:[['تصاميم مسلّمة','20+/شهر'],['Ad Creatives','8+/شهر'],['Save Rate Carousels','5%+'],['تعديلات بعد التسليم','< 2/قطعة'],['تسليم في الموعد','100%']] },
    { emoji:'✍️', bg:'rgba(0,200,150,.13)', name:'كاتب المحتوى — Content Writer', role:'مقالات SEO · Captions · LinkedIn Threads · Emails', duties:['1 مقال SEO عميق لـ modonty.com (1500+ كلمة)','5 Captions Feed — كل CTA → jbrseo.com','1 Thread أسبوعي LinkedIn أو X','Brand Voice ثابت'], kpis:[['مقالات SEO','4/شهر'],['Organic Traffic','+15%/شهر'],['Captions في الموعد','100%'],['Keywords تتصدر','5+/شهر']] },
  ],
  devAlert:{ type:'g' as AlertType, html:'<strong>تم:</strong> GTM ✅ + GA4 ✅ مفعّلان. <strong>تبقّى:</strong> Facebook Pixel في GTM → الإطلاق الكامل 🚀' },
  devDone:['☑ GTM-TT25M3GX — Version 3 Published','☑ GA4 G-1H4CC4BJBM — SA + EG analytics','☑ signup_start + pricing_view + whatsapp_click','☑ Admin dashboard analytics split (🌍/🇸🇦/🇪🇬)'],
  devTodo:['☐ Facebook Pixel في GTM: New Tag → FB Pixel → All Pages','☐ Conversion Event: Lead → signup_complete','☐ تحقق في Meta Events Manager → Test Events'],
  meetings:[
    { title:'يومي — 10 دقائق', body:'Standup: ماذا نشرت؟ ماذا اليوم؟ عائق؟' },
    { title:'أسبوعي — 30 دقيقة', body:'KPIs الأسبوع + خطة الأسبوع القادم + Content Calendar' },
    { title:'شهري — 60 دقيقة', body:'Revenue، CAC، Best Content، ما نوقف، ما نضاعف' },
  ],
}

const KPIS = {
  tag:{ color:'y' as Color, text:'القياس' },
  title:'KPIs المنصات والمنتجات',
  subtitle:'الإنجاز الوحيد هو اشتراكات على jbrseo.com',
  systemKpis:[
    { label:'اشتراكات jbrseo/شهر', value:'20+', note:'ملء الـ 20 مقعد', accent:'#4a8eff' },
    { label:'CPL السعودية', value:'<80', note:'ريال/Lead', accent:'#4a8eff' },
    { label:'Retention modonty', value:'90%+', note:'احتفاظ شهري', accent:'#00c896' },
    { label:'Trial → Paid', value:'25%+', note:'نسبة التحويل', accent:'#00c896' },
  ],
  platformHeaders:['المنصة','نقيسه','لا نقيسه','الهدف'],
  platformRows:[
    { platform:'Instagram', measure:'Link Clicks لـ jbrseo، Save Rate', notMeasure:'Likes فقط', goal:'50 Click/شهر' },
    { platform:'TikTok', measure:'Watch Time %، Bio Link Clicks', notMeasure:'Views بدون Watch Time', goal:'Watch Time 40%+' },
    { platform:'LinkedIn', measure:'Profile Visits، InMail Replies، Clicks', notMeasure:'Impressions', goal:'5 Leads B2B/شهر' },
    { platform:'Snapchat', measure:'Swipe-ups لـ jbrseo', notMeasure:'Reach', goal:'30 Swipe-up/شهر' },
    { platform:'Facebook', measure:'Lead Forms، Clicks لـ jbrseo', notMeasure:'Reactions فقط', goal:'15 Click (EG)' },
  ],
}

const PLATFORMS = {
  tag:{ color:'y' as Color, text:'المنصات' },
  title:'قواعد كل منصة',
  subtitle:'كل CTA في كل منصة → jbrseo.com فقط',
  ctaAlert:{ type:'g' as AlertType, html:'<strong>CTAs المعتمدة فقط:</strong><br/>PRIMARY: <strong>ابدأ مجاناً — بدون بطاقة ←</strong><br/>SECONDARY: <strong>ابدأ الحين — ١٤ يوم ضمان كامل ✅</strong>' },
  list:[
    { name:'Instagram — التحويل الرئيسي', left:'التردد:\n• Feed: 1 قطعة/يوم\n• Stories: 3–5 يومياً\n• Live: 1/شهر\n\nBio Link: jbrseo.com دائماً', right:'توزيع أسبوعي:\n✦ 2× قبل/بعد من العملاء\n✦ 2× تعليمي\n✦ 1× Lead Magnet\n✦ 1× CTA مباشر لـ jbrseo.com' },
    { name:'TikTok — Awareness', left:'التردد: 1–2 فيديو/يوم\nالمدة: 30–60 ثانية\n\nHook في أول ثانيتين\nBio: jbrseo.com', right:'أنواع:\n✦ "لماذا موقعك ما يظهر؟"\n✦ Before/After من العملاء\n✦ "سر واحد" — معلومة مفيدة' },
    { name:'LinkedIn — B2B Authority', left:'التردد: 4–5 منشورات/أسبوع\nالثلاثاء–الخميس · 9–11 صباحاً\n\nرابط jbrseo.com في أول تعليق', right:'أنواع:\n✦ Thread تعليمي\n✦ Case Study: النتيجة أولاً\n✦ رأي استراتيجي + بيانات' },
    { name:'Snapchat (SA) + Facebook (EG)', left:'Snapchat:\n• 3–4 Stories/يوم\n• Swipe-up لـ jbrseo.com', right:'Facebook (EG):\n• 1 منشور/يوم\n• Groups: مجموعات أصحاب الأعمال\n• كل CTA → jbrseo.com' },
  ],
}

const MONTH1 = {
  tag:{ color:'m' as Color, text:'الشهر الأول' },
  title:'الشهر الأول — الأساس وأول عملاء',
  subtitle:'الأسبوع الأول: Facebook Pixel أولاً — GTM + GA4 جاهزان ✅',
  alert:{ type:'y' as AlertType, html:'<strong>شرط الإطلاق:</strong> Facebook Pixel يسجّل Conversions ✓ · GTM ✅ GA4 ✅ · Case Study من العملاء الـ 7 ✓' },
  weeks:[
    { title:'الأسبوع الأول — Facebook Pixel + تجهيز', dev:['☑ GTM-TT25M3GX — مكتمل ✅','☑ GA4 G-1H4CC4BJBM — مكتمل ✅','☐ Facebook Pixel في GTM: New Tag → FB Pixel','☐ Conversion Event: Lead → signup_complete','☐ تحقق في Meta Events Manager'], content:['☐ Content Calendar الشهر الأول','☐ Case Study من العملاء الـ 7 (قبل/بعد)','☐ كتابة أول مقالين SEO لـ modonty.com','☐ تصوير أول 5 فيديوهات','☐ Bio موحد: jbrseo.com'] },
    { title:'الأسبوع الثاني — إطلاق المحتوى', posts:[
      { platform:'Instagram', title:'Reel: "ليش عيادتك ما تظهر في Google Maps؟" 🇸🇦', example:'Hook بصري — 3 خطوات — CTA → jbrseo.com', count:'' },
      { platform:'TikTok', title:'فيديو: Case Study من أحد العملاء الـ 7 🇸🇦', example:'قبل/بعد حقيقي — 30 ثانية', count:'' },
      { platform:'LinkedIn', title:'Thread: "لماذا 80% من خدمات SEO فاشلة في السعودية"', example:'رأي جريء + بيانات + الحل', count:'' },
      { platform:'Blog', title:'مقال: "كيف تظهر في Google Maps بدون إعلانات"', example:'1500+ كلمة · CTA في النهاية: jbrseo.com', count:'' },
    ]},
    { title:'الأسبوع الثالث — أول إعلانات (بعد تأكيد Pixel)', adsSA:'Budget: 500 ريال/أسبوع\nنسخة A: Hook سؤال · نسخة B: Case Study\nAudience: أصحاب أعمال، الرياض/جدة، 28–50', adsEG:'Budget: 200 ريال/أسبوع\nنسخة A: مشكلة المنافسين · نسخة B: توفير 96%', contentPosts:[{ platform:'Snapchat', title:'Story: Swipe-up لـ jbrseo.com' },{ platform:'Facebook', title:'مجموعات أصحاب الأعمال (EG)' },{ platform:'Instagram', title:'Reel: رد على اعتراض "SEO بطيء"' }] },
    { title:'الأسبوع الرابع — تحليل + Retargeting', analysis:['☐ أي Ad أعطى أكثر Conversions؟ → ضاعف','☐ أي محتوى أعطى أكثر Link Clicks؟ → كرر','☐ GA4: بيانات SA vs EG','☐ تقرير نهاية الشهر'], retargeting:['• Audience: زار jbrseo.com ولم يشترك (30 يوم)','• Budget: 200 ريال/أسبوع','• الرسالة: Case Study + "13 مقعد متبقٍ"'] },
  ],
  summaryHeaders:['المنصة','أ1','أ2','أ3','أ4','الإجمالي'],
  summaryRows:[
    ['Instagram','تجهيز','1 Reel+Carousel','2 Reels','2 Reels','~6 Feed + 60 Stories'],
    ['TikTok','تصوير','2 فيديو','3 فيديو','2 فيديو','~10 فيديو'],
    ['LinkedIn','إعداد Profile','3 منشورات','3 منشورات','3 منشورات','~9 منشور'],
    ['Snapchat','—','3 Stories/يوم','3 Stories/يوم','3 Stories/يوم','~60 Story'],
    ['Facebook','—','5 منشورات','5 منشورات','5 منشورات','~15 (EG)'],
    ['Blog modonty','كتابة','1 مقال','—','1 مقال','2 مقالات SEO'],
  ],
}

const MONTH2 = {
  tag:{ color:'j' as Color, text:'الشهر الثاني' },
  title:'الشهر الثاني — التحسين والتوسع',
  subtitle:'نضاعف ما نجح. Case Study كامل = أقوى سلاح.',
  alert:{ type:'g' as AlertType, html:'<strong>أهم حدث:</strong> نشر Case Study كامل من أحد العملاء الـ 7 = أقوى social proof.' },
  scaleUp:['☐ Ad أعطى أكثر Conversions → ضاعف','☐ نوع محتوى أعطى أكثر Clicks → كرر','☐ SA أم EG أعطت أجود عملاء → ركّز'],
  scaleDown:['☐ Ads بـ CPA فوق 200 ريال بعد 14 يوم','☐ محتوى بـ Clicks صفر لـ jbrseo'],
  additions:[
    { title:'LinkedIn Ads:', body:'• Sponsored Content لـ Marketing Managers\n• Budget: 800 ريال/شهر' },
    { title:'Email Sequence (3 رسائل):', body:'• Email 1: قيمة · Email 2: Case Study · Email 3: CTA' },
    { title:'Referral تجريبي:', body:'• Email للعملاء الـ 7: "جيب صاحبك = شهر مجاني"' },
  ],
  scheduleHeaders:['اليوم','Instagram','TikTok','LinkedIn','Snapchat','Facebook'],
  scheduleRows:[
    ['الأحد','Reel تعليمي → jbrseo','Hook فيديو','Thread: رأي','3 Stories','مشاركة مقال'],
    ['الاثنين','Stories + Poll','—','—','3 Stories','—'],
    ['الثلاثاء','Carousel: Case Study','Before/After','Case Study قصير','3 Stories','Lead Form'],
    ['الأربعاء','Stories + Q&A','—','—','3 Stories','—'],
    ['الخميس','Reel: رد اعتراض','فيديو تعليمي','منشور بيانات','3 Stories','مشاركة Reel'],
    ['الجمعة','Stories حصرية','—','—','3 Stories','—'],
    ['السبت','CTA مباشر → jbrseo','خلف الكواليس','—','3 Stories','Groups EG'],
  ],
}

const MONTH3 = {
  tag:{ color:'y' as Color, text:'الشهر الثالث' },
  title:'الشهر الثالث — نظام يعمل وحده',
  subtitle:'Referral · YouTube · Content Calendar Q2 · تقرير Q1',
  additions:[
    { title:'Referral Program:', lines:['• كل عميل يجيب عميل = خصم أو شهر مجاني','• Email للعملاء الحاليين + بوست'] },
    { title:'YouTube:', lines:['• إطلاق القناة الرسمية','• 1 Long-form/أسبوع (5–10 دقائق)','• CTA: jbrseo.com'] },
    { title:'Content Calendar Q2:', lines:['• الأشهر 4–6 مبنية مسبقاً'] },
  ],
  reportNumbers:['• إجمالي اشتراكات jbrseo.com (3 أشهر)','• إجمالي Revenue','• إجمالي Ad Spend + ROAS','• أفضل Persona (SA vs EG)'],
  reportDecisions:['• هل رفعنا البدجت؟ · هل فتحنا سوق جديد؟','• هل عدّلنا الـ Messaging؟'],
  dailyHeaders:['اليوم','المحتوى','CTA','المنصة','المسؤول'],
  dailyRows:[
    ['الأحد','Reel تعليمي','Bio: jbrseo.com','IG + TT','فيديو + مصمم'],
    ['الأحد','Thread LinkedIn','أول تعليق: jbrseo.com','LinkedIn','كاتب'],
    ['الاثنين','Stories Poll/Q&A','Swipe-up: jbrseo.com','IG + Snap','مصمم'],
    ['الثلاثاء','Carousel: Case Study','آخر Slide: jbrseo.com','IG + FB','مصمم + كاتب'],
    ['الأربعاء','TikTok Before/After','Bio: jbrseo.com','TikTok','فيديو'],
    ['الخميس','Reel: رد اعتراض','Bio: jbrseo.com','IG + TT','فيديو + مصمم'],
    ['الجمعة','مقال SEO — modonty.com','CTA: jbrseo.com','Blog','كاتب + تطوير'],
    ['السبت','YouTube Long-form','في الفيديو: jbrseo.com','YouTube','فيديو'],
    ['السبت','Facebook Groups + Lead Form','Link: jbrseo.com','Facebook','ميديا فاير'],
  ],
}

const ADS = {
  tag:{ color:'y' as Color, text:'الإعلانات' },
  title:'خطة الإعلانات المدفوعة',
  subtitle:'كل إعلان → jbrseo.com · GTM ✅ GA4 ✅ · تبقّى Pixel ⏳',
  alert:{ type:'y' as AlertType, html:'شرط الإطلاق: GTM ✅ GA4 ✅ — Facebook Pixel ⏳ (الخطوة الأخيرة). كل ريال بدون Pixel = ضائع.' },
  budgets:[
    { label:'Meta — SA', value:'2000', note:'ريال/شهر', accent:'#4a8eff' },
    { label:'Meta — EG', value:'800', note:'ريال/شهر', accent:'#4a8eff' },
    { label:'LinkedIn Ads', value:'800', note:'ريال/شهر B2B', accent:'#00c896' },
    { label:'Snap + Google', value:'700', note:'ريال/شهر · اختبار', accent:'#f5c842' },
  ],
  campaignHeaders:['الحملة','السوق','Objective','الجمهور','نوع الإعلان','CPA'],
  campaignRows:[
    { name:'jbrseo SA Local', market:'SA', objective:'Conversions', audience:'عيادات/خدمات · الرياض/جدة · 28–50', adType:'Case Study العملاء', cpa:'200 ريال' },
    { name:'jbrseo EG Local', market:'EG', objective:'Lead Gen', audience:'عيادات/خدمات · مصر', adType:'Video + رد اعتراض', cpa:'120 ريال' },
    { name:'jbrseo B2B SA', market:'SA', objective:'Conversions', audience:'Marketing Manager · LinkedIn', adType:'Sponsored Content', cpa:'350 ريال' },
    { name:'Retargeting', market:'SA+EG', objective:'Conversions', audience:'زار jbrseo ولم يشترك · 30 يوم', adType:'"13 مقعد متبقٍ" + Testimonial', cpa:'100 ريال' },
  ],
  abTestRules:['• متغير واحد فقط في كل اختبار','• 7 أيام كحد أدنى لكل نسخة','• Budget: 200 ريال على كل نسخة','• الفائز: أقل CPA على jbrseo.com'],
  abVariables:['Hook (سؤال vs Case Study vs مشكلة)','الفيديو/الصورة (قبل/بعد vs شهادة)','CTA ("ابدأ مجاناً" vs "ابدأ الحين — ١٤ يوم")','الجمهور (Interest vs Lookalike vs Retargeting)'],
}

const RULES = {
  tag:{ color:'g' as Color, text:'القواعد' },
  title:'قواعد النشر والـ QA',
  subtitle:'لا استثناءات — كل عضو في الفريق مسؤول',
  ctaAlert:{ type:'g' as AlertType, html:'<strong>CTAs المعتمدة — الـ 2 فقط:</strong><br/>PRIMARY: <strong>ابدأ مجاناً — بدون بطاقة ←</strong><br/>SECONDARY: <strong>ابدأ الحين — ١٤ يوم ضمان كامل ✅</strong>' },
  trackingAlert:{ type:'b' as AlertType, html:'<strong>التتبع:</strong> GTM ✅ · GA4 ✅ · signup_start ✅ · pricing_view ✅ · whatsapp_click ✅<br/><strong>⏳ تبقّى:</strong> Facebook Pixel — أضفه في GTM' },
  contentRules:[
    { n:'01', text:'كل CTA → jbrseo.com فقط. الـ 2 صياغات المعتمدة فقط.' },
    { n:'02', text:'Hook يأتي أولاً — لا مقدمات. أول جملة/ثانية تجذب أو تخسر.' },
    { n:'03', text:'لا نشر بدون مراجعة: كاتب/مصمم → مراجعة → نشر.' },
    { n:'04', text:'Social Proof حقيقي في كل إعلان — من العملاء الـ 7.' },
    { n:'05', text:'Brand Voice: هادئ، واقعي، واضح.' },
    { n:'06', text:'Caption: النتيجة أولاً — ثم القصة — ثم CTA.' },
    { n:'07', text:'كل مقال له Keyword محدد. لا مقال "عام" على modonty.com.' },
    { n:'08', text:'Subtitles على كل فيديو — 80% يشاهدون بصمت — إجباري.' },
  ],
  adRules:[
    { n:'01', text:'شروط الإطلاق: GTM ✅ GA4 ✅ Pixel ⏳ Landing Page ✓ Social Proof ✓' },
    { n:'02', text:'كل الإعلانات → jbrseo.com. ليس modonty.com مباشرة.' },
    { n:'03', text:'100+ ريال بدون Conversion = إيقاف وتحليل فوري.' },
    { n:'04', text:'A/B Test إجباري: نسختان لكل حملة جديدة.' },
    { n:'05', text:'لا تقرير يذكر Likes كإنجاز. الإنجاز = اشتراكات jbrseo + Revenue.' },
    { n:'06', text:'ميزانية SA منفصلة عن EG — لا خلط.' },
  ],
  qaLeft:['☐ Hook واضح في أول ثانيتين/سطرين؟','☐ CTA المعتمد فقط → jbrseo.com؟','☐ Caption يبدأ بالنتيجة؟','☐ Social Proof موجود؟'],
  qaRight:['☐ Hashtags 3–7 فقط؟','☐ Subtitles على الفيديو؟','☐ Brand Guide متّبع؟','☐ مسجّل في Content Calendar؟'],
}

// ══════════════════════════════════════════════════════════════════════════════
// RENDERING ENGINE — عدّل هنا للتصميم فقط
// ══════════════════════════════════════════════════════════════════════════════

const C = {
  bg:'#0b0d12', surface:'#13161f', s2:'#1a1e2b',
  border:'#252b3b', text:'#dde0ea', muted:'#6e7590', hint:'#4a5070',
  m:'#00c896', j:'#4a8eff', r:'#ff6b4a', y:'#f5c842', p:'#b06aff',
}

const PF: Record<string, CSSProperties> = {
  Instagram:{background:'rgba(228,64,95,.14)',color:'#e8556a'},
  TikTok:   {background:'rgba(37,244,238,.09)',color:'#1dd9d4'},
  LinkedIn: {background:'rgba(10,102,194,.18)',color:'#4a8eff'},
  Snapchat: {background:'rgba(255,252,0,.08)', color:'#d4af00'},
  Facebook: {background:'rgba(24,119,242,.14)',color:'#5b9bf5'},
  YouTube:  {background:'rgba(255,0,0,.11)',   color:'#ff6060'},
  Blog:     {background:'rgba(0,200,150,.1)',  color:'#00c896'},
}

const CM: Record<Color, CSSProperties> = {
  m:{background:'rgba(0,200,150,.1)',color:C.m},
  j:{background:'rgba(74,142,255,.1)',color:C.j},
  y:{background:'rgba(245,200,66,.09)',color:C.y},
  r:{background:'rgba(255,107,74,.1)',color:C.r},
  g:{background:'rgba(110,117,144,.1)',color:C.muted},
  p:{background:'rgba(176,106,255,.1)',color:C.p},
}

const AM: Record<AlertType, CSSProperties> = {
  r:{background:'rgba(255,107,74,.07)',borderColor:C.r,color:'#ffb3a0'},
  g:{background:'rgba(0,200,150,.07)',borderColor:C.m,color:'#96ffe0'},
  y:{background:'rgba(245,200,66,.07)',borderColor:C.y,color:'#f5e090'},
  b:{background:'rgba(74,142,255,.07)',borderColor:C.j,color:'#a0c4ff'},
}

// primitives
function Tag({color,children}:{color:Color;children:ReactNode}):ReactNode{return<span style={{display:'inline-block',fontSize:10,fontWeight:700,letterSpacing:'.07em',padding:'2px 9px',borderRadius:4,marginBottom:8,textTransform:'uppercase',...CM[color]}}>{children}</span>}
function Badge({color,children}:{color:Color;children:ReactNode}):ReactNode{return<span style={{display:'inline-block',fontSize:10.5,fontWeight:500,padding:'1px 7px',borderRadius:3,margin:1,...CM[color]}}>{children}</span>}
function Alert({type,html}:{type:AlertType;html:string}):ReactNode{return<div style={{padding:'.8rem 1.1rem',borderRadius:10,fontSize:12.5,marginBottom:'.85rem',borderRight:'3px solid',lineHeight:1.6,...AM[type]}} dangerouslySetInnerHTML={{__html:html}}/>}
function Card({children,topColor,style}:{children:ReactNode;topColor?:string;style?:CSSProperties}):ReactNode{return<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:'1.1rem 1.3rem',marginBottom:'.85rem',...(topColor?{borderTop:`2px solid ${topColor}`}:{}),...style}}>{children}</div>}
function CT({children}:{children:ReactNode}){return<div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:'.6rem',display:'flex',alignItems:'center',gap:8}}>{children}</div>}
function CB({children}:{children:ReactNode}):ReactNode{return<div style={{fontSize:12.5,color:C.muted,lineHeight:1.8}}>{children}</div>}
function Sub({children,style}:{children:ReactNode;style?:CSSProperties}):ReactNode{return<div style={{fontSize:10,fontWeight:700,letterSpacing:'.07em',color:C.hint,textTransform:'uppercase',margin:'.7rem 0 .4rem',...style}}>{children}</div>}
function Divider():ReactNode{return<div style={{height:1,background:C.border,margin:'1.25rem 0'}}/>}
function Grid({cols,children}:{cols:2|3|4;children:ReactNode}):ReactNode{const t={2:'1fr 1fr',3:'1fr 1fr 1fr',4:'1fr 1fr 1fr 1fr'};return<div style={{display:'grid',gridTemplateColumns:t[cols],gap:cols===4?'.7rem':'.85rem'}}>{children}</div>}
function Rule({n,text}:{n:string;text:string}):ReactNode{return<div style={{padding:'.8rem 1.1rem',borderRadius:8,background:C.s2,border:`1px solid ${C.border}`,fontSize:12.5,color:C.text,lineHeight:1.6,marginBottom:'.55rem'}}><div style={{fontSize:10,color:C.hint,marginBottom:2}}>قاعدة {n}</div>{text}</div>}
function Kpi({label,value,note,accent}:{label:string;value:string;note:string;accent?:string}):ReactNode{return<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:'.9rem 1.1rem',textAlign:'center',...(accent?{borderTop:`2px solid ${accent}`}:{})}}><div style={{fontSize:10.5,color:C.muted,marginBottom:'.35rem',fontWeight:500}}>{label}</div><div style={{fontSize:19,fontWeight:700,marginBottom:'.15rem',color:accent??C.text}}>{value}</div><div style={{fontSize:10.5,color:C.muted}}>{note}</div></div>}
function Tbl({headers,rows}:{headers:string[];rows:string[][]}):ReactNode{return<div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:12.5}}><thead><tr>{headers.map((h,i)=><th key={i} style={{background:C.s2,color:C.muted,fontWeight:500,padding:'.55rem .9rem',textAlign:'right',fontSize:11,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead><tbody>{rows.map((row,ri)=><tr key={ri}>{row.map((cell,ci)=><td key={ci} style={{padding:'.6rem .9rem',borderBottom:ri<rows.length-1?`1px solid ${C.border}`:'none',color:C.text,verticalAlign:'top',lineHeight:1.6}}>{cell}</td>)}</tr>)}</tbody></table></div>}
function Week({title,children}:{title:string;children:ReactNode}):ReactNode{const[o,s]=useState(false);return<div style={{border:`1px solid ${C.border}`,borderRadius:10,marginBottom:'1rem',overflow:'hidden'}}><div onClick={()=>s(!o)} style={{background:C.s2,padding:'.7rem 1.1rem',display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer',fontSize:12.5,fontWeight:600,color:C.text}}><span>{title}</span><span style={{fontSize:9,color:C.muted,transform:o?'rotate(90deg)':'none',transition:'transform .18s'}}>▶</span></div>{o&&<div style={{padding:'.9rem 1.1rem'}}>{children}</div>}</div>}
function Post({platform,title,example,count}:{platform:string;title:string;example?:string;count?:string}):ReactNode{const s=PF[platform]??{background:'rgba(110,117,144,.1)',color:C.muted};return<div style={{display:'flex',gap:10,padding:'.6rem 0',borderBottom:`1px solid ${C.border}`,alignItems:'flex-start'}}><span style={{minWidth:72,fontSize:11,fontWeight:600,padding:'.2rem .5rem',borderRadius:3,textAlign:'center',marginTop:2,flexShrink:0,...s}}>{platform}</span><div style={{flex:1}}><div style={{fontSize:12.5,fontWeight:500,color:C.text,marginBottom:2}}>{title}</div>{example&&<div style={{fontSize:11.5,color:C.muted,lineHeight:1.55}}>{example}</div>}{count&&<div style={{fontSize:10.5,color:C.y,marginTop:3,fontWeight:500}}>{count}</div>}</div></div>}
function SH({tag,title,subtitle}:{tag:{color:Color;text:string};title:string;subtitle:string}):ReactNode{return<div style={{marginBottom:'1.75rem'}}><Tag color={tag.color}>{tag.text}</Tag><div style={{fontSize:20,fontWeight:700,color:C.text,marginBottom:'.35rem'}}>{title}</div><div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>{subtitle}</div></div>}

// sections
function SectionStatus():ReactNode{const d=STATUS;return<div><SH tag={d.tag} title={d.title} subtitle={d.subtitle}/><Alert type={d.alert.type} html={d.alert.html}/><Sub>مقاييس الأداء — قبل وبعد</Sub><Tbl headers={d.perfHeaders} rows={d.perfRows}/><Divider/><Sub>إصلاحات المحتوى</Sub><Tbl headers={d.contentHeaders} rows={d.contentRows}/><Divider/><Sub>GTM + GA4 — مكتمل ✅</Sub><Alert type={d.gtmAlert.type} html={d.gtmAlert.html}/><Grid cols={2}>{d.gtmCards.map(c=><Card key={c.title} topColor={c.topColor}><CT>{c.title}</CT><CB><div dangerouslySetInnerHTML={{__html:c.body.replace(/\n/g,'<br/>')}}/></CB></Card>)}</Grid><Sub>ما يتبقى</Sub><Alert type={d.pixelAlert.type} html={d.pixelAlert.html}/><Card topColor={d.pixelCard.topColor}><CT>{d.pixelCard.title}</CT><CB>{d.pixelCard.steps.map((s,i)=><div key={i}>{i+1}. {s}<br/></div>)}<strong style={{color:C.y}}>{d.pixelCard.footer}</strong></CB></Card></div>}
function SectionFunnel():ReactNode{const d=FUNNEL;return<div><SH tag={d.tag} title={d.title} subtitle={d.subtitle}/><Card topColor={d.systemCard.topColor}><CT>{d.systemCard.title}</CT><CB><div dangerouslySetInnerHTML={{__html:d.systemCard.body.replace(/\n/g,'<br/>')}}/></CB></Card><div style={{textAlign:'center',padding:'1rem 0'}}>{d.steps.map((s,i)=><div key={i}><div style={{margin:'0 auto',width:s.w,background:s.bg,border:`1px solid ${s.border}`,borderRadius:6,padding:'.7rem',fontSize:12,fontWeight:500,color:C.text}}>{s.label}{s.sub&&<span style={{display:'block',fontSize:11,color:C.muted}}>{s.sub}</span>}</div>{i<d.steps.length-1&&<div style={{color:C.hint,fontSize:12,margin:'4px 0'}}>▼</div>}</div>)}</div><Divider/><Grid cols={2}>{d.statusCards.map(c=><Card key={c.badge} topColor={c.topColor}><CT><Badge color={c.badgeColor}>{c.badge}</Badge>{c.title}</CT><CB>{c.items.map((it,i)=><div key={i}>{it}</div>)}</CB></Card>)}</Grid><Divider/><Sub>السوق المستهدف</Sub><Grid cols={2}>{d.markets.map(m=><Card key={m.title}><CT>{m.title}</CT><CB><strong style={{color:C.text}}>الجمهور:</strong> {m.audience}<br/><strong style={{color:C.text}}>المنصات:</strong> {m.platforms}<br/><strong style={{color:C.text}}>اللغة:</strong> {m.language}<br/><strong style={{color:C.text}}>المشتركون:</strong> {m.subscribers}</CB></Card>)}</Grid></div>}
function PersonaItem({p}:{p:typeof PERSONAS.list[0]}):ReactNode{return<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:'1.1rem',display:'flex',flexDirection:'column',gap:'.65rem'}}><div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:40,height:40,borderRadius:'50%',background:p.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0}}>{p.emoji}</div><div><div style={{fontSize:13,fontWeight:600,color:C.text}}>{p.name} {p.badges.map(b=><Badge key={b.text} color={b.color}>{b.text}</Badge>)}</div><div style={{fontSize:11,color:C.muted}}>{p.role}</div></div></div><div style={{fontSize:12.5,color:C.muted,lineHeight:1.8}}><strong style={{color:C.text}}>دوافعه:</strong> {p.motives}<br/><strong style={{color:C.text}}>اعتراضه:</strong> {p.objection}<br/><strong style={{color:C.text}}>ردنا:</strong> {p.response}<br/><strong style={{color:C.text}}>رحلته:</strong> {p.journey}<br/><strong style={{color:C.text}}>قناته:</strong> {p.channel}</div></div>}
function SectionPersonas():ReactNode{const d=PERSONAS;return<div><SH tag={d.tag} title={d.title} subtitle={d.subtitle}/><Grid cols={2}>{d.list.slice(0,4).map(p=><PersonaItem key={p.name} p={p}/>)}</Grid><div style={{marginTop:'.85rem'}}>{d.list.slice(4).map(p=><PersonaItem key={p.name} p={p}/>)}</div></div>}
function SectionStrategy():ReactNode{const d=STRATEGY;return<div><SH tag={d.tag} title={d.title} subtitle={d.subtitle}/><Alert type={d.alert.type} html={d.alert.html}/><Grid cols={3}>{d.months.map(m=><Card key={m.title} topColor={m.topColor}><CT>{m.title}</CT><CB>{m.body}</CB></Card>)}</Grid><Divider/><Sub>المبادئ الثابتة</Sub><Grid cols={2}><div>{d.principles.slice(0,3).map(p=><Rule key={p.n} n={p.n} text={p.text}/>)}</div><div>{d.principles.slice(3).map(p=><Rule key={p.n} n={p.n} text={p.text}/>)}</div></Grid><Divider/><Card><CT>الباقات الحالية على jbrseo.com</CT><CB><Grid cols={4}>{d.packages.map(p=><div key={p.label} style={{padding:'10px',border:`${p.highlight?2:1}px solid ${p.highlight?p.color:C.border}`,borderRadius:8,textAlign:'center'}}><div style={{fontSize:11,color:p.highlight?p.color:C.muted,marginBottom:4}}>{p.label}</div><div style={{fontSize:16,fontWeight:700,color:p.color}}>{p.price}</div><div style={{fontSize:11,color:C.muted}}>{p.note}</div></div>)}</Grid><div style={{marginTop:12,fontSize:12,color:C.muted}}>{d.packagesFooter}</div></CB></Card></div>}
function SectionTeam():ReactNode{const d=TEAM;return<div><SH tag={d.tag} title={d.title} subtitle={d.subtitle}/><Alert type={d.alert.type} html={d.alert.html}/><Grid cols={2}>{d.members.map(m=><div key={m.name} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:'1.1rem',display:'flex',flexDirection:'column',gap:'.65rem'}}><div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:40,height:40,borderRadius:'50%',background:m.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>{m.emoji}</div><div><div style={{fontSize:13,fontWeight:600,color:C.text}}>{m.name}</div><div style={{fontSize:11,color:C.muted}}>{m.role}</div></div></div><Sub>المهام</Sub><div style={{fontSize:12.5,color:C.muted,lineHeight:1.8}}>{m.duties.map((d,i)=><div key={i}>• {d}</div>)}</div><Sub>KPIs الشهرية</Sub><ul style={{listStyle:'none',padding:0}}>{m.kpis.map(([l,v],i)=><li key={i} style={{fontSize:11.5,color:C.muted,padding:'.28rem 0',borderBottom:i<m.kpis.length-1?`1px solid ${C.border}`:'none',display:'flex',justifyContent:'space-between'}}>{l}<span style={{color:C.y,fontWeight:500,fontSize:10.5}}>{v}</span></li>)}</ul></div>)}</Grid><Divider/><Sub>مدير التطوير</Sub><Alert type={d.devAlert.type} html={d.devAlert.html}/><Card><CT>🛠 قائمة مهام مدير التطوير</CT><CB><Grid cols={2}><div><strong style={{color:C.m}}>مكتمل ✅:</strong>{d.devDone.map((t,i)=><div key={i}>{t}</div>)}</div><div><strong style={{color:C.y}}>⏳ تبقّى:</strong>{d.devTodo.map((t,i)=><div key={i}>{t}</div>)}</div></Grid></CB></Card><Divider/><Sub>إيقاع الاجتماعات</Sub><Grid cols={3}>{d.meetings.map(m=><Card key={m.title}><CT>{m.title}</CT><CB>{m.body}</CB></Card>)}</Grid></div>}
function SectionKpis():ReactNode{const d=KPIS;return<div><SH tag={d.tag} title={d.title} subtitle={d.subtitle}/><Sub>KPIs النظام</Sub><Grid cols={4}>{d.systemKpis.map(k=><Kpi key={k.label} {...k}/>)}</Grid><Sub style={{marginTop:'1.25rem'}}>KPIs كل منصة</Sub><Tbl headers={d.platformHeaders} rows={d.platformRows.map(r=>[r.platform,r.measure,r.notMeasure,r.goal])}/><Alert type="r" html="<strong>محظور:</strong> لا يُقدَّم تقرير يذكر Likes أو Followers كإنجاز. الإنجاز = اشتراكات jbrseo.com + Revenue."/></div>}
function SectionPlatforms():ReactNode{const d=PLATFORMS;return<div><SH tag={d.tag} title={d.title} subtitle={d.subtitle}/><Alert type={d.ctaAlert.type} html={d.ctaAlert.html}/>{d.list.map(p=><Card key={p.name}><CT>{p.name}</CT><CB><Grid cols={2}><div style={{whiteSpace:'pre-line'}}>{p.left}</div><div style={{whiteSpace:'pre-line'}}>{p.right}</div></Grid></CB></Card>)}</div>}
function SectionMonth1():ReactNode{
  const d=MONTH1,w=d.weeks
  const w0=w[0] as {title:string;dev:string[];content:string[]}
  const w1=w[1] as {title:string;posts:{platform:string;title:string;example?:string;count?:string}[]}
  const w2=w[2] as {title:string;adsSA:string;adsEG:string;contentPosts:{platform:string;title:string}[]}
  const w3=w[3] as {title:string;analysis:string[];retargeting:string[]}
  return<div><SH tag={d.tag} title={d.title} subtitle={d.subtitle}/><Alert type={d.alert.type} html={d.alert.html}/><Week title={w0.title}><Grid cols={2}><div><Sub>مدير التطوير</Sub><CB>{w0.dev.map((t,i)=><div key={i}>{t}</div>)}</CB></div><div><Sub>المحتوى والتصميم</Sub><CB>{w0.content.map((t,i)=><div key={i}>{t}</div>)}</CB></div></Grid></Week><Week title={w1.title}>{w1.posts.map(p=><Post key={p.platform+p.title} platform={p.platform} title={p.title} example={p.example} count={p.count||undefined}/>)}</Week><Week title={w2.title}><Grid cols={2}><div><Sub>Meta Ads — Landing: jbrseo.com</Sub><CB><strong style={{color:C.text}}>SA:</strong><br/>{w2.adsSA.split('\n').map((l,i)=><div key={i}>{l}</div>)}<br/><strong style={{color:C.text}}>EG:</strong><br/>{w2.adsEG.split('\n').map((l,i)=><div key={i}>{l}</div>)}</CB></div><div><Sub>محتوى الأسبوع</Sub>{w2.contentPosts.map(p=><Post key={p.platform} platform={p.platform} title={p.title}/>)}</div></Grid></Week><Week title={w3.title}><Grid cols={2}><div><Sub>قرارات البيانات</Sub><CB>{w3.analysis.map((t,i)=><div key={i}>{t}</div>)}</CB></div><div><Sub>إطلاق Retargeting</Sub><CB>{w3.retargeting.map((t,i)=><div key={i}>{t}</div>)}</CB></div></Grid></Week><Sub>ملخص المحتوى — الشهر الأول</Sub><Tbl headers={d.summaryHeaders} rows={d.summaryRows}/></div>
}
function SectionMonth2():ReactNode{const d=MONTH2;return<div><SH tag={d.tag} title={d.title} subtitle={d.subtitle}/><Alert type={d.alert.type} html={d.alert.html}/><Grid cols={2}><Card><CT>قرارات بداية الشهر الثاني</CT><CB><strong style={{color:C.text}}>ماذا نضاعف:</strong><br/>{d.scaleUp.map((t,i)=><div key={i}>{t}</div>)}<br/><strong style={{color:C.text}}>ماذا نوقف:</strong><br/>{d.scaleDown.map((t,i)=><div key={i}>{t}</div>)}</CB></Card><Card><CT>إضافات الشهر الثاني</CT><CB>{d.additions.map(a=><div key={a.title}><strong style={{color:C.text}}>{a.title}</strong><br/>{a.body.split('\n').map((l,i)=><div key={i}>{l}</div>)}<br/></div>)}</CB></Card></Grid><Sub>جدول المحتوى الأسبوعي</Sub><Tbl headers={d.scheduleHeaders} rows={d.scheduleRows}/></div>}
function SectionMonth3():ReactNode{const d=MONTH3;return<div><SH tag={d.tag} title={d.title} subtitle={d.subtitle}/><Grid cols={2}><Card><CT>إضافات الشهر الثالث</CT><CB>{d.additions.map(a=><div key={a.title}><strong style={{color:C.text}}>{a.title}</strong><br/>{a.lines.map((l,i)=><div key={i}>{l}</div>)}<br/></div>)}</CB></Card><Card><CT>تقرير Q1</CT><CB><strong style={{color:C.text}}>الأرقام:</strong><br/>{d.reportNumbers.map((l,i)=><div key={i}>{l}</div>)}<br/><strong style={{color:C.text}}>قرارات Q2:</strong><br/>{d.reportDecisions.map((l,i)=><div key={i}>{l}</div>)}</CB></Card></Grid><Sub>الجدول اليومي — الشهر الثالث</Sub><Tbl headers={d.dailyHeaders} rows={d.dailyRows}/></div>}
function SectionAds():ReactNode{const d=ADS;return<div><SH tag={d.tag} title={d.title} subtitle={d.subtitle}/><Alert type={d.alert.type} html={d.alert.html}/><Sub>توزيع الميزانية</Sub><Grid cols={4}>{d.budgets.map(b=><Kpi key={b.label} {...b}/>)}</Grid><Sub style={{marginTop:'1.25rem'}}>هيكل الحملات</Sub><Tbl headers={d.campaignHeaders} rows={d.campaignRows.map(r=>[r.name,r.market,r.objective,r.audience,r.adType,r.cpa])}/><Divider/><Grid cols={2}><Card><CT>A/B Test</CT><CB>{d.abTestRules.map((r,i)=><div key={i}>{r}</div>)}</CB></Card><Card><CT>ترتيب المتغيرات</CT><CB>{d.abVariables.map((r,i)=><div key={i}>{i+1}. {r}</div>)}</CB></Card></Grid></div>}
function SectionRules():ReactNode{const d=RULES;return<div><SH tag={d.tag} title={d.title} subtitle={d.subtitle}/><Alert type={d.ctaAlert.type} html={d.ctaAlert.html}/><Alert type={d.trackingAlert.type} html={d.trackingAlert.html}/><Sub>قواعد المحتوى</Sub><Grid cols={2}><div>{d.contentRules.slice(0,4).map(r=><Rule key={r.n} n={r.n} text={r.text}/>)}</div><div>{d.contentRules.slice(4).map(r=><Rule key={r.n} n={r.n} text={r.text}/>)}</div></Grid><Sub>قواعد الإعلانات</Sub><Grid cols={2}><div>{d.adRules.slice(0,3).map(r=><Rule key={r.n} n={r.n} text={r.text}/>)}</div><div>{d.adRules.slice(3).map(r=><Rule key={r.n} n={r.n} text={r.text}/>)}</div></Grid><Divider/><Sub>QA Checklist — قبل كل نشر</Sub><Card><CB><Grid cols={2}><div>{d.qaLeft.map((q,i)=><div key={i}>{q}</div>)}</div><div>{d.qaRight.map((q,i)=><div key={i}>{q}</div>)}</div></Grid></CB></Card></div>}

const SECTIONS: Record<SectionId, ComponentType> = {
  status:SectionStatus, funnel:SectionFunnel, personas:SectionPersonas,
  strategy:SectionStrategy, team:SectionTeam, kpis:SectionKpis,
  platforms:SectionPlatforms, month1:SectionMonth1, month2:SectionMonth2,
  month3:SectionMonth3, ads:SectionAds, rules:SectionRules,
}

// ─── Main — بدون sidebar داخلي، يعمل داخل admin layout ──────────────────────
export default function MarketingPlan() {
  const [active, setActive] = useState<SectionId>('status')
  const ActiveSection = SECTIONS[active]

  return (
    <div dir="rtl" style={{fontFamily:"'IBM Plex Sans Arabic', sans-serif",color:C.text,fontSize:14,lineHeight:1.7}}>

      {/* Status bar */}
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:'.6rem 1.1rem',marginBottom:'1.25rem',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
        <span style={{fontSize:12,fontWeight:600}}>مركز التسويق — مدونتي · Production ✅</span>
        <div style={{display:'flex',gap:12,fontSize:11,color:C.muted,flexWrap:'wrap'}}>
          <span><span style={{width:6,height:6,borderRadius:'50%',background:C.m,display:'inline-block',marginLeft:4,animation:'pu 2s infinite'}}/>نشط</span>
          {TOPBAR_BADGES.map(b=><span key={b.text} style={b.color?{color:b.color}:{}}>{b.text}</span>)}
        </div>
      </div>

      {/* Tab groups */}
      <div style={{marginBottom:'1.25rem'}}>
        {NAV_GROUPS.map(group=>(
          <div key={group.title} style={{marginBottom:'.5rem'}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:'.08em',color:C.hint,textTransform:'uppercase',marginBottom:'.3rem'}}>{group.title}</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.35rem'}}>
              {group.items.map(item=>(
                <button key={item.id} onClick={()=>setActive(item.id)}
                  style={{
                    padding:'.35rem .85rem', fontSize:12, fontWeight:500, borderRadius:6, cursor:'pointer',
                    border:`1px solid ${active===item.id ? C.m : C.border}`,
                    background: active===item.id ? 'rgba(0,200,150,.1)' : C.surface,
                    color: active===item.id ? C.m : C.muted,
                    transition:'all .12s',
                  }}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{background:C.s2,border:`1px solid ${C.border}`,borderRadius:12,padding:'1.75rem'}}>
        <ActiveSection/>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        @keyframes pu{0%,100%{opacity:1}50%{opacity:.3}}
        *{box-sizing:border-box} button:hover{opacity:.85}
      `}</style>
    </div>
  )
}
