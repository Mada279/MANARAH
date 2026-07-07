import {
  boardingCheckIns,
  boardingResidents,
  educationClasses,
  financeEntries,
  saveStore,
  staffMembers,
  students,
  type BoardingCheckIn,
  type BoardingResident,
  type EducationClass,
  type FinanceEntry,
  type StaffMember,
  type Student,
} from '../lib/memory-store.js';

export type EducationSummary = {
  classes: number;
  schoolClasses: number;
  quranClasses: number;
  students: number;
  staff: number;
  averageAcademicProgress: number;
  averageQuranPages: number;
  attendanceRate: number;
  income: number;
  expenses: number;
  balance: number;
};

export function listEducationClasses(organizationId: string) {
  return educationClasses.filter((item) => item.organizationId === organizationId);
}

export function listStudents(organizationId: string) {
  return students
    .filter((item) => item.organizationId === organizationId)
    .map((student) => ({
      ...student,
      className: educationClasses.find((classItem) => classItem.id === student.classId)?.name ?? 'غير مرتبط',
    }));
}

export function listStaffMembers(organizationId: string) {
  return staffMembers.filter((item) => item.organizationId === organizationId);
}

export function listFinanceEntries(organizationId: string) {
  return financeEntries.filter((item) => item.organizationId === organizationId);
}

export function buildEducationSummary(organizationId: string): EducationSummary {
  const classes = listEducationClasses(organizationId);
  const organizationStudents = students.filter((item) => item.organizationId === organizationId);
  const staff = listStaffMembers(organizationId);
  const finance = listFinanceEntries(organizationId);
  const income = finance.filter((entry) => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0);
  const expenses = finance.filter((entry) => entry.type === 'expense').reduce((sum, entry) => sum + entry.amount, 0);

  const average = (values: number[]) => {
    if (!values.length) return 0;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  };

  return {
    classes: classes.length,
    schoolClasses: classes.filter((item) => item.track === 'school' || item.track === 'hybrid').length,
    quranClasses: classes.filter((item) => item.track === 'quran' || item.track === 'hybrid').length,
    students: organizationStudents.length,
    staff: staff.length,
    averageAcademicProgress: average(organizationStudents.map((student) => student.academicProgress)),
    averageQuranPages: average(organizationStudents.map((student) => student.quranMemorizedPages)),
    attendanceRate: average(organizationStudents.map((student) => student.attendanceRate)),
    income,
    expenses,
    balance: income - expenses,
  };
}

export type CreateEducationClassInput = Omit<EducationClass, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>;
export type CreateStudentInput = Omit<Student, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>;
export type CreateStaffInput = Omit<StaffMember, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>;
export type CreateFinanceInput = Omit<FinanceEntry, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>;

export function createEducationClass(organizationId: string, input: CreateEducationClassInput) {
  const item: EducationClass = {
    id: `class-${crypto.randomUUID()}`,
    organizationId,
    createdAt: new Date().toISOString(),
    ...input,
  };
  educationClasses.unshift(item);
  saveStore();
  return item;
}

export function createStudent(organizationId: string, input: CreateStudentInput) {
  const item: Student = {
    id: `student-${crypto.randomUUID()}`,
    organizationId,
    createdAt: new Date().toISOString(),
    ...input,
  };
  students.unshift(item);
  saveStore();
  return {
    ...item,
    className: educationClasses.find((classItem) => classItem.id === item.classId)?.name ?? 'غير مرتبط',
  };
}

export function createStaffMember(organizationId: string, input: CreateStaffInput) {
  const item: StaffMember = {
    id: `staff-${crypto.randomUUID()}`,
    organizationId,
    createdAt: new Date().toISOString(),
    ...input,
  };
  staffMembers.unshift(item);
  saveStore();
  return item;
}

export function createFinanceEntry(organizationId: string, input: CreateFinanceInput) {
  const item: FinanceEntry = {
    id: `finance-${crypto.randomUUID()}`,
    organizationId,
    createdAt: new Date().toISOString(),
    ...input,
  };
  financeEntries.unshift(item);
  saveStore();
  return item;
}

