import { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL, getParentStudentResults, type ParentStudentResults } from '../../lib/api';
import { clearStoredSession, getStoredSession } from '../../lib/auth';

type ParentResultCard = ParentStudentResults & {
  studentId: string;
};

function formatTuitionStatus(status: ParentStudentResults['tuitionStatus']) {
  const labels: Record<string, string> = {
    paid: 'مسدد',
    partial: 'مسدد جزئيًا',
    due: 'مستحق',
    scholarship: 'كفالة/منحة',
  };
  return labels[status] ?? status;
}

function ProgressBar({ value, color = 'bg-amber-400' }: { value: number; color?: string }) {
  return (
    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
    </div>
  );
}

export default function ParentPortal() {
  const [results, setResults] = useState<ParentResultCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = getStoredSession();

  const loadResults = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const currentSession = getStoredSession();
      if (!currentSession) {
        window.location.hash = 'login';
        return;
      }

      if (currentSession.user.role !== 'parent') {
        setError('هذه الصفحة مخصصة لحساب ولي الأمر فقط.');
        return;
      }

      const studentIds = currentSession.user.parentStudentIds ?? [];
      const data = await Promise.all(
        studentIds.map(async (studentId) => ({
          studentId,
          ...(await getParentStudentResults(studentId)),
        })),
      );
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تحميل نتائج الأبناء');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadResults();
  }, [loadResults]);

  const logout = () => {
    clearStoredSession();
    window.location.hash = 'login';
  };

  return (
    <div className="min-h-screen bg-[#071020] text-white relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="text-xs text-amber-400 font-bold mb-2">MANARAH · Parent Portal</div>
            <h1 className="text-3xl md:text-4xl font-black text-gold-gradient font-arabic">لوحة ولي الأمر</h1>
            <p className="text-gray-400 mt-2 leading-relaxed">
              متابعة النتائج العامة للأبناء فقط: التقدم العلمي، الحفظ، الحضور، المصروفات، والتوصيات العامة دون عرض تفاصيل الإشراف الداخلي.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => void loadResults()} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-bold hover:bg-white/10">
              تحديث النتائج
            </button>
            <button onClick={logout} className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-bold hover:bg-orange-500/20">
              تسجيل الخروج
            </button>
          </div>
        </header>

        <div className="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-100 text-sm leading-relaxed">
          سياسة العرض: ولي الأمر يرى النتائج العامة والتوصيات المناسبة فقط. ملاحظات المشرف الداخلية، السلوك التفصيلي، وتفاصيل السكن الداخلي لا تظهر هنا.
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-100 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="gradient-border p-8 text-center text-gray-400">جاري تحميل النتائج...</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="gradient-border p-5">
                <div className="text-xs text-gray-500 mb-1">ولي الأمر</div>
                <div className="text-xl font-black text-white">{session?.user.name ?? 'ولي الأمر'}</div>
                <div className="text-xs text-gray-500 mt-1" dir="ltr">{session?.user.email}</div>
              </div>
              <div className="gradient-border p-5">
                <div className="text-xs text-gray-500 mb-1">عدد الأبناء المرتبطين</div>
                <div className="text-3xl font-black text-amber-400">{results.length}</div>
              </div>
              <div className="gradient-border p-5">
                <div className="text-xs text-gray-500 mb-1">API</div>
                <div className="text-sm text-teal-400" dir="ltr">{API_BASE_URL}</div>
              </div>
            </div>

            {results.map((result) => (
              <article key={result.studentId} className="gradient-border p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-black font-arabic text-white mb-2">{result.studentName}</h2>
                    <p className="text-gray-500 text-sm">{result.className}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-bold">
                    نتائج عامة فقط
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                    <div className="text-xs text-gray-500 mb-2">التقدم العلمي</div>
                    <div className="text-2xl font-black text-blue-400 mb-2">{result.academicProgress}%</div>
                    <ProgressBar value={result.academicProgress} color="bg-blue-400" />
                  </div>
                  <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                    <div className="text-xs text-gray-500 mb-2">صفحات الحفظ</div>
                    <div className="text-2xl font-black text-amber-400">{result.quranMemorizedPages}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                    <div className="text-xs text-gray-500 mb-2">الحضور</div>
                    <div className="text-2xl font-black text-teal-400 mb-2">{result.attendanceRate}%</div>
                    <ProgressBar value={result.attendanceRate} color="bg-teal-400" />
                  </div>
                  <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                    <div className="text-xs text-gray-500 mb-2">المصروفات</div>
                    <div className="text-lg font-black text-purple-400">{formatTuitionStatus(result.tuitionStatus)}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <h3 className="font-bold text-emerald-300 mb-3">توصيات عامة</h3>
                    <div className="space-y-2">
                      {result.publicRecommendations.map((recommendation) => (
                        <div key={recommendation} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-100">
                          {recommendation}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-300 mb-3">خصوصية الداخلي</h3>
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-100 leading-relaxed">
                      تفاصيل الإشراف الداخلي مخفية: {result.internalBoardingDetailsHidden ? 'نعم' : 'لا'}.
                      تظهر هنا النتائج العامة فقط دون الملاحظات الداخلية للمشرف.
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {!results.length && !error && (
              <div className="gradient-border p-8 text-center text-gray-400">
                لا توجد نتائج مرتبطة بهذا الحساب حتى الآن.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
