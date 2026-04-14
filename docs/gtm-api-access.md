# GTM API Access — دليل كامل للـ Agent

> هذا الملف يشرح كيفية التحكم الكامل في Google Tag Manager عبر API بدون فتح المتصفح.  
> مكتوب خصيصاً لأي Agent يعمل على مشروع مدونتي أو jbrseo.com.

---

## 1. المعلومات الأساسية

| المعلومة | القيمة |
|----------|--------|
| **GTM Account ID** | `6346050418` |
| **GTM Container ID** | `247305831` |
| **GTM Container Public ID** | `GTM-TT25M3GX` |
| **GTM Workspace ID** | `8` (Default Workspace) |
| **Service Account Email** | `jbrseo-analytics@modonty.iam.gserviceaccount.com` |
| **Google Cloud Project** | `modonty` (project ID: `1006829969708`) |

---

## 2. المتطلبات المسبقة

### 2.1 متغيرات البيئة المطلوبة

يجب أن يكون في ملف `.env` هذان المتغيران:

```env
GA4_CLIENT_EMAIL="jbrseo-analytics@modonty.iam.gserviceaccount.com"
GA4_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
```

> **ملاحظة:** الـ `\n` في `GA4_PRIVATE_KEY` هي حروف حرفية (escaped)، وليست أسطر جديدة حقيقية.  
> **يجب دائماً** تحويلها قبل الاستخدام: `.replace(/\\n/g, "\n")`

### 2.2 الصلاحيات المُفعَّلة

- ✅ **Tag Manager API** مُفعَّل في Google Cloud Console (project: modonty)
- ✅ Service Account مضاف كـ **Editor** في GTM → Admin → User Management

---

## 3. كود المصادقة (JWT Auth)

هذا هو الكود الأساسي الذي يجب نسخه كما هو. لا تغيّر شيئاً فيه.

```js
import { createSign } from "node:crypto";

function base64url(data) {
  const buf = typeof data === "string" ? Buffer.from(data) : data;
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function getAccessToken(scope) {
  const clientEmail = process.env.GA4_CLIENT_EMAIL ?? "";
  const privateKey = (process.env.GA4_PRIVATE_KEY ?? "")
    .replace(/\\n/g, "\n")   // ← هذا السطر حرج جداً — لا تحذفه
    .replace(/\\r/g, "")
    .trim();

  const now = Math.floor(Date.now() / 1000);
  const header  = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({
    iss: clientEmail,
    scope,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));

  const toSign = `${header}.${payload}`;
  const sign = createSign("RSA-SHA256");
  sign.update(toSign);
  const signature = base64url(sign.sign(privateKey));
  const jwt = `${toSign}.${signature}`;

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(`Token error: ${JSON.stringify(data)}`);
  return data.access_token;
}
```

### الـ Scopes المتاحة

| الصلاحية | الـ Scope |
|----------|-----------|
| قراءة فقط | `https://www.googleapis.com/auth/tagmanager.readonly` |
| تعديل containers/tags | `https://www.googleapis.com/auth/tagmanager.edit.containers` |
| نشر (publish) | `https://www.googleapis.com/auth/tagmanager.publish` |
| كل شيء | `https://www.googleapis.com/auth/tagmanager.edit.containers` + `tagmanager.publish` |

---

## 4. الـ Base URLs

```js
const ACCOUNT_ID   = "6346050418";
const CONTAINER_ID = "247305831";
const WORKSPACE_ID = "8";

const BASE = `https://www.googleapis.com/tagmanager/v2/accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}`;
const WS   = `${BASE}/workspaces/${WORKSPACE_ID}`;
```

---

## 5. العمليات الأساسية

### 5.1 قراءة كل التاغات الموجودة

```js
const token = await getAccessToken("https://www.googleapis.com/auth/tagmanager.readonly");

