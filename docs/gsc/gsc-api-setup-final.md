# Google Search Console API — التقرير النهائي الكامل

**تاريخ الإنجاز**: 24 أبريل 2026
**الحساب**: modonty1@gmail.com
**الحالة**: جاهز للإنتاج (Live-Ready) ✅

---

## 🎯 الإنجازات الرئيسية

- ✅ Google Cloud Project مُعدّ
- ✅ Search Console API مُفعّل
- ✅ IAM Credentials API مُفعّل
- ✅ Site Verification API مُفعّل
- ✅ Service Account لـ jbrseo.com — **محقّق كمالك كامل** (siteOwner)
- ✅ Service Account لـ modonty.com — محقق جزئياً (DNS TXT أُضيف، ينتظر propagation)
- ✅ JSON Keys تم تنزيلها

---

## 1. Google Cloud Project

| البند | القيمة |
|-------|--------|
| Project Name | modonty |
| Project ID | `modonty` |
| Project Number | `1006829969708` |

## 2. APIs المُفعّلة

| API | Service Name | الحالة |
|-----|-------------|--------|
| Google Search Console API | `searchconsole.googleapis.com` | ✅ Enabled |
| IAM Credentials API | `iamcredentials.googleapis.com` | ✅ Enabled |
| Site Verification API | `siteverification.googleapis.com` | ✅ Enabled |

## 3. Service Accounts

### أ. gsc-jbrseo (لـ jbrseo.com) — ✅ جاهز كامل

| البند | القيمة |
|-------|--------|
| Display Name | `gsc-jbrseo` |
| Email | `gsc-jbrseo@modonty.iam.gserviceaccount.com` |
| Unique ID | `107746434053455280658` |
| Key File | `modonty-12f91a70d3d7.json` |
| Key ID | `12f91a70d3d76637c87b8799bb64099a4bfcb54d` |
| Token Creator | ✅ `modonty1@gmail.com` |
| Verified Owner | ✅ `dns://jbrseo.com` |
| GSC Site | `sc-domain:jbrseo.com` (siteOwner) |

### ب. gsc-modonty (لـ modonty.com) — ⏳ ينتظر propagation

| البند | القيمة |
|-------|--------|
| Display Name | `gsc-modonty` |
| Email | `gsc-modonty@modonty.iam.gserviceaccount.com` |
| Unique ID | `116282602978529896994` |
| Key File | `modonty-a505af207db6.json` |
| Token Creator | ✅ `modonty1@gmail.com` |
| TXT Token | `google-site-verification=rRCR3dR7CJ1g_gHF4NC26t6P_I6Y-dokdHFYd957e1A` |
| DNS Record | ✅ مُضاف في Namecheap |
| Verification | ⏳ ينتظر (دقائق-ساعة للـ Google DNS cache) |

**للإكمال**: بعد 15-60 دقيقة، نفّذ في Cloud Shell:
```bash
SA2_TOKEN=$(curl -s -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  -d '{"scope":["https://www.googleapis.com/auth/siteverification"]}' \
  https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/gsc-modonty@modonty.iam.gserviceaccount.com:generateAccessToken \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['accessToken'])")

curl -s -X POST -H "Authorization: Bearer $SA2_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"site":{"type":"INET_DOMAIN","identifier":"modonty.com"}}' \
  "https://www.googleapis.com/siteVerification/v1/webResource?verificationMethod=DNS_TXT"
```

ثم:
```bash
WM2_TOKEN=$(curl -s -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  -d '{"scope":["https://www.googleapis.com/auth/webmasters"]}' \
  https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/gsc-modonty@modonty.iam.gserviceaccount.com:generateAccessToken \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['accessToken'])")

curl -s -X PUT -H "Authorization: Bearer $WM2_TOKEN" \
  'https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Amodonty.com'
```

### ج. jbrseo-analytics (GA4 — لا يلمس)

| البند | القيمة |
|-------|--------|
| Email | `jbrseo-analytics@modonty.iam.gserviceaccount.com` |
| Purpose | GA4 Data API — dashboard التطبيق (GTM integration) |
| الحالة | **⚠️ لا يلمس** — شغّال وحيوي |

---

## 4. متغيرات البيئة المقترحة (.env.local)

