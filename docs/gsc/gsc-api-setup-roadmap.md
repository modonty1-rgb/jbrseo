# Google Search Console API — خارطة الطريق والإعداد الكامل

**تاريخ الإعداد**: 23 أبريل 2026
**الحساب**: modonty1@gmail.com
**المستخدم**: khalidnadish

---

## 1. الحالة الحالية (ما تم إنجازه)

### ✅ Google Cloud Project
| البند | القيمة |
|-------|--------|
| Project Name | modonty |
| Project ID | `modonty` |
| Project Number | `1006829969708` |
| Owner | modonty1@gmail.com |

### ✅ API المُفعّلة
| API | الحالة | ملاحظات |
|-----|--------|---------|
| Google Search Console API | Enabled | `searchconsole.googleapis.com` |

### ✅ Service Account (تم إنشاؤه — قرار الاسم معلّق)
| البند | القيمة |
|-------|--------|
| Display Name | `gsc-jbrseo` |
| Service Account ID | `gsc-jbrseo` |
| Email | `gsc-jbrseo@modonty.iam.gserviceaccount.com` |
| Unique ID | `107746434053455280658` |
| IAM Roles | لا شيء (غير مطلوب لـ GSC) |

> **ملاحظة**: اسم "gsc-jbrseo" ضيّق. لو تبي Service Account واحد لكل دومينات SEO، احذفه وسوِ جديد باسم عام مثل `seo-reader` أو `gsc-access`.

### ⏳ ما لم ينتهِ بعد
- [ ] اختيار نطاق الاستخدام (domain واحد / جميع الدومينات / منفصل لكل دومين)
- [ ] إنشاء JSON Key وتنزيله
- [ ] إضافة الـ Service Account كمستخدم في GSC Properties
- [ ] تثبيت المكتبات في مشروع الكود
- [ ] إعداد متغيرات البيئة
- [ ] كتابة الكود والاختبار

---

## 2. قرار يحتاج حسم: نطاق Service Account

### الخيار أ — واحد لكل SEO domains (موصى به)
- **الاسم المقترح**: `seo-reader` أو `gsc-access` أو `seo-automation`
- **الإيميل الناتج**: `seo-reader@modonty.iam.gserviceaccount.com`
- **الاستخدام**: أضف هذا الإيميل كمستخدم في كل GSC property (jbrseo.com, modonty.com, jbrtechno.com, businessburaq.com, dreamto.app, resturx.com)
- **ملف JSON واحد** يحتاج تخزينه
- **الميزة**: إدارة بسيطة، تبديل سريع بين الدومينات
- **العيب**: لو تسرّب المفتاح، كل المواقع معرّضة

### الخيار ب — فقط jbrseo.com (الحالي)
- الاسم الحالي `gsc-jbrseo` مناسب
- أضف الإيميل فقط في jbrseo.com في GSC
- **الميزة**: عزل أعلى
- **العيب**: لو حبيت تضيف دومين آخر، تحتاج Service Account جديد

### الخيار ج — منفصل لكل دومين
- Service Account لكل دومين
- **الميزة**: أقصى عزل أمني
- **العيب**: ٦ Service Accounts + ٦ ملفات JSON = صيانة مرهقة

**التوصية**: الخيار (أ) مع اسم `seo-reader`.

**ما يجب عمله حسب الخيار**:

| الخيار | الخطوة |
|--------|-------|
| أ (seo-reader) | احذف الحالي، أنشئ جديد باسم `seo-reader` |
| ب (jbrseo فقط) | أكمل مع الحالي `gsc-jbrseo` |
| ج (واحد لكل دومين) | أنشئ SA منفصل لكل دومين بنفس الخطوات |

---

## 3. OAuth Scopes المطلوبة

لاستخدام كامل لـ Search Console API، استخدم:

```
https://www.googleapis.com/auth/webmasters
```

هذا الـ scope يعطيك:
- قراءة كل البيانات (Sitemaps, Sites, Performance, Coverage)
- كتابة (Submit/Delete sitemaps, URL Inspection)
- إدارة Sites (إذا كنت Owner)

### Scope بديل للقراءة فقط (أكثر أماناً)
```
https://www.googleapis.com/auth/webmasters.readonly
```

استخدم `readonly` لو كل اللي تحتاجه تحليلات وتقارير بدون تعديل.

---

