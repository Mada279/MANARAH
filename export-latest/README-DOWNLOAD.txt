MANARAH Altamayuz Latest Package

Latest package after updating demo data to:
- مؤسسة التميز التعليمية
- المسؤول: د. مالك بالدي
- المدارس: مدرسة ١ - لابي، مدرسة ٢ - كنديا، مدرسة ٣ - كوندرا
- قسم التحفيظ الخارجي: أولاد وبنات
- قسم التحفيظ الداخلي: بنين فقط
- لوحة ولي الأمر تعرض النتائج العامة فقط

Includes:
- Marketing website
- Mishkat dashboard
- Parent portal
- Boys boarding module
- Supervisor dashboard
- Daily check-ins
- Monthly reports
- Education/Quran reports
- API + Auth + Role/Org protection
- JSON persistence
- Repository layer
- Prisma skeleton
- Docs

Excluded:
- .git/
- node_modules/
- dist/
- server/data/
- generated archives

After extracting:
  npm install
  npm run server:check
  npm run build

Run:
  npm run server:dev
  npm run dev

Open:
  http://localhost:5173/MANARAH/#login

Demo accounts:
  admin@manarah.local
  parent@manarah.local
  viewer@manarah.local

Smoke test:
  npm run api:smoke
