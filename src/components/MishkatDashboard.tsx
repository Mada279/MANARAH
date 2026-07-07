import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  API_BASE_URL,
  createBeneficiary,
  createProgram,
  createVolunteer,
  getBeneficiaries,
  getImpactMetrics,
  getOrganizationDashboard,
  getOrganizations,
  getPrograms,
  getVolunteers,
  resetPrototypeStore,
  type Beneficiary,
  type ImpactMetric,
  type Organization,
  type OrganizationDashboard,
  type Program,
  type Volunteer,
} from '../lib/api';

const fallbackOrganization: Organization = {
  id: 'org-noor',
  name: 'مؤسسة النور المجتمعية',
  slug: 'noor-community',
  type: 'charity',
  country: 'EG',
  city: 'Cairo',
  description: 'مؤسسة تجريبية لاختبار Mishkat MVP.',
  status: 'active',
  createdAt: new Date().toISOString(),
};

const fallbackDashboard: OrganizationDashboard = {
  programs: 3,
  beneficiaries: 3,
  volunteers: 3,
  volunteerHours: 258,
  documents: 42,
  metrics: 4,
};

const fallbackPrograms: Program[] = [
  { id: 'program-student-sponsorship', organizationId: 'org-noor', name: 'برنامج كفالة طالب علم', manager: 'فريق التعليم', category: 'education', status: 'active', progress: 78, beneficiaries: 1, volunteers: 1, createdAt: new Date().toISOString() },
  { id: 'program-monthly-baskets', organizationId: 'org-noor', name: 'مبادرة السلال الشهرية', manager: 'فريق الإغاثة', category: 'relief', status: 'active', progress: 64, beneficiaries: 1, volunteers: 1, createdAt: new Date().toISOString() },
  { id: 'program-volunteer-training', organizationId: 'org-noor', name: 'دورات تأهيل المتطوعين', manager: 'فريق المجتمع', category: 'community', status: 'active', progress: 91, beneficiaries: 1, volunteers: 1, createdAt: new Date().toISOString() },
];

const fallbackBeneficiaries: Beneficiary[] = [
  { id: 'ben-ahmed', organizationId: 'org-noor', programId: 'program-student-sponsorship', program: 'برنامج كفالة طالب علم', name: 'أحمد محمد', city: 'القاهرة', ageGroup: 'youth', status: 'active', createdAt: new Date().toISOString() },
  { id: 'ben-mariam', organizationId: 'org-noor', programId: 'program-volunteer-training', program: 'دورات تأهيل المتطوعين', name: 'مريم خالد', city: 'الجيزة', ageGroup: 'adult', status: 'follow_up', createdAt: new Date().toISOString() },
  { id: 'ben-family-284', organizationId: 'org-noor', programId: 'program-monthly-baskets', program: 'مبادرة السلال الشهرية', name: 'أسرة رقم 284', city: 'القاهرة', ageGroup: 'family', status: 'active', createdAt: new Date().toISOString() },
];

const fallbackVolunteers: Volunteer[] = [
  { id: 'vol-sara', organizationId: 'org-noor', programId: 'program-student-sponsorship', program: 'برنامج كفالة طالب علم', name: 'سارة علي', skill: 'تعليم', totalHours: 124, status: 'available', createdAt: new Date().toISOString() },
  { id: 'vol-mahmoud', organizationId: 'org-noor', programId: 'program-monthly-baskets', program: 'مبادرة السلال الشهرية', name: 'محمود حسن', skill: 'لوجستيات', totalHours: 88, status: 'assigned', createdAt: new Date().toISOString() },
  { id: 'vol-omar', organizationId: 'org-noor', programId: 'program-volunteer-training', program: 'دورات تأهيل المتطوعين', name: 'عمر يوسف', skill: 'تحليل بيانات', totalHours: 46, status: 'available', createdAt: new Date().toISOString() },
];