const resp = await fetch(`${WS}/tags`, {
  headers: { Authorization: `Bearer ${token}` },
});
const { tag } = await resp.json();
// tag = مصفوفة بكل التاغات
for (const t of tag) {
  console.log(t.tagId, t.name, t.type);
}
```

### 5.2 إضافة تاغ جديد (Custom HTML)

```js
const token = await getAccessToken("https://www.googleapis.com/auth/tagmanager.edit.containers");

const newTag = {
  name: "اسم التاغ هنا",
  type: "html",
  parameter: [
    {
      type: "template",
      key: "html",
      value: `<script>console.log('hello');</script>`,
    },
    {
      type: "boolean",
      key: "supportDocumentWrite",
      value: "false",
    },
  ],
  firingTriggerId: ["2147479553"], // All Pages — trigger مدمج في GTM
};

const resp = await fetch(`${WS}/tags`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newTag),
});
const created = await resp.json();
console.log("Tag ID:", created.tagId);
```

### 5.3 إضافة تاغ GA4 Event

```js
const ga4Tag = {
  name: "GA4 - signup_start",
  type: "gaawe", // GA4 Event tag type
  parameter: [
    { type: "template", key: "eventName",         value: "signup_start" },
    { type: "template", key: "measurementId",     value: "{{GA4 Measurement ID}}" },
    { type: "template", key: "sendEcommerceData", value: "false" },
  ],
  firingTriggerId: ["TRIGGER_ID_HERE"],
};
```

### 5.4 تعديل تاغ موجود

```js
// أولاً — اجلب الـ fingerprint الحالي (مطلوب للـ update)
const getResp = await fetch(`${WS}/tags/TAG_ID`, {
  headers: { Authorization: `Bearer ${token}` },
});
const existing = await getResp.json();

// ثانياً — عدّل وأرسل
const updated = {
  ...existing,
  name: "الاسم الجديد",
  // غيّر ما تريد
};

const updateResp = await fetch(`${WS}/tags/${existing.tagId}`, {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(updated),
});
```

### 5.5 حذف تاغ

```js
const resp = await fetch(`${WS}/tags/TAG_ID`, {
  method: "DELETE",
  headers: { Authorization: `Bearer ${token}` },
});
// 204 = حذف ناجح
```

### 5.6 قراءة الـ Triggers

```js
const resp = await fetch(`${WS}/triggers`, {
  headers: { Authorization: `Bearer ${token}` },
});
const { trigger } = await resp.json();
```

### 5.7 إنشاء Trigger جديد

```js
const newTrigger = {
  name: "Click - signup button",
  type: "CLICK",
  filter: [
    {
      type: "CSS_SELECTOR",
      parameter: [
        { type: "template", key: "arg0", value: "{{Click Element}}" },
        { type: "template", key: "arg1", value: ".signup-btn" },
      ],
    },
  ],
};

const resp = await fetch(`${WS}/triggers`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newTrigger),
});
const created = await resp.json();
// استخدم created.triggerId في firingTriggerId للتاغات
```

### 5.8 قراءة المتغيرات (Variables)

```js
const resp = await fetch(`${WS}/variables`, {
  headers: { Authorization: `Bearer ${token}` },
});
const { variable } = await resp.json();
```

### 5.9 نشر التغييرات (Publish)

> ⚠️ هذا يعمل publish مباشر للـ live container. تأكد قبل التنفيذ.

```js
const publishToken = await getAccessToken("https://www.googleapis.com/auth/tagmanager.publish");