export type EducationReport = {
  title: string;
  generatedAt: string;
  summary: EducationSummary;
  highlights: string[];
  risks: string[];
  recommendations: string[];
  financialNotes: string[];
};

export function buildEducationReport(organizationId: string): EducationReport {
  const summary = buildEducationSummary(organizationId);
  const organizationStudents = students.filter((item) => item.organizationId === organizationId);
  const finance = listFinanceEntries(organizationId);
  const dueStudents = organizationStudents.filter((student) => student.tuitionStatus === 'due').length;
  const scholarshipStudents = organizationStudents.filter((student) => student.tuitionStatus === 'scholarship').length;
  const lowAttendance = organizationStudents.filter((student) => student.attendanceRate < 85).length;
  const highQuranProgress = organizationStudents.filter((student) => student.quranMemorizedPages >= 100).length;
  const salaryExpenses = finance
    .filter((entry) => entry.type === 'expense' && entry.category === 'salary')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const highlights = [
    `تدير المؤسسة ${summary.classes} فصلًا/حلقة، منها ${summary.quranClasses} مرتبطة بالتحفيظ.`,
    `متوسط التقدم العلمي الحالي ${summary.averageAcademicProgress}% مع حضور عام ${summary.attendanceRate}%.`,
    `متوسط صفحات الحفظ للطلاب ${summary.averageQuranPages} صفحة، ويوجد ${highQuranProgress} طلاب تجاوزوا 100 صفحة.`,
    `الرصيد المالي الحالي ${summary.balance} بعد احتساب الإيرادات والمصروفات المسجلة.`,
  ];

  const risks = [
    ...(lowAttendance > 0 ? [`يوجد ${lowAttendance} طلاب يحتاجون متابعة بسبب انخفاض الحضور عن 85%.`] : []),
    ...(dueStudents > 0 ? [`يوجد ${dueStudents} طلاب لديهم مستحقات دراسية غير مسددة.`] : []),
    ...(summary.balance < 0 ? ['الرصيد المالي سالب ويحتاج مراجعة عاجلة للمصروفات أو مصادر التمويل.'] : []),
  ];

  const recommendations = [
    'إنشاء تقرير شهري للتقدم العلمي والحفظ لكل فصل وحلقة.',
    'ربط الطلاب منخفضي الحضور بخطة متابعة مع ولي الأمر.',
    'تخصيص مؤشرات منفصلة للتقدم الدراسي، الحفظ، المراجعة، والحضور.',
    'مراجعة الطاقة الاستيعابية للفصول والحلقات ذات الأداء المرتفع لتكرار نموذجها.',
  ];

  const financialNotes = [
    `إجمالي الإيرادات المسجلة ${summary.income}.`,
    `إجمالي المصروفات المسجلة ${summary.expenses}.`,
    `إجمالي الرواتب المسجلة ${salaryExpenses}.`,
    `عدد الطلاب على منح أو كفالات: ${scholarshipStudents}.`,
  ];

  return {
    title: 'تقرير التعليم والتحفيظ المختصر',
    generatedAt: new Date().toISOString(),
    summary,
    highlights,
    risks: risks.length ? risks : ['لا توجد مخاطر حرجة ظاهرة في البيانات الحالية.'],
    recommendations,
    financialNotes,
  };
}

export type StudentReport = {
  title: string;
  generatedAt: string;
  student: ReturnType<typeof listStudents>[number];
  classInfo?: EducationClass;
  alerts: string[];
  recommendations: string[];
  progress: {
    academicProgress: number;
    quranMemorizedPages: number;
    attendanceRate: number;
    tuitionStatus: Student['tuitionStatus'];
  };
};

