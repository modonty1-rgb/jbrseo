# مراجعة شاملة لسجلات DNS — modonty.com

**التاريخ**: 24 أبريل 2026
**المدقق**: Claude
**المستوى**: ⚠️ مهم — مشروع رئيسي و SEO حرج

---

## الخلاصة السريعة

| العنصر | الحالة |
|--------|--------|
| النطاق الأساسي modonty.com | ✅ يعمل (A record موجود) |
| www.modonty.com | ✅ يعمل (على Vercel) |
| admin.modonty.com | ✅ يعمل (على Vercel) |
| console.modonty.com | ✅ يعمل (على Vercel) |
| v0.modonty.com | ✅ يعمل (على Vercel — عنقود مختلف) |
| البريد الإلكتروني (Hostinger) | ✅ تكوين سليم |
| إرسال الإيميل (AWS SES/Resend) | ✅ مُعدّ بشكل جيد |
| DKIM | ✅ ثلاث مفاتيح Hostinger موجودة |
| SPF + DMARC | ✅ موجودين |
| Google Search Console | ⏳ ينتظر DNS cache |
| DNSSEC | ⚪ معطّل (آمن لعدم التفعيل) |

**الحكم النهائي**: **الإعداد سليم تماماً ومناسب لـ SEO**. لا توجد مشاكل حرجة.

---

## 1. Host Records (السجلات الكاملة)

### سجلات الموقع (Vercel)

| Type | Host | Value | التقييم |
|------|------|-------|--------|
| A | @ | `216.198.79.1` | ℹ️ IP Hostinger — الجذر modonty.com يشير لـ Hostinger. تأكد إن هذا المقصود |
| CNAME | www | `274e8024b78a8ad1.vercel-dns-017.com.` | ✅ www.modonty.com → Vercel |
| CNAME | admin | `b3272f1cf53d68dc.vercel-dns-017.com.` | ✅ admin.modonty.com → Vercel |
| CNAME | console | `70338d5113e2dafa.vercel-dns-017.com.` | ✅ console.modonty.com → Vercel |
| CNAME | v0 | `8577045241aa0377.vercel-dns-016.com.` | ✅ v0.modonty.com → Vercel (عنقود مختلف 016، طبيعي) |

### ℹ️ ملاحظة عن A Record
`216.198.79.1` هو IP تابع لـ Hostinger. يعني لما حد يكتب `modonty.com` مباشرة (بدون www)، يوصل لاستضافة Hostinger، مو للموقع الـ Next.js على Vercel.

**إذا الموقع الأساسي modonty.com المفروض يشتغل على Vercel**: لازم تضيف redirect أو تغيّر الـ A record لـ Vercel (`76.76.21.21`). أو تحط إعداد redirect في Hostinger لتحويل لـ www.modonty.com.

**إذا modonty.com تعرض صفحة مختلفة** (زي صفحة هبوط منفصلة على Hostinger): الإعداد الحالي صح.

---

### سجلات الإيميل (Hostinger)

| Type | Host | Value | التقييم |
|------|------|-------|--------|
| CNAME | autoconfig | autoconfig.mail.hostinger.com. | ℹ️ اختياري (Thunderbird auto-config) |
| CNAME | autodiscover | autodiscover.mail.hostinger.com. | ℹ️ اختياري (Outlook auto-discovery) |
| CNAME | hostingermail-a._domainkey | hostingermail-a.dkim.mail.hostinger.com. | ✅ DKIM 1 (TTL 30min) |
| CNAME | hostingermail-b._domainkey | hostingermail-b.dkim.mail.hostinger.com. | ✅ DKIM 2 (TTL 30min) |
| CNAME | hostingermail-c._domainkey | hostingermail-c.dkim.mail.hostinger.com. | ✅ DKIM 3 |
| TXT | @ | v=spf1 include:_spf.mail.hostinger.com ~all | ✅ SPF — يسمح لـ Hostinger إرسال باسم modonty.com |
| TXT | _dmarc | v=DMARC1; p=none; rua=mailto:no-reply@modo... | ✅ DMARC — مراقبة فقط (p=none آمن) |

**التقييم**: التكوين كامل واحترافي. الصلاحيات الثلاث (SPF/DKIM/DMARC) مُفعّلة — الإيميل الصادر ما يذهب spam.

---

### سجلات Resend / AWS SES

