# 20 — Repository Layer

## الهدف

فصل منطق الوصول للبيانات عن ملف Express الرئيسي، حتى يصبح الانتقال لاحقًا من JSON Store إلى PostgreSQL/Prisma أسهل وأقل خطورة.

## ما تم تنفيذه

تم إنشاء مجلد:

```txt
server/src/repositories/
```

ويحتوي على:

```txt
auth.repository.ts
organizations.repository.ts
programs.repository.ts
beneficiaries.repository.ts
volunteers.repository.ts
impact.repository.ts
```

## قبل هذه المرحلة

كان ملف:

```txt
server/src/index.ts
```

يتعامل مباشرة مع:

```txt
users
organizations
programs
beneficiaries
volunteers
impactMetrics
saveStore()
```

## بعد هذه المرحلة

أصبح `index.ts` يستدعي دوال واضحة مثل:

```ts
findUserByEmail()
findUserByToken()
listOrganizationsForUser()
createOrganization()
buildDashboard()
listPrograms()
createProgram()
updateProgram()
deleteProgram()
listBeneficiaries()
createBeneficiary()
listVolunteers()
createVolunteer()
listImpactMetrics()
createImpactMetric()
```

## لماذا هذا مهم؟

لأننا لاحقًا نستطيع إنشاء نسخة Prisma من هذه الدوال بدون تغيير كبير في Express routes.

المسار المستهدف:

```txt
Express Routes
  ↓
Repository Interface
  ↓
JSON Store Repository الآن
  ↓
Prisma Repository لاحقًا
  ↓
PostgreSQL
```

## مثال

بدل أن يقوم route بعمل:

```ts
programs.unshift(program)
saveStore()
```

أصبح يستدعي:

```ts
createProgram(organization.id, input)
```

## مميزات المرحلة

- ملف `index.ts` أصبح مسؤولًا عن HTTP وValidation فقط.
- منطق البيانات أصبح في Repositories.
- الانتقال إلى Prisma أصبح أسهل.
- الاختبار أصبح أبسط.
- تقليل تكرار حسابات مثل عدد المستفيدين والمتطوعين داخل البرامج.

## الخطوة التالية

إنشاء Prisma repositories بنفس أسماء ودوال repositories الحالية، ثم تبديل الاستيراد لاحقًا.

مثال مستقبلي:

```txt
server/src/repositories/json/programs.repository.ts
server/src/repositories/prisma/programs.repository.ts
```

أو استخدام Interface موحد:

```ts
ProgramsRepository
```

ثم اختيار implementation حسب البيئة.
