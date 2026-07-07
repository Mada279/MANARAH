# 12 — تجهيز PostgreSQL وPrisma

## الهدف

المرحلة التالية بعد CRUD المؤقت هي نقل التخزين من الذاكرة إلى قاعدة بيانات PostgreSQL باستخدام Prisma.

## ما تم تجهيزه

تمت إضافة:

```txt
docker-compose.yml
prisma/schema.prisma
prisma/seed.ts
.env.example
```

كما أضيفت سكربتات:

```bash
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
```

## تشغيل PostgreSQL محليًا

إذا كان Docker متاحًا:

```bash
docker compose up -d postgres
```

ثم انسخ ملف البيئة:

```bash
cp .env.example .env
```

وتأكد من وجود:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/manarah?schema=public"
```

## توليد Prisma Client

```bash
npm run db:generate
```

## تشغيل Migration

```bash
npm run db:migrate
```

## إدخال بيانات تجريبية

```bash
npm run db:seed
```

## فتح Prisma Studio

```bash
npm run db:studio
```

## ملاحظة مهمة

في بيئة Arena الحالية قد يفشل `prisma validate/generate` بسبب عدم القدرة على تنزيل Prisma engines من الإنترنت. هذا لا يمنعك من تشغيلها محليًا على جهازك إذا كان الاتصال متاحًا.

## ما بعد هذه الخطوة

بعد نجاح Prisma محليًا، يتم استبدال `server/src/lib/memory-store.ts` بطبقة Repository تستخدم Prisma Client:

```txt
memory-store.ts
  ↓
repositories/
  organizations.repository.ts
  programs.repository.ts
  beneficiaries.repository.ts
  volunteers.repository.ts
  impact.repository.ts
```

ثم تصبح كل عمليات الإضافة والقراءة محفوظة في قاعدة البيانات بدل الذاكرة.