const fallbackMetrics: ImpactMetric[] = [
  { id: 'metric-beneficiaries', organizationId: 'org-noor', name: 'عدد المستفيدين', key: 'beneficiaries_count', current: 1248, target: 1600, unit: 'مستفيد', createdAt: new Date().toISOString() },
  { id: 'metric-volunteer-hours', organizationId: 'org-noor', name: 'ساعات التطوع', key: 'volunteer_hours', current: 3640, target: 5000, unit: 'ساعة', createdAt: new Date().toISOString() },
  { id: 'metric-documents', organizationId: 'org-noor', name: 'المستندات المؤرشفة', key: 'documents_archived', current: 42, target: 60, unit: 'مستند', createdAt: new Date().toISOString() },
  { id: 'metric-impact-completeness', organizationId: 'org-noor', name: 'اكتمال مؤشرات الأثر', key: 'impact_metrics_completeness', current: 12, target: 12, unit: 'مؤشر', createdAt: new Date().toISOString() },
];

const activities = [
  'تم ربط لوحة مشكاة بالـ API المحلية',
  'يمكن الآن إضافة برامج ومستفيدين ومتطوعين أثناء تشغيل السيرفر',
  'الخطوة التالية هي استبدال الذاكرة المؤقتة بقاعدة بيانات PostgreSQL',
  'كل البيانات الجديدة مؤقتة وتختفي عند إعادة تشغيل السيرفر',
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
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function MishkatDashboard() {
  const [organization, setOrganization] = useState<Organization>(fallbackOrganization);
  const [dashboard, setDashboard] = useState<OrganizationDashboard>(fallbackDashboard);
  const [programs, setPrograms] = useState<Program[]>(fallbackPrograms);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(fallbackBeneficiaries);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(fallbackVolunteers);
  const [metrics, setMetrics] = useState<ImpactMetric[]>(fallbackMetrics);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const [programForm, setProgramForm] = useState({ name: '', manager: '', progress: '0' });
  const [beneficiaryForm, setBeneficiaryForm] = useState({ name: '', city: '', programId: '' });
  const [volunteerForm, setVolunteerForm] = useState({ name: '', skill: '', totalHours: '0', programId: '' });

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const organizations = await getOrganizations();
      const selectedOrganization = organizations[0] ?? fallbackOrganization;

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
      setConnected(true);
    } catch (err) {
      setOrganization(fallbackOrganization);
      setDashboard(fallbackDashboard);
      setPrograms(fallbackPrograms);
      setBeneficiaries(fallbackBeneficiaries);
      setVolunteers(fallbackVolunteers);
      setMetrics(fallbackMetrics);
      setConnected(false);
      setError(err instanceof Error ? err.message : 'تعذر الاتصال بالـ API');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const impactScore = useMemo(() => {
    if (!metrics.length) return 0;
    const total = metrics.reduce((sum, metric) => sum + percent(metric.current, metric.target), 0);
    return Math.round(total / metrics.length);
  }, [metrics]);

  const overviewStats = useMemo(
    () => [
      { label: 'البرامج النشطة', value: formatNumber(dashboard.programs), change: connected ? 'من API' : 'بيانات احتياطية', icon: '🧭', color: 'text-amber-400' },
      { label: 'المستفيدون', value: formatNumber(dashboard.beneficiaries), change: `${formatNumber(beneficiaries.length)} سجلات`, icon: '🌱', color: 'text-emerald-400' },
      { label: 'المتطوعون', value: formatNumber(dashboard.volunteers), change: `${formatNumber(dashboard.volunteerHours)} ساعة`, icon: '🤝', color: 'text-teal-400' },
      { label: 'مؤشر الأثر', value: `${impactScore}%`, change: `${formatNumber(metrics.length)} مؤشرات`, icon: '📊', color: 'text-purple-400' },
    ],
    [beneficiaries.length, connected, dashboard, impactScore, metrics.length],
  );

  const submitProgram = async (event: FormEvent) => {
    event.preventDefault();
    if (!connected) {
      setError('شغّل API أولًا قبل الإضافة: npm run server:dev');
      return;
    }

    setSaving('program');
    try {
      await createProgram(organization.id, {
        name: programForm.name,
        manager: programForm.manager || 'فريق التشغيل',
        progress: Number(programForm.progress || 0),
        status: 'active',
      });
      setProgramForm({ name: '', manager: '', progress: '0' });
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إضافة البرنامج');
    } finally {
      setSaving(null);
    }
  };

  const submitBeneficiary = async (event: FormEvent) => {
    event.preventDefault();
    if (!connected) {
      setError('شغّل API أولًا قبل الإضافة: npm run server:dev');
      return;
    }

    setSaving('beneficiary');
    try {
      await createBeneficiary(organization.id, {
        name: beneficiaryForm.name,
        city: beneficiaryForm.city,
        programId: beneficiaryForm.programId || undefined,
        status: 'active',
      });
      setBeneficiaryForm({ name: '', city: '', programId: '' });
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إضافة المستفيد');
    } finally {
      setSaving(null);
    }
  };

  const submitVolunteer = async (event: FormEvent) => {
    event.preventDefault();
    if (!connected) {
      setError('شغّل API أولًا قبل الإضافة: npm run server:dev');
      return;
    }

    setSaving('volunteer');
    try {
      await createVolunteer(organization.id, {
        name: volunteerForm.name,
        skill: volunteerForm.skill,
        totalHours: Number(volunteerForm.totalHours || 0),
        programId: volunteerForm.programId || undefined,
        status: 'available',
      });
      setVolunteerForm({ name: '', skill: '', totalHours: '0', programId: '' });
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إضافة المتطوع');
    } finally {
      setSaving(null);
    }
  };

  const resetStore = async () => {
    if (!connected) {
      setError('شغّل API أولًا قبل إعادة التهيئة: npm run server:dev');
      return;
    }

    setSaving('reset');
    try {
      await resetPrototypeStore();
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر إعادة تهيئة البيانات');
    } finally {
      setSaving(null);
    }
  };

  return (
    <section id="mishkat-dashboard" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0D1F3C 0%, #071020 50%, #0A1628 100%)' }}>
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-24 left-10 w-72 h-72 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.45) 0%, transparent 70%)' }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.35) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400 text-sm font-medium tracking-widest">✦ نموذج Mishkat MVP ✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 font-arabic">
            لوحة متصلة بأول <span className="text-gold-gradient">CRUD API</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto font-cairo leading-relaxed">
            هذه النسخة تقرأ وتضيف البرامج والمستفيدين والمتطوعين من API محلية أثناء تشغيل <code dir="ltr" className="text-amber-300">npm run server:dev</code>. البيانات مؤقتة حتى نربط PostgreSQL في المرحلة القادمة.
          </p>
        </div>

        <div className="gradient-border overflow-hidden shadow-2xl">
          <div className="border-b border-amber-400/10 bg-white/2 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/25 to-teal-400/15 border border-amber-400/30 flex items-center justify-center text-2xl">🏛️</div>
              <div>
                <h3 className="text-xl font-black text-white font-arabic">{organization.name}</h3>
                <p className="text-xs text-gray-500 font-cairo" dir="ltr">API: {API_BASE_URL} · {organization.slug}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full border text-xs font-bold ${connected ? 'bg-green-500/15 text-green-400 border-green-500/30' : 'bg-orange-500/15 text-orange-300 border-orange-500/30'}`}>
                {loading ? 'جاري الاتصال...' : connected ? 'متصل بالـ API' : 'بيانات احتياطية'}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold">CRUD Prototype</span>
              <button onClick={() => void loadDashboard()} className="px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors">تحديث</button>
              <button onClick={() => void resetStore()} disabled={saving === 'reset'} className="px-3 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50">إعادة تهيئة</button>
            </div>
          </div>

          {error && (
            <div className="mx-5 md:mx-8 mt-5 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-200 text-sm font-cairo leading-relaxed">
              {error.includes('API request') ? 'تعذر الاتصال بالـ API المحلية. تأكد من تشغيل npm run server:dev.' : error}
            </div>
          )}

          <div className="p-5 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {overviewStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/3 border border-white/5 p-5 card-hover">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{stat.icon}</span>
                    <span className={`text-xs font-bold ${stat.color}`}>{stat.change}</span>
                  </div>
                  <div className={`text-3xl font-black mb-1 ${stat.color}`}>{loading ? '...' : stat.value}</div>
                  <div className="text-gray-400 text-sm font-cairo">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 rounded-2xl bg-white/3 border border-white/5 p-5">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-lg font-black text-white font-arabic">البرامج النشطة</h4>
                  <span className="text-xs text-gray-500">{programs.length} برامج</span>
                </div>
                <div className="space-y-4">
                  {programs.map((program) => (
                    <div key={program.id} className="p-4 rounded-xl bg-[#0A1628]/70 border border-white/5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                        <div>
                          <h5 className="text-white font-bold font-arabic">{program.name}</h5>
                          <p className="text-xs text-gray-500 font-cairo">{program.manager} · {program.beneficiaries} مستفيد · {program.volunteers} متطوع</p>
                        </div>
                        <span className="self-start md:self-auto px-3 py-1 rounded-full bg-teal-400/10 text-teal-300 border border-teal-400/20 text-xs font-bold">{statusLabel(program.status)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1"><ProgressBar value={program.progress} color="bg-teal-400" /></div>
                        <span className="text-xs text-teal-300 font-bold w-10">{program.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white/3 border border-white/5 p-5">
                <h4 className="text-lg font-black text-white font-arabic mb-5">آخر الأنشطة</h4>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={activity} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300 text-xs flex-shrink-0">{index + 1}</div>
                      <p className="text-gray-400 text-sm font-cairo leading-relaxed">{activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="rounded-2xl bg-white/3 border border-white/5 p-5">
                <h4 className="text-lg font-black text-white font-arabic mb-5">مؤشرات الأثر من API</h4>
                <div className="space-y-5">
                  {metrics.map((metric) => (
                    <div key={metric.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm font-cairo">{metric.name}</span>
                        <span className="text-amber-300 text-xs font-bold">{formatNumber(metric.current)} / {formatNumber(metric.target)} {metric.unit}</span>
                      </div>
                      <ProgressBar value={percent(metric.current, metric.target)} color="bg-amber-400" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white/3 border border-white/5 p-5">
                <h4 className="text-lg font-black text-white font-arabic mb-5">تقرير مختصر</h4>
                <div className="p-5 rounded-xl bg-gradient-to-br from-amber-400/10 to-teal-400/10 border border-amber-400/20 mb-4">
                  <div className="text-4xl mb-3">📄</div>
                  <h5 className="text-white font-bold font-arabic mb-2">تقرير أثر الربع الحالي</h5>
                  <p className="text-gray-400 text-sm font-cairo leading-relaxed">
                    المؤسسة حققت {impactScore}% من مؤشرات الأثر المستهدفة. هذه النسبة محسوبة من مؤشرات API الحالية.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 rounded-xl bg-amber-400 text-navy font-black text-sm hover:bg-amber-300 transition-colors">عرض التقرير</button>
                  <button className="py-3 rounded-xl bg-white/5 text-gray-300 border border-white/10 font-bold text-sm hover:bg-white/10 transition-colors">تصدير لاحقًا</button>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="rounded-2xl bg-white/3 border border-white/5 p-5 overflow-hidden">
                <h4 className="text-lg font-black text-white font-arabic mb-5">آخر المستفيدين</h4>
                <div className="space-y-3">
                  {beneficiaries.slice(0, 5).map((item) => (
                    <div key={item.id} className="grid grid-cols-4 gap-3 items-center text-sm p-3 rounded-xl bg-[#0A1628]/70 border border-white/5">
                      <span className="text-white font-cairo">{item.name}</span>
                      <span className="text-gray-500 font-cairo col-span-2">{item.program} · {item.city ?? 'غير محدد'}</span>
                      <span className="text-green-400 text-xs font-bold text-left">{statusLabel(item.status)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white/3 border border-white/5 p-5 overflow-hidden">
                <h4 className="text-lg font-black text-white font-arabic mb-5">المتطوعون</h4>
                <div className="space-y-3">
                  {volunteers.slice(0, 5).map((item) => (
                    <div key={item.id} className="grid grid-cols-4 gap-3 items-center text-sm p-3 rounded-xl bg-[#0A1628]/70 border border-white/5">
                      <span className="text-white font-cairo">{item.name}</span>
                      <span className="text-gray-500 font-cairo">{item.skill ?? 'مهارة عامة'}</span>
                      <span className="text-amber-300 font-bold text-xs">{item.totalHours} ساعة</span>
                      <span className="text-teal-400 text-xs font-bold text-left">{statusLabel(item.status)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/3 border border-white/5 p-5">
              <h4 className="text-lg font-black text-white font-arabic mb-5">إضافة سريعة عبر API</h4>
              <div className="grid lg:grid-cols-3 gap-5">
                <form onSubmit={submitProgram} className="space-y-3 p-4 rounded-xl bg-[#0A1628]/70 border border-white/5">
                  <h5 className="font-bold text-amber-300">برنامج جديد</h5>
                  <input required value={programForm.name} onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })} placeholder="اسم البرنامج" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-400/50" />
                  <input value={programForm.manager} onChange={(e) => setProgramForm({ ...programForm, manager: e.target.value })} placeholder="الفريق المسؤول" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-400/50" />
                  <input type="number" min="0" max="100" value={programForm.progress} onChange={(e) => setProgramForm({ ...programForm, progress: e.target.value })} placeholder="نسبة التقدم" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-400/50" />
                  <button disabled={saving === 'program'} className="w-full py-2 rounded-lg bg-amber-400 text-navy font-black text-sm disabled:opacity-50">{saving === 'program' ? 'جارٍ الحفظ...' : 'إضافة برنامج'}</button>
                </form>

                <form onSubmit={submitBeneficiary} className="space-y-3 p-4 rounded-xl bg-[#0A1628]/70 border border-white/5">
                  <h5 className="font-bold text-emerald-300">مستفيد جديد</h5>
                  <input required value={beneficiaryForm.name} onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, name: e.target.value })} placeholder="اسم المستفيد" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-400/50" />
                  <input value={beneficiaryForm.city} onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, city: e.target.value })} placeholder="المدينة" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-400/50" />
                  <select value={beneficiaryForm.programId} onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, programId: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-emerald-400/50">
                    <option value="">بدون برنامج</option>
                    {programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}
                  </select>
                  <button disabled={saving === 'beneficiary'} className="w-full py-2 rounded-lg bg-emerald-400 text-navy font-black text-sm disabled:opacity-50">{saving === 'beneficiary' ? 'جارٍ الحفظ...' : 'إضافة مستفيد'}</button>
                </form>

                <form onSubmit={submitVolunteer} className="space-y-3 p-4 rounded-xl bg-[#0A1628]/70 border border-white/5">
                  <h5 className="font-bold text-teal-300">متطوع جديد</h5>
                  <input required value={volunteerForm.name} onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })} placeholder="اسم المتطوع" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-teal-400/50" />
                  <input value={volunteerForm.skill} onChange={(e) => setVolunteerForm({ ...volunteerForm, skill: e.target.value })} placeholder="المهارة" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-teal-400/50" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" min="0" value={volunteerForm.totalHours} onChange={(e) => setVolunteerForm({ ...volunteerForm, totalHours: e.target.value })} placeholder="الساعات" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-teal-400/50" />
                    <select value={volunteerForm.programId} onChange={(e) => setVolunteerForm({ ...volunteerForm, programId: e.target.value })} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-teal-400/50">
                      <option value="">برنامج</option>
                      {programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}
                    </select>
                  </div>
                  <button disabled={saving === 'volunteer'} className="w-full py-2 rounded-lg bg-teal-400 text-navy font-black text-sm disabled:opacity-50">{saving === 'volunteer' ? 'جارٍ الحفظ...' : 'إضافة متطوع'}</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm font-cairo">
          الخطوة التالية: ربط هذه الـ CRUD بقاعدة بيانات PostgreSQL بدل الذاكرة المؤقتة.
        </div>
      </div>
    </section>
  );
}
