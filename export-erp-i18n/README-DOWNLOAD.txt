MANARAH Altamayuz ERP i18n Latest Package

This package includes ALL latest changes:

Identity / Vision:
- MANARAH ecosystem website
- README and full docs
- Altamayuz Education Institution demo data
- Responsible person: د. مالك بالدي
- Schools: مدرسة ١ - لابي، مدرسة ٢ - كنديا، مدرسة ٣ - كوندرا
- Locations: لابي، كنديا، كوندرا، القرية
- Quran department: external boys, external girls, internal boys only

Mishkat MVP:
- Standalone dashboard #dashboard
- Login page #login
- Parent portal #parent
- AR / EN / FR language controls
- Light / Dark theme controls
- School ERP tab
- Finance and fees management
- Students management
- Teachers and HR management
- Programs, beneficiaries, volunteers, impact metrics

Boys boarding Quran center:
- Boys-only boarding
- No girls boarding
- Daily check-ins
- Monthly boarding report
- Supervisor dashboard
- Parent safe results only

Backend:
- Express API
- Bearer token protection
- Role and organization access
- Audit logs
- JSON persistence
- Repository layer
- Prisma skeleton
- Docker/PostgreSQL setup
- Smoke test script

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

Run locally:
  npm run server:dev
  npm run dev

Open:
  http://localhost:5173/MANARAH/#login

Demo accounts:
  admin@manarah.local  -> admin/dashboard
  parent@manarah.local -> parent portal
  viewer@manarah.local -> read-only/API test

Smoke test:
  npm run api:smoke

GitHub upload from your local machine:
  git add .
  git commit -m "Add Altamayuz Mishkat ERP i18n MVP"
  git push