export function buildStudentReport(organizationId: string, studentId: string): StudentReport | null {
  const student = listStudents(organizationId).find((item) => item.id === studentId);
  if (!student) return null;

  const classInfo = educationClasses.find((item) => item.id === student.classId);
  const alerts: string[] = [];
  const recommendations: string[] = [];

  if (student.attendanceRate < 85) {
    alerts.push('نسبة حضور الطالب أقل من 85% وتحتاج متابعة مع ولي الأمر.');
    recommendations.push('تحديد موعد متابعة أسبوعية مع ولي الأمر لتحسين الالتزام بالحضور.');
  }

  if (student.academicProgress < 70) {
    alerts.push('التقدم العلمي أقل من المستوى المستهدف.');
    recommendations.push('إعداد خطة دعم علمي قصيرة للطالب خلال أسبوعين.');
  } else {
    recommendations.push('الاستمرار في خطة التقدم العلمي الحالية مع مراجعة شهرية.');
  }

  if (student.track === 'quran' || student.track === 'hybrid') {
    if (student.quranMemorizedPages < 30) {
      recommendations.push('زيادة ورد الحفظ والمراجعة تدريجيًا مع متابعة أسبوعية.');
    } else {
      recommendations.push('إضافة خطة مراجعة للحفظ السابق للحفاظ على جودة الإتقان.');
    }
  }

  if (student.tuitionStatus === 'due') {
    alerts.push('توجد مستحقات مالية غير مسددة للطالب.');
    recommendations.push('مراجعة حالة المصروفات مع الإدارة المالية أو بحث إمكانية كفالة جزئية.');
  }

  if (student.tuitionStatus === 'scholarship') {
    recommendations.push('توثيق أثر الكفالة التعليمية وربطه بتقرير الداعمين.');
  }

  return {
    title: `تقرير الطالب: ${student.name}`,
    generatedAt: new Date().toISOString(),
    student,
    classInfo,
    alerts: alerts.length ? alerts : ['لا توجد تنبيهات حرجة على بيانات الطالب الحالية.'],
    recommendations,
    progress: {
      academicProgress: student.academicProgress,
      quranMemorizedPages: student.quranMemorizedPages,
      attendanceRate: student.attendanceRate,
      tuitionStatus: student.tuitionStatus,
    },
  };
}

export type BoardingResidentView = BoardingResident & {
  studentName: string;
  className: string;
  track: Student['track'];
  academicProgress: number;
  quranMemorizedPages: number;
  attendanceRate: number;
};

export type BoardingSummary = {
  residents: number;
  rooms: number;
  averageTarbiyahScore: number;
  averageSupervisionScore: number;
  averageQuranRevisionScore: number;
  healthAlerts: number;
  parentVisibleReports: number;
  boysOnly: true;
  girlsBoardingSupported: false;
};

export type BoardingReport = {
  title: string;
  generatedAt: string;
  summary: BoardingSummary;
  highlights: string[];
  supervisionNotes: string[];
  tarbiyahRecommendations: string[];
  parentVisibilityPolicy: string;
};

export type ParentStudentResults = {
  studentName: string;
  className: string;
  academicProgress: number;
  quranMemorizedPages: number;
  attendanceRate: number;
  tuitionStatus: Student['tuitionStatus'];
  publicRecommendations: string[];
  internalBoardingDetailsHidden: true;
};

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function toBoardingResidentView(resident: BoardingResident): BoardingResidentView {
  const student = students.find((item) => item.id === resident.studentId);
  const classInfo = educationClasses.find((item) => item.id === student?.classId);

  return {
    ...resident,
    studentName: student?.name ?? 'طالب غير معروف',
    className: classInfo?.name ?? 'غير مرتبط',
    track: student?.track ?? 'quran',
    academicProgress: student?.academicProgress ?? 0,
    quranMemorizedPages: student?.quranMemorizedPages ?? 0,
    attendanceRate: student?.attendanceRate ?? 0,
  };
}

export function listBoardingResidents(organizationId: string) {
  return boardingResidents
    .filter((resident) => resident.organizationId === organizationId)
    .map(toBoardingResidentView);
}

