# وثائق منارة | MANARAH Docs

هذا المجلد يحوّل رؤية منارة من نص عام إلى وثائق قابلة للتنفيذ. الهدف أن تصبح كل مرحلة واضحة للفريق: ماذا نبني؟ ولماذا؟ ولمن؟ وبأي ترتيب؟

## فهرس الوثائق

1. [خطوات GitHub والنشر](./00-github-and-deployment.md)
2. [الرؤية والتموضع](./01-vision.md)
3. [منظومة منارة](./02-ecosystem.md)
4. [Manarah OS](./03-manarah-os.md)
5. [Mishkat MVP](./04-mishkat-mvp.md)
6. [نموذج البيانات الأولي](./05-data-model.md)
7. [شاشات لوحة التحكم](./06-dashboard-wireframes.md)
8. [خارطة التنفيذ](./07-implementation-roadmap.md)
9. [قائمة مراجعة الإطلاق](./08-launch-checklist.md)
10. [نموذج لوحة Mishkat Dashboard](./09-dashboard-prototype.md)
11. [Backend API Scaffold](./10-backend-api-scaffold.md)
12. [CRUD API وربط لوحة مشكاة](./11-crud-api-and-dashboard.md)
13. [تجهيز PostgreSQL وPrisma](./12-postgres-prisma-next-step.md)
14. [Auth وصلاحيات أولية](./13-auth-and-permissions-scaffold.md)
15. [التخزين المحلي المؤقت JSON](./14-local-json-persistence.md)
16. [الاختبار المحلي وSmoke Test](./15-local-testing-and-smoke-test.md)
17. [لوحة مشكاة المستقلة](./16-standalone-dashboard-route.md)
18. [واجهة تسجيل الدخول وحماية Dashboard](./17-login-ui-and-dashboard-guard.md)
19. [حماية API بالـ Token](./18-protected-api-token.md)
20. [صلاحيات الدور والوصول للمؤسسة](./19-role-and-organization-access.md)
21. [Repository Layer](./20-repository-layer.md)
22. [Prisma Repository Skeleton](./21-prisma-repository-skeleton.md)

## ترتيب التنفيذ المقترح

```txt
GitHub PR / Deployment
  ↓
Docs Foundation
  ↓
Mishkat MVP Definition
  ↓
Data Model
  ↓
Dashboard Wireframes
  ↓
Implementation Roadmap
  ↓
Build Dashboard + Backend
  ↓
Pilot With Real Organization
```

## القاعدة الذهبية

لا نضيف منتجًا جديدًا قبل أن نثبت أن المنتج الأول يحل مشكلة حقيقية لمؤسسة حقيقية.
