const values = [
  { icon: '🌱', title: 'الإنسان أولًا', desc: 'كل قرار تقني يجب أن يخدم رحلة الإنسان ونموه لا أن يزيد تعقيده.' },
  { icon: '🏛️', title: 'تمكين المؤسسة', desc: 'نمنح المؤسسات أدوات تشغيل وحوكمة تساعدها على أداء رسالتها بكفاءة.' },
  { icon: '📊', title: 'الأثر معيار النجاح', desc: 'لا تكتمل أي مبادرة حتى يصبح أثرها قابلًا للقياس والتحسين.' },
  { icon: '📚', title: 'المعرفة أصل', desc: 'المحتوى والخبرات والبيانات تتحول إلى شبكة معرفة حية تخدم الجميع.' },
  { icon: '♾️', title: 'الاستدامة', desc: 'الوقف ونماذج التشغيل المستدامة جزء من تصميم المنظومة منذ البداية.' },
  { icon: '🛡️', title: 'الأمانة والحوكمة', desc: 'الشفافية والصلاحيات وسجلات التدقيق أساس الثقة داخل المنظومة.' },
];

export default function Vision() {
  return (
    <section id="vision" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A1628 0%, #0D1F3C 50%, #0A1628 100%)' }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-amber-400/50 to-transparent" />
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400 text-sm font-medium tracking-widest uppercase">✦ الرؤية والرسالة ✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 font-arabic">
            مشروع حضاري يبدأ من <span className="text-gold-gradient">الإنسان</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto font-cairo leading-relaxed">
            التقنية في منارة وسيلة لبناء رحلة متكاملة تربط الفرد بالمؤسسة والمعرفة والمجتمع والوقف والأثر.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="gradient-border p-8 card-hover group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full -translate-y-16 translate-x-16 group-hover:bg-amber-400/10 transition-all duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center mb-6 text-2xl border border-amber-400/30">
                🌟
              </div>
              <h3 className="text-2xl font-black text-gold-gradient mb-4 font-arabic">الرؤية</h3>
              <p className="text-gray-300 leading-relaxed text-lg font-cairo">
                أن تصبح منارة <span className="text-amber-400 font-bold">البنية الرقمية المرجعية عالميًا</span> لتمكين الإنسان والمؤسسات ذات الرسالة من خلال المعرفة، والحوكمة، والذكاء الاصطناعي، وقياس الأثر، والاستدامة الوقفية.
              </p>
            </div>
          </div>

          <div className="gradient-border p-8 card-hover group relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A2A2A, #0D1F3C)' }}>
            <div className="absolute top-0 left-0 w-32 h-32 bg-teal-400/5 rounded-full -translate-y-16 -translate-x-16 group-hover:bg-teal-400/10 transition-all duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400/20 to-teal-600/20 flex items-center justify-center mb-6 text-2xl border border-teal-400/30">
                🎯
              </div>
              <h3 className="text-2xl font-black text-teal-gradient mb-4 font-arabic">الرسالة</h3>
              <p className="text-gray-300 leading-relaxed text-lg font-cairo">
                تطوير منظومة رقمية تساعد الفرد على النمو، وتمكّن المؤسسات من إدارة أعمالها بكفاءة، وتربط المتبرعين والمستفيدين والمتطوعين في شبكة تقوم على <span className="text-teal-400 font-bold">الشفافية وقياس الأثر والاستدامة</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400 text-sm font-medium tracking-widest">✦ المبادئ الحاكمة ✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((val, i) => (
            <div key={val.title} className="gradient-border p-6 card-hover group cursor-default" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center text-xl flex-shrink-0 border border-amber-400/20 group-hover:bg-amber-400/20 transition-all duration-300">
                  {val.icon}
                </div>
                <div>
                  <h4 className="text-base font-bold text-amber-300 mb-2 font-arabic">{val.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed font-cairo">{val.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