export function buildBoardingSummary(organizationId: string): BoardingSummary {
  const residents = listBoardingResidents(organizationId);
  const rooms = new Set(residents.map((resident) => resident.room)).size;

  return {
    residents: residents.length,
    rooms,
    averageTarbiyahScore: average(residents.map((resident) => resident.tarbiyahScore)),
    averageSupervisionScore: average(residents.map((resident) => resident.supervisionScore)),
    averageQuranRevisionScore: average(residents.map((resident) => resident.quranRevisionScore)),
    healthAlerts: residents.filter((resident) => resident.healthStatus !== 'good').length,
    parentVisibleReports: residents.filter((resident) => resident.parentVisible).length,
    boysOnly: true,
    girlsBoardingSupported: false,
  };
}

export type CreateBoardingResidentInput = Omit<BoardingResident, 'id' | 'organizationId' | 'createdAt' | 'updatedAt' | 'parentVisible'> & {
  parentVisible?: boolean;
};

export function createBoardingResident(organizationId: string, input: CreateBoardingResidentInput) {
  const student = students.find((item) => item.id === input.studentId && item.organizationId === organizationId);

  if (!student) {
    throw new Error('StudentNotFound');
  }

  const resident: BoardingResident = {
    id: `boarding-${crypto.randomUUID()}`,
    organizationId,
    parentVisible: input.parentVisible ?? true,
    createdAt: new Date().toISOString(),
    ...input,
  };

  boardingResidents.unshift(resident);
  saveStore();
  return toBoardingResidentView(resident);
}

export function buildBoardingReport(organizationId: string): BoardingReport {
  const summary = buildBoardingSummary(organizationId);
  const residents = listBoardingResidents(organizationId);
  const lowRevision = residents.filter((resident) => resident.quranRevisionScore < 75).length;
  const healthAlerts = residents.filter((resident) => resident.healthStatus !== 'good').length;

  return {
    title: 'تقرير الداخلي للبنين في دار التحفيظ',
    generatedAt: new Date().toISOString(),
    summary,
    highlights: [
      `يضم السكن الداخلي ${summary.residents} طلاب بنين موزعين على ${summary.rooms} غرف.`,
      `متوسط المتابعة التربوية ${summary.averageTarbiyahScore}%، ومتوسط الإشراف ${summary.averageSupervisionScore}%.`,
      `متوسط مراجعة القرآن ${summary.averageQuranRevisionScore}% مع ${summary.parentVisibleReports} تقارير ظاهرة لولي الأمر.`,
      'النظام الداخلي مخصص للبنين فقط، ولا توجد داخلية للبنات ضمن النموذج الحالي.',
    ],
    supervisionNotes: [
      ...(healthAlerts ? [`يوجد ${healthAlerts} حالات صحية أو إشرافية تحتاج متابعة.`] : ['لا توجد تنبيهات صحية حرجة حاليًا.']),
      ...(lowRevision ? [`يوجد ${lowRevision} طلاب يحتاجون رفع مستوى مراجعة الحفظ.`] : ['مستوى مراجعة الحفظ مستقر في البيانات الحالية.']),
    ],
    tarbiyahRecommendations: [
      'تخصيص مشرف تربوي لكل مجموعة غرف وتسجيل متابعة يومية مختصرة.',
      'فصل تقرير ولي الأمر عن ملاحظات الإشراف الداخلي الحساسة.',
      'إضافة مؤشرات للسلوك، الالتزام، الورد اليومي، النظافة، والحضور للحلقة.',
      'مراجعة الطلاب ذوي انخفاض المراجعة القرآنية بخطة أسبوعية.',
    ],
    parentVisibilityPolicy:
      'ولي الأمر يرى النتائج العامة والتقدم والحضور والتنبيهات المسموح بها فقط، ولا يرى ملاحظات الإشراف الداخلي التفصيلية.',
  };
}

