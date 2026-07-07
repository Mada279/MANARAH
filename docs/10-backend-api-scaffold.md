# 10 — Backend API Scaffold

## الهدف

بدء المرحلة التالية بعد نموذج لوحة Mishkat Dashboard: إنشاء نواة API محلية أولية يمكن لاحقًا ربطها بقاعدة بيانات PostgreSQL.

## ما تم إنشاؤه

```txt
server/
  src/
    index.ts
    lib/
      memory-store.ts

prisma/
  schema.prisma

tsconfig.server.json
.env.example
```

## السكربتات الجديدة

```bash
npm run server:dev
npm run server:check
npm run db:validate
npm run db:generate
npm run db:migrate
```

## API الحالية

### Health Check

```http
GET /health
```

تعرض حالة API التجريبية.

### قائمة المؤسسات

```http
GET /api/v1/organizations
```

تعرض المؤسسات الموجودة في الذاكرة حاليًا.

### إنشاء مؤسسة

```http
POST /api/v1/organizations
Content-Type: application/json

{
  "name": "مؤسسة تجريبية",
  "slug": "demo-org",
  "type": "charity",
  "country": "EG",
  "city": "Cairo"
}
```

### لوحة مؤسسة

```http
GET /api/v1/organizations/:organizationId/dashboard
```

تعرض أرقام Dashboard أولية.

## ملاحظة عن التخزين الحالي

التخزين الحالي مؤقت داخل الذاكرة فقط:

```txt
memory-store-prototype
```

أي أن البيانات تختفي عند إعادة تشغيل السيرفر. الهدف من ذلك اختبار شكل API قبل تفعيل قاعدة البيانات.

## Prisma Schema

تم إنشاء `prisma/schema.prisma` كنموذج بيانات رسمي لـ:

- User
- Organization
- OrganizationMember
- Role
- Permission
- Program
- Beneficiary
- Volunteer
- Document
- ImpactMetric
- ImpactMetricValue
- ImpactReport
- AuditLog
- Notification

## لماذا لم يتم ربط Prisma فعليًا الآن؟

لأن تشغيل Prisma validation/generate يحتاج تنزيل محركات Prisma من الإنترنت. في بيئة العمل الحالية فشل التنزيل بسبب مشكلة اتصال مؤقتة مع خوادم Prisma binaries.

لذلك تم اعتماد خطوة آمنة:

1. كتابة Prisma schema كعقد بيانات.
2. تشغيل API بذاكرة مؤقتة.
3. ترك الربط الحقيقي مع PostgreSQL للمرحلة التالية عندما تكون البيئة جاهزة.

## ربط الواجهة بالـ API

تمت إضافة API client في الواجهة:

```txt
src/lib/api.ts
```

ويستخدم المتغير:

```env
VITE_API_URL="http://localhost:4000"
```

كما تم تحديث `MishkatDashboard` ليجلب:

```http
GET /api/v1/organizations
GET /api/v1/organizations/:organizationId/dashboard
```

إذا لم تكن API تعمل، تعرض الواجهة بيانات احتياطية مع رسالة خطأ واضحة بدل أن تتوقف.

## التحقق المنفذ

تم التحقق من:

```bash
npm run server:check
npm run build
npm run server:dev
curl http://127.0.0.1:4000/health
curl http://127.0.0.1:4000/api/v1/organizations
```

## الخطوة التالية

1. إضافة Endpoints للبرامج والمستفيدين والمتطوعين.
2. تشغيل PostgreSQL محلي أو عبر خدمة خارجية.
2. ضبط `DATABASE_URL` في `.env`.
3. تشغيل:

```bash
npm run db:generate
npm run db:migrate
```

4. استبدال `memory-store.ts` بطبقة Prisma فعلية.
5. ربط Dashboard frontend بالـ API.
