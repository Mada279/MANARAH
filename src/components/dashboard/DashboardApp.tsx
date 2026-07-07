import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  API_BASE_URL,
  createBeneficiary,
  createImpactMetric,
  createProgram,
  createStaffMember,
  createVolunteer,
  deleteBeneficiary,
  deleteImpactMetric,
  deleteProgram,
  deleteVolunteer,
  createFinanceEntry,
  createStudent,
  getAuditLogs,
  getBeneficiaries,
  getBoardingCheckIns,
  getBoardingMonthlyReport,
  getBoardingReport,
  getBoardingResidents,
  getBoardingSummary,
  getBoardingSupervisorDashboard,
  getEducationClasses,
  getEducationReport,
  getEducationSummary,
  getFinanceEntries,
  getImpactMetrics,
  getOrganizationDashboard,
  getOrganizations,
  getPrograms,
  getStaffMembers,
  getStudentReport,
  getStudents,
  getVolunteers,
  resetPrototypeStore,
  updateBeneficiary,
  updateImpactMetric,
  updateProgram,
  updateVolunteer,
  type AuditLog,
  type Beneficiary,
  type BoardingCheckIn,
  type BoardingMonthlyReport,
  type BoardingReport,
  type BoardingResident,
  type BoardingSupervisorDashboard,
  type BoardingSummary,
  type EducationClass,
  type EducationReport,
  type EducationSummary,
  type FinanceEntry,
  type ImpactMetric,
  type Organization,
  type OrganizationDashboard,
  type Program,
  type StaffMember,
  type Student,
  type StudentReport,
  type User,
  type Volunteer,
} from '../../lib/api';
import { canManage, clearStoredSession, getStoredSession } from '../../lib/auth';
import { LanguageThemeControls, usePreferences } from '../../lib/preferences';

type Tab = 'overview' | 'programs' | 'beneficiaries' | 'volunteers' | 'impact' | 'education' | 'boarding' | 'supervisor' | 'erp' | 'settings';

const tabs: { id: Tab; labelKey: string; icon: string }[] = [
  { id: 'overview', labelKey: 'tabs.overview', icon: '📊' },
  { id: 'programs', labelKey: 'tabs.programs', icon: '🧭' },
  { id: 'beneficiaries', labelKey: 'tabs.beneficiaries', icon: '🌱' },
  { id: 'volunteers', labelKey: 'tabs.volunteers', icon: '🤝' },
  { id: 'impact', labelKey: 'tabs.impact', icon: '📈' },
  { id: 'education', labelKey: 'tabs.education', icon: '🏫' },
  { id: 'boarding', labelKey: 'tabs.boarding', icon: '🛏️' },
  { id: 'supervisor', labelKey: 'tabs.supervisor', icon: '🧑‍🏫' },
  { id: 'erp', labelKey: 'tabs.erp', icon: '🏢' },
  { id: 'settings', labelKey: 'tabs.settings', icon: '⚙️' },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat('ar-EG').format(value);
}

function percent(current: number, target: number) {
  if (!target) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: 'مسودة',
    active: 'نشط',
    paused: 'متوقف',
    completed: 'مكتمل',
    archived: 'مؤرشف',
    follow_up: 'متابعة',
    available: 'متاح',
    assigned: 'مكلف',
    inactive: 'غير نشط',
  };
  return labels[status] ?? status;
}

function ProgressBar({ value, color = 'bg-amber-400' }: { value: number; color?: string }) {
  return (
    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-gray-500 mb-2 font-cairo">{label}</span>
      {children}
    </label>
  );
}

const inputClass = 'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-400/50';
const selectClass = 'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-amber-400/50';

