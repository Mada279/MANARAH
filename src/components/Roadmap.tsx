const phases = [
  {
    num: '01',
    phase: 'المرحلة الأولى',
    period: 'الربع الأول – الثاني 2025',
    status: 'active',
    statusLabel: '🟢 نشط',
    statusColor: 'text-green-400',
    title: 'التأسيس والإطلاق',
    items: [
      'إطلاق الورقة البيضاء والتوثيق الكامل',
      'بناء فريق التطوير الأساسي',
      'إطلاق الشبكة التجريبية Testnet',
      'تمويل جولة البذور Seed Round',
      'إطلاق ManaraPay و ZakatChain',
      'أولى الشراكات الاستراتيجية',
    ],
    progress: 45,
    color: 'amber',
    borderColor: 'border-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    bgColor: 'from-amber-500/10 to-transparent',
  },
  {
    num: '02',
    phase: 'المرحلة الثانية',
    period: 'الربع الثالث – الرابع 2025',
    status: 'upcoming',
    statusLabel: '🔵 قادمة',
    statusColor: 'text-blue-400',
    title: 'التوسع والنمو',
    items: [
      'إطلاق الشبكة الرئيسية Mainnet',
      'إطلاق WaqfDAO و TakafulNet',
      'دمج الذكاء الاصطناعي في المنصة',
      'التوسع إلى 15 دولة',
      'إطلاق برنامج المطورين',
      'جولة تمويل Series A',
    ],
    progress: 0,
    color: 'blue',
    borderColor: 'border-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    bgColor: 'from-blue-500/10 to-transparent',
  },
  {
    num: '03',
    phase: 'المرحلة الثالثة',
    period: 'الربع الأول – الرابع 2026',
    status: 'future',
    statusLabel: '🔮 المستقبل',
    statusColor: 'text-purple-400',
    title: 'التوسع العالمي',
    items: [
      'إطلاق IlmHub و HalalDeFi و ReliefDAO',
      'التوسع إلى أكثر من 50 دولة',
      'إطلاق رمز ManaraToken',
      'شراكات مع كبرى البنوك الإسلامية',
      'طرح عام IDO/IEO',
      'تحقيق 10 مليون مستخدم نشط',
    ],
    progress: 0,
    color: 'purple',
    borderColor: 'border-purple-400',
    glowColor: 'rgba(139, 92, 246, 0.3)',
    bgColor: 'from-purple-500/10 to-transparent',
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A1628 0%, #0D1F3C 100%)' }}>
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />

      {/* Vertical line */}
      <div className="absolute left-1/2 top-40 bottom-20 w-px bg-gradient-to-b from-amber-400/40 via-blue-400/30 to-purple-400/30 hidden lg:block -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400 text-sm font-medium tracking-widest">✦ خارطة الطريق ✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 font-arabic">
            الرحلة نحو <span className="text-gold-gradient">المستقبل</span>
          </h2>
          <p className="text-gray-400 text-lg font-cairo">مراحل مدروسة لبناء أضخم منظومة إسلامية رقمية</p>
        </div>

        {/* Phases */}
        <div className="space-y-10">
          {phases.map((phase, i) => (
            <div
              key={i}
              className={`relative gradient-border p-6 md:p-8 card-hover bg-gradient-to-r ${phase.bgColor} group`}
              style={{
                boxShadow: phase.status === 'active' ? `0 0 40px ${phase.glowColor}` : 'none',
              }}
            >
              {/* Active indicator */}
              {phase.status === 'active' && (
                <div className="absolute -top-3 right-6 px-4 py-1 bg-green-500 text-white text-xs font-bold rounded-full animate-pulse">
                  ● نشط الآن
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                
                {/* Phase Number */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl border-2 ${phase.borderColor} flex items-center justify-center mb-2`}
                       style={{ boxShadow: `0 0 20px ${phase.glowColor}` }}>
                    <span className="text-2xl font-black text-white">{phase.num}</span>
                  </div>
                  <span className={`text-xs font-medium ${phase.statusColor}`}>{phase.statusLabel}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-xs text-gray-500 font-cairo bg-white/5 px-3 py-1 rounded-full">
                      {phase.period}
                    </span>
                    <span className="text-xs text-gray-500 font-arabic">{phase.phase}</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-white mb-5 font-arabic">
                    {phase.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {phase.items.map((item, ii) => (
                      <div key={ii} className="flex items-start gap-2">
                        <span className={`mt-1 text-xs ${phase.statusColor === 'text-green-400' ? 'text-green-400' : phase.statusColor === 'text-blue-400' ? 'text-blue-400' : 'text-purple-400'}`}>
                          {phase.status === 'active' ? '✓' : '○'}
                        </span>
                        <span className="text-gray-400 text-sm font-cairo">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Progress */}
                  {phase.status === 'active' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 font-cairo">التقدم الكلي</span>
                        <span className="text-sm font-bold text-amber-400">{phase.progress}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full progress-bar rounded-full transition-all duration-1000"
                          style={{ width: `${phase.progress}%` }}
                        />
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