export function buildParentStudentResults(studentId: string): ParentStudentResults | null {
  const student = listStudents(students.find((item) => item.id === studentId)?.organizationId ?? '').find(
    (item) => item.id === studentId,
  );

  if (!student) return null;

  const recommendations = [
    'متابعة الحضور والالتزام الأسبوعي مع إدارة الحلقة أو المدرسة.',
    student.track === 'quran' || student.track === 'hybrid'
      ? 'مراجعة ورد الحفظ في المنزل دون الاطلاع على تفاصيل الإشراف الداخلي.'
      : 'متابعة الواجبات والتقدم الدراسي مع المعلم المسؤول.',
  ];

  if (student.tuitionStatus === 'due') {
    recommendations.push('يوجد تنبيه مالي يحتاج مراجعة الإدارة المالية.');
  }

  return {
    studentName: student.name,
    className: student.className,
    academicProgress: student.academicProgress,
    quranMemorizedPages: student.quranMemorizedPages,
    attendanceRate: student.attendanceRate,
    tuitionStatus: student.tuitionStatus,
    publicRecommendations: recommendations,
    internalBoardingDetailsHidden: true,
  };
}

export type BoardingCheckInView = BoardingCheckIn & {
  residentName: string;
  room: string;
  supervisorName: string;
};

export type CreateBoardingCheckInInput = Omit<BoardingCheckIn, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>;

function toBoardingCheckInView(checkIn: BoardingCheckIn): BoardingCheckInView {
  const resident = boardingResidents.find((item) => item.id === checkIn.residentId);
  const residentView = resident ? toBoardingResidentView(resident) : null;

  return {
    ...checkIn,
    residentName: residentView?.studentName ?? 'طالب داخلي غير معروف',
    room: resident?.room ?? 'غير محدد',
    supervisorName: resident?.supervisorName ?? 'غير محدد',
  };
}

export function listBoardingCheckIns(organizationId: string, residentId?: string) {
  return boardingCheckIns
    .filter((checkIn) => checkIn.organizationId === organizationId)
    .filter((checkIn) => !residentId || checkIn.residentId === residentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toBoardingCheckInView);
}

export function createBoardingCheckIn(organizationId: string, input: CreateBoardingCheckInInput) {
  const resident = boardingResidents.find(
    (item) => item.id === input.residentId && item.organizationId === organizationId,
  );

  if (!resident) {
    throw new Error('BoardingResidentNotFound');
  }

  const checkIn: BoardingCheckIn = {
    id: `checkin-${crypto.randomUUID()}`,
    organizationId,
    createdAt: new Date().toISOString(),
    ...input,
  };

  boardingCheckIns.unshift(checkIn);
  resident.tarbiyahScore = Math.round((resident.tarbiyahScore + input.behaviorScore) / 2);
  resident.supervisionScore = Math.round(
    (resident.supervisionScore + input.cleanlinessScore + input.sleepDisciplineScore) / 3,
  );
  resident.quranRevisionScore = Math.round((resident.quranRevisionScore + Math.min(input.revisionPages * 10, 100)) / 2);
  resident.healthStatus = input.healthStatus;
  resident.updatedAt = new Date().toISOString();

  saveStore();
  return toBoardingCheckInView(checkIn);
}

export type BoardingMonthlyReport = {
  title: string;
  month: string;
  generatedAt: string;
  daysTracked: number;
  fajrAttendanceRate: number;
  quranSessionAttendanceRate: number;
  totalMemorizationPages: number;
  totalRevisionPages: number;
  averageBehaviorScore: number;
  averageCleanlinessScore: number;
  averageSleepDisciplineScore: number;
  healthAlerts: number;
  supervisorRecommendations: string[];
  parentSafeSummary: string[];
  internalNotesCount: number;
};

function monthKey(date: string) {
  return new Date(date).toISOString().slice(0, 7);
}

