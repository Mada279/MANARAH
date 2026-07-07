# 18 — حماية API بالـ Token

## الهدف

نقل الحماية من الواجهة فقط إلى API نفسها، بحيث لا يمكن استدعاء مسارات Manarah OS / Mishkat بدون إرسال token تجريبي.

## ما تم تنفيذه

تمت إضافة Middleware في Express يقرأ الهيدر:

```http
Authorization: Bearer demo-token
```

ويحمي مسارات:

```txt
/api/v1/*
```

مع ترك المسارات التالية عامة:

```txt
GET  /health
POST /api/v1/auth/login
```

## الاستجابة عند عدم وجود Token

إذا تم استدعاء مسار محمي بدون token أو بـ token غير صحيح:

```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid Authorization: Bearer token"
}
```

مع status:

```http
401 Unauthorized
```

## تحديث الواجهة

تم تعديل API client:

```txt
src/lib/api.ts
```

ليقرأ token من:

```txt
localStorage.manarah_auth_token
```

ويرسله تلقائيًا مع كل الطلبات:

```http
Authorization: Bearer <token>
```

## تحديث Smoke Test

تم تحديث:

```txt
scripts/smoke-test.mjs
```

ليقوم بالآتي:

1. يفحص `/health` بدون token.
2. يتأكد أن `/api/v1/organizations` يرجع `401` بدون token.
3. يسجل الدخول عبر `/api/v1/auth/login`.
4. يحفظ token الناتج.
5. يرسل token مع كل الطلبات التالية.
6. ينفذ CRUD smoke test.

## المتغيرات

```env
DEMO_AUTH_TOKEN="demo-token"
```

## ملاحظات مهمة

هذه حماية تجريبية وليست نظام أمان إنتاجي. قبل الإنتاج نحتاج:

- JWT حقيقي بتوقيع آمن.
- انتهاء صلاحية token.
- Refresh token.
- تشفير كلمات المرور.
- Middleware يربط المستخدم بالطلب.
- فحص عضوية المستخدم في المؤسسة قبل الوصول للبيانات.
- Audit logs للعمليات الحساسة.

## التحقق

بعد تشغيل السيرفر:

```bash
npm run server:dev
```

شغّل:

```bash
npm run api:smoke
```

يجب أن تظهر:

```txt
✓ protected organizations require token
✓ login admin@manarah.local
✓ me admin@manarah.local
```
