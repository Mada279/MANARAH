MANARAH Final MVP Package

This package includes the latest local MANARAH/Mishkat MVP source code:

- Marketing website aligned with MANARAH ecosystem vision
- Mishkat standalone dashboard (#dashboard)
- Login page (#login)
- Parent portal (#parent)
- Express API with token, role, and organization access protection
- CRUD for programs, beneficiaries, volunteers, impact metrics
- School and Quran center management
- Boys-only Quran boarding module
- Daily boarding check-ins
- Monthly boarding reports
- Supervisor dashboard
- Parent-safe results view
- Audit logs
- JSON persistence
- Repository layer
- Prisma skeleton, schema, seed, Docker PostgreSQL setup
- Smoke test script
- Full docs/ folder

Excluded:
- .git/
- node_modules/
- dist/
- server/data/
- old generated archives

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
  viewer@manarah.local -> read-only smoke/API user
  parent@manarah.local -> parent portal

Smoke test:
  npm run api:smoke
