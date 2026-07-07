# 14 — التخزين المحلي المؤقت JSON

## الهدف

قبل الانتقال الكامل إلى PostgreSQL، تم تحسين API التجريبية بحيث لا تفقد البيانات عند إعادة تشغيل السيرفر.

بدل أن تكون البيانات داخل الذاكرة فقط، أصبحت تُحفظ في ملف JSON محلي.

## مكان التخزين

افتراضيًا:

```txt
server/data/manarah-store.json
```

يمكن تغيير المكان عبر:

```env
DATA_DIR="server/data"
```

> المجلد `server/data/` موجود في `.gitignore` حتى لا يتم رفع بياناتك التجريبية إلى GitHub.

## ما الذي أصبح محفوظًا؟

- المستخدم التجريبي.
- المؤسسات.
- البرامج.
- المستفيدون.
- المتطوعون.
- مؤشرات الأثر.

## Endpoints إضافية

### إعادة تهيئة البيانات التجريبية

```http
POST /api/v1/dev/reset-store
```

يعيد البيانات إلى الحالة الافتراضية.

### تحديث وحذف البرامج

```http
PATCH  /api/v1/organizations/:organizationId/programs/:programId
DELETE /api/v1/organizations/:organizationId/programs/:programId
```

### تحديث وحذف المستفيدين

```http
PATCH  /api/v1/organizations/:organizationId/beneficiaries/:beneficiaryId
DELETE /api/v1/organizations/:organizationId/beneficiaries/:beneficiaryId
```

### تحديث وحذف المتطوعين

```http
PATCH  /api/v1/organizations/:organizationId/volunteers/:volunteerId
DELETE /api/v1/organizations/:organizationId/volunteers/:volunteerId
```

### تحديث وحذف مؤشرات الأثر

```http
PATCH  /api/v1/organizations/:organizationId/impact-metrics/:metricId
DELETE /api/v1/organizations/:organizationId/impact-metrics/:metricId
```

## تحديث الواجهة

تمت إضافة زر داخل لوحة مشكاة:

```txt
إعادة تهيئة
```

يستدعي endpoint إعادة التهيئة ثم يعيد تحميل البيانات.

## لماذا هذه الخطوة؟

هذه المرحلة تجعل تجربة MVP المحلية عملية أكثر:

```txt
تشغيل السيرفر
  ↓
إضافة بيانات من الواجهة
  ↓
إيقاف السيرفر
  ↓
تشغيله مرة أخرى
  ↓
البيانات ما زالت موجودة
```

## المرحلة التالية

هذه ليست بديلًا عن قاعدة البيانات، لكنها خطوة انتقالية. المرحلة التالية تبقى:

```txt
JSON File Store
  ↓
PostgreSQL + Prisma
```
