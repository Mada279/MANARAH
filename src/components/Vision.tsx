const values = [
  { icon: '⚖️', title: 'الامتثال الشرعي', desc: 'كل منتج ومعاملة تحت إشراف هيئة شرعية متخصصة' },
  { icon: '🔗', title: 'الشفافية الكاملة', desc: 'دفتر حسابات مفتوح وموثوق على البلوكتشين لكل عملية مالية' },
  { icon: '🌍', title: 'الأثر العالمي', desc: 'خدمة المجتمعات الإسلامية في كل قارة' },
  { icon: '💡', title: 'الابتكار المستدام', desc: 'تقنيات المستقبل بروح إسلامية أصيلة' },
  { icon: '🤝', title: 'الاقتصاد التشاركي', desc: 'نموذج DeFi إسلامي يرتقي بقيم التعاون والعدالة' },
  { icon: '🛡️', title: 'الأمن والحماية', desc: 'حماية عالية المستوى لأموال المستخدمين وبياناتهم' },
];

export default function Vision() {
  return (
    <section id="vision" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A1628 0%, #0D1F3C 50%, #0A1628 100%)' }}>
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-amber-400/50 to-transparent" />
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400 text-sm font-medium tracking-widest uppercase">✦ الرؤية والمهمة ✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          
          {/* Vision */}
          <div className="gradient-border p-8 card-hover group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full -translate-y-16 translate-x-16 group-hover:bg-amber-400/10 transition-all duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center mb-6 text-2xl border border-amber-400/30">
                🌟
              </div>
              <h3 className="text-2xl font-black text-gold-gradient mb-4 font-arabic">الرؤية</h3>
              <p className="text-gray-300 leading-relaxed text-lg font-cairo">
                أن نصبح <span className="text-amber-400 font-bold">أول بنية تحتية رقمية إسلامية عالمية</span> — منصة شاملة تمكّن المسلمين من إجراء معاملاتهم المالية والرقمية وفق المبادئ الإسلامية في عالم متصل ومتقدم.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="gradient-border p-8 card-hover group relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A2A2A, #0D1F3C)' }}>
            <div className="absolute top-0 left-0 w-32 h-32 bg-teal-400/5 rounded-full -translate-y-16 -translate-x-16 group-hover:bg-teal-400/10 transition-all duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400/20 to-teal-600/20 flex items-center justify-center mb-6 text-2xl border border-teal-400/30">
                🎯
              </div>
              <h3 className="text-2xl font-black text-teal-gradient mb-4 font-arabic">المهمة</h3>
              <p className="text-gray-300 leading-relaxed text-lg font-cairo">
                بناء <span className="text-teal-400 font-bold">منظومة رقمية إسلامية متكاملة</span> تجمع بين تقنية البلوكتشين والذكاء الاصطناعي والفقه الإسلامي لخلق قيمة حقيقية وأثر إيجابي في حياة المسلمين.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400 text-sm font-medium tracking-widest">✦ قيمنا الجوهرية ✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((val, i) => (
            <div
              key={i}
              className="gradient-border p-6 card-hover group cursor-default"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
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
