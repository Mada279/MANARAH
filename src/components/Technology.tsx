const techStack = [
  { label: 'Blockchain', value: 'Ethereum / Polygon', icon: '⛓', color: 'text-purple-400' },
  { label: 'Smart Contracts', value: 'Solidity', icon: '📄', color: 'text-blue-400' },
  { label: 'Frontend', value: 'React + TypeScript', icon: '⚛️', color: 'text-cyan-400' },
  { label: 'Backend', value: 'Node.js + Express', icon: '🟢', color: 'text-green-400' },
  { label: 'AI Engine', value: 'OpenAI GPT-4', icon: '🤖', color: 'text-amber-400' },
  { label: 'Storage', value: 'IPFS + Filecoin', icon: '💾', color: 'text-orange-400' },
  { label: 'Indexing', value: 'The Graph', icon: '📊', color: 'text-pink-400' },
  { label: 'Oracle', value: 'Chainlink', icon: '🔗', color: 'text-teal-400' },
];

const pipeline = [
  { num: '01', title: 'طلب المستخدم', desc: 'يرسل المستخدم طلبًا عبر واجهة المستخدم أو API', icon: '👤', color: 'amber' },
  { num: '02', title: 'التحقق الشرعي', desc: 'محرك الذكاء الاصطناعي يتحقق من الامتثال الشرعي', icon: '🕌', color: 'emerald' },
  { num: '03', title: 'العقد الذكي', desc: 'تنفيذ العملية عبر عقد ذكي موثوق على البلوكتشين', icon: '⚡', color: 'blue' },
  { num: '04', title: 'التوثيق', desc: 'تسجيل دائم وشفاف على الشبكة اللامركزية', icon: '📋', color: 'purple' },
];

export default function Technology() {
  return (
    <section id="technology" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0D1F3C 0%, #0A1628 50%, #071020 100%)' }}>
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400 text-sm font-medium tracking-widest">✦ البنية التقنية ✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 font-arabic">
            مكوّنات <span className="text-teal-gradient">المكدس التقني</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-cairo">
            بنية تقنية متقدمة تجمع بين أحدث تقنيات البلوكتشين والذكاء الاصطناعي مع الامتثال الشرعي الكامل
          </p>
        </div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
          {techStack.map((tech, i) => (
            <div
              key={i}
              className="gradient-border p-5 text-center card-hover group cursor-default"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{tech.icon}</div>
              <div className="text-xs text-gray-500 font-cairo mb-1 uppercase tracking-wider">{tech.label}</div>
              <div className={`text-sm font-bold ${tech.color} font-cairo`}>{tech.value}</div>
            </div>
          ))}
        </div>

        {/* AI Pipeline */}
        <div className="gradient-border p-8 md:p-12">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-xl border border-amber-400/20">
              ⚡
            </div>
            <h3 className="text-xl font-black text-white font-arabic">مسار معالجة الذكاء الاصطناعي</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pipeline.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                {/* Connector Line */}
                {i < pipeline.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 w-full h-px bg-gradient-to-l from-transparent via-amber-400/30 to-transparent translate-x-1/2" />
                )}

                {/* Number Circle */}
                <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300
                  ${step.color === 'amber' ? 'border-amber-400 bg-amber-400/10' : ''}
                  ${step.color === 'emerald' ? 'border-emerald-400 bg-emerald-400/10' : ''}
                  ${step.color === 'blue' ? 'border-blue-400 bg-blue-400/10' : ''}
                  ${step.color === 'purple' ? 'border-purple-400 bg-purple-400/10' : ''}
                `}>
                  <span className="text-2xl">{step.icon}</span>
                </div>

                <div className={`text-xs font-mono font-bold mb-2
                  ${step.color === 'amber' ? 'text-amber-400' : ''}
                  ${step.color === 'emerald' ? 'text-emerald-400' : ''}
                  ${step.color === 'blue' ? 'text-blue-400' : ''}
                  ${step.color === 'purple' ? 'text-purple-400' : ''}
                `}>
                  {step.num}
                </div>
                <h4 className="text-base font-bold text-white mb-2 font-arabic">{step.title}</h4>
                <p className="text-gray-400 text-xs font-cairo leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { icon: '🔐', title: 'أمان متعدد الطبقات', desc: 'حماية تشفيرية متعددة المستويات لكل بيانات المستخدمين والمعاملات', color: 'text-amber-400' },
            { icon: '⚡', title: 'أداء عالي', desc: 'معالجة آلاف المعاملات في الثانية مع أوقات استجابة قياسية', color: 'text-teal-400' },
            { icon: '🌐', title: 'لامركزية كاملة', desc: 'بنية تحتية موزعة تضمن عدم وجود نقطة فشل مركزية', color: 'text-purple-400' },
          ].map((feat, i) => (
            <div key={i} className="gradient-border p-6 card-hover group">
              <div className="text-3xl mb-4">{feat.icon}</div>
              <h4 className={`text-lg font-bold mb-2 font-arabic ${feat.color}`}>{feat.title}</h4>
              <p className="text-gray-400 text-sm font-cairo leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
