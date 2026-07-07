# 21 — Prisma Repository Skeleton

## الهدف

تجهيز نسخة أولية من Repositories تعمل بـ Prisma لاحقًا، بدون كسر النسخة الحالية التي تعمل بـ JSON Store.

هذه المرحلة لا تُفعّل Prisma داخل API بعد، لكنها تجهز ملفات الانتقال حتى يصبح التبديل تدريجيًا ومنظمًا.

## ما تم إنشاؤه

```txt
server/src/lib/prisma.ts
server/src/repositories/prisma/
  auth.prisma.repository.ts
  organizations.prisma.repository.ts
  programs.prisma.repository.ts
  beneficiaries.prisma.repository.ts
  volunteers.prisma.repository.ts
  impact.prisma.repository.ts
```

## لماذا `server/src/lib/prisma.ts` يستخدم Lazy Import؟

في بعض البيئات، مثل بيئة العمل الحالية، قد لا يكون Prisma Client مولدًا بعد لأن الأمر التالي لم يعمل بعد:

```bash
npm run db:generate
```

لذلك تم إنشاء Prisma loader بطريقة lazy حتى يظل TypeScript قادرًا على فحص المشروع قبل توليد Prisma Client.

إذا حاولت استخدام Prisma قبل التوليد، ستظهر رسالة واضحة:

```txt
PrismaClient is not generated yet. Run: npm run db:generate...
```

## طريقة التفعيل لاحقًا

بعد تشغيل PostgreSQL محليًا:

```bash
docker compose up -d postgres
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
```

يمكن بعد ذلك تبديل imports في `server/src/index.ts` تدريجيًا من:

```txt
server/src/repositories/*.repository.ts
```

إلى:

```txt
server/src/repositories/prisma/*.prisma.repository.ts
```

## ملاحظات مهمة

النسخة الحالية ما زالت تستخدم JSON Store كمسار مستقر:

```txt
server/data/manarah-store.json
```

أما Prisma repositories فهي Skeleton جاهز للمرحلة التالية وليست مفعّلة افتراضيًا.

## سبب هذه الخطوة

هذه الخطوة تقلل المخاطرة. بدل نقل API بالكامل إلى قاعدة البيانات مرة واحدة، أصبح لدينا مساران:

```txt
JSON Repository — يعمل الآن
Prisma Repository — جاهز للتفعيل لاحقًا
```

## الخطوة التالية

عند نجاح تشغيل Prisma محليًا، نبدأ بكيان واحد فقط:

```txt
Organizations
```

ثم نختبره، وبعدها ننقل بالتدريج:

```txt
Programs
Beneficiaries
Volunteers
Impact Metrics
Auth
```
