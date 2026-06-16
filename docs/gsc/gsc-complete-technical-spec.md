# Google Search Console API — الدليل التقني الكامل

**المشروع**: modonty.com + jbrseo.com
**التاريخ**: 24 أبريل 2026
**المستوى**: Production-ready
**المطوّر المستهدف**: خالد (Full-stack / Next.js)

---

## الفهرس

1. [الحالة الحالية](#1-الحالة-الحالية)
2. [البيانات الجوهرية](#2-البيانات-الجوهرية)
3. [المصادقة - How Auth Works](#3-المصادقة)
4. [OAuth Scopes](#4-oauth-scopes)
5. [API Endpoints الكاملة](#5-api-endpoints-الكاملة)
6. [أشكال الـ Requests و Responses](#6-أشكال-الـ-requests-و-responses)
7. [Rate Limits و Quotas](#7-rate-limits-و-quotas)
8. [Error Handling](#8-error-handling)
9. [Environment Variables](#9-environment-variables)
10. [Architecture Recommendations](#10-architecture-recommendations)
11. [الأمان](#11-الأمان)
12. [Deployment على Vercel](#12-deployment-على-vercel)
13. [اختبار شامل](#13-اختبار-شامل)
14. [المراجع الرسمية](#14-المراجع-الرسمية)

---

## 1. الحالة الحالية

### ✅ ما تم تجهيزه

| العنصر | jbrseo.com | modonty.com |
|--------|-----------|-------------|
| Google Cloud Project | ✅ modonty | ✅ modonty (نفسه) |
| Search Console API enabled | ✅ | ✅ |
| IAM Credentials API enabled | ✅ | ✅ |
| Site Verification API enabled | ✅ | ✅ |
| Service Account created | ✅ gsc-jbrseo | ✅ gsc-modonty |
| Token Creator role granted | ✅ modonty1@gmail.com | ✅ modonty1@gmail.com |
| JSON Key downloaded | ✅ | ✅ |
| Domain verified (Site Verification) | ✅ | ⏳ ينتظر Google cache |
| GSC Property (sc-domain) added | ✅ sc-domain:jbrseo.com | ⏳ بعد تحقق SA |
| GSC Property (UI) | ✅ URL prefix قديم + Domain (يمكن الإضافة) | ✅ Domain property (modonty1@gmail.com owner) |

### ⚠️ ملاحظة مهمة

- **jbrseo.com**: الـ SA جاهز تماماً. تقدر تبدأ API calls الآن.
- **modonty.com**: حسابك (modonty1@gmail.com) عنده access في GSC UI فوراً. الـ SA سيكمل verification خلال ساعات. **لحين اكتماله**، تقدر:
  1. استخدم API مع gsc-jbrseo للاختبار
  2. أو انتظر ساعات قليلة للـ modonty SA

---

## 2. البيانات الجوهرية

### Google Cloud Project
```yaml
project_name: modonty
project_id: modonty
project_number: 1006829969708
owner: modonty1@gmail.com
```

### Service Accounts

#### أ. gsc-jbrseo
```yaml
display_name: gsc-jbrseo
email: REDACTED_SA@REDACTED.iam.gserviceaccount.com
unique_id: REDACTED_CLIENT_ID
key_file: modonty-12f91a70d3d7.json
key_id: REDACTED_PRIVATE_KEY_ID
gsc_site: sc-domain:jbrseo.com
permission: siteOwner
verified_domain: jbrseo.com
```

#### ب. gsc-modonty
```yaml
display_name: gsc-modonty
email: gsc-modonty@modonty.iam.gserviceaccount.com
unique_id: 116282602978529896994
key_file: modonty-a505af207db6.json
gsc_site: sc-domain:modonty.com
permission: siteOwner (pending)
verified_domain: modonty.com (pending Google cache)
```

### GSC Properties (UI)

| Property | Type | Owner | Access |
|----------|------|-------|--------|
| `modonty.com` | Domain | modonty1@gmail.com | ✅ Owner |
| `https://www.jbrseo.com/` | URL prefix | modonty1@gmail.com | ✅ Owner (legacy) |

### DNS Verification Tokens

لـ jbrseo.com (TXT @):
```
google-site-verification=vXK9apd8ruDuIPvLhxE29qGVpRpIbrP21cLOAxAgd1I
```

لـ modonty.com (TXT @):
```
google-site-verification=rRCR3dR7CJ1g_gHF4NC26t6P_I6Y-dokdHFYd957e1A
```

---

## 3. المصادقة

### كيف تشتغل Service Account Auth

```
┌─────────────────┐                  ┌──────────────────────┐
│   Your App      │                  │   Google GSC API     │
│   (Vercel)      │                  │                      │
│                 │                  │                      │
│  1. Read JSON   │                  │                      │
│  private key    │                  │                      │
│     ↓           │                  │                      │
│  2. Sign JWT    │                  │                      │
│  with scopes    │                  │                      │
│     ↓           │   3. Exchange    │                      │
│                 │   JWT → token    │                      │
│                 ├─────────────────>│ oauth2.googleapis.com│
│                 │                  │                      │
│                 │<─────────────────┤  Returns access_token│
│                 │   (valid ~1 hour)│                      │
│                 │                  │                      │
│  4. Call API    │                  │                      │
│  with Bearer    │   Authorization: │                      │
│  token          ├─────────────────>│   webmasters/v3/...  │
│                 │   Bearer TOKEN   │                      │
│                 │<─────────────────┤                      │
│                 │   API response   │                      │
└─────────────────┘                  └──────────────────────┘
```

### مكتبات المصادقة الشائعة

**تتعامل مع كل خطوات JWT تلقائياً**:

| اللغة | المكتبة | Docs |
|------|---------|------|
| Node.js | `googleapis` | https://github.com/googleapis/google-api-nodejs-client |
| Node.js (lightweight) | `google-auth-library` + `fetch` | https://github.com/googleapis/google-auth-library-nodejs |
| Python | `google-api-python-client` + `google-auth` | https://github.com/googleapis/google-api-python-client |

### تدفق المصادقة داخل الكود (Node.js مثال مختصر)

```javascript
// 1. استيراد المكتبة
const { GoogleAuth } = require('google-auth-library');

// 2. إنشاء المصادقة
const auth = new GoogleAuth({
  credentials: {
    client_email: process.env.GSC_CLIENT_EMAIL,
    private_key: process.env.GSC_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
});

// 3. الحصول على authenticated client
const client = await auth.getClient();

// 4. الاستعلام
const res = await client.request({
  url: 'https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Ajbrseo.com/searchAnalytics/query',
  method: 'POST',
  data: { startDate: '2026-03-24', endDate: '2026-04-24', dimensions: ['query'] }
});
```

---

## 4. OAuth Scopes

Search Console API يدعم scopes التالية:

| Scope | الصلاحيات | متى تستخدمه |
|-------|-----------|-------------|
| `https://www.googleapis.com/auth/webmasters.readonly` | قراءة البيانات فقط (Analytics, Pages, Sitemaps, URL Inspection) | للـ dashboards والتحليلات |
| `https://www.googleapis.com/auth/webmasters` | قراءة + كتابة (إضافة/حذف sitemaps، إدارة المواقع) | للأتمتة الكاملة |
| `https://www.googleapis.com/auth/siteverification` | إدارة ملكية المواقع | للتحقق البرمجي (نستخدمه لإضافة domains) |

**توصية**: استخدم `webmasters.readonly` افتراضياً. ارفع إلى `webmasters` فقط عند الحاجة لـ sitemap submission.

---

## 5. API Endpoints الكاملة

### Base URL
```
https://www.googleapis.com/webmasters/v3/
```

### URL Encoding للـ siteUrl

| شكل siteUrl | تنسيق في URL |
|-------------|--------------|
| `https://www.example.com/` | `https%3A%2F%2Fwww.example.com%2F` |
| `sc-domain:example.com` | `sc-domain%3Aexample.com` |

### 5.1 Sites Management

```http
# قائمة كل المواقع المضافة
GET /sites
Headers: Authorization: Bearer TOKEN

# معلومات موقع محدد
GET /sites/{siteUrl}

# إضافة موقع (تتطلب ownership verification)
PUT /sites/{siteUrl}

# حذف موقع
DELETE /sites/{siteUrl}
```

### 5.2 Search Analytics (الأكثر استخداماً)

```http
POST /sites/{siteUrl}/searchAnalytics/query
Content-Type: application/json

{
  "startDate": "2026-04-01",
  "endDate": "2026-04-24",
  "dimensions": ["query", "page", "country", "device", "date"],
  "searchType": "web",
  "rowLimit": 1000,
  "startRow": 0,
  "aggregationType": "auto",
  "dimensionFilterGroups": [
    {
      "filters": [
        { "dimension": "country", "operator": "equals", "expression": "sau" }
      ]
    }
  ]
}
```

**Dimensions المتاحة**: `query`, `page`, `country`, `device`, `date`, `searchAppearance`

**Search Types**: `web`, `image`, `video`, `news`, `discover`, `googleNews`

**Aggregation**: `auto` (default), `byPage`, `byProperty`

### 5.3 Sitemaps

```http
# قائمة
GET /sites/{siteUrl}/sitemaps

# سيتماب محدد
GET /sites/{siteUrl}/sitemaps/{feedpath}

# تقديم/تحديث
PUT /sites/{siteUrl}/sitemaps/{feedpath}

# حذف
DELETE /sites/{siteUrl}/sitemaps/{feedpath}
```

حيث `feedpath` = URL-encoded للـ sitemap URL مثل `https%3A%2F%2Fwww.jbrseo.com%2Fsitemap.xml`

### 5.4 URL Inspection (API منفصل)

```http
POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect
Content-Type: application/json

{
  "inspectionUrl": "https://www.jbrseo.com/sa/pricing",
  "siteUrl": "sc-domain:jbrseo.com",
  "languageCode": "ar-SA"
}
```

**ملاحظة**: Base URL مختلف (`searchconsole.googleapis.com` مش `www.googleapis.com`).

---

## 6. أشكال الـ Requests و Responses

### 6.1 Search Analytics Response

```json
{
  "rows": [
    {
      "keys": ["ما هو SEO", "https://www.jbrseo.com/sa/about"],
      "clicks": 45,
      "impressions": 892,
      "ctr": 0.05044843049327354,
      "position": 8.3
    }
  ],
  "responseAggregationType": "byPage"
}
```

### 6.2 URL Inspection Response

```json
{
  "inspectionResult": {
    "inspectionResultLink": "https://search.google.com/search-console/inspect?...",
    "indexStatusResult": {
      "verdict": "PASS",
      "coverageState": "Submitted and indexed",
      "robotsTxtState": "ALLOWED",
      "indexingState": "INDEXING_ALLOWED",
      "lastCrawlTime": "2026-04-23T14:30:00Z",
      "pageFetchState": "SUCCESSFUL",
      "googleCanonical": "https://www.jbrseo.com/sa",
      "userCanonical": "https://www.jbrseo.com/sa",
      "sitemap": ["https://www.jbrseo.com/sitemap.xml"],
      "referringUrls": ["https://www.jbrseo.com/"],
      "crawledAs": "MOBILE"
    },
    "mobileUsabilityResult": {
      "verdict": "VERDICT_UNSPECIFIED"
    },
    "richResultsResult": { ... },
    "ampResult": null
  }
}
```

**الحقول الحرجة**:
- `verdict`: `PASS`, `PARTIAL`, `FAIL`, `NEUTRAL`
- `coverageState`: النص الظاهر في GSC تحت "Coverage"
- `indexingState`: `INDEXING_ALLOWED` or `BLOCKED_BY_*`
- `googleCanonical` vs `userCanonical`: المقارنة حاسمة لـ SEO

### 6.3 Sites List Response

```json
{
  "siteEntry": [
    {
      "siteUrl": "sc-domain:jbrseo.com",
      "permissionLevel": "siteOwner"
    }
  ]
}
```

**permissionLevel**: `siteOwner`, `siteFullUser`, `siteRestrictedUser`, `siteUnverifiedUser`

### 6.4 Sitemaps Response

```json
{
  "sitemap": [
    {
      "path": "https://www.jbrseo.com/sitemap.xml",
      "lastSubmitted": "2026-04-23T10:00:00Z",
      "isPending": false,
      "isSitemapsIndex": false,
      "type": "sitemap",
      "lastDownloaded": "2026-04-23T10:05:00Z",
      "warnings": "0",
      "errors": "0",
      "contents": [
        { "type": "web", "submitted": "24", "indexed": "18" }
      ]
    }
  ]
}
```

---

## 7. Rate Limits و Quotas

| الـ API | الحد |
|--------|------|
| Search Analytics | 1,200 queries/minute per user |
| URL Inspection | 600 queries/minute per property **+ 2,000 queries/day** |
| Sitemaps | 300 queries/minute |
| Sites management | 100 queries/minute |

**استراتيجيات تجنّب الحدود**:

1. **Batch requests**: اجمع استعلامات متعددة بدل طلب واحد لكل page
2. **Caching aggressive**: Search Analytics لا تتحدث فورياً (2-3 أيام delay) — cache 6 ساعات على الأقل
3. **Exponential backoff**: عند 429 error، انتظر 1s, 2s, 4s, 8s...
4. **Batch URL Inspection**: لا تتجاوز 2,000 URL يومياً — اعمل queue للصفحات

---

## 8. Error Handling

### HTTP Status Codes

| Code | المعنى | التصرف |
|------|--------|--------|
| 200 | Success | اعرض البيانات |
| 400 | Bad Request | راجع الـ payload |
| 401 | Unauthenticated | token منتهي - جدّده |
| 403 | Permission denied | SA ليس owner أو scope خطأ |
| 404 | Not found | siteUrl خطأ أو لم يُضف |
| 429 | Rate limit | exponential backoff |
| 500, 502, 503 | Server error | retry مع backoff |

### شكل رسالة الخطأ

```json
{
  "error": {
    "code": 403,
    "message": "User does not have sufficient permissions for site 'sc-domain:jbrseo.com'.",
    "errors": [
      {
        "message": "...",
        "domain": "global",
        "reason": "forbidden"
      }
    ],
    "status": "PERMISSION_DENIED"
  }
}
```

### استراتيجية Retry مقترحة

```
retries: 0
while retries < 5:
  response = call_api()
  if response.status == 200:
    return response
  if response.status == 429 or response.status >= 500:
    wait(2 ** retries * 1000ms)  # 1s, 2s, 4s, 8s, 16s
    retries++
    continue
  # other errors: fail immediately
  throw response.error
```

---

## 9. Environment Variables

```env
# ================== Google Cloud ==================
GCP_PROJECT_ID=modonty
GCP_PROJECT_NUMBER=1006829969708

# ================== gsc-jbrseo ==================
GSC_JBRSEO_CLIENT_EMAIL=REDACTED_SA@REDACTED.iam.gserviceaccount.com
# Base64 (موصى به للـ Vercel):
GSC_JBRSEO_KEY_BASE64=<paste base64 of modonty-12f91a70d3d7.json>
# أو منفصل:
# GSC_JBRSEO_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# GSC Property
GSC_JBRSEO_PROPERTY=sc-domain:jbrseo.com

# ================== gsc-modonty ==================
GSC_MODONTY_CLIENT_EMAIL=gsc-modonty@modonty.iam.gserviceaccount.com
GSC_MODONTY_KEY_BASE64=<paste base64 of modonty-a505af207db6.json>
GSC_MODONTY_PROPERTY=sc-domain:modonty.com

# ================== مشترك ==================
GSC_SCOPE_READONLY=https://www.googleapis.com/auth/webmasters.readonly
GSC_SCOPE_FULL=https://www.googleapis.com/auth/webmasters
```

### تحويل JSON إلى Base64

```bash
# Linux / Mac
base64 -i ~/Downloads/modonty-12f91a70d3d7.json | pbcopy
base64 -i ~/Downloads/modonty-a505af207db6.json | pbcopy

# Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\path\to\modonty-12f91a70d3d7.json")) | Set-Clipboard
```

### فك Base64 في الكود (Node.js)

```javascript
const jsonStr = Buffer.from(
  process.env.GSC_JBRSEO_KEY_BASE64,
  'base64'
).toString('utf-8');
const credentials = JSON.parse(jsonStr);
// Use: credentials.client_email, credentials.private_key
```

---

## 10. Architecture Recommendations

### بنية الملفات المقترحة (Next.js 15 App Router)

```
/lib/gsc/
  ├── auth.ts              # إنشاء authenticated clients
  ├── client.ts            # wrapper يختار SA حسب الدومين
  ├── analytics.ts         # Search Analytics queries
  ├── inspection.ts        # URL Inspection
  ├── sitemaps.ts          # Sitemap management
  ├── sites.ts             # Sites list
  ├── cache.ts             # Caching layer
  ├── errors.ts            # Error types
  └── types.ts             # TypeScript interfaces

/app/api/seo/
  ├── performance/route.ts      # GET - بيانات Performance
  ├── pages/route.ts            # GET - صفحات غير مفهرسة
  ├── inspect/route.ts          # POST - فحص URL
  ├── sitemap/
  │   ├── list/route.ts         # GET - قائمة sitemaps
  │   └── submit/route.ts       # POST - تقديم sitemap
  └── coverage/route.ts         # GET - تقرير Coverage

/app/dashboard/seo/
  ├── page.tsx                  # صفحة Dashboard SEO
  ├── performance/page.tsx      # تحليلات مفصّلة
  ├── pages/page.tsx            # إدارة الصفحات
  └── tools/inspect/page.tsx    # URL Inspection tool
```

### مبادئ المعمارية

1. **Separation of concerns**:
   - `auth.ts` يحتوي فقط على المصادقة
   - `client.ts` يختار الـ SA المناسب
   - endpoints محددة لكل نوع بيانات

2. **Domain-agnostic**:
   - دالة `getGSCClient(domain: 'jbrseo' | 'modonty')` تُرجع client صحيح

3. **Caching**:
   - استخدم Next.js `unstable_cache` أو Redis
   - Search Analytics: TTL 6 ساعات
   - Sites list: TTL 24 ساعة
   - URL Inspection: TTL 1 ساعة

4. **Error handling موحّد**:
   - Wrapper function يتعامل مع 429, 401, 500
   - يرجع typed errors للـ UI

---

## 11. الأمان

### Checklist الأمان

- [ ] `*.json` في `.gitignore` (ما عدا package.json)
- [ ] `.env*.local` في `.gitignore`
- [ ] JSON keys خارج مجلد المشروع محلياً (`~/secure/gsc-keys/`)
- [ ] Environment variables في Vercel (ليس ملفات على الخادم)
- [ ] `GSC_SCOPE_READONLY` في الـ dashboard (ليس FULL)
- [ ] لا تطبع `private_key` في logs
- [ ] Rate limiting على API routes (منع abuse)
- [ ] Authentication على API routes الخاصة (Clerk/NextAuth/custom)
- [ ] Key rotation كل 90 يوم
- [ ] Cloud Audit Logs مفعّل

### Rotate المفتاح (كل 90 يوم)

1. اذهب إلى Cloud Console → Service Accounts → {account} → Keys
2. أنشئ مفتاح جديد (Create new key → JSON)
3. حدّث Environment Variables في Vercel
4. اختبر Production
5. احذف المفتاح القديم من Keys tab

---

## 12. Deployment على Vercel

### خطوات الـ Deploy

1. **Push الكود** إلى GitHub/GitLab
2. **Vercel Dashboard** → Project → **Settings** → **Environment Variables**
3. أضف كل المتغيرات من [القسم 9](#9-environment-variables):
   - Environment: **Production**, **Preview**, **Development**
4. Deploy ← Vercel يعيد البناء بالمتغيرات الجديدة

### ⚠️ تنبيهات Vercel

- **Private key**: استخدم Base64 encoding في `GSC_*_KEY_BASE64` لتجنّب مشاكل `\n` في الـ PEM
- **Timeout**: API routes في Vercel Hobby تنتهي بعد 10s. استخدم streaming أو background jobs للاستعلامات الطويلة
- **Regions**: Vercel بعض APIs تعمل في region محدد. GSC API عالمي، لا مشكلة
- **Edge Functions**: **لا تستخدمها** لـ GSC — google-auth-library يحتاج Node.js runtime

```javascript
// في app/api/seo/.../route.ts
export const runtime = 'nodejs';  // إجباري - مش edge
```

---

## 13. اختبار شامل

### Checklist الاختبار قبل الـ Live

- [ ] **Auth**: authenticate with SA وطبع client_email من الـ token
- [ ] **Sites List**: استعلم واحصل على sc-domain:jbrseo.com + modonty (لاحقاً)
- [ ] **Search Analytics**: استعلام simple لآخر 28 يوم - تأكد rows ترجع
- [ ] **Date filter**: استعلام محدد لتاريخ واحد
- [ ] **Dimensions**: جرّب query, page, country كل واحد على حدة
- [ ] **URL Inspection**: افحص URL موجود - استقبل indexStatusResult
- [ ] **URL Inspection**: افحص URL غير موجود - استقبل NOT_FOUND
- [ ] **Sitemaps List**: استعلم وتأكد من النتيجة
- [ ] **Error 401**: جرّب invalid token - تأكد من معالجته
- [ ] **Error 403**: جرّب site لم يُضف - تأكد من معالجته
- [ ] **Rate limit**: اعمل 10+ طلبات متتالية - تأكد من backoff

### أوامر اختبار سريعة (curl)

```bash
# اختبار المصادقة (بعد ما تحصل على access_token)
TOKEN="<access_token>"

# 1. List sites
curl -H "Authorization: Bearer $TOKEN" \
  https://www.googleapis.com/webmasters/v3/sites

# 2. Search Analytics (آخر 28 يوم)
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"startDate":"2026-03-27","endDate":"2026-04-24","dimensions":["query"],"rowLimit":10}' \
  "https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Ajbrseo.com/searchAnalytics/query"

# 3. URL Inspection
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"inspectionUrl":"https://www.jbrseo.com/","siteUrl":"sc-domain:jbrseo.com"}' \
  "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect"
```

---

## 14. المراجع الرسمية

### Google Documentation

- **Overview**: https://developers.google.com/webmaster-tools
- **API Reference**: https://developers.google.com/webmaster-tools/v1/api_reference_index
- **Search Analytics**: https://developers.google.com/webmaster-tools/v1/searchanalytics
- **URL Inspection**: https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect
- **Sitemaps**: https://developers.google.com/webmaster-tools/v1/sitemaps
- **Sites**: https://developers.google.com/webmaster-tools/v1/sites
- **OAuth**: https://developers.google.com/webmaster-tools/v1/how-tos/authorizing
- **Rate Limits**: https://developers.google.com/webmaster-tools/limits
- **Error Responses**: https://developers.google.com/webmaster-tools/v1/errors

### Authentication Libraries

- **Node.js googleapis**: https://github.com/googleapis/google-api-nodejs-client
- **google-auth-library**: https://github.com/googleapis/google-auth-library-nodejs
- **Python client**: https://github.com/googleapis/google-api-python-client

### Data Freshness (للـ SEO)

- **Search Analytics**: 2-3 أيام delay
- **URL Inspection (live)**: فوري
- **URL Inspection (index status)**: 1-3 أيام
- **Index Coverage**: 1-3 أيام
- **Sitemap processing**: ساعات → أيام

---

## 15. خطة تنفيذ سريعة

### اليوم 1 (2-3 ساعات)
1. احفظ JSON keys في `~/secure/gsc-keys/`
2. حوّل لـ Base64
3. أضف المتغيرات في `.env.local`
4. ركّب `googleapis` في Next.js:
   ```bash
   npm install googleapis
   ```
5. ابنِ `lib/gsc/auth.ts` و `lib/gsc/client.ts`
6. اختبر: list sites + 1 analytics query

### اليوم 2-3
1. بناء باقي endpoints (analytics, inspection, sitemaps)
2. إضافة caching layer
3. إضافة error handling موحّد
4. بناء أول صفحة dashboard

### اليوم 4-7
1. UI components (recharts أو Tremor)
2. Filters + Date pickers
3. URL Inspection tool
4. Sitemap management

### الأسبوع 2+
1. تحسينات UX
2. تنبيهات تلقائية (إيميل عند مشاكل)
3. Scheduled jobs (cron) لتحديث البيانات
4. Integration مع باقي الدومينات

---

## 16. أسئلة متوقعة

**Q: ليش gsc-modonty لسه ما تم verification؟**
A: Google DNS cache يأخذ ساعات-يوم. ما هو عطل، هو delay طبيعي. TXT record موجود وصحيح.

**Q: هل أحتاج SA منفصل لكل دومين؟**
A: لا. SA واحد يقدر يدير عدة دومينات. بس في حالتنا، عمل SA منفصل لعزل أمني (modonty.com crown jewel).

**Q: Base64 ولا JSON file؟**
A: في Vercel production → Base64. محلياً للتطوير → JSON file في `~/secure/`.

**Q: كيف أعرف أن الـ SA يشوف الدومين؟**
A: استعلم `GET /sites` → تأكد من ظهور `sc-domain:modonty.com` في النتيجة.

**Q: إذا API يرد 429 كثيراً؟**
A: Cache أكثر، reduce frequency. تذكّر أن بيانات GSC تتحدث كل 2-3 أيام فقط.

**Q: هل أقدر أطلب فهرسة URL عبر API؟**
A: لا. Search Console API **لا يوفّر** request indexing endpoint. الخيارات:
- Sitemap submission (الأفضل)
- URL Inspection + user يضغط Request Indexing في GSC UI
- Indexing API (محدود لـ JobPosting و BroadcastEvent فقط)

---

## 17. الملحق — JSON Key Structure

هذا شكل الـ JSON file اللي يحتوي على مفتاح Service Account:

```json
{
  "type": "service_account",
  "project_id": "modonty",
  "private_key_id": "REDACTED_PRIVATE_KEY_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n",
  "client_email": "REDACTED_SA@REDACTED.iam.gserviceaccount.com",
  "client_id": "REDACTED_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/REDACTED_SA%40REDACTED.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

**الحقول المستخدمة للمصادقة**:
- `client_email` → في `GSC_*_CLIENT_EMAIL`
- `private_key` → في `GSC_*_PRIVATE_KEY`
- `project_id` → في `GCP_PROJECT_ID`

الباقي موجود للمرجعية فقط، لا يُستخدم مباشرة.

---

**انتهى الدليل التقني. تقدر تبدأ في الكود من هنا — كل معلومة محتاجها لربط التطبيق بـ GSC موجودة في هذا الملف.**
