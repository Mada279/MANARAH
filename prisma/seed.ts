import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: { slug: 'noor-community' },
    update: {},
    create: {
      name: 'مؤسسة النور المجتمعية',
      slug: 'noor-community',
      type: 'charity',
      country: 'EG',
      city: 'Cairo',
      description: 'مؤسسة تجريبية لاختبار Mishkat MVP.',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'admin@manarah.local' },
    update: {},
    create: {
      name: 'مدير منارة التجريبي',
      email: 'admin@manarah.local',
      phone: '+200000000000',
    },
  });

  const ownerRole = await prisma.role.upsert({
    where: {
      organizationId_name: {
        organizationId: organization.id,
        name: 'owner',
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      name: 'owner',
      description: 'مالك المؤسسة وصاحب الصلاحيات الكاملة',
      isSystem: true,
    },
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: user.id,
      },
    },
    update: { roleId: ownerRole.id },
    create: {
      organizationId: organization.id,
      userId: user.id,
      roleId: ownerRole.id,
    },
  });

  const studentProgram = await prisma.program.create({
    data: {
      organizationId: organization.id,
      managerId: user.id,
      name: 'برنامج كفالة طالب علم',
      description: 'برنامج تعليمي تجريبي ضمن Mishkat MVP.',
      category: 'education',
      status: 'active',
    },
  });

  const reliefProgram = await prisma.program.create({
    data: {
      organizationId: organization.id,
      managerId: user.id,
      name: 'مبادرة السلال الشهرية',
      description: 'مبادرة إغاثية تجريبية ضمن Mishkat MVP.',
      category: 'relief',
      status: 'active',
    },
  });

  await prisma.beneficiary.createMany({
    data: [
      {
        organizationId: organization.id,
        programId: studentProgram.id,
        name: 'أحمد محمد',
        city: 'القاهرة',
        ageGroup: 'youth',
      },
      {
        organizationId: organization.id,
        programId: reliefProgram.id,
        name: 'أسرة رقم 284',
        city: 'القاهرة',
        ageGroup: 'family',
      },
    ],
  });

  await prisma.volunteer.createMany({
    data: [
      {
        organizationId: organization.id,
        programId: studentProgram.id,
        name: 'سارة علي',
        email: 'sara@example.com',
        skills: ['تعليم'],
        totalHours: 124,
      },
      {
        organizationId: organization.id,
        programId: reliefProgram.id,
        name: 'محمود حسن',
        email: 'mahmoud@example.com',
        skills: ['لوجستيات'],
        totalHours: 88,
        status: 'assigned',
      },
    ],
  });

  await prisma.impactMetric.createMany({
    data: [
      {
        organizationId: organization.id,
        name: 'عدد المستفيدين',
        key: 'beneficiaries_count',
        unit: 'مستفيد',
        targetValue: 1600,
      },
      {
        organizationId: organization.id,
        name: 'ساعات التطوع',
        key: 'volunteer_hours',
        unit: 'ساعة',
        targetValue: 5000,
      },
    ],
  });

  console.log('Seed complete:', {
    organization: organization.slug,
    user: user.email,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
