# First Session Prompt — JBRSEO

> انسخ النص أدناه والصقه في أول محادثة عند فتح مشروع JBRSEO في Claude Code.

---

## الـ Prompt (انسخ من هنا)

```
أنت تعمل على مشروع JBRSEO لأول مرة في هذه الجلسة.

قبل أي شيء، نفّذ هذه الخطوات بالترتيب:

1. اقرأ ملفات المشروع الأساسية:
   - package.json
   - next.config.ts (أو next.config.js)
   - prisma/schema.prisma (إذا موجود)
   - أي ملف README أو CLAUDE.md في الجذر
   - تصفّح مجلد app/ لتفهم هيكل الصفحات

2. بعد القراءة، حدّث ملفَي الـ Memory الناقصَين:
   - C:\Users\w2nad\.claude\projects\c--Users-w2nad-Desktop-dreamToApp-JBRSEO\memory\project_architecture.md
     → اكتب: Stack التقني، قاعدة البيانات، هيكل التطبيقات، نمط الـ Deployment
   - C:\Users\w2nad\.claude\projects\c--Users-w2nad-Desktop-dreamToApp-JBRSEO\memory\reference_production_urls.md
     → اكتب: URLs الإنتاج الحقيقية (الموقع، الأدمن، أي subdomain)

3. أكّد لي عند الانتهاء بـ: اسم الـ framework، نوع الـ DB، وعدد الصفحات الرئيسية.

لا تبدأ أي عمل آخر قبل إتمام هذه الخطوات.
```

---

## ملاحظة

هذا الـ prompt يُنفَّذ **مرة واحدة فقط** في أول جلسة.
بعدها كل شيء أوتوماتيك — لا تحتاج تكرره.