export function buildBoardingMonthlyReport(organizationId: string, month = new Date().toISOString().slice(0, 7)): BoardingMonthlyReport {
  const checkIns = boardingCheckIns.filter(
    (checkIn) => checkIn.organizationId === organizationId && monthKey(checkIn.date) === month,
  );
  const uniqueDays = new Set(checkIns.map((checkIn) => new Date(checkIn.date).toISOString().slice(0, 10))).size;
  const average = (values: number[]) => {
    if (!values.length) return 0;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  };
  const rate = (values: boolean[]) => {
    if (!values.length) return 0;
    return Math.round((values.filter(Boolean).length / values.length) * 100);
  };

  const totalMemorizationPages = checkIns.reduce((sum, checkIn) => sum + checkIn.memorizationPages, 0);
  const totalRevisionPages = checkIns.reduce((sum, checkIn) => sum + checkIn.revisionPages, 0);
  const fajrAttendanceRate = rate(checkIns.map((checkIn) => checkIn.fajrPrayer));
  const quranSessionAttendanceRate = rate(checkIns.map((checkIn) => checkIn.quranSession));
  const averageBehaviorScore = average(checkIns.map((checkIn) => checkIn.behaviorScore));
  const averageCleanlinessScore = average(checkIns.map((checkIn) => checkIn.cleanlinessScore));
  const averageSleepDisciplineScore = average(checkIns.map((checkIn) => checkIn.sleepDisciplineScore));
  const healthAlerts = checkIns.filter((checkIn) => checkIn.healthStatus !== 'good').length;
  const internalNotesCount = checkIns.filter((checkIn) => checkIn.supervisorNote && !checkIn.parentVisible).length;

  const supervisorRecommendations = [
    ...(fajrAttendanceRate < 85 ? ['رفع متابعة الاستيقاظ لصلاة الفجر بخطة إشراف صباحية.'] : ['مستوى حضور الفجر جيد ويحتاج استمرارًا.']),
    ...(quranSessionAttendanceRate < 90 ? ['مراجعة أسباب غياب بعض الطلاب عن الحلقة وتعديل جدول الداخلي إن لزم.'] : ['حضور الحلقة مستقر في هذا الشهر.']),
    ...(averageBehaviorScore < 80 ? ['إعداد برنامج تربوي قصير لتحسين السلوك والانضباط.'] : ['المؤشر التربوي العام جيد.']),
    ...(averageSleepDisciplineScore < 80 ? ['تحسين نظام النوم والاستيقاظ ومتابعة غرف الداخلي.'] : ['انضباط النوم مقبول في بيانات الشهر.']),
    ...(healthAlerts ? ['مراجعة الحالات الصحية أو الإشرافية التي ظهرت خلال الشهر.'] : ['لا توجد حالات صحية حرجة ظاهرة.']),
  ];

  const parentSafeSummary = [
    `تم تسجيل ${uniqueDays} أيام متابعة خلال شهر ${month}.`,
    `إجمالي صفحات الحفظ ${totalMemorizationPages}، وإجمالي صفحات المراجعة ${totalRevisionPages}.`,
    `نسبة حضور الحلقة ${quranSessionAttendanceRate}% ونسبة حضور الفجر ${fajrAttendanceRate}%.`,
    'التفاصيل الداخلية وملاحظات المشرف لا تظهر لولي الأمر إلا إذا وسمها المشرف كقابلة للعرض.',
  ];

  return {
    title: 'التقرير الشهري للداخلي للبنين',
    month,
    generatedAt: new Date().toISOString(),
    daysTracked: uniqueDays,
    fajrAttendanceRate,
    quranSessionAttendanceRate,
    totalMemorizationPages,
    totalRevisionPages,
    averageBehaviorScore,
    averageCleanlinessScore,
    averageSleepDisciplineScore,
    healthAlerts,
    supervisorRecommendations,
    parentSafeSummary,
    internalNotesCount,
  };
}

export type BoardingSupervisorDashboard = {
  title: string;
  generatedAt: string;
  date: string;
  supervisorName?: string;
  students: BoardingResidentView[];
  todayCheckIns: BoardingCheckInView[];
  studentsWithoutTodayCheckIn: BoardingResidentView[];
  missingFajr: BoardingResidentView[];
  missingQuranSession: BoardingResidentView[];
  healthAttention: BoardingResidentView[];
  lowBehavior: BoardingResidentView[];
  lowCleanliness: BoardingResidentView[];
  lowSleepDiscipline: BoardingResidentView[];
  alerts: string[];
  quickRecommendations: string[];
};

function dayKey(date: string) {
  return new Date(date).toISOString().slice(0, 10);
}