export default function DashboardApp() {
  const { t, language, theme } = usePreferences();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [dashboard, setDashboard] = useState<OrganizationDashboard | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [educationSummary, setEducationSummary] = useState<EducationSummary | null>(null);
  const [educationReport, setEducationReport] = useState<EducationReport | null>(null);
  const [educationClasses, setEducationClasses] = useState<EducationClass[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentReport, setStudentReport] = useState<StudentReport | null>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>([]);
  const [boardingSummary, setBoardingSummary] = useState<BoardingSummary | null>(null);
  const [boardingResidents, setBoardingResidents] = useState<BoardingResident[]>([]);
  const [boardingReport, setBoardingReport] = useState<BoardingReport | null>(null);
  const [boardingMonthlyReport, setBoardingMonthlyReport] = useState<BoardingMonthlyReport | null>(null);
  const [boardingCheckIns, setBoardingCheckIns] = useState<BoardingCheckIn[]>([]);
  const [boardingSupervisorDashboard, setBoardingSupervisorDashboard] = useState<BoardingSupervisorDashboard | null>(null);
  const [selectedBoardingResidentId, setSelectedBoardingResidentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [programForm, setProgramForm] = useState({ name: '', manager: '', progress: '0' });
  const [beneficiaryForm, setBeneficiaryForm] = useState({ name: '', city: '', programId: '' });
  const [volunteerForm, setVolunteerForm] = useState({ name: '', skill: '', totalHours: '0', programId: '' });
  const [metricForm, setMetricForm] = useState({ name: '', key: '', current: '0', target: '100', unit: 'عدد' });
  const [studentForm, setStudentForm] = useState({ name: '', classId: '', track: 'school', academicProgress: '0', quranMemorizedPages: '0', attendanceRate: '100', tuitionStatus: 'due' });
  const [financeForm, setFinanceForm] = useState({ type: 'income', category: 'tuition', amount: '0', description: '' });
  const [staffForm, setStaffForm] = useState({ name: '', role: 'teacher', department: 'school', salary: '0' });
  const [boardingForm, setBoardingForm] = useState({ studentId: '', room: '', supervisorName: '', tarbiyahScore: '80', supervisionScore: '80', quranRevisionScore: '80', healthStatus: 'good' });
  const [boardingCheckInForm, setBoardingCheckInForm] = useState({ residentId: '', fajrPrayer: true, quranSession: true, memorizationPages: '1', revisionPages: '3', behaviorScore: '85', cleanlinessScore: '85', sleepDisciplineScore: '85', healthStatus: 'good', supervisorNote: '', parentVisible: false });

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const session = getStoredSession();
      if (!session) {
        window.location.hash = 'login';
        return;
      }

      setCurrentUser(session.user);
      setAuthToken(session.token);

      const organizations = session.organizations.length ? session.organizations : await getOrganizations();
      const selectedOrganization = organizations[0];
      if (!selectedOrganization) {
        throw new Error('لا توجد مؤسسة متاحة في API');
      }

      const [
        dashboardData,
        programsData,
        beneficiariesData,
        volunteersData,
        metricsData,
        auditLogsData,
        educationSummaryData,
        educationReportData,
        educationClassesData,
        studentsData,
        staffData,
        financeData,
        boardingSummaryData,
        boardingResidentsData,
        boardingReportData,
        boardingMonthlyReportData,
        boardingSupervisorDashboardData,
      ] = await Promise.all([
        getOrganizationDashboard(selectedOrganization.id),
        getPrograms(selectedOrganization.id),
        getBeneficiaries(selectedOrganization.id),
        getVolunteers(selectedOrganization.id),
        getImpactMetrics(selectedOrganization.id),
        getAuditLogs(selectedOrganization.id, 10),
        getEducationSummary(selectedOrganization.id),
        getEducationReport(selectedOrganization.id),
        getEducationClasses(selectedOrganization.id),
        getStudents(selectedOrganization.id),
        getStaffMembers(selectedOrganization.id),
        getFinanceEntries(selectedOrganization.id),
        getBoardingSummary(selectedOrganization.id),
        getBoardingResidents(selectedOrganization.id),
        getBoardingReport(selectedOrganization.id),
        getBoardingMonthlyReport(selectedOrganization.id),
        getBoardingSupervisorDashboard(selectedOrganization.id),
      ]);

      setOrganization(selectedOrganization);
      setDashboard(dashboardData);
      setPrograms(programsData);
      setBeneficiaries(beneficiariesData);
      setVolunteers(volunteersData);
      setMetrics(metricsData);
      setAuditLogs(auditLogsData);
      setEducationSummary(educationSummaryData);
      setEducationReport(educationReportData);
      setEducationClasses(educationClassesData);
      setStudents(studentsData);
      setStaffMembers(staffData);
      setFinanceEntries(financeData);
      setBoardingSummary(boardingSummaryData);
      setBoardingResidents(boardingResidentsData);
      setBoardingReport(boardingReportData);
      setBoardingMonthlyReport(boardingMonthlyReportData);
      setBoardingSupervisorDashboard(boardingSupervisorDashboardData);
      const residentId = selectedBoardingResidentId || boardingResidentsData[0]?.id || '';
      setSelectedBoardingResidentId(residentId);
      setBoardingCheckInForm((current) => ({ ...current, residentId: current.residentId || residentId }));
      setBoardingCheckIns(residentId ? await getBoardingCheckIns(selectedOrganization.id, residentId) : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تحميل بيانات لوحة التحكم');
    } finally {
      setLoading(false);
    }
  }, [selectedBoardingResidentId]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const impactScore = useMemo(() => {
    if (!metrics.length) return 0;
    return Math.round(metrics.reduce((total, metric) => total + percent(metric.current, metric.target), 0) / metrics.length);
  }, [metrics]);

  const requireOrg = () => {
    if (!organization) {
      setError('لا توجد مؤسسة محملة. تأكد من تشغيل API.');
      return null;
    }
    return organization;
  };

  const submitProgram = async (event: FormEvent) => {
    event.preventDefault();
    const org = requireOrg();
    if (!org) return;
    if (!canEdit) {
      setError('ليس لديك صلاحية تنفيذ هذا الإجراء في النسخة التجريبية.');
      return;
    }
    setSaving('program');
    try {
      await createProgram(org.id, {
        name: programForm.name,
        manager: programForm.manager || 'فريق التشغيل',
        progress: Number(programForm.progress || 0),
        status: 'active',
      });
      setProgramForm({ name: '', manager: '', progress: '0' });
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إضافة البرنامج');
    } finally {
      setSaving(null);
    }
  };

  const submitBeneficiary = async (event: FormEvent) => {
    event.preventDefault();
    const org = requireOrg();
    if (!org) return;
    if (!canEdit) {
      setError('ليس لديك صلاحية تنفيذ هذا الإجراء في النسخة التجريبية.');
      return;
    }
    setSaving('beneficiary');
    try {
      await createBeneficiary(org.id, {
        name: beneficiaryForm.name,
        city: beneficiaryForm.city,
        programId: beneficiaryForm.programId || undefined,
        status: 'active',
      });
      setBeneficiaryForm({ name: '', city: '', programId: '' });
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إضافة المستفيد');
    } finally {
      setSaving(null);
    }
  };

  const submitVolunteer = async (event: FormEvent) => {
    event.preventDefault();
    const org = requireOrg();
    if (!org) return;
    if (!canEdit) {
      setError('ليس لديك صلاحية تنفيذ هذا الإجراء في النسخة التجريبية.');
      return;
    }
    setSaving('volunteer');
    try {
      await createVolunteer(org.id, {
        name: volunteerForm.name,
        skill: volunteerForm.skill,
        totalHours: Number(volunteerForm.totalHours || 0),
        programId: volunteerForm.programId || undefined,
        status: 'available',
      });
      setVolunteerForm({ name: '', skill: '', totalHours: '0', programId: '' });
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إضافة المتطوع');
    } finally {
      setSaving(null);
    }
  };

  const submitMetric = async (event: FormEvent) => {
    event.preventDefault();
    const org = requireOrg();
    if (!org) return;
    if (!canEdit) {
      setError('ليس لديك صلاحية تنفيذ هذا الإجراء في النسخة التجريبية.');
      return;
    }
    setSaving('metric');
    try {
      await createImpactMetric(org.id, {
        name: metricForm.name,
        key: metricForm.key,
        current: Number(metricForm.current || 0),
        target: Number(metricForm.target || 1),
        unit: metricForm.unit,
      });
      setMetricForm({ name: '', key: '', current: '0', target: '100', unit: 'عدد' });
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إضافة المؤشر');
    } finally {
      setSaving(null);
    }
  };

  const loadStudentReport = async (studentId: string) => {
    const org = requireOrg();
    if (!org) return;

    setSaving('student-report');
    try {
      const report = await getStudentReport(org.id, studentId);
      setStudentReport(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تحميل تقرير الطالب');
    } finally {
      setSaving(null);
    }
  };

  const submitStudent = async (event: FormEvent) => {
    event.preventDefault();
    const org = requireOrg();
    if (!org) return;
    if (!canEdit) {
      setError('ليس لديك صلاحية تنفيذ هذا الإجراء في النسخة التجريبية.');
      return;
    }

    setSaving('student');
    try {
      await createStudent(org.id, {
        name: studentForm.name,
        classId: studentForm.classId || undefined,
        track: studentForm.track as 'school' | 'quran' | 'hybrid',
        academicProgress: Number(studentForm.academicProgress || 0),
        quranMemorizedPages: Number(studentForm.quranMemorizedPages || 0),
        attendanceRate: Number(studentForm.attendanceRate || 100),
        tuitionStatus: studentForm.tuitionStatus as 'paid' | 'partial' | 'due' | 'scholarship',
        status: 'active',
      });
      setStudentForm({ name: '', classId: '', track: 'school', academicProgress: '0', quranMemorizedPages: '0', attendanceRate: '100', tuitionStatus: 'due' });
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إضافة الطالب');
    } finally {
      setSaving(null);
    }
  };

  const submitFinance = async (event: FormEvent) => {
    event.preventDefault();
    const org = requireOrg();
    if (!org) return;
    if (!canEdit) {
      setError('ليس لديك صلاحية تنفيذ هذا الإجراء في النسخة التجريبية.');
      return;
    }

    setSaving('finance');
    try {
      await createFinanceEntry(org.id, {
        type: financeForm.type as 'income' | 'expense',
        category: financeForm.category as 'tuition' | 'donation' | 'salary' | 'operations' | 'books' | 'transport' | 'other',
        amount: Number(financeForm.amount || 0),
        description: financeForm.description,
        date: new Date().toISOString(),
      });
      setFinanceForm({ type: 'income', category: 'tuition', amount: '0', description: '' });
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إضافة القيد المالي');
    } finally {
      setSaving(null);
    }
  };

  const submitStaff = async (event: FormEvent) => {
    event.preventDefault();
    const org = requireOrg();
    if (!org) return;
    if (!canEdit) {
      setError('ليس لديك صلاحية تنفيذ هذا الإجراء في النسخة التجريبية.');
      return;
    }

    setSaving('staff');
    try {
      await createStaffMember(org.id, {
        name: staffForm.name,
        role: staffForm.role as 'teacher' | 'quran_teacher' | 'admin' | 'accountant' | 'supervisor' | 'hr',
        department: staffForm.department as 'school' | 'quran' | 'finance' | 'hr' | 'admin',
        salary: Number(staffForm.salary || 0),
        status: 'active',
      });
      setStaffForm({ name: '', role: 'teacher', department: 'school', salary: '0' });
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إضافة المدرس/الموظف');
    } finally {
      setSaving(null);
    }
  };

  const submitBoardingResident = async (event: FormEvent) => {
    event.preventDefault();
    const org = requireOrg();
    if (!org) return;
    if (!canEdit) {
      setError('ليس لديك صلاحية تنفيذ هذا الإجراء في النسخة التجريبية.');
      return;
    }

    setSaving('boarding');
    try {
      await createBoardingResident(org.id, {
        studentId: boardingForm.studentId,
        room: boardingForm.room,
        supervisorName: boardingForm.supervisorName,
        tarbiyahScore: Number(boardingForm.tarbiyahScore || 80),
        supervisionScore: Number(boardingForm.supervisionScore || 80),
        quranRevisionScore: Number(boardingForm.quranRevisionScore || 80),
        healthStatus: boardingForm.healthStatus as 'good' | 'watch' | 'needs_attention',
        parentVisible: true,
      });
      setBoardingForm({ studentId: '', room: '', supervisorName: '', tarbiyahScore: '80', supervisionScore: '80', quranRevisionScore: '80', healthStatus: 'good' });
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إضافة طالب داخلي');
    } finally {
      setSaving(null);
    }
  };

  const submitBoardingCheckIn = async (event: FormEvent) => {
    event.preventDefault();
    const org = requireOrg();
    if (!org) return;
    if (!canEdit) {
      setError('ليس لديك صلاحية تنفيذ هذا الإجراء في النسخة التجريبية.');
      return;
    }

    const residentId = boardingCheckInForm.residentId || selectedBoardingResidentId;
    if (!residentId) {
      setError('اختر طالبًا داخليًا أولًا.');
      return;
    }

    setSaving('boarding-checkin');
    try {
      await createBoardingCheckIn(org.id, residentId, {
        date: new Date().toISOString(),
        fajrPrayer: boardingCheckInForm.fajrPrayer,
        quranSession: boardingCheckInForm.quranSession,
        memorizationPages: Number(boardingCheckInForm.memorizationPages || 0),
        revisionPages: Number(boardingCheckInForm.revisionPages || 0),
        behaviorScore: Number(boardingCheckInForm.behaviorScore || 80),
        cleanlinessScore: Number(boardingCheckInForm.cleanlinessScore || 80),
        sleepDisciplineScore: Number(boardingCheckInForm.sleepDisciplineScore || 80),
        healthStatus: boardingCheckInForm.healthStatus as 'good' | 'watch' | 'needs_attention',
        supervisorNote: boardingCheckInForm.supervisorNote,
        parentVisible: boardingCheckInForm.parentVisible,
      });
      setBoardingCheckInForm({ residentId, fajrPrayer: true, quranSession: true, memorizationPages: '1', revisionPages: '3', behaviorScore: '85', cleanlinessScore: '85', sleepDisciplineScore: '85', healthStatus: 'good', supervisorNote: '', parentVisible: false });
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إضافة متابعة الداخلي');
    } finally {
      setSaving(null);
    }
  };

  const resetStore = async () => {
    setSaving('reset');
    try {
      await resetPrototypeStore();
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إعادة التهيئة');
    } finally {
      setSaving(null);
    }
  };

  const logout = () => {
    clearStoredSession();
    window.location.hash = 'login';
  };

  const canEdit = canManage(currentUser?.role);

  const statCards = [
    { label: 'البرامج', value: dashboard?.programs ?? 0, icon: '🧭', color: 'text-amber-400' },
    { label: 'المستفيدون', value: dashboard?.beneficiaries ?? 0, icon: '🌱', color: 'text-emerald-400' },
    { label: 'المتطوعون', value: dashboard?.volunteers ?? 0, icon: '🤝', color: 'text-teal-400' },
    { label: 'ساعات التطوع', value: dashboard?.volunteerHours ?? 0, icon: '⏱️', color: 'text-blue-400' },
    { label: 'مؤشرات الأثر', value: dashboard?.metrics ?? 0, icon: '📈', color: 'text-purple-400' },
    { label: 'مؤشر عام', value: `${impactScore}%`, icon: '🎯', color: 'text-rose-400' },
  ];

  return (
    <div className={`min-h-screen text-white ${theme === 'dark' ? 'bg-[#071020]' : 'bg-[#F7F1E5]'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="fixed inset-0 islamic-pattern opacity-20 pointer-events-none" />
      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden lg:flex w-72 flex-col border-l border-amber-400/10 bg-[#0A1628]/95 backdrop-blur-xl p-5">
          <a href="#hero" className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center glow-gold">
              <span className="text-navy font-black text-xl">م</span>
            </div>
            <div>
              <div className="text-xl font-black text-gold-gradient font-arabic">مشكاة</div>
              <div className="text-xs text-teal-400 tracking-wider">Mishkat Dashboard</div>
            </div>
          </a>

          <div className="mb-5">
            <LanguageThemeControls />
          </div>

          <nav className="space-y-2 flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-400 text-navy shadow-lg'
                    : 'text-gray-400 hover:text-amber-300 hover:bg-amber-400/10'
                }`}
              >
                <span>{tab.icon}</span>
                {t(tab.labelKey)}
              </button>
            ))}
          </nav>

          <div className="space-y-3">
            <button onClick={() => void loadAll()} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-bold hover:bg-white/10 transition-colors">
              {t('dashboard.refresh')}
            </button>
            <button onClick={() => void resetStore()} disabled={saving === 'reset'} className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50">
              إعادة تهيئة البيانات
            </button>
            <button onClick={logout} className="w-full py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-bold hover:bg-orange-500/20 transition-colors">
              {t('dashboard.logout')}
            </button>
            <a href="#hero" className="block w-full text-center py-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 text-sm font-bold hover:bg-amber-400/20 transition-colors">
              {t('dashboard.back')}
            </a>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 bg-[#071020]/90 backdrop-blur-xl border-b border-amber-400/10 px-4 md:px-8 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="text-xs text-amber-400 font-bold mb-1">MANARAH OS · Mishkat MVP</div>
                <h1 className="text-2xl md:text-3xl font-black font-arabic">{organization?.name ?? 'لوحة مشكاة'}</h1>
                <p className="text-xs text-gray-500 mt-1" dir="ltr">API: {API_BASE_URL}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 lg:hidden">
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 rounded-xl text-xs font-bold ${activeTab === tab.id ? 'bg-amber-400 text-navy' : 'bg-white/5 text-gray-400'}`}>
                    {tab.icon} {t(tab.labelKey)}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <LanguageThemeControls />
                {currentUser && (
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold">
                    {currentUser.name} · {currentUser.role}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full border text-xs font-bold ${error ? 'bg-orange-500/10 text-orange-300 border-orange-500/20' : 'bg-green-500/10 text-green-300 border-green-500/20'}`}>
                  {loading ? 'تحميل...' : error ? 'تحقق من API' : 'متصل'}
                </span>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-8">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-200 text-sm font-cairo leading-relaxed">
                {error}. تأكد من تشغيل <code dir="ltr">npm run server:dev</code>.
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {statCards.map((stat) => (
                    <div key={stat.label} className="gradient-border p-5 card-hover">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">{stat.icon}</span>
                        <span className="text-xs text-gray-500">MVP</span>
                      </div>
                      <div className={`text-3xl font-black ${stat.color}`}>{typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}</div>
                      <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid xl:grid-cols-2 gap-6">
                  <div className="gradient-border p-6">
                    <h2 className="font-black text-xl mb-5">أحدث البرامج</h2>
                    <div className="space-y-4">
                      {programs.slice(0, 4).map((program) => (
                        <div key={program.id} className="p-4 rounded-xl bg-white/3 border border-white/5">
                          <div className="flex justify-between gap-4 mb-3">
                            <div>
                              <div className="font-bold">{program.name}</div>
                              <div className="text-xs text-gray-500">{program.manager} · {program.beneficiaries} مستفيد · {program.volunteers} متطوع</div>
                            </div>
                            <span className="text-xs text-teal-300">{statusLabel(program.status)}</span>
                          </div>
                          <ProgressBar value={program.progress} color="bg-teal-400" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="gradient-border p-6">
                    <h2 className="font-black text-xl mb-5">مؤشرات الأثر</h2>
                    <div className="space-y-5">
                      {metrics.map((metric) => (
                        <div key={metric.id}>
                          <div className="flex justify-between mb-2 text-sm">
                            <span>{metric.name}</span>
                            <span className="text-amber-300">{formatNumber(metric.current)} / {formatNumber(metric.target)} {metric.unit}</span>
                          </div>
                          <ProgressBar value={percent(metric.current, metric.target)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="gradient-border p-6">
                  <h2 className="font-black text-xl mb-5">آخر سجل تدقيق</h2>
                  <div className="space-y-3">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="p-3 rounded-xl bg-white/3 border border-white/5">
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span className="text-sm font-bold text-amber-300" dir="ltr">{log.action}</span>
                          <span className="text-xs text-gray-600">{new Date(log.createdAt).toLocaleString('ar-EG')}</span>
                        </div>
                        <div className="text-xs text-gray-500">{log.actorEmail ?? 'system'} · {log.entityType}</div>
                      </div>
                    ))}
                    {!auditLogs.length && <div className="text-sm text-gray-500">لا توجد سجلات بعد.</div>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'programs' && (
              <div className="grid xl:grid-cols-3 gap-6">
                <form onSubmit={submitProgram} className="gradient-border p-6 space-y-4 h-fit">
                  <h2 className="text-xl font-black">إضافة برنامج</h2>
                  <Field label="اسم البرنامج"><input required className={inputClass} value={programForm.name} onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })} /></Field>
                  <Field label="الفريق المسؤول"><input className={inputClass} value={programForm.manager} onChange={(e) => setProgramForm({ ...programForm, manager: e.target.value })} /></Field>
                  <Field label="نسبة التقدم"><input type="number" min="0" max="100" className={inputClass} value={programForm.progress} onChange={(e) => setProgramForm({ ...programForm, progress: e.target.value })} /></Field>
                  <button className="w-full py-3 rounded-xl bg-amber-400 text-navy font-black disabled:opacity-50" disabled={saving === 'program' || !canEdit}>{saving === 'program' ? 'جارٍ الحفظ...' : 'حفظ البرنامج'}</button>
                </form>
                <div className="xl:col-span-2 gradient-border p-6 overflow-hidden">
                  <h2 className="text-xl font-black mb-5">قائمة البرامج</h2>
                  <div className="space-y-3">
                    {programs.map((program) => (
                      <div key={program.id} className="p-4 rounded-xl bg-white/3 border border-white/5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                          <div>
                            <div className="font-bold">{program.name}</div>
                            <div className="text-xs text-gray-500">{program.manager} · {program.beneficiaries} مستفيد · {program.volunteers} متطوع</div>
                          </div>
                          <div className="flex gap-2">
                            <button disabled={!canEdit} onClick={() => canEdit && organization && void updateProgram(organization.id, program.id, { progress: Math.min(program.progress + 10, 100) }).then(loadAll)} className="px-3 py-1 rounded-lg bg-teal-400/10 text-teal-300 text-xs">+10%</button>
                            <button disabled={!canEdit} onClick={() => canEdit && organization && void deleteProgram(organization.id, program.id).then(loadAll)} className="px-3 py-1 rounded-lg bg-red-500/10 text-red-300 text-xs">حذف</button>
                          </div>
                        </div>
                        <ProgressBar value={program.progress} color="bg-teal-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'beneficiaries' && (
              <div className="grid xl:grid-cols-3 gap-6">
                <form onSubmit={submitBeneficiary} className="gradient-border p-6 space-y-4 h-fit">
                  <h2 className="text-xl font-black">إضافة مستفيد</h2>
                  <Field label="اسم المستفيد"><input required className={inputClass} value={beneficiaryForm.name} onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, name: e.target.value })} /></Field>
                  <Field label="المدينة"><input className={inputClass} value={beneficiaryForm.city} onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, city: e.target.value })} /></Field>
                  <Field label="البرنامج"><select className={selectClass} value={beneficiaryForm.programId} onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, programId: e.target.value })}><option value="">بدون برنامج</option>{programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}</select></Field>
                  <button className="w-full py-3 rounded-xl bg-emerald-400 text-navy font-black disabled:opacity-50" disabled={saving === 'beneficiary' || !canEdit}>{saving === 'beneficiary' ? 'جارٍ الحفظ...' : 'حفظ المستفيد'}</button>
                </form>
                <div className="xl:col-span-2 gradient-border p-6">
                  <h2 className="text-xl font-black mb-5">قائمة المستفيدين</h2>
                  <div className="space-y-3">
                    {beneficiaries.map((item) => (
                      <div key={item.id} className="grid md:grid-cols-5 gap-3 items-center p-4 rounded-xl bg-white/3 border border-white/5 text-sm">
                        <span className="font-bold">{item.name}</span>
                        <span className="text-gray-500 md:col-span-2">{item.program}</span>
                        <span className="text-green-300">{statusLabel(item.status)}</span>
                        <div className="flex gap-2 md:justify-end">
                          <button disabled={!canEdit} onClick={() => canEdit && organization && void updateBeneficiary(organization.id, item.id, { status: item.status === 'follow_up' ? 'active' : 'follow_up' }).then(loadAll)} className="px-3 py-1 rounded-lg bg-amber-400/10 text-amber-300 text-xs">متابعة</button>
                          <button disabled={!canEdit} onClick={() => canEdit && organization && void deleteBeneficiary(organization.id, item.id).then(loadAll)} className="px-3 py-1 rounded-lg bg-red-500/10 text-red-300 text-xs">حذف</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'volunteers' && (
              <div className="grid xl:grid-cols-3 gap-6">
                <form onSubmit={submitVolunteer} className="gradient-border p-6 space-y-4 h-fit">
                  <h2 className="text-xl font-black">إضافة متطوع</h2>
                  <Field label="اسم المتطوع"><input required className={inputClass} value={volunteerForm.name} onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })} /></Field>
                  <Field label="المهارة"><input className={inputClass} value={volunteerForm.skill} onChange={(e) => setVolunteerForm({ ...volunteerForm, skill: e.target.value })} /></Field>
                  <Field label="الساعات"><input type="number" min="0" className={inputClass} value={volunteerForm.totalHours} onChange={(e) => setVolunteerForm({ ...volunteerForm, totalHours: e.target.value })} /></Field>
                  <Field label="البرنامج"><select className={selectClass} value={volunteerForm.programId} onChange={(e) => setVolunteerForm({ ...volunteerForm, programId: e.target.value })}><option value="">بدون برنامج</option>{programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}</select></Field>
                  <button className="w-full py-3 rounded-xl bg-teal-400 text-navy font-black disabled:opacity-50" disabled={saving === 'volunteer' || !canEdit}>{saving === 'volunteer' ? 'جارٍ الحفظ...' : 'حفظ المتطوع'}</button>
                </form>
                <div className="xl:col-span-2 gradient-border p-6">
                  <h2 className="text-xl font-black mb-5">قائمة المتطوعين</h2>
                  <div className="space-y-3">
                    {volunteers.map((item) => (
                      <div key={item.id} className="grid md:grid-cols-5 gap-3 items-center p-4 rounded-xl bg-white/3 border border-white/5 text-sm">
                        <span className="font-bold">{item.name}</span>
                        <span className="text-gray-500">{item.skill ?? 'مهارة عامة'}</span>
                        <span className="text-amber-300">{formatNumber(item.totalHours)} ساعة</span>
                        <span className="text-teal-300">{statusLabel(item.status)}</span>
                        <div className="flex gap-2 md:justify-end">
                          <button disabled={!canEdit} onClick={() => canEdit && organization && void updateVolunteer(organization.id, item.id, { totalHours: item.totalHours + 1 }).then(loadAll)} className="px-3 py-1 rounded-lg bg-teal-400/10 text-teal-300 text-xs">+ساعة</button>
                          <button disabled={!canEdit} onClick={() => canEdit && organization && void deleteVolunteer(organization.id, item.id).then(loadAll)} className="px-3 py-1 rounded-lg bg-red-500/10 text-red-300 text-xs">حذف</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'impact' && (
              <div className="grid xl:grid-cols-3 gap-6">
                <form onSubmit={submitMetric} className="gradient-border p-6 space-y-4 h-fit">
                  <h2 className="text-xl font-black">إضافة مؤشر أثر</h2>
                  <Field label="اسم المؤشر"><input required className={inputClass} value={metricForm.name} onChange={(e) => setMetricForm({ ...metricForm, name: e.target.value })} /></Field>
                  <Field label="المفتاح التقني"><input required className={inputClass} value={metricForm.key} onChange={(e) => setMetricForm({ ...metricForm, key: e.target.value })} placeholder="example_metric" /></Field>
                  <div className="grid grid-cols-3 gap-2">
                    <Field label="الحالي"><input type="number" min="0" className={inputClass} value={metricForm.current} onChange={(e) => setMetricForm({ ...metricForm, current: e.target.value })} /></Field>
                    <Field label="الهدف"><input type="number" min="1" className={inputClass} value={metricForm.target} onChange={(e) => setMetricForm({ ...metricForm, target: e.target.value })} /></Field>
                    <Field label="الوحدة"><input className={inputClass} value={metricForm.unit} onChange={(e) => setMetricForm({ ...metricForm, unit: e.target.value })} /></Field>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-purple-400 text-navy font-black disabled:opacity-50" disabled={saving === 'metric' || !canEdit}>{saving === 'metric' ? 'جارٍ الحفظ...' : 'حفظ المؤشر'}</button>
                </form>
                <div className="xl:col-span-2 gradient-border p-6">
                  <h2 className="text-xl font-black mb-5">قائمة المؤشرات</h2>
                  <div className="space-y-5">
                    {metrics.map((metric) => (
                      <div key={metric.id} className="p-4 rounded-xl bg-white/3 border border-white/5">
                        <div className="flex flex-col md:flex-row md:justify-between gap-3 mb-3">
                          <div>
                            <div className="font-bold">{metric.name}</div>
                            <div className="text-xs text-gray-500" dir="ltr">{metric.key}</div>
                          </div>
                          <div className="flex gap-2">
                            <button disabled={!canEdit} onClick={() => canEdit && organization && void updateImpactMetric(organization.id, metric.id, { current: metric.current + 1 }).then(loadAll)} className="px-3 py-1 rounded-lg bg-purple-400/10 text-purple-300 text-xs">+1</button>
                            <button disabled={!canEdit} onClick={() => canEdit && organization && void deleteImpactMetric(organization.id, metric.id).then(loadAll)} className="px-3 py-1 rounded-lg bg-red-500/10 text-red-300 text-xs">حذف</button>
                          </div>
                        </div>
                        <div className="flex justify-between mb-2 text-xs text-gray-400">
                          <span>{formatNumber(metric.current)} / {formatNumber(metric.target)} {metric.unit}</span>
                          <span>{percent(metric.current, metric.target)}%</span>
                        </div>
                        <ProgressBar value={percent(metric.current, metric.target)} color="bg-purple-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { label: 'الفصول والحلقات', value: educationSummary?.classes ?? 0, icon: '🏫', color: 'text-amber-400' },
                    { label: 'الطلاب', value: educationSummary?.students ?? 0, icon: '🎓', color: 'text-emerald-400' },
                    { label: 'المعلمون والموظفون', value: educationSummary?.staff ?? 0, icon: '👥', color: 'text-teal-400' },
                    { label: 'الرصيد المالي', value: educationSummary?.balance ?? 0, icon: '💰', color: 'text-purple-400' },
                  ].map((stat) => (
                    <div key={stat.label} className="gradient-border p-5 card-hover">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">{stat.icon}</span>
                        <span className="text-xs text-gray-500">تعليم</span>
                      </div>
                      <div className={`text-3xl font-black ${stat.color}`}>{formatNumber(stat.value)}</div>
                      <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {educationReport && (
                  <div className="grid xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 gradient-border p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                        <div>
                          <h2 className="text-xl font-black">{educationReport.title}</h2>
                          <p className="text-xs text-gray-500 mt-1">تم التوليد: {new Date(educationReport.generatedAt).toLocaleString('ar-EG')}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-blue-400/10 text-blue-300 border border-blue-400/20 text-xs font-bold">تقرير أولي</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-bold text-emerald-300 mb-3">أبرز النتائج</h3>
                          <div className="space-y-2">
                            {educationReport.highlights.map((item) => (
                              <div key={item} className="p-3 rounded-xl bg-white/3 border border-white/5 text-sm text-gray-300">{item}</div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-amber-300 mb-3">التوصيات</h3>
                          <div className="space-y-2">
                            {educationReport.recommendations.map((item) => (
                              <div key={item} className="p-3 rounded-xl bg-white/3 border border-white/5 text-sm text-gray-300">{item}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="gradient-border p-6">
                      <h3 className="font-bold text-red-300 mb-3">تنبيهات وملاحظات مالية</h3>
                      <div className="space-y-2 mb-5">
                        {educationReport.risks.map((item) => (
                          <div key={item} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-100">{item}</div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {educationReport.financialNotes.map((item) => (
                          <div key={item} className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-100">{item}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 gradient-border p-6">
                    <h2 className="text-xl font-black mb-5">إدارة المدارس ودور التحفيظ</h2>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                        <div className="text-xs text-gray-500 mb-1">متوسط التقدم العلمي</div>
                        <div className="text-2xl font-black text-emerald-400">{educationSummary?.averageAcademicProgress ?? 0}%</div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                        <div className="text-xs text-gray-500 mb-1">متوسط صفحات الحفظ</div>
                        <div className="text-2xl font-black text-amber-400">{educationSummary?.averageQuranPages ?? 0}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                        <div className="text-xs text-gray-500 mb-1">نسبة الحضور</div>
                        <div className="text-2xl font-black text-teal-400">{educationSummary?.attendanceRate ?? 0}%</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {educationClasses.map((classItem) => (
                        <div key={classItem.id} className="p-4 rounded-xl bg-white/3 border border-white/5">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                            <div>
                              <div className="font-bold">{classItem.name}</div>
                              <div className="text-xs text-gray-500">{classItem.teacherName} · {classItem.level} · {classItem.studentsCount} طالب</div>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${classItem.track === 'quran' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-amber-400/10 text-amber-300'}`}>
                              {classItem.track === 'quran' ? 'دار تحفيظ' : classItem.track === 'hybrid' ? 'مدرسة + تحفيظ' : 'مدرسة'}
                            </span>
                          </div>
                          <ProgressBar value={classItem.averageProgress} color={classItem.track === 'quran' ? 'bg-emerald-400' : 'bg-amber-400'} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="gradient-border p-6">
                    <h2 className="text-xl font-black mb-5">الماليات والموارد البشرية</h2>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm">
                        <span>الإيرادات</span><span className="text-green-300 font-bold">{formatNumber(educationSummary?.income ?? 0)}</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm">
                        <span>المصروفات</span><span className="text-red-300 font-bold">{formatNumber(educationSummary?.expenses ?? 0)}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {staffMembers.slice(0, 4).map((staff) => (
                        <div key={staff.id} className="p-3 rounded-xl bg-white/3 border border-white/5 text-sm">
                          <div className="font-bold">{staff.name}</div>
                          <div className="text-xs text-gray-500">{staff.department} · {staff.role} · {formatNumber(staff.salary)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {studentReport && (
                  <div className="gradient-border p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                      <div>
                        <h2 className="text-xl font-black">{studentReport.title}</h2>
                        <p className="text-xs text-gray-500 mt-1">{studentReport.student.className} · تم التوليد: {new Date(studentReport.generatedAt).toLocaleString('ar-EG')}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-bold">تقرير طالب</span>
                    </div>
                    <div className="grid md:grid-cols-4 gap-3 mb-5">
                      <div className="p-3 rounded-xl bg-white/3 border border-white/5"><div className="text-xs text-gray-500">التقدم العلمي</div><div className="text-2xl font-black text-blue-400">{studentReport.progress.academicProgress}%</div></div>
                      <div className="p-3 rounded-xl bg-white/3 border border-white/5"><div className="text-xs text-gray-500">صفحات الحفظ</div><div className="text-2xl font-black text-amber-400">{studentReport.progress.quranMemorizedPages}</div></div>
                      <div className="p-3 rounded-xl bg-white/3 border border-white/5"><div className="text-xs text-gray-500">الحضور</div><div className="text-2xl font-black text-teal-400">{studentReport.progress.attendanceRate}%</div></div>
                      <div className="p-3 rounded-xl bg-white/3 border border-white/5"><div className="text-xs text-gray-500">المصروفات</div><div className="text-lg font-black text-purple-400">{studentReport.progress.tuitionStatus}</div></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-bold text-red-300 mb-3">تنبيهات</h3>
                        <div className="space-y-2">{studentReport.alerts.map((item) => <div key={item} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-100">{item}</div>)}</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-emerald-300 mb-3">توصيات</h3>
                        <div className="space-y-2">{studentReport.recommendations.map((item) => <div key={item} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-100">{item}</div>)}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid xl:grid-cols-2 gap-6">
                  <div className="gradient-border p-6">
                    <h2 className="text-xl font-black mb-5">تقدم الطلاب العلمي والقرآني</h2>
                    <div className="space-y-3">
                      {students.slice(0, 6).map((student) => (
                        <div key={student.id} className="p-4 rounded-xl bg-white/3 border border-white/5">
                          <div className="flex justify-between gap-3 mb-2">
                            <div>
                              <div className="font-bold">{student.name}</div>
                              <div className="text-xs text-gray-500">{student.className} · حضور {student.attendanceRate}%</div>
                            </div>
                            <div className="text-left text-xs text-amber-300">{student.quranMemorizedPages} صفحة</div>
                          </div>
                          <ProgressBar value={student.academicProgress} color="bg-blue-400" />
                          <button onClick={() => void loadStudentReport(student.id)} className="mt-3 px-3 py-1 rounded-lg bg-blue-400/10 text-blue-300 text-xs font-bold">عرض تقرير الطالب</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="gradient-border p-6 space-y-5">
                    <form onSubmit={submitStudent} className="space-y-3">
                      <h2 className="text-xl font-black">إضافة طالب سريعًا</h2>
                      <input required className={inputClass} placeholder="اسم الطالب" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} />
                      <select className={selectClass} value={studentForm.classId} onChange={(e) => setStudentForm({ ...studentForm, classId: e.target.value })}>
                        <option value="">اختر الفصل/الحلقة</option>
                        {educationClasses.map((classItem) => <option key={classItem.id} value={classItem.id}>{classItem.name}</option>)}
                      </select>
                      <div className="grid grid-cols-3 gap-2">
                        <input type="number" min="0" max="100" className={inputClass} placeholder="تقدم" value={studentForm.academicProgress} onChange={(e) => setStudentForm({ ...studentForm, academicProgress: e.target.value })} />
                        <input type="number" min="0" className={inputClass} placeholder="صفحات" value={studentForm.quranMemorizedPages} onChange={(e) => setStudentForm({ ...studentForm, quranMemorizedPages: e.target.value })} />
                        <select className={selectClass} value={studentForm.track} onChange={(e) => setStudentForm({ ...studentForm, track: e.target.value })}>
                          <option value="school">مدرسة</option>
                          <option value="quran">تحفيظ</option>
                          <option value="hybrid">كلاهما</option>
                        </select>
                      </div>
                      <button disabled={!canEdit || saving === 'student'} className="w-full py-3 rounded-xl bg-blue-400 text-navy font-black disabled:opacity-50">{saving === 'student' ? 'جارٍ الحفظ...' : 'إضافة طالب'}</button>
                    </form>

                    <form onSubmit={submitFinance} className="space-y-3 border-t border-white/10 pt-5">
                      <h2 className="text-xl font-black">إضافة قيد مالي</h2>
                      <div className="grid grid-cols-2 gap-2">
                        <select className={selectClass} value={financeForm.type} onChange={(e) => setFinanceForm({ ...financeForm, type: e.target.value })}>
                          <option value="income">إيراد</option>
                          <option value="expense">مصروف</option>
                        </select>
                        <input type="number" min="0" className={inputClass} placeholder="المبلغ" value={financeForm.amount} onChange={(e) => setFinanceForm({ ...financeForm, amount: e.target.value })} />
                      </div>
                      <input required className={inputClass} placeholder="الوصف" value={financeForm.description} onChange={(e) => setFinanceForm({ ...financeForm, description: e.target.value })} />
                      <button disabled={!canEdit || saving === 'finance'} className="w-full py-3 rounded-xl bg-green-400 text-navy font-black disabled:opacity-50">{saving === 'finance' ? 'جارٍ الحفظ...' : 'إضافة قيد مالي'}</button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'boarding' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-100 text-sm leading-relaxed">
                  هذا القسم مخصص لإدارة الداخلي في دور التحفيظ للبنين فقط. البنات لا يوجد لهن نظام داخلي في هذا النموذج، ودور ولي الأمر يقتصر على متابعة النتائج العامة دون تفاصيل الإشراف الداخلي.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { label: 'طلاب داخلي', value: boardingSummary?.residents ?? 0, icon: '🛏️', color: 'text-amber-400' },
                    { label: 'الغرف', value: boardingSummary?.rooms ?? 0, icon: '🚪', color: 'text-teal-400' },
                    { label: 'متوسط التربية', value: `${boardingSummary?.averageTarbiyahScore ?? 0}%`, icon: '🧭', color: 'text-emerald-400' },
                    { label: 'مراجعة القرآن', value: `${boardingSummary?.averageQuranRevisionScore ?? 0}%`, icon: '📖', color: 'text-purple-400' },
                  ].map((stat) => (
                    <div key={stat.label} className="gradient-border p-5 card-hover">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">{stat.icon}</span>
                        <span className="text-xs text-gray-500">داخلي</span>
                      </div>
                      <div className={`text-3xl font-black ${stat.color}`}>{typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}</div>
                      <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {boardingReport && (
                  <div className="grid xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 gradient-border p-6">
                      <h2 className="text-xl font-black mb-5">{boardingReport.title}</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-bold text-emerald-300 mb-3">أبرز النتائج</h3>
                          <div className="space-y-2">{boardingReport.highlights.map((item) => <div key={item} className="p-3 rounded-xl bg-white/3 border border-white/5 text-sm text-gray-300">{item}</div>)}</div>
                        </div>
                        <div>
                          <h3 className="font-bold text-amber-300 mb-3">توصيات التربية والإشراف</h3>
                          <div className="space-y-2">{boardingReport.tarbiyahRecommendations.map((item) => <div key={item} className="p-3 rounded-xl bg-white/3 border border-white/5 text-sm text-gray-300">{item}</div>)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="gradient-border p-6">
                      <h3 className="font-bold text-red-300 mb-3">ملاحظات الإشراف</h3>
                      <div className="space-y-2 mb-5">{boardingReport.supervisionNotes.map((item) => <div key={item} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-100">{item}</div>)}</div>
                      <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-100">{boardingReport.parentVisibilityPolicy}</div>
                    </div>
                  </div>
                )}

                {boardingMonthlyReport && (
                  <div className="grid xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 gradient-border p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                        <div>
                          <h2 className="text-xl font-black">{boardingMonthlyReport.title}</h2>
                          <p className="text-xs text-gray-500 mt-1">الشهر: {boardingMonthlyReport.month} · أيام المتابعة: {boardingMonthlyReport.daysTracked}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-purple-400/10 text-purple-300 border border-purple-400/20 text-xs font-bold">تقرير شهري</span>
                      </div>
                      <div className="grid md:grid-cols-4 gap-3 mb-5">
                        <div className="p-3 rounded-xl bg-white/3 border border-white/5"><div className="text-xs text-gray-500">حضور الفجر</div><div className="text-2xl font-black text-amber-400">{boardingMonthlyReport.fajrAttendanceRate}%</div></div>
                        <div className="p-3 rounded-xl bg-white/3 border border-white/5"><div className="text-xs text-gray-500">حضور الحلقة</div><div className="text-2xl font-black text-emerald-400">{boardingMonthlyReport.quranSessionAttendanceRate}%</div></div>
                        <div className="p-3 rounded-xl bg-white/3 border border-white/5"><div className="text-xs text-gray-500">صفحات الحفظ</div><div className="text-2xl font-black text-blue-400">{boardingMonthlyReport.totalMemorizationPages}</div></div>
                        <div className="p-3 rounded-xl bg-white/3 border border-white/5"><div className="text-xs text-gray-500">صفحات المراجعة</div><div className="text-2xl font-black text-purple-400">{boardingMonthlyReport.totalRevisionPages}</div></div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3">
                        <div><div className="text-xs text-gray-500 mb-1">متوسط السلوك</div><ProgressBar value={boardingMonthlyReport.averageBehaviorScore} color="bg-emerald-400" /></div>
                        <div><div className="text-xs text-gray-500 mb-1">متوسط النظافة</div><ProgressBar value={boardingMonthlyReport.averageCleanlinessScore} color="bg-teal-400" /></div>
                        <div><div className="text-xs text-gray-500 mb-1">انضباط النوم</div><ProgressBar value={boardingMonthlyReport.averageSleepDisciplineScore} color="bg-purple-400" /></div>
                      </div>
                    </div>
                    <div className="gradient-border p-6">
                      <h3 className="font-bold text-amber-300 mb-3">توصيات المشرف</h3>
                      <div className="space-y-2 mb-5">{boardingMonthlyReport.supervisorRecommendations.map((item) => <div key={item} className="p-3 rounded-xl bg-white/3 border border-white/5 text-sm text-gray-300">{item}</div>)}</div>
                      <h3 className="font-bold text-blue-300 mb-3">ملخص آمن لولي الأمر</h3>
                      <div className="space-y-2">{boardingMonthlyReport.parentSafeSummary.map((item) => <div key={item} className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-100">{item}</div>)}</div>
                    </div>
                  </div>
                )}

                <div className="grid xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 gradient-border p-6">
                    <h2 className="text-xl font-black mb-5">طلاب الداخلي للبنين</h2>
                    <div className="space-y-4">
                      {boardingResidents.map((resident) => (
                        <div key={resident.id} className="p-4 rounded-xl bg-white/3 border border-white/5">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                            <div>
                              <div className="font-bold">{resident.studentName}</div>
                              <div className="text-xs text-gray-500">{resident.className} · {resident.room} · {resident.supervisorName}</div>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${resident.healthStatus === 'good' ? 'bg-green-400/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                              {resident.healthStatus === 'good' ? 'مستقر' : 'يحتاج متابعة'}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-3 gap-3">
                            <div><div className="text-xs text-gray-500 mb-1">تربية</div><ProgressBar value={resident.tarbiyahScore} color="bg-emerald-400" /></div>
                            <div><div className="text-xs text-gray-500 mb-1">إشراف</div><ProgressBar value={resident.supervisionScore} color="bg-teal-400" /></div>
                            <div><div className="text-xs text-gray-500 mb-1">مراجعة قرآن</div><ProgressBar value={resident.quranRevisionScore} color="bg-purple-400" /></div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedBoardingResidentId(resident.id);
                              setBoardingCheckInForm((current) => ({ ...current, residentId: resident.id }));
                              organization && void getBoardingCheckIns(organization.id, resident.id).then(setBoardingCheckIns);
                            }}
                            className="mt-3 px-3 py-1 rounded-lg bg-amber-400/10 text-amber-300 text-xs font-bold"
                          >
                            متابعة يومية
                          </button>
                        </div>
                      ))}
                      {!boardingResidents.length && <div className="text-gray-500 text-sm">لا يوجد طلاب داخلي مسجلون.</div>}
                    </div>
                  </div>

                  <form onSubmit={submitBoardingResident} className="gradient-border p-6 space-y-3 h-fit">
                    <h2 className="text-xl font-black">إضافة طالب داخلي</h2>
                    <select required className={selectClass} value={boardingForm.studentId} onChange={(e) => setBoardingForm({ ...boardingForm, studentId: e.target.value })}>
                      <option value="">اختر طالبًا من طلاب التحفيظ/الهجين</option>
                      {students.filter((student) => student.track === 'quran' || student.track === 'hybrid').map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
                    </select>
                    <input required className={inputClass} placeholder="الغرفة" value={boardingForm.room} onChange={(e) => setBoardingForm({ ...boardingForm, room: e.target.value })} />
                    <input required className={inputClass} placeholder="المشرف التربوي" value={boardingForm.supervisorName} onChange={(e) => setBoardingForm({ ...boardingForm, supervisorName: e.target.value })} />
                    <div className="grid grid-cols-3 gap-2">
                      <input type="number" min="0" max="100" className={inputClass} placeholder="تربية" value={boardingForm.tarbiyahScore} onChange={(e) => setBoardingForm({ ...boardingForm, tarbiyahScore: e.target.value })} />
                      <input type="number" min="0" max="100" className={inputClass} placeholder="إشراف" value={boardingForm.supervisionScore} onChange={(e) => setBoardingForm({ ...boardingForm, supervisionScore: e.target.value })} />
                      <input type="number" min="0" max="100" className={inputClass} placeholder="مراجعة" value={boardingForm.quranRevisionScore} onChange={(e) => setBoardingForm({ ...boardingForm, quranRevisionScore: e.target.value })} />
                    </div>
                    <select className={selectClass} value={boardingForm.healthStatus} onChange={(e) => setBoardingForm({ ...boardingForm, healthStatus: e.target.value })}>
                      <option value="good">مستقر</option>
                      <option value="watch">متابعة</option>
                      <option value="needs_attention">يحتاج انتباه</option>
                    </select>
                    <button disabled={!canEdit || saving === 'boarding'} className="w-full py-3 rounded-xl bg-amber-400 text-navy font-black disabled:opacity-50">{saving === 'boarding' ? 'جارٍ الحفظ...' : 'إضافة للداخلي'}</button>
                  </form>
                </div>

                <div className="grid xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 gradient-border p-6">
                    <h2 className="text-xl font-black mb-5">سجل المتابعة اليومية</h2>
                    <div className="space-y-3">
                      {boardingCheckIns.map((checkIn) => (
                        <div key={checkIn.id} className="p-4 rounded-xl bg-white/3 border border-white/5">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                            <div>
                              <div className="font-bold">{checkIn.residentName}</div>
                              <div className="text-xs text-gray-500">{new Date(checkIn.date).toLocaleDateString('ar-EG')} · {checkIn.room} · {checkIn.supervisorName}</div>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${checkIn.parentVisible ? 'bg-blue-400/10 text-blue-300' : 'bg-gray-500/10 text-gray-400'}`}>
                              {checkIn.parentVisible ? 'ظاهر لولي الأمر' : 'داخلي فقط'}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-4 gap-3 text-xs text-gray-400 mb-3">
                            <span>الفجر: {checkIn.fajrPrayer ? 'نعم' : 'لا'}</span>
                            <span>الحلقة: {checkIn.quranSession ? 'نعم' : 'لا'}</span>
                            <span>حفظ: {checkIn.memorizationPages} صفحات</span>
                            <span>مراجعة: {checkIn.revisionPages} صفحات</span>
                          </div>
                          <div className="grid md:grid-cols-3 gap-3">
                            <div><div className="text-xs text-gray-500 mb-1">السلوك</div><ProgressBar value={checkIn.behaviorScore} color="bg-emerald-400" /></div>
                            <div><div className="text-xs text-gray-500 mb-1">النظافة</div><ProgressBar value={checkIn.cleanlinessScore} color="bg-teal-400" /></div>
                            <div><div className="text-xs text-gray-500 mb-1">النوم</div><ProgressBar value={checkIn.sleepDisciplineScore} color="bg-purple-400" /></div>
                          </div>
                          {checkIn.supervisorNote && <div className="mt-3 text-sm text-gray-300 bg-[#071020]/60 p-3 rounded-xl">{checkIn.supervisorNote}</div>}
                        </div>
                      ))}
                      {!boardingCheckIns.length && <div className="text-sm text-gray-500">اختر طالبًا داخليًا أو أضف متابعة يومية.</div>}
                    </div>
                  </div>

                  <form onSubmit={submitBoardingCheckIn} className="gradient-border p-6 space-y-3 h-fit">
                    <h2 className="text-xl font-black">إضافة متابعة يومية</h2>
                    <select required className={selectClass} value={boardingCheckInForm.residentId || selectedBoardingResidentId} onChange={(e) => { setSelectedBoardingResidentId(e.target.value); setBoardingCheckInForm({ ...boardingCheckInForm, residentId: e.target.value }); organization && void getBoardingCheckIns(organization.id, e.target.value).then(setBoardingCheckIns); }}>
                      <option value="">اختر طالب داخلي</option>
                      {boardingResidents.map((resident) => <option key={resident.id} value={resident.id}>{resident.studentName}</option>)}
                    </select>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                      <label className="flex items-center gap-2"><input type="checkbox" checked={boardingCheckInForm.fajrPrayer} onChange={(e) => setBoardingCheckInForm({ ...boardingCheckInForm, fajrPrayer: e.target.checked })} /> صلاة الفجر</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={boardingCheckInForm.quranSession} onChange={(e) => setBoardingCheckInForm({ ...boardingCheckInForm, quranSession: e.target.checked })} /> حضور الحلقة</label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" min="0" className={inputClass} placeholder="صفحات الحفظ" value={boardingCheckInForm.memorizationPages} onChange={(e) => setBoardingCheckInForm({ ...boardingCheckInForm, memorizationPages: e.target.value })} />
                      <input type="number" min="0" className={inputClass} placeholder="صفحات المراجعة" value={boardingCheckInForm.revisionPages} onChange={(e) => setBoardingCheckInForm({ ...boardingCheckInForm, revisionPages: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="number" min="0" max="100" className={inputClass} placeholder="سلوك" value={boardingCheckInForm.behaviorScore} onChange={(e) => setBoardingCheckInForm({ ...boardingCheckInForm, behaviorScore: e.target.value })} />
                      <input type="number" min="0" max="100" className={inputClass} placeholder="نظافة" value={boardingCheckInForm.cleanlinessScore} onChange={(e) => setBoardingCheckInForm({ ...boardingCheckInForm, cleanlinessScore: e.target.value })} />
                      <input type="number" min="0" max="100" className={inputClass} placeholder="نوم" value={boardingCheckInForm.sleepDisciplineScore} onChange={(e) => setBoardingCheckInForm({ ...boardingCheckInForm, sleepDisciplineScore: e.target.value })} />
                    </div>
                    <textarea className={inputClass} placeholder="ملاحظة المشرف الداخلية" value={boardingCheckInForm.supervisorNote} onChange={(e) => setBoardingCheckInForm({ ...boardingCheckInForm, supervisorNote: e.target.value })} />
                    <label className="flex items-center gap-2 text-sm text-gray-300"><input type="checkbox" checked={boardingCheckInForm.parentVisible} onChange={(e) => setBoardingCheckInForm({ ...boardingCheckInForm, parentVisible: e.target.checked })} /> إظهار ملخصها لولي الأمر</label>
                    <button disabled={!canEdit || saving === 'boarding-checkin'} className="w-full py-3 rounded-xl bg-purple-400 text-navy font-black disabled:opacity-50">{saving === 'boarding-checkin' ? 'جارٍ الحفظ...' : 'حفظ المتابعة اليومية'}</button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'supervisor' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { label: 'طلاب المشرف', value: boardingSupervisorDashboard?.students.length ?? 0, icon: '🧑‍🏫', color: 'text-amber-400' },
                    { label: 'متابعات اليوم', value: boardingSupervisorDashboard?.todayCheckIns.length ?? 0, icon: '✅', color: 'text-emerald-400' },
                    { label: 'بدون متابعة', value: boardingSupervisorDashboard?.studentsWithoutTodayCheckIn.length ?? 0, icon: '⏳', color: 'text-orange-400' },
                    { label: 'تنبيهات صحية', value: boardingSupervisorDashboard?.healthAttention.length ?? 0, icon: '🩺', color: 'text-red-400' },
                  ].map((stat) => (
                    <div key={stat.label} className="gradient-border p-5 card-hover">
                      <div className="flex items-center justify-between mb-4"><span className="text-3xl">{stat.icon}</span><span className="text-xs text-gray-500">مشرف</span></div>
                      <div className={`text-3xl font-black ${stat.color}`}>{formatNumber(stat.value)}</div>
                      <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 gradient-border p-6">
                    <h2 className="text-xl font-black mb-5">تنبيهات اليوم</h2>
                    <div className="space-y-3">
                      {boardingSupervisorDashboard?.alerts.map((alert) => (
                        <div key={alert} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-100">{alert}</div>
                      ))}
                    </div>
                  </div>
                  <div className="gradient-border p-6">
                    <h2 className="text-xl font-black mb-5">توصيات سريعة</h2>
                    <div className="space-y-3">
                      {boardingSupervisorDashboard?.quickRecommendations.map((item) => (
                        <div key={item} className="p-3 rounded-xl bg-white/3 border border-white/5 text-sm text-gray-300">{item}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid xl:grid-cols-2 gap-6">
                  <div className="gradient-border p-6">
                    <h2 className="text-xl font-black mb-5">طلاب بدون متابعة اليوم</h2>
                    <div className="space-y-3">
                      {boardingSupervisorDashboard?.studentsWithoutTodayCheckIn.map((resident) => (
                        <div key={resident.id} className="p-4 rounded-xl bg-white/3 border border-white/5">
                          <div className="font-bold">{resident.studentName}</div>
                          <div className="text-xs text-gray-500 mb-3">{resident.room} · {resident.supervisorName}</div>
                          <button
                            onClick={() => {
                              setActiveTab('boarding');
                              setSelectedBoardingResidentId(resident.id);
                              setBoardingCheckInForm((current) => ({ ...current, residentId: resident.id }));
                            }}
                            className="px-3 py-1 rounded-lg bg-purple-400/10 text-purple-300 text-xs font-bold"
                          >
                            إضافة متابعة
                          </button>
                        </div>
                      ))}
                      {!boardingSupervisorDashboard?.studentsWithoutTodayCheckIn.length && <div className="text-sm text-gray-500">كل الطلاب لديهم متابعة اليوم.</div>}
                    </div>
                  </div>

                  <div className="gradient-border p-6">
                    <h2 className="text-xl font-black mb-5">قوائم متابعة سريعة</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-bold text-red-300 mb-3">لم يحضروا الفجر</h3>
                        <div className="space-y-2">{boardingSupervisorDashboard?.missingFajr.map((resident) => <div key={resident.id} className="p-2 rounded-lg bg-red-500/10 text-sm text-red-100">{resident.studentName}</div>)}</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-orange-300 mb-3">لم يحضروا الحلقة</h3>
                        <div className="space-y-2">{boardingSupervisorDashboard?.missingQuranSession.map((resident) => <div key={resident.id} className="p-2 rounded-lg bg-orange-500/10 text-sm text-orange-100">{resident.studentName}</div>)}</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-amber-300 mb-3">سلوك منخفض</h3>
                        <div className="space-y-2">{boardingSupervisorDashboard?.lowBehavior.map((resident) => <div key={resident.id} className="p-2 rounded-lg bg-amber-500/10 text-sm text-amber-100">{resident.studentName}</div>)}</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-blue-300 mb-3">نظافة/نوم منخفض</h3>
                        <div className="space-y-2">
                          {[...(boardingSupervisorDashboard?.lowCleanliness ?? []), ...(boardingSupervisorDashboard?.lowSleepDiscipline ?? [])]
                            .filter((resident, index, array) => array.findIndex((item) => item.id === resident.id) === index)
                            .map((resident) => <div key={resident.id} className="p-2 rounded-lg bg-blue-500/10 text-sm text-blue-100">{resident.studentName}</div>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'erp' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { label: t('erp.students'), value: students.length, icon: '🎓', color: 'text-emerald-400' },
                    { label: t('erp.teachers'), value: staffMembers.length, icon: '👥', color: 'text-teal-400' },
                    { label: 'الإيرادات / Income', value: educationSummary?.income ?? 0, icon: '💵', color: 'text-green-400' },
                    { label: 'المصروفات / Expenses', value: educationSummary?.expenses ?? 0, icon: '💳', color: 'text-red-400' },
                  ].map((stat) => (
                    <div key={stat.label} className="gradient-border p-5 card-hover">
                      <div className="flex items-center justify-between mb-4"><span className="text-3xl">{stat.icon}</span><span className="text-xs text-gray-500">ERP</span></div>
                      <div className={`text-3xl font-black ${stat.color}`}>{formatNumber(stat.value)}</div>
                      <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 gradient-border p-6">
                    <h2 className="text-xl font-black mb-5">{t('erp.finance')}</h2>
                    <div className="space-y-3">
                      {financeEntries.map((entry) => (
                        <div key={entry.id} className="grid md:grid-cols-5 gap-3 items-center p-4 rounded-xl bg-white/3 border border-white/5 text-sm">
                          <span className={`font-bold ${entry.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>{entry.type === 'income' ? 'إيراد' : 'مصروف'}</span>
                          <span className="text-gray-400">{entry.category}</span>
                          <span className="text-amber-300 font-bold">{formatNumber(entry.amount)}</span>
                          <span className="md:col-span-2 text-gray-500">{entry.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={submitFinance} className="gradient-border p-6 space-y-3 h-fit">
                    <h2 className="text-xl font-black">{t('erp.addFinance')}</h2>
                    <div className="grid grid-cols-2 gap-2">
                      <select className={selectClass} value={financeForm.type} onChange={(e) => setFinanceForm({ ...financeForm, type: e.target.value })}>
                        <option value="income">Income / إيراد</option>
                        <option value="expense">Expense / مصروف</option>
                      </select>
                      <select className={selectClass} value={financeForm.category} onChange={(e) => setFinanceForm({ ...financeForm, category: e.target.value })}>
                        <option value="tuition">Fees / مصروفات</option>
                        <option value="salary">Salaries / رواتب</option>
                        <option value="donation">Donation / دعم</option>
                        <option value="operations">Operations / تشغيل</option>
                        <option value="other">Other / أخرى</option>
                      </select>
                    </div>
                    <input type="number" min="0" className={inputClass} placeholder="Amount / المبلغ" value={financeForm.amount} onChange={(e) => setFinanceForm({ ...financeForm, amount: e.target.value })} />
                    <input required className={inputClass} placeholder="Description / الوصف" value={financeForm.description} onChange={(e) => setFinanceForm({ ...financeForm, description: e.target.value })} />
                    <button disabled={!canEdit || saving === 'finance'} className="w-full py-3 rounded-xl bg-green-400 text-navy font-black disabled:opacity-50">{saving === 'finance' ? 'Saving...' : t('erp.addFinance')}</button>
                  </form>
                </div>

                <div className="grid xl:grid-cols-3 gap-6">
                  <div className="gradient-border p-6">
                    <h2 className="text-xl font-black mb-5">{t('erp.students')}</h2>
                    <div className="space-y-3 max-h-[520px] overflow-auto pr-1">
                      {students.map((student) => (
                        <div key={student.id} className="p-3 rounded-xl bg-white/3 border border-white/5 text-sm">
                          <div className="font-bold">{student.name}</div>
                          <div className="text-xs text-gray-500">{student.className} · {student.academicProgress}% · {student.quranMemorizedPages} صفحة</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="gradient-border p-6">
                    <h2 className="text-xl font-black mb-5">{t('erp.teachers')}</h2>
                    <div className="space-y-3 max-h-[520px] overflow-auto pr-1">
                      {staffMembers.map((staff) => (
                        <div key={staff.id} className="p-3 rounded-xl bg-white/3 border border-white/5 text-sm">
                          <div className="font-bold">{staff.name}</div>
                          <div className="text-xs text-gray-500">{staff.department} · {staff.role} · {formatNumber(staff.salary)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={submitStaff} className="gradient-border p-6 space-y-3 h-fit">
                    <h2 className="text-xl font-black">{t('erp.addStaff')}</h2>
                    <input required className={inputClass} placeholder="Name / الاسم" value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} />
                    <select className={selectClass} value={staffForm.role} onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}>
                      <option value="teacher">Teacher / مدرس</option>
                      <option value="quran_teacher">Quran Teacher / محفظ</option>
                      <option value="admin">Admin / إداري</option>
                      <option value="accountant">Accountant / محاسب</option>
                      <option value="supervisor">Supervisor / مشرف</option>
                      <option value="hr">HR / موارد بشرية</option>
                    </select>
                    <select className={selectClass} value={staffForm.department} onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}>
                      <option value="school">School / مدرسة</option>
                      <option value="quran">Quran / تحفيظ</option>
                      <option value="finance">Finance / مالية</option>
                      <option value="hr">HR / موارد بشرية</option>
                      <option value="admin">Admin / إدارة</option>
                    </select>
                    <input type="number" min="0" className={inputClass} placeholder="Salary / الراتب" value={staffForm.salary} onChange={(e) => setStaffForm({ ...staffForm, salary: e.target.value })} />
                    <button disabled={!canEdit || saving === 'staff'} className="w-full py-3 rounded-xl bg-teal-400 text-navy font-black disabled:opacity-50">{saving === 'staff' ? 'Saving...' : t('erp.addStaff')}</button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="grid xl:grid-cols-2 gap-6">
                <div className="gradient-border p-6">
                  <h2 className="text-xl font-black mb-4">إعدادات المؤسسة</h2>
                  <div className="space-y-3 text-sm text-gray-400">
                    <p><span className="text-gray-500">الاسم:</span> {organization?.name}</p>
                    <p><span className="text-gray-500">المعرّف:</span> <span dir="ltr">{organization?.id}</span></p>
                    <p><span className="text-gray-500">المدينة:</span> {organization?.city}</p>
                    <p><span className="text-gray-500">الدولة:</span> {organization?.country}</p>
                    <p><span className="text-gray-500">التخزين:</span> JSON file prototype</p>
                    <p><span className="text-gray-500">المستخدم:</span> {currentUser?.email ?? 'غير مسجل'}</p>
                    <p><span className="text-gray-500">رمز الجلسة:</span> <span dir="ltr">{authToken ? `${authToken.slice(0, 4)}...` : 'غير متاح'}</span></p>
                    <p><span className="text-gray-500">سجلات التدقيق:</span> {auditLogs.length}</p>
                  </div>
                </div>
                <div className="gradient-border p-6">
                  <h2 className="text-xl font-black mb-4">إجراءات التطوير</h2>
                  <div className="space-y-3">
                    <button onClick={() => void loadAll()} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold">تحديث البيانات</button>
                    <button onClick={() => void resetStore()} className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 font-bold">إعادة تهيئة البيانات التجريبية</button>
                    <a href="#hero" className="block text-center w-full py-3 rounded-xl bg-amber-400 text-navy font-black">العودة للموقع التعريفي</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