const resp = await fetch(
  `${BASE}/versions:publish?containerVersionId=live`,
  {
    method: "POST",
    headers: { Authorization: `Bearer ${publishToken}` },
  }
);
const result = await resp.json();
console.log("Published version:", result.containerVersion?.containerVersionId);
```

---

## 6. Trigger IDs الجاهزة (Built-in)

| الاسم | ID |
|-------|----|
| All Pages | `2147479553` |
| DOM Ready | `2147479572` |
| Window Loaded | `2147479573` |
| Initialization | `2147479574` |

---

## 7. أنواع التاغات الشائعة (type field)

| النوع | القيمة في API |
|-------|---------------|
| Custom HTML | `html` |
| GA4 Configuration | `gaawc` |
| GA4 Event | `gaawe` |
| Google Ads Conversion | `awct` |
| Custom Image | `img` |
| Custom JavaScript Variable | `jsm` |

---

## 8. نمط الـ Script الكامل (جاهز للنسخ)

```js
// gtm-agent.mjs — نسخ هذا الملف كاملاً في أي مشروع
import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// تحميل .env
const envPath = join(dirname(fileURLToPath(import.meta.url)), ".env");
const envLines = readFileSync(envPath, "utf8").split("\n");
const env = {};
for (const line of envLines) {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) {
    let val = m[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[m[1].trim()] = val;
  }
}
process.env.GA4_CLIENT_EMAIL = env.GA4_CLIENT_EMAIL;
process.env.GA4_PRIVATE_KEY  = env.GA4_PRIVATE_KEY;

// ── Auth ──
function base64url(data) {
  const buf = typeof data === "string" ? Buffer.from(data) : data;
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function getAccessToken(scope) {
  const clientEmail = process.env.GA4_CLIENT_EMAIL ?? "";
  const privateKey = (process.env.GA4_PRIVATE_KEY ?? "")
    .replace(/\\n/g, "\n").replace(/\\r/g, "").trim();
  const now = Math.floor(Date.now() / 1000);
  const header  = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({
    iss: clientEmail, scope,
    aud: "https://oauth2.googleapis.com/token",
    iat: now, exp: now + 3600,
  }));
  const toSign = `${header}.${payload}`;
  const sign = createSign("RSA-SHA256");
  sign.update(toSign);
  const jwt = `${toSign}.${base64url(sign.sign(privateKey))}`;
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(`Token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

// ── Config ──
const ACCOUNT_ID   = "6346050418";
const CONTAINER_ID = "247305831";
const WORKSPACE_ID = "8";
const BASE = `https://www.googleapis.com/tagmanager/v2/accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}`;
const WS   = `${BASE}/workspaces/${WORKSPACE_ID}`;
const READ  = "https://www.googleapis.com/auth/tagmanager.readonly";
const WRITE = "https://www.googleapis.com/auth/tagmanager.edit.containers";

// ── استخدم هنا ──
const token = await getAccessToken(WRITE);

// مثال: اعرض كل التاغات
const { tag } = await (await fetch(`${WS}/tags`, {
  headers: { Authorization: `Bearer ${token}` },
})).json();

for (const t of tag ?? []) {
  console.log(`[${t.tagId}] ${t.name} (${t.type})`);
}
```

---

## 9. أخطاء شائعة وحلولها

| الخطأ | السبب | الحل |
|-------|-------|------|
| `error:1E08010C DECODER routines unsupported` | الـ private key بدون newlines حقيقية | أضف `.replace(/\\n/g, "\n")` |
| `SERVICE_DISABLED` | Tag Manager API غير مفعّل | فعّله في Google Cloud Console |
| `403 Permission denied` | Service Account ليس Editor في GTM | أضفه في GTM → Admin → User Management |
| `400 Invalid tag_firing_option` | القيمة غلط | لا تُرسل هذا الـ field أصلاً |
| `409 Conflict fingerprint` | الـ fingerprint قديم عند التعديل | اجلب الـ tag أولاً وخذ الـ fingerprint منه |

---

## 10. روابط مرجعية

- GTM Container في الواجهة: `https://tagmanager.google.com/#/container/accounts/6346050418/containers/247305831`
- GTM API Reference: `https://developers.google.com/tag-platform/tag-manager/api/v2/reference`
- Google Cloud Console (modonty): `https://console.cloud.google.com/apis/dashboard?project=modonty`
