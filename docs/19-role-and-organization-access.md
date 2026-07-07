# 19 — صلاحيات الدور والوصول للمؤسسة

## الهدف

بعد حماية API بالـ token، تم إضافة طبقة صلاحيات أولية تربط الطلب بالمستخدم الحالي، وتمنع عمليات الكتابة لغير الأدوار المصرح لها.

## ما تم تنفيذه

### 1. ربط token بالمستخدم

الـ API تقرأ token من:

```http
Authorization: Bearer <token>
```

ثم تربطه بمستخدم تجريبي داخل `memory-store`:

- `demo-token` → المستخدم الإداري `admin@manarah.local`
- `demo-viewer-token` → المستخدم القارئ `viewer@manarah.local`

### 2. مستخدم Viewer تجريبي

تمت إضافة مستخدم جديد:

```txt
viewer@manarah.local
```

دوره:

```txt
viewer
```

ويستطيع قراءة البيانات فقط.

### 3. فلترة المؤسسات حسب المستخدم

مسار:

```http
GET /api/v1/organizations
```

يعيد فقط المؤسسات التي ينتمي إليها المستخدم الحالي.

### 4. منع الوصول لمؤسسة خارج عضوية المستخدم

أي endpoint يحتوي:

```txt
:organizationId
```

يتحقق من أن المستخدم الحالي عضو داخل هذه المؤسسة، وإلا يرجع:

```http
403 Forbidden
```

### 5. منع الكتابة لغير أصحاب الصلاحية

عمليات `POST/PATCH/DELETE` أصبحت تحتاج دورًا إداريًا.

الأدوار المسموح لها بالكتابة:

- owner
- admin
- program_manager
- coordinator

دور `viewer` يقرأ فقط.

## أمثلة

### Viewer يستطيع القراءة

```http
GET /api/v1/organizations
Authorization: Bearer demo-viewer-token
```

### Viewer لا يستطيع الإضافة

```http
POST /api/v1/organizations/org-noor/programs
Authorization: Bearer demo-viewer-token
```

الاستجابة:

```http
403 Forbidden
```

## تحديث Smoke Test

تم تحديث:

```txt
scripts/smoke-test.mjs
```

ليتحقق من:

1. رفض الطلب بدون token.
2. دخول viewer.
3. قدرة viewer على القراءة.
4. منع viewer من الكتابة.
5. دخول admin.
6. تنفيذ CRUD كامل.

## ملاحظات

هذه صلاحيات تجريبية، وليست بديلًا عن نظام صلاحيات إنتاجي. لاحقًا يجب نقلها إلى:

- JWT حقيقي.
- Middleware يستخرج المستخدم من token.
- جداول `roles` و `permissions`.
- صلاحيات على مستوى كل resource.
- Audit logs لكل عملية كتابة.