export function buildBoardingSupervisorDashboard(
  organizationId: string,
  supervisorName?: string,
  date = new Date().toISOString().slice(0, 10),
): BoardingSupervisorDashboard {
  const residents = listBoardingResidents(organizationId).filter((resident) =>
    supervisorName ? resident.supervisorName === supervisorName : true,
  );
  const residentIds = new Set(residents.map((resident) => resident.id));
  const todayCheckIns = boardingCheckIns
    .filter((checkIn) => checkIn.organizationId === organizationId)
    .filter((checkIn) => residentIds.has(checkIn.residentId))
    .filter((checkIn) => dayKey(checkIn.date) === date)
    .map(toBoardingCheckInView);

  const checkedResidentIds = new Set(todayCheckIns.map((checkIn) => checkIn.residentId));
  const studentsWithoutTodayCheckIn = residents.filter((resident) => !checkedResidentIds.has(resident.id));
  const latestTodayByResident = new Map<string, BoardingCheckInView>();

  for (const checkIn of todayCheckIns) {
    const existing = latestTodayByResident.get(checkIn.residentId);
    if (!existing || existing.createdAt < checkIn.createdAt) {
      latestTodayByResident.set(checkIn.residentId, checkIn);
    }
  }

  const latestCheckIns = [...latestTodayByResident.values()];
  const byResident = (predicate: (checkIn: BoardingCheckInView) => boolean) =>
    latestCheckIns
      .filter(predicate)
      .map((checkIn) => residents.find((resident) => resident.id === checkIn.residentId))
      .filter(Boolean) as BoardingResidentView[];

  const missingFajr = byResident((checkIn) => !checkIn.fajrPrayer);
  const missingQuranSession = byResident((checkIn) => !checkIn.quranSession);
  const healthAttention = residents.filter((resident) => resident.healthStatus !== 'good');
  const lowBehavior = byResident((checkIn) => checkIn.behaviorScore < 75);
  const lowCleanliness = byResident((checkIn) => checkIn.cleanlinessScore < 75);
  const lowSleepDiscipline = byResident((checkIn) => checkIn.sleepDisciplineScore < 75);

  const alerts = [
    ...(studentsWithoutTodayCheckIn.length
      ? [`${studentsWithoutTodayCheckIn.length} طلاب لم تُسجل لهم متابعة اليوم.`]
      : ['تم تسجيل متابعة اليوم لجميع الطلاب ضمن النطاق.']),
    ...(missingFajr.length ? [`${missingFajr.length} طلاب لم يحضروا الفجر حسب آخر متابعة.`] : []),
    ...(missingQuranSession.length ? [`${missingQuranSession.length} طلاب لم يحضروا الحلقة حسب آخر متابعة.`] : []),
    ...(healthAttention.length ? [`${healthAttention.length} طلاب لديهم حالة صحية/إشرافية تحتاج متابعة.`] : []),
    ...(lowBehavior.length ? [`${lowBehavior.length} طلاب لديهم انخفاض في مؤشر السلوك.`] : []),
    ...(lowCleanliness.length ? [`${lowCleanliness.length} طلاب لديهم انخفاض في مؤشر النظافة.`] : []),
    ...(lowSleepDiscipline.length ? [`${lowSleepDiscipline.length} طلاب لديهم انخفاض في مؤشر النوم.`] : []),
  ];

  const quickRecommendations = [
    'ابدأ بتسجيل متابعة الطلاب الذين لا يملكون متابعة اليوم.',
    'راجع قائمة الفجر والحلقة قبل نهاية اليوم لإغلاق المتابعات الناقصة.',
    'حوّل الحالات الصحية أو السلوكية المتكررة إلى خطة متابعة أسبوعية.',
    'اجعل الملاحظات الحساسة داخلية ولا تظهر لولي الأمر إلا كملخص عام مناسب.',
  ];

  return {
    title: 'لوحة المشرف التربوي للداخلي',
    generatedAt: new Date().toISOString(),
    date,
    supervisorName,
    students: residents,
    todayCheckIns,
    studentsWithoutTodayCheckIn,
    missingFajr,
    missingQuranSession,
    healthAttention,
    lowBehavior,
    lowCleanliness,
    lowSleepDiscipline,
    alerts,
    quickRecommendations,
  };
}