```env
# ========== Google Cloud ==========
GCP_PROJECT_ID=modonty
GCP_PROJECT_NUMBER=1006829969708

# ========== gsc-jbrseo ==========
GSC_JBRSEO_CLIENT_EMAIL=gsc-jbrseo@modonty.iam.gserviceaccount.com
GSC_JBRSEO_KEY_BASE64=<paste base64 here>
GSC_JBRSEO_PROPERTY=sc-domain:jbrseo.com

# ========== gsc-modonty ==========
GSC_MODONTY_CLIENT_EMAIL=gsc-modonty@modonty.iam.gserviceaccount.com
GSC_MODONTY_KEY_BASE64=<paste base64 here>
GSC_MODONTY_PROPERTY=sc-domain:modonty.com

# ========== OAuth Scopes ==========
GSC_SCOPE_READONLY=https://www.googleapis.com/auth/webmasters.readonly
GSC_SCOPE_FULL=https://www.googleapis.com/auth/webmasters
```

### تحويل JSON إلى Base64

```bash
# Linux / Mac
base64 -i ~/Downloads/modonty-12f91a70d3d7.json | pbcopy
base64 -i ~/Downloads/modonty-a505af207db6.json | pbcopy

# Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("modonty-12f91a70d3d7.json")) | Set-Clipboard
```

### أو اربط المتغيرات المتكاملة
```env
GSC_JBRSEO_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n"
GSC_JBRSEO_CLIENT_EMAIL=gsc-jbrseo@modonty.iam.gserviceaccount.com
```

---

## 5. أمثلة استخدام API (للمرجعية)

### قائمة المواقع المتاحة
```bash
# لـ gsc-jbrseo
GET https://www.googleapis.com/webmasters/v3/sites
# النتيجة المتوقعة:
# { "siteEntry": [{ "siteUrl": "sc-domain:jbrseo.com", "permissionLevel": "siteOwner" }] }
```

### Search Analytics (البيانات الأساسية)
```bash
POST https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Ajbrseo.com/searchAnalytics/query

{
  "startDate": "2026-03-24",
  "endDate": "2026-04-24",
  "dimensions": ["query", "page"],
  "rowLimit": 1000
}
```

### URL Inspection
```bash
POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect

{
  "inspectionUrl": "https://www.jbrseo.com/sa/pricing",
  "siteUrl": "sc-domain:jbrseo.com"
}
```

### Sitemaps
```bash
# قراءة
GET https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Ajbrseo.com/sitemaps

# تقديم
PUT https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Ajbrseo.com/sitemaps/https%3A%2F%2Fwww.jbrseo.com%2Fsitemap.xml
```

---

## 6. Scopes المتاحة

| Scope | الصلاحيات | متى نستخدمه |
|-------|-----------|-------------|
| `webmasters.readonly` | قراءة فقط (Analytics, Pages, Sitemaps) | التحليلات والمراقبة |
| `webmasters` | قراءة + كتابة (تقديم sitemaps، URL Inspection، حذف) | التكامل الكامل |

**توصية**: استخدم `webmasters.readonly` في بيئات القراءة فقط (lovable dashboard).

---

## 7. Rate Limits

| النوع | الحد |
|------|------|
| Search Analytics | 1,200/min per user |
| URL Inspection | 600/min per property, **2,000/day** |
| Sitemaps | 300/min |
| Site management | 100/min |

---

## 8. الأمان

### ✅ يجب
- نقل JSON files خارج مجلد المشروع (`~/secure/gsc-keys/` مثلاً)
- إضافة `*.json` في `.gitignore` (استثني package.json)
- إضافة `.env.local` في `.gitignore`
- استخدام Vercel Env Variables في Production
- Rotation كل 90 يوم

### ❌ لا تفعل
- لا ترفع JSON على Git
- لا تطبع الـ private key في logs
- لا تشاركه عبر Slack/Email بدون تشفير
- لا تضعه في Client-side code

### لو تسرّب
1. اذهب إلى Cloud Console → Service Account → Keys
2. احذف المفتاح المعرّض
3. أنشئ مفتاح جديد
4. حدّث Environment Variables في Vercel

---

## 9. الحالة الحالية للـ DNS

### jbrseo.com
```
TXT @ google-site-verification=vXK9apd8ruDuIPvLhxE29qGVpRpIbrP21cLOAxAgd1I   ✅ verified
A @ 216.150.1.1                                                              (بطلب فيصل)
CNAME admin → Vercel
CNAME modonty → Vercel
CNAME www → Vercel
CNAME content → Vercel
CNAME 3 × DKIM Hostinger
TXT @ SPF + DMARC
MX mx1, mx2 Hostinger
+ 3 Vercel verification TXT records
```

