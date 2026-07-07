# 17 — واجهة تسجيل الدخول وحماية Dashboard

## الهدف

نقل Auth من تسجيل دخول تلقائي داخل Dashboard إلى شاشة دخول واضحة، مع حفظ الجلسة محليًا وحماية لوحة مشكاة.

## ما تم تنفيذه

تمت إضافة:

```txt
src/components/dashboard/LoginPage.tsx
src/lib/auth.ts
```

وتم تحديث:

```txt
src/App.tsx
src/components/dashboard/DashboardApp.tsx
```

## المسارات

### تسجيل الدخول

```txt
#login
```

مثال محلي:

```txt
http://localhost:5173/MANARAH/#login
```

### لوحة مشكاة

```txt
#dashboard
```

مثال محلي:

```txt
http://localhost:5173/MANARAH/#dashboard
```

## آلية العمل

1. المستخدم يفتح `#login`.
2. يدخل البريد التجريبي:

```txt
admin@manarah.local
```

3. الواجهة تستدعي:

```http
POST /api/v1/auth/login
```

4. يتم حفظ الجلسة في `localStorage`:

```txt
manarah_auth_token
manarah_auth_user
manarah_auth_organizations
```

5. يتم تحويل المستخدم إلى:

```txt
#dashboard
```

6. إذا حاول المستخدم فتح `#dashboard` بدون جلسة محفوظة، يتم عرض صفحة الدخول.

## تسجيل الخروج

تمت إضافة زر:

```txt
تسجيل الخروج
```

داخل الشريط الجانبي للوحة مشكاة. يقوم بمسح الجلسة والعودة إلى صفحة الدخول.

## الصلاحيات الأولية

تمت إضافة دالة:

```txt
canManage(role)
```

وتسمح بالأدوار التالية بتنفيذ الإضافات والتعديلات والحذف:

- owner
- admin
- program_manager
- coordinator

أما دور `viewer` فيكون للعرض فقط لاحقًا.

## ملاحظات مهمة

هذا ليس نظام Auth إنتاجي بعد، لكنه يثبت الشكل العام للتدفق:

```txt
Login UI
  ↓
Auth API
  ↓
Local Session
  ↓
Dashboard Guard
  ↓
Role-based UI Actions
```

## الخطوة التالية

- إضافة Middleware حقيقي في API للتحقق من token.
- ربط الصلاحيات بكل endpoint.
- إضافة كلمات مرور مشفرة.
- إضافة JWT حقيقي.
- إضافة Refresh token لاحقًا.
