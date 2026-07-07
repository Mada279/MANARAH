const overviewStats = [
  { label: 'البرامج النشطة', value: '6', change: '+2 هذا الشهر', icon: '🧭', color: 'text-amber-400' },
  { label: 'المستفيدون', value: '1,248', change: '72% من الهدف', icon: '🌱', color: 'text-emerald-400' },
  { label: 'المتطوعون', value: '86', change: '3,640 ساعة', icon: '🤝', color: 'text-teal-400' },
  { label: 'مؤشر الأثر', value: '87%', change: '+9% عن الربع السابق', icon: '📊', color: 'text-purple-400' },
];

const programs = [
  { name: 'برنامج كفالة طالب علم', manager: 'فريق التعليم', beneficiaries: 420, volunteers: 18, progress: 78, status: 'نشط' },
  { name: 'مبادرة السلال الشهرية', manager: 'فريق الإغاثة', beneficiaries: 610, volunteers: 34, progress: 64, status: 'نشط' },
  { name: 'دورات تأهيل المتطوعين', manager: 'فريق المجتمع', beneficiaries: 218, volunteers: 22, progress: 91, status: 'مراجعة' },
];

const impactMetrics = [
  { name: 'عدد المستفيدين', current: 1248, target: 1600, unit: 'مستفيد', progress: 78 },
  { name: 'ساعات التطوع', current: 3640, target: 5000, unit: 'ساعة', progress: 73 },
  { name: 'اكتمال الأنشطة', current: 42, target: 50, unit: 'نشاط', progress: 84 },
  { name: 'رضا المستفيدين', current: 91, target: 95, unit: '%', progress: 96 },
];

const beneficiaries = [
  { name: 'أحمد محمد', program: 'كفالة طالب علم', city: 'القاهرة', status: 'نشط' },
  { name: 'مريم خالد', program: 'دورات التأهيل', city: 'الجيزة', status: 'متابعة' },
  { name: 'أسرة رقم 284', program: 'السلال الشهرية', city: 'القاهرة', status: 'نشط' },
];

const volunteers = [
  { name: 'سارة علي', skill: 'تعليم', hours: 124, status: 'متاح' },
  { name: 'محمود حسن', skill: 'لوجستيات', hours: 88, status: 'مكلف' },
  { name: 'عمر يوسف', skill: 'تحليل بيانات', hours: 46, status: 'متاح' },
];

const activities = [
  'تم تحديث مؤشر ساعات التطوع في برنامج السلال الشهرية',
  'تم إضافة 24 مستفيدًا جديدًا إلى برنامج كفالة طالب علم',
  'تقرير الربع الحالي جاهز للمراجعة',
  'طلب موافقة جديد على نشاط تدريبي للمتطوعين',
];