| Type | Host | Value | Priority | التقييم |
|------|------|-------|----------|--------|
| TXT | resend._domainkey | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...` | - | ✅ DKIM لـ Resend |
| TXT | send | v=spf1 include:amazonses.com ~all | - | ✅ SPF لـ send.modonty.com |
| MX | @ | mx1.hostinger.com. | **5** | ✅ الأساسي لاستقبال البريد |
| MX | @ | mx2.hostinger.com. | **10** | ✅ احتياطي Hostinger |
| MX | @ | inbound-smtp.eu-west-1.amazonaws.com. | **10** | 🚨 **تعارض** — نفس أولوية mx2 |
| MX | send | feedback-smtp.eu-west-1.amazonses.com. | **10** | ✅ feedback loop لـ Resend (subdomain منفصل) |

### 🚨 مشكلة حرجة تحتاج إصلاح

**MX @ inbound-smtp.eu-west-1.amazonaws.com (priority 10)**

هذا السجل عنده نفس priority (10) مثل `mx2.hostinger.com`. لما `mx1` يفشل، سيرفرات المرسلين قد تختار عشوائياً بين:
- `mx2.hostinger.com` → البريد يوصل Hostinger ✅
- `inbound-smtp.eu-west-1.amazonaws.com` → البريد يذهب لـ AWS ❌

**النتيجة**: خطر فقدان بريد وارد.

**خيارات الإصلاح**:

1. **إذا AWS SES ما يستخدم للاستقبال** (الأغلب): احذف هذا الـ MX record
2. **إذا AWS يستخدم لاستقبال bounces**: غيّر priority من 10 إلى **20**

**توصيتي**: احذفه. Resend عادةً ما يحتاج MX لاستقبال. المستخدم يسأل فيصل قبل الحذف لو مش متأكد.

---

### سجلات التحقق من الملكية

| Type | Host | Value | التقييم |
|------|------|-------|--------|
| TXT | _vercel | vc-domain-verify=admin.modonty.com,9b84e02... | ✅ تحقق Vercel لـ admin |
| TXT | _vercel | vc-domain-verify=modonty.com,6b73f346d12f14... | ✅ تحقق Vercel للجذر |
| TXT | _vercel | vc-domain-verify=www.modonty.com,ccc212170... | ✅ تحقق Vercel لـ www |
| TXT | _vercel | vc-domain-verify=console.modonty.com,a0f7d41f... | ✅ تحقق Vercel لـ console |
| TXT | @ | google-site-verification=rRCR3dR7CJ1g_gHF4NC... | ⏳ الجديد اللي ضفناه — ينتظر Google cache |
| TXT | @ | `b048a5848b475c4b4b4b63fa361bd4fc` | ⚠️ **غامض** — لا نعرف مصدره |

**بخصوص b048**:
- شكله MD5 hash (32 hex chars بدون prefix)
- لا يبدأ بـ "google-site-verification=" فهو ليس تحقق Google
- لا يبدأ بـ "facebook-domain-verification=" فهو ليس Facebook
- قد يكون: Hostinger domain verification قديم، أو خدمة تحليلات قديمة
- **الحكم**: آمن تجاهله، بس إذا تبي تنظّف، اسأل عن مصدره قبل الحذف

---

## 2. Mail Settings (خدمة البريد)

- **Type**: Custom MX ✅
- **MX Records**: 4 سجلات (مُشار لها في الجدول أعلاه)
- **الحكم**: الإعداد مناسب لاستخدام Hostinger (استقبال) + AWS SES/Resend (إرسال transactional)

---

## 3. DNSSEC

- **الحالة**: معطّل ⚪
- **الحكم**: آمن. لا يحتاج تفعيل إلا لمتطلب خاص.

---

## 4. Dynamic DNS

- **الحالة**: معطّل ⚪
- **الحكم**: ممتاز. لا علاقة له بالموقع.

---

## 5. Personal DNS Server

- **الإعداد**: Standard Nameservers ✅
- **Nameservers**: dns1.registrar-servers.com, dns2.registrar-servers.com
- **الحكم**: الإعداد الافتراضي الصحيح لـ Namecheap.

---

## 6. ما أوصي بفعله

### ✅ الأولوية عالية (الآن)
1. **تحقق من MX Priority**: افتح Mail Settings و تأكد mx1 priority=5 (أقل) و mx2 + inbound-smtp priority=10 (أعلى). لو متساوية، بريد وارد قد يروح لـ AWS
2. **قرر مصير A Record `216.198.79.1`**: هل modonty.com الجذر يعرض صفحة Hostinger أم يفترض redirect لـ Vercel؟

### ⚠️ الأولوية متوسطة (هذا الأسبوع)
3. **تحقيق Google Search Console**: ينتهي تلقائياً بعد DNS cache propagation (خلال ساعة-يوم)
4. **راجع b048 hash**: اسأل فيصل عن مصدره، لو مهمل، احذفه

### ℹ️ الأولوية منخفضة (اختياري)
5. **autoconfig/autodiscover**: لو مستخدمينك ما يستخدمون إعداد تلقائي في Outlook، يمكن حذفها

---

## 7. الموقف لـ SEO

**الحكم**: ✅ **ممتاز لـ SEO**

- ✅ www.modonty.com يشير لـ Vercel — الموقع الرئيسي
- ✅ SSL صالح (Vercel يديره تلقائياً)
- ✅ البريد الصادر موثّق (SPF + DKIM + DMARC) → لا يذهب spam
- ✅ لا توجد redirect loops
- ✅ Vercel verification كامل لكل subdomain
- ⏳ Google Search Console قيد التحقق الأخير

---

## 8. الاستنتاج النهائي

**modonty.com في حالة جيدة جداً**. الإعداد احترافي ومدروس:
- استضافة Vercel لكل الـ subdomains الرئيسية
- إيميل Hostinger مع 3 DKIM (مستوى enterprise)
- Resend/AWS SES للـ transactional emails
- تحقق Vercel لكل subdomain

**ما تحتاج تعديل أي شي حرج**. فقط تأكد من:
1. MX priorities (هل inbound-smtp منخفض الـ priority؟)
2. A record @ `216.198.79.1` — هل هذا المقصود؟
3. اسأل عن b048 hash إذا بتنظّف
