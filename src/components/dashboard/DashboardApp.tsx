import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  API_BASE_URL,
  createBeneficiary,
  createImpactMetric,
  createProgram,
  createVolunteer,
  deleteBeneficiary,
  deleteImpactMetric,
  deleteProgram,
  deleteVolunteer,
  getBeneficiaries,
  getImpactMetrics,
  getOrganizationDashboard,
  getOrganizations,
  getPrograms,
  getVolunteers,
  resetPrototypeStore,
  updateBeneficiary,
  updateImpactMetric,
  updateProgram,
  updateVolunteer,
  type Beneficiary,
  type ImpactMetric,
  type Organization,
  type OrganizationDashboard,
  type Program,
  type User,
  type Volunteer,
} from '../../lib/api';
import { canManage, clearStoredSession, getStoredSession } from '../../lib/auth';

type Tab = 'overview' | 'programs' | 'beneficiaries' | 'volunteers' | 'impact' | 'settings';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'نظرة عامة', icon: '📊' },
  { id: 'programs', label: 'البرامج', icon: '🧭' },
  { id: 'beneficiaries', label: 'المستفيدون', icon: '🌱' },
  { id: 'volunteers', label: 'المتطوعون', icon: '🤝' },
  { id: 'impact', label: 'مؤشرات الأثر', icon: '📈' },
  { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
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
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [dashboard, setDashboard] = useState<OrganizationDashboard | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [programForm, setProgramForm] = useState({ name: '', manager: '', progress: '0' });
  const [beneficiaryForm, setBeneficiaryForm] = useState({ name: '', city: '', programId: '' });
  const [volunteerForm, setVolunteerForm] = useState({ name: '', skill: '', totalHours: '0', programId: '' });
  const [metricForm, setMetricForm] = useState({ name: '', key: '', current: '0', target: '100', unit: 'عدد' });

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

      const [dashboardData, programsData, beneficiariesData, volunteersData, metricsData] = await Promise.all([
        getOrganizationDashboard(selectedOrganization.id),
        getPrograms(selectedOrganization.id),
        getBeneficiaries(selectedOrganization.id),
        getVolunteers(selectedOrganization.id),
        getImpactMetrics(selectedOrganization.id),
      ]);

      setOrganization(selectedOrganization);
      setDashboard(dashboardData);
      setPrograms(programsData);
      setBeneficiaries(beneficiariesData);
      setVolunteers(volunteersData);
      setMetrics(metricsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تحميل بيانات لوحة التحكم');
    } finally {
      setLoading(false);
    }
  }, []);

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
    <div className="min-h-screen bg-[#071020] text-white" dir="rtl">
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
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="space-y-3">
            <button onClick={() => void loadAll()} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-bold hover:bg-white/10 transition-colors">
              تحديث البيانات
            </button>
            <button onClick={() => void resetStore()} disabled={saving === 'reset'} className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50">
              إعادة تهيئة البيانات
            </button>
            <button onClick={logout} className="w-full py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-bold hover:bg-orange-500/20 transition-colors">
              تسجيل الخروج
            </button>
            <a href="#hero" className="block w-full text-center py-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 text-sm font-bold hover:bg-amber-400/20 transition-colors">
              العودة للموقع
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
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
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
