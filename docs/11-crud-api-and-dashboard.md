# 11 — CRUD API وربط لوحة مشكاة

## الهدف

نقل Mishkat MVP من لوحة تقرأ أرقام Dashboard فقط إلى نموذج أولي يسمح بإضافة وإدارة كيانات أساسية مؤقتًا عبر API.

## ما تم تنفيذه

تمت إضافة Endpoints للكيانات التالية:

- Programs
- Beneficiaries
- Volunteers
- Impact Metrics

كما تم تحديث لوحة `MishkatDashboard` لتقرأ هذه القوائم من API وتعرض نماذج إضافة سريعة.

## Endpoints الجديدة

### البرامج

```http
GET /api/v1/organizations/:organizationId/programs
POST /api/v1/organizations/:organizationId/programs
```

مثال POST:

```json
{
  "name": "برنامج جديد",
  "manager": "فريق التشغيل",
  "progress": 10,
  "status": "active"
}
```

### المستفيدون

```http
GET /api/v1/organizations/:organizationId/beneficiaries
POST /api/v1/organizations/:organizationId/beneficiaries
```

مثال POST:

```json
{
  "name": "مستفيد جديد",
  "city": "القاهرة",
  "programId": "program-student-sponsorship",
  "status": "active"
}
```

### المتطوعون

```http
GET /api/v1/organizations/:organizationId/volunteers
POST /api/v1/organizations/:organizationId/volunteers
```

مثال POST:

```json
{
  "name": "متطوع جديد",
  "skill": "تعليم",
  "totalHours": 5,
  "programId": "program-student-sponsorship",
  "status": "available"
}
```

### مؤشرات الأثر

```http
GET /api/v1/organizations/:organizationId/impact-metrics
POST /api/v1/organizations/:organizationId/impact-metrics
```

مثال POST:

```json
{
  "name": "نسبة الرضا",
  "key": "satisfaction_rate",
  "current": 91,
  "target": 95,
  "unit": "%"
}
```

## تحديثات الواجهة

تم تحديث:

```txt
src/lib/api.ts
src/components/MishkatDashboard.tsx
```

لوحة مشكاة الآن تعرض:

- البرامج القادمة من API.
- المستفيدين القادمين من API.
- المتطوعين القادمين من API.
- مؤشرات الأثر القادمة من API.
- نماذج إضافة سريعة للبرامج والمستفيدين والمتطوعين.
- إعادة تحميل تلقائية بعد الإضافة.
- بيانات احتياطية إذا كانت API متوقفة.

## حدود هذه المرحلة

- التخزين ما زال داخل الذاكرة فقط.
- لا يوجد تعديل أو حذف بعد.
- لا توجد مصادقة أو صلاحيات.
- لا توجد قاعدة بيانات PostgreSQL بعد.
- البيانات تضيع عند إعادة تشغيل السيرفر.

## التحقق المقترح

شغّل API:

```bash
npm run server:dev
```

ثم شغّل الواجهة:

```bash
npm run dev
```

افتح قسم `MVP مشكاة` وجرب:

1. إضافة برنامج جديد.
2. إضافة مستفيد وربطه ببرنامج.
3. إضافة متطوع وربطه ببرنامج.
4. الضغط على تحديث.
5. ملاحظة تغير الأرقام والقوائم.

## الخطوة التالية

المرحلة التالية هي استبدال التخزين المؤقت بـ PostgreSQL وPrisma:

```txt
Memory Store
  ↓
PostgreSQL + Prisma Client
  ↓
Migrations
  ↓
Seed Data
  ↓
Real CRUD Persistence
```