function ProgressBar({ value, color = 'bg-amber-400' }: { value: number; color?: string }) {
  return (
    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function MishkatDashboard() {
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
            أول نموذج بصري للوحة <span className="text-gold-gradient">تشغيل المؤسسة</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto font-cairo leading-relaxed">
            هذا نموذج Frontend أولي يحوّل وثيقة Mishkat MVP إلى تجربة مرئية: برامج، مستفيدون، متطوعون، مؤشرات أثر، وتنبيهات تشغيلية في لوحة واحدة.
          </p>
        </div>

        <div className="gradient-border overflow-hidden shadow-2xl">
          <div className="border-b border-amber-400/10 bg-white/2 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/25 to-teal-400/15 border border-amber-400/30 flex items-center justify-center text-2xl">🏛️</div>
              <div>
                <h3 className="text-xl font-black text-white font-arabic">مؤسسة النور المجتمعية</h3>
                <p className="text-xs text-gray-500 font-cairo">Mishkat MVP Dashboard · الربع الحالي</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/30 text-xs font-bold">بيانات تجريبية</span>
              <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold">Frontend Prototype</span>
            </div>
          </div>

          <div className="p-5 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {overviewStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/3 border border-white/5 p-5 card-hover">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{stat.icon}</span>
                    <span className={`text-xs font-bold ${stat.color}`}>{stat.change}</span>
                  </div>
                  <div className={`text-3xl font-black mb-1 ${stat.color}`}>{stat.value}</div>
                  <div className="text-gray-400 text-sm font-cairo">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 rounded-2xl bg-white/3 border border-white/5 p-5">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-lg font-black text-white font-arabic">البرامج النشطة</h4>
                  <button className="px-3 py-1.5 rounded-xl bg-amber-400/10 text-amber-300 text-xs font-bold border border-amber-400/20">+ برنامج جديد</button>
                </div>
                <div className="space-y-4">
                  {programs.map((program) => (
                    <div key={program.name} className="p-4 rounded-xl bg-[#0A1628]/70 border border-white/5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                        <div>
                          <h5 className="text-white font-bold font-arabic">{program.name}</h5>
                          <p className="text-xs text-gray-500 font-cairo">{program.manager} · {program.beneficiaries} مستفيد · {program.volunteers} متطوع</p>
                        </div>
                        <span className="self-start md:self-auto px-3 py-1 rounded-full bg-teal-400/10 text-teal-300 border border-teal-400/20 text-xs font-bold">{program.status}</span>
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
                <h4 className="text-lg font-black text-white font-arabic mb-5">مؤشرات الأثر</h4>
                <div className="space-y-5">
                  {impactMetrics.map((metric) => (
                    <div key={metric.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-sm font-cairo">{metric.name}</span>
                        <span className="text-amber-300 text-xs font-bold">{metric.current.toLocaleString()} / {metric.target.toLocaleString()} {metric.unit}</span>
                      </div>
                      <ProgressBar value={metric.progress} color="bg-amber-400" />
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
                    المؤسسة حققت 87% من مؤشرات الأثر المستهدفة، مع تقدم واضح في ساعات التطوع واكتمال الأنشطة. الأولوية القادمة هي رفع نسبة الوصول للمستفيدين الجدد.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 rounded-xl bg-amber-400 text-navy font-black text-sm hover:bg-amber-300 transition-colors">عرض التقرير</button>
                  <button className="py-3 rounded-xl bg-white/5 text-gray-300 border border-white/10 font-bold text-sm hover:bg-white/10 transition-colors">تصدير لاحقًا</button>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white/3 border border-white/5 p-5 overflow-hidden">
                <h4 className="text-lg font-black text-white font-arabic mb-5">آخر المستفيدين</h4>
                <div className="space-y-3">
                  {beneficiaries.map((item) => (
                    <div key={item.name} className="grid grid-cols-4 gap-3 items-center text-sm p-3 rounded-xl bg-[#0A1628]/70 border border-white/5">
                      <span className="text-white font-cairo">{item.name}</span>
                      <span className="text-gray-500 font-cairo col-span-2">{item.program} · {item.city}</span>
                      <span className="text-green-400 text-xs font-bold text-left">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white/3 border border-white/5 p-5 overflow-hidden">
                <h4 className="text-lg font-black text-white font-arabic mb-5">المتطوعون</h4>
                <div className="space-y-3">
                  {volunteers.map((item) => (
                    <div key={item.name} className="grid grid-cols-4 gap-3 items-center text-sm p-3 rounded-xl bg-[#0A1628]/70 border border-white/5">
                      <span className="text-white font-cairo">{item.name}</span>
                      <span className="text-gray-500 font-cairo">{item.skill}</span>
                      <span className="text-amber-300 font-bold text-xs">{item.hours} ساعة</span>
                      <span className="text-teal-400 text-xs font-bold text-left">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm font-cairo">
          الخطوة التالية بعد هذا النموذج: تحويل البيانات التجريبية إلى API حقيقي وقاعدة بيانات متعددة المؤسسات.
        </div>
      </div>
    </section>
  );
}