## 4. Endpoints الرئيسية المتاحة

| العملية | Endpoint | الاستخدام |
|--------|----------|----------|
| List sites | `GET /webmasters/v3/sites` | قائمة كل المواقع المضافة |
| Get site | `GET /webmasters/v3/sites/{siteUrl}` | معلومات موقع معين |
| Search Analytics | `POST /webmasters/v3/sites/{siteUrl}/searchAnalytics/query` | بيانات Performance (clicks, impressions, keywords) |
| List sitemaps | `GET /webmasters/v3/sites/{siteUrl}/sitemaps` | سجلات الـ sitemaps |
| Submit sitemap | `PUT /webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}` | إضافة sitemap |
| Delete sitemap | `DELETE /webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}` | حذف sitemap |
| URL Inspection | `POST /v1/urlInspection/index:inspect` | فحص صفحة محددة (v1 API منفصل) |

### URL Inspection API (منفصل)
- Base URL: `https://searchconsole.googleapis.com/v1/urlInspection/index:inspect`
- Scope: `https://www.googleapis.com/auth/webmasters` أو `webmasters.readonly`
- معدّل الطلبات: **600 طلب/دقيقة لكل property**

---

## 5. تنسيق siteUrl في API

**قاعدة**: `siteUrl` لازم يكون URL-encoded لما تستخدمه في الـ path.

| نوع الخاصية في GSC | تنسيق siteUrl |
|--------------------|----------------|
| URL Prefix property | `https://www.jbrseo.com/` (مع `/` نهاية) |
| Domain property | `sc-domain:jbrseo.com` |

### تنسيقها في URL path
- URL prefix: `https%3A%2F%2Fwww.jbrseo.com%2F`
- Domain: `sc-domain%3Ajbrseo.com`

**حالتك**: خاصية jbrseo.com هي URL Prefix = `https://www.jbrseo.com/`

---

## 6. متغيرات البيئة المقترحة

أضف هذه المتغيرات في `.env.local` أو Vercel Environment Variables:

```env
# Google Cloud Project
GCP_PROJECT_ID=modonty
GCP_PROJECT_NUMBER=1006829969708

# Service Account
GSC_SERVICE_ACCOUNT_EMAIL=gsc-jbrseo@modonty.iam.gserviceaccount.com

# المفتاح الخاص (طريقتان)
# الطريقة أ: JSON كامل كنص (Base64 مفضّل لتجنب مشاكل التنسيق)
GSC_SERVICE_ACCOUNT_KEY_BASE64=<base64 encoded JSON>

# الطريقة ب: مفاتيح مفصولة (للقراءة المباشرة)
GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GSC_CLIENT_EMAIL=gsc-jbrseo@modonty.iam.gserviceaccount.com

# خصائص GSC المُدارة
GSC_PROPERTY_JBRSEO=https://www.jbrseo.com/
GSC_PROPERTY_MODONTY=https://modonty.com/
GSC_PROPERTY_JBRTECHNO=https://jbrtechno.com/

# إعدادات API
GSC_SCOPE=https://www.googleapis.com/auth/webmasters
```

### لتحويل JSON إلى Base64
```bash
# Linux / Mac
base64 -i modonty-XXXX.json | pbcopy

# Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("modonty-XXXX.json"))
```

### استخدام Base64 في الكود
```
const json = Buffer.from(process.env.GSC_SERVICE_ACCOUNT_KEY_BASE64, 'base64').toString('utf-8')
const credentials = JSON.parse(json)
```

---

## 7. متطلبات الأمان (مهم جداً)

### قواعد ذهبية
1. **لا ترفع ملف JSON على Git أبداً**. أضفه لـ `.gitignore`:
   ```
   # .gitignore
   *.json
   !package.json
   !tsconfig.json
   /credentials/
   .env.local
   .env.production
   ```

2. **في Production استخدم Environment Variables فقط** (ليس ملفات على الخادم)

3. **Vercel**: أضف المتغيرات في Project Settings → Environment Variables

4. **حدّد Scope الأدنى**: لو كل اللي تحتاجه قراءة، استخدم `webmasters.readonly`

5. **راقب الاستخدام**: افحص لوجات Service Account شهرياً في Cloud Console

6. **Rotate المفاتيح كل 90 يوم**: احذف القديم وأنشئ جديد

7. **لو تسرّب المفتاح**: احذفه فوراً من Keys tab، ثم أنشئ جديد