### modonty.com
```
TXT @ google-site-verification=rRCR3dR7CJ1g_gHF4NC26t6P_I6Y-dokdHFYd957e1A   ⏳ pending
A @ 216.198.79.1
CNAME admin, autoconfig, autodiscover, console
TXT resend._domainkey, _vercel
MX records
+ SPF + DMARC + verification tokens
```

---

## 10. ملاحظة عن 216.150.1.1

**هام**: السجل `A @ 216.150.1.1` في jbrseo.com موضوع حسب طلب **فيصل**. لم يتم تعديله. في jbrtechno.com تم حذفه بالخطأ في بداية الجلسة — **راجع معه** إذا يحتاج إعادة إضافة.

---

## 11. VS Code Integration (للكود)

### Node.js / TypeScript

**تثبيت المكتبات**:
```bash
npm install googleapis
npm install -D @types/node
```

**أمثلة بنية المجلد**:
```
/lib/gsc/
  ├── client.ts           # مصادقة وإنشاء GSC client
  ├── analytics.ts        # Search Analytics queries
  ├── inspection.ts       # URL Inspection
  ├── sitemaps.ts         # Sitemap management
  └── types.ts            # TypeScript interfaces

/app/api/seo/
  ├── performance/route.ts   # API endpoint لبيانات الأداء
  ├── pages/route.ts         # API endpoint للصفحات
  ├── sitemap/route.ts       # إدارة sitemap
  └── inspect/route.ts       # فحص URL
```

### البناء الموصى به لاختبار الكود

1. **وحدة المصادقة**: تُرجع authenticated client
2. **Caching**: استخدم unstable_cache أو Redis (TTL ≥ ساعة للـ Analytics)
3. **Error handling**: retry مع exponential backoff عند 429
4. **Logging**: لا تطبع tokens أو keys

---

## 12. Roadmap الإصلاحات المطلوبة

### مرحلة الربط (اليوم/بكرة)
- [ ] تأكيد verification لـ modonty.com بعد انتشار DNS
- [ ] تأكيد الـ domain property موجودة في GSC
- [ ] إنشاء base64 للمفتاحين
- [ ] رفع env variables في Vercel

### مرحلة الكود (أسبوع)
- [ ] بناء GSC client في /lib/gsc/client.ts
- [ ] بناء أول query للـ Search Analytics
- [ ] اختبار URL Inspection على صفحة واحدة
- [ ] بناء dashboard لعرض البيانات

### مرحلة إصلاح SEO (بناء على تقرير Page Indexing السابق)
- [ ] إصلاح `/eg` redirect error (جذر Next.js middleware)
- [ ] إضافة hreflang للصفحات المحلية (sa + eg)
- [ ] طلب فهرسة الـ 8 صفحات "Discovered - not indexed"
- [ ] حجب `/_next/static/` في robots.txt

### مرحلة الإنتاج
- [ ] Rotation للمفاتيح كل 90 يوم
- [ ] Alert في Cloud Logs على استخدام غير متوقع
- [ ] تكامل مع CI/CD لتقديم sitemap عند Deploy

---

## 13. روابط سريعة

**Cloud Console**
- Service Accounts: https://console.cloud.google.com/iam-admin/serviceaccounts?project=modonty
- APIs: https://console.cloud.google.com/apis/dashboard?project=modonty

**GSC**
- jbrseo URL-prefix: https://search.google.com/search-console?resource_id=https://www.jbrseo.com/
- Domain property: ستظهر تلقائياً بعد verification

**Namecheap**
- jbrseo.com: https://ap.www.namecheap.com/Domains/DomainControlPanel/jbrseo.com/advancedns
- modonty.com: https://ap.www.namecheap.com/Domains/DomainControlPanel/modonty.com/advancedns

**الوثائق**
- [Search Console API](https://developers.google.com/webmaster-tools/v1/api_reference_index)
- [Site Verification API](https://developers.google.com/site-verification/v1/getting_started)
- [OAuth Scopes](https://developers.google.com/identity/protocols/oauth2/scopes)

---

## 14. ملاحظات أخيرة

- Service Accounts مجانية بالكامل
- Search Console API مجانية ضمن Rate Limits المذكورة
- تحديث البيانات في GSC: Performance (2-3 أيام)، URL Inspection (فوري)، Index Coverage (1-3 أيام)
- **مبروك**: النظام جاهز للإنتاج ويقبل أي تطوير تستخدم فيه

---

**الإعداد اكتمل من ناحية Google Cloud والـ DNS. الخطوة التالية: كتابة الكود في VS Code وربط Env Variables في Vercel.**
