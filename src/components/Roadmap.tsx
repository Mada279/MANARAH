const phases = [
  {
    num: '00',
    phase: 'مرحلة التأسيس',
    period: 'الحالية',
    status: 'active',
    statusLabel: '🟢 الآن',
    statusColor: 'text-green-400',
    title: 'تثبيت الرؤية والهوية',
    items: [
      'توحيد تعريف منارة ورسالتها',
      'تنظيم الوثائق والمرجع التأسيسي',
      'إعادة توجيه الموقع نحو المنظومة الكاملة',
      'تحديد المنتج الأول القابل للاستخدام',
      'بناء نظام تصميم وهوية موحدة',
      'تحويل الأفكار إلى Roadmap تنفيذية',
    ],
    progress: 55,
    borderColor: 'border-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    bgColor: 'from-amber-500/10 to-transparent',
  },
  {
    num: '01',
    phase: 'النواة المشتركة',
    period: 'المرحلة التالية',
    status: 'upcoming',
    statusLabel: '🔵 قادمة',
    statusColor: 'text-blue-400',
    title: 'Manarah OS Core',
    items: [
      'إدارة الحسابات والهوية الرقمية',
      'إدارة المؤسسات والفروع والفرق',
      'الأدوار والصلاحيات وسجل التدقيق',
      'النماذج والحقول المخصصة',
      'سير العمل والموافقات',
      'التقارير والإشعارات الأساسية',
    ],
    progress: 0,
    borderColor: 'border-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    bgColor: 'from-blue-500/10 to-transparent',
  },
  {
    num: '02',
    phase: 'أول منتج عملي',
    period: 'MVP',
    status: 'future',
    statusLabel: '🧩 MVP',
    statusColor: 'text-purple-400',
    title: 'Mishkat MVP + Impact Dashboard',
    items: [
      'إدارة البرامج والمبادرات',
      'إدارة المستفيدين والمتطوعين',
      'إدارة المستندات والعمليات',
      'لوحة مؤشرات أثر أولية',
      'تقارير قابلة للتصدير',
      'تجارب مع مؤسسات حقيقية',
    ],
    progress: 0,
    borderColor: 'border-purple-400',
    glowColor: 'rgba(139, 92, 246, 0.3)',
    bgColor: 'from-purple-500/10 to-transparent',
  },
  {
    num: '03',
    phase: 'التوسع المنظومي',
    period: 'بعد تحقق MVP',
    status: 'future',
    statusLabel: '🌱 توسع',
    statusColor: 'text-teal-400',
    title: 'Meraj + Digital Waqf + Knowledge',
    items: [
      'إطلاق رحلة الإنسان عبر معراج',
      'ربط الأفراد بالمؤسسات والفرص',
      'إدارة الوقف الرقمي والعوائد',
      'بناء منصة المعرفة والأكاديمية',
      'توسيع محرك الأثر والذكاء الاصطناعي',
      'إطلاق بوابة المطورين والتكاملات',
    ],
    progress: 0,
    borderColor: 'border-teal-400',
    glowColor: 'rgba(20, 184, 166, 0.3)',
    bgColor: 'from-teal-500/10 to-transparent',
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A1628 0%, #0D1F3C 100%)' }}>
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />
      <div className="absolute left-1/2 top-40 bottom-20 w-px bg-gradient-to-b from-amber-400/40 via-blue-400/30 to-teal-400/30 hidden lg:block -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400 text-sm font-medium tracking-widest">✦ خارطة البناء ✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 font-arabic">
            من الرؤية إلى <span className="text-gold-gradient">منتج قابل للاستخدام</span>
          </h2>
          <p className="text-gray-400 text-lg font-cairo max-w-2xl mx-auto leading-relaxed">
            بناء منارة يجب أن يكون مرحليًا: نبدأ بالنواة والمؤسسة والأثر، ثم نتوسع إلى رحلة الإنسان والوقف والمعرفة.
          </p>
        </div>

        <div className="space-y-10">
          {phases.map((phase) => (
            <div
              key={phase.num}
              className={`relative gradient-border p-6 md:p-8 card-hover bg-gradient-to-r ${phase.bgColor} group`}
              style={{ boxShadow: phase.status === 'active' ? `0 0 40px ${phase.glowColor}` : 'none' }}
            >
              {phase.status === 'active' && (
                <div className="absolute -top-3 right-6 px-4 py-1 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">
                  ● قيد التأسيس
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl border-2 ${phase.borderColor} flex items-center justify-center mb-2`} style={{ boxShadow: `0 0 20px ${phase.glowColor}` }}>
                    <span className="text-2xl font-black text-white">{phase.num}</span>
                  </div>
                  <span className={`text-xs font-medium ${phase.statusColor}`}>{phase.statusLabel}</span>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-xs text-gray-500 font-cairo bg-white/5 px-3 py-1 rounded-full">{phase.period}</span>
                    <span className="text-xs text-gray-500 font-arabic">{phase.phase}</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-white mb-5 font-arabic">{phase.title}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {phase.items.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <span className={`mt-1 text-xs ${phase.statusColor}`}>{phase.status === 'active' ? '✓' : '○'}</span>
                        <span className="text-gray-400 text-sm font-cairo">{item}</span>
                      </div>
                    ))}
                  </div>

                  {phase.status === 'active' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 font-cairo">تقدم التأسيس</span>
                        <span className="text-sm font-bold text-amber-400">{phase.progress}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full progress-bar rounded-full transition-all duration-1000" style={{ width: `${phase.progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