### إذا تسرّب المفتاح (Compromised)
1. اذهب إلى Service Account → Keys
2. احذف المفتاح المعرّض (Delete key)
3. أنشئ مفتاح جديد
4. حدّث Environment Variables في Vercel وكل بيئاتك
5. راجع لوجات Cloud للعمليات المشبوهة

---

## 8. إضافة Service Account لـ GSC Property

**بعد تنزيل JSON Key، افعل الآتي**:

1. افتح [Google Search Console](https://search.google.com/search-console)
2. اختر الـ Property (`https://www.jbrseo.com/`)
3. اضغط **Settings** (الترس في الأسفل)
4. اختر **Users and permissions**
5. اضغط **Add user**
6. الصق إيميل الـ Service Account:
   ```
   gsc-jbrseo@modonty.iam.gserviceaccount.com
   ```
7. اختر مستوى الصلاحية:
   - **Owner**: كل الصلاحيات (مطلوب لـ URL Inspection وsitemaps submission)
   - **Full user**: قراءة كل البيانات + بعض الإجراءات
   - **Restricted user**: قراءة محدودة
8. اضغط **Add**

**للـ GSC المتعدد Properties** (الخيار أ): كرر الخطوات أعلاه لكل property تريد الوصول إليه.

---

## 9. Rate Limits و Quotas

| الحد | القيمة |
|-----|--------|
| Search Analytics | 1,200 queries/minute لكل user |
| URL Inspection | 600 queries/minute لكل property, 2,000 queries/day |
| Sitemaps operations | 300 queries/minute |
| Site management | 100 queries/minute |

**تعامل مع الحدود**:
- استخدم exponential backoff عند 429 errors
- Cache النتائج لفترات طويلة (Search Analytics لا تتغير بالساعة)
- اجمع طلبات متعددة في batch queries بدل طلب لكل URL

---

## 10. Data Freshness (تحديث البيانات)

مهم لإدارة توقعاتك:

| البيانات | تأخير التحديث |
|---------|---------------|
| Search Analytics (Performance) | 2-3 أيام |
| Index Coverage | 1-3 أيام |
| URL Inspection (live) | فوري |
| URL Inspection (index status) | 1-3 أيام |
| Sitemaps submission | فوري للتأكيد، ساعات للزحف |

---

## 11. المكتبات الموصى بها (للمعلومة فقط)

حسب اللغة/الإطار المستخدم في مشروعك:

### Node.js / TypeScript (Next.js)
- **googleapis** — الرسمية من Google، شاملة لكل APIs
- **google-auth-library** — للمصادقة فقط

### Python
- **google-api-python-client** — الرسمية
- **google-auth** — للمصادقة

### Ruby
- **google-apis-searchconsole_v1**

### PHP
- **google/apiclient**

---

## 12. الخطوات المتبقية (تسلسل التنفيذ)

### المرحلة أ: إتمام الإعداد في Google Cloud

1. [ ] **قرّر خيار النطاق** (أ / ب / ج)
2. [ ] إذا اخترت (أ): احذف `gsc-jbrseo` وأنشئ `seo-reader`
3. [ ] من صفحة Keys للـ Service Account → Add Key → Create new key → JSON
4. [ ] احفظ الملف في مكان آمن خارج مشروع الكود (مثلاً `~/secure/gsc/modonty-key.json`)
5. [ ] حوّل المفتاح إلى Base64 (اختياري للتخزين السهل في env)

### المرحلة ب: إعداد GSC

1. [ ] افتح GSC → jbrseo.com → Settings → Users and permissions
2. [ ] أضف الإيميل بصلاحية **Owner**
3. [ ] (لو الخيار أ): كرر لكل property أخرى

### المرحلة ج: إعداد بيئة الكود

1. [ ] أضف المكتبات لـ `package.json` (أو ما يعادلها)
2. [ ] أضف `.env.local` بالمتغيرات المذكورة أعلاه
3. [ ] أضف مسار المفاتيح لـ `.gitignore`
4. [ ] في Vercel: أضف نفس المتغيرات في Project Settings
5. [ ] اكتب Helper للمصادقة واستخدمه في API routes

### المرحلة د: الاختبار

1. [ ] اختبر Authentication (list sites)
2. [ ] اختبر Search Analytics query
3. [ ] اختبر URL Inspection على صفحة واحدة
4. [ ] اختبر قراءة Sitemaps

### المرحلة هـ: بناء الميزات

**أمثلة ميزات تقدر تبنيها**:

- لوحة SEO داخلية تعرض:
  - أهم الكلمات اليومية
  - الصفحات الأعلى أداءً
  - CTR وPosition لكل صفحة
  - صفحات غير مفهرسة
- نظام تنبيهات:
  - تنبيه لو صفحة خسرت رانكها
  - تنبيه لو GSC اكتشف مشكلة جديدة
- أتمتة:
  - تقديم sitemap جديد عند كل Deploy
  - إعادة تقديم URL بعد تعديل مهم
  - فحص URL تلقائياً بعد نشر كل مقال
- تقارير دورية بالإيميل

---

## 13. معلومات مرجعية سريعة

### الحالة الحالية المحفوظة
```yaml
cloud_project: modonty
project_id: modonty
project_number: 1006829969708
api_enabled: searchconsole.googleapis.com
service_account:
  display_name: gsc-jbrseo
  email: gsc-jbrseo@modonty.iam.gserviceaccount.com
  unique_id: 107746434053455280658
  status: active (no key generated yet)
gsc_property:
  url: https://www.jbrseo.com/
  type: URL prefix
  verification: Google Tag Manager
  current_state:
    indexed: 1 page
    not_indexed: 13 pages
```

### روابط سريعة
- Cloud Console - Service Account:
  `https://console.cloud.google.com/iam-admin/serviceaccounts/details/107746434053455280658?project=modonty`
- API Library - Search Console:
  `https://console.cloud.google.com/apis/api/searchconsole.googleapis.com?project=modonty`
- GSC Property:
  `https://search.google.com/search-console?resource_id=https://www.jbrseo.com/`

### الوثائق الرسمية
- [Search Console API Overview](https://developers.google.com/webmaster-tools/v1/api_reference_index)
- [Search Analytics API](https://developers.google.com/webmaster-tools/v1/searchanalytics)
- [URL Inspection API](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect)
- [Sitemaps API](https://developers.google.com/webmaster-tools/v1/sitemaps)
- [OAuth Scopes](https://developers.google.com/webmaster-tools/v1/how-tos/authorizing)
- [Python Quickstart](https://developers.google.com/webmaster-tools/v1/quickstart/quickstart-python)
- [Rate Limits](https://developers.google.com/webmaster-tools/limits)

---

## 14. Checklist نهائي قبل النشر على Production

- [ ] JSON key غير موجود في أي مستودع Git (محلياً ولا remote)
- [ ] `.env.local` مدرج في `.gitignore`
- [ ] متغيرات البيئة في Vercel مضبوطة لكل البيئات (Production, Preview, Development)
- [ ] Service Account مُضاف لكل GSC Properties المطلوبة
- [ ] اختبرت Authentication فعلياً (استقبلت بيانات من GSC بنجاح)
- [ ] أضفت error handling لكل 429 و 403 errors
- [ ] أضفت caching لنتائج Search Analytics (TTL على الأقل ساعة)
- [ ] لوجات الخطأ لا تطبع المفتاح الخاص أبداً
- [ ] وضعت تنبيه في Cloud Console على Service Account usage anomalies
- [ ] راجعت Cloud Billing للتأكد من عدم تفعيل مفاجآت

---

## 15. ملاحظات أخيرة

- **Search Console API مجاني** بالكامل (ضمن الحدود المذكورة أعلاه)
- **لا توجد تكلفة** على استخدام Service Account أو تفعيل API
- **الحد الأقصى للـ properties** لكل حساب Google: 1,000 (ليس مشكلة عندك)
- **الـ Indexing API** (المختلف عن Search Console) **محدود** لـ JobPosting وBroadcastEvent فقط — لا تستخدمه لـ SEO عام
- إذا حبيت تقدّم URL لـ Google لإعادة الفهرسة، الطريقة الوحيدة الرسمية هي:
  1. URL Inspection API (فحص فقط، مش request indexing)
  2. تقديم Sitemap محدّث
  3. يدوياً عبر GSC UI → URL Inspection → Request Indexing

---

**انتهى الإعداد الأساسي في Google Cloud. خطوتك التالية: حسم قرار الـ Service Account scope، ثم تنزيل JSON Key.**
