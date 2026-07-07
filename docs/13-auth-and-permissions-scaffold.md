# 13 — Auth وصلاحيات أولية

## الهدف

تجهيز خطوة أولى نحو تسجيل الدخول والصلاحيات قبل بناء نظام Auth حقيقي.

## ما تم تنفيذه

تمت إضافة مستخدم تجريبي داخل الذاكرة:

```txt
admin@manarah.local
```

وتمت إضافة Endpoints:

```http
POST /api/v1/auth/login
GET /api/v1/me
```

## تسجيل دخول تجريبي

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@manarah.local"
}
```

الاستجابة:

```json
{
  "data": {
    "token": "demo-token",
    "user": {
      "email": "admin@manarah.local",
      "role": "owner"
    },
    "organizations": []
  }
}
```

## ربط لوحة التحكم

تم تحديث لوحة مشكاة المستقلة لتستدعي `POST /api/v1/auth/login` عند التحميل باستخدام المستخدم التجريبي:

```txt
admin@manarah.local
```

وتعرض اسم المستخدم ودوره داخل رأس لوحة التحكم، كما تعرض رمز الجلسة التجريبي داخل تبويب الإعدادات.

## ملاحظات أمنية

هذا ليس نظام مصادقة إنتاجي. هو Scaffold فقط لتحديد شكل الاستجابة وربط المستخدم بالمؤسسة.

قبل الإنتاج نحتاج:

- تشفير كلمات المرور.
- JWT حقيقي.
- Refresh tokens.
- صلاحيات على مستوى الموارد.
- حماية Endpoints.
- Rate limiting.
- Audit logs لكل عمليات حساسة.

## المتغيرات

```env
DEMO_AUTH_TOKEN="demo-token"
```

## الخطوة التالية

عند الانتقال إلى PostgreSQL:

1. نقل المستخدمين إلى جدول `users`.
2. نقل العضويات إلى `organization_members`.
3. تفعيل الأدوار والصلاحيات من `roles` و `permissions`.
4. إضافة Middleware للتحقق من token.
5. منع الوصول إلى بيانات مؤسسة إلا لأعضائها.
