import { useState } from 'react';

const marketStats = [
  { value: '1.8B', label: 'مسلم حول العالم', sub: '+2.5% سنوياً', icon: '🌍', color: 'text-amber-400' },
  { value: '$3.8T', label: 'حجم الاقتصاد الإسلامي', sub: 'بحلول 2025', icon: '📈', color: 'text-teal-400' },
  { value: '$2.8T', label: 'أصول التمويل الإسلامي', sub: 'نمو 10% سنوياً', icon: '💎', color: 'text-purple-400' },
  { value: '72%', label: 'مسلمون بلا خدمات مالية', sub: 'فرصة غير مستغلة', icon: '🎯', color: 'text-rose-400' },
];

const rounds = [
  {
    status: 'LIVE',
    name: 'جولة البذور',
    nameEn: 'Seed Round',
    amount: '$2M',
    timing: 'مفتوح الآن',
    timingColor: 'text-green-400',
    borderColor: 'border-amber-400',
    bgColor: 'from-amber-500/15 to-transparent',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    badgeColor: 'bg-green-500 text-white',
    features: ['حصة في المنصة الأساسية', 'وصول مبكر لجميع الوحدات', 'مقعد في مجلس المستشارين', 'نسبة أرباح مضاعفة'],
  },
  {
    status: 'قادمة',
    name: 'Series A',
    nameEn: 'Series A Round',
    amount: '$15M',
    timing: 'الربع الثالث 2025',
    timingColor: 'text-blue-400',
    borderColor: 'border-blue-400',
    bgColor: 'from-blue-500/15 to-transparent',
    glowColor: 'rgba(59, 130, 246, 0.2)',
    badgeColor: 'bg-blue-500/30 text-blue-300 border border-blue-500/50',
    features: ['توسع في 15 دولة', 'إطلاق Mainnet', 'برنامج المطورين', 'شراكات استراتيجية'],
  },
  {
    status: 'مستقبلي',
    name: 'IDO / IEO',
    nameEn: 'Public Offering',
    amount: '$50M',
    timing: 'الربع الأول 2026',
    timingColor: 'text-purple-400',
    borderColor: 'border-purple-400',
    bgColor: 'from-purple-500/15 to-transparent',
    glowColor: 'rgba(139, 92, 246, 0.2)',
    badgeColor: 'bg-purple-500/30 text-purple-300 border border-purple-500/50',
    features: ['طرح عام للرمز MNR', 'إدراج في بورصات كبرى', 'توسع عالمي', '10M مستخدم'],
  },
];

export default function Investors() {
  const [formData, setFormData] = useState({ name: '', email: '', amount: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="investors" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A1628 0%, #0D1F3C 100%)' }}>
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />

      {/* Gold glow */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400 text-sm font-medium tracking-widest">✦ فرصة الاستثمار ✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 font-arabic">
            سوق بقيمة <span className="text-gold-gradient">$3.8 تريليون</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-cairo">
            الاقتصاد الإسلامي ينمو بسرعة كبيرة — ونحن في قلب هذه الثورة الرقمية
          </p>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {marketStats.map((stat, i) => (
            <div key={i} className="gradient-border p-6 text-center card-hover group">
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className={`text-2xl sm:text-3xl font-black mb-1 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
              <div className="text-gray-400 text-xs font-cairo mb-1">{stat.label}</div>
              <div className="text-gray-500 text-xs font-cairo">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Funding Rounds */}
        <h3 className="text-xl font-black text-white mb-8 font-arabic flex items-center gap-2">
          <span className="text-amber-400">💰</span> جولات التمويل
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {rounds.map((round, i) => (
            <div
              key={i}
              className={`relative gradient-border p-6 card-hover bg-gradient-to-b ${round.bgColor} border-2 ${round.borderColor}`}
              style={{
                boxShadow: round.status === 'LIVE' ? `0 0 40px ${round.glowColor}` : 'none',
              }}
            >
              {/* Status Badge */}
              <div className={`absolute -top-3 right-4 px-4 py-1 rounded-full text-xs font-bold ${round.badgeColor}`}>
                {round.status}
              </div>

              <div className="mt-2">
                <h4 className="text-xl font-black text-white font-arabic mb-1">{round.name}</h4>
                <p className="text-gray-500 text-xs font-cairo mb-4">{round.nameEn}</p>

                <div className="text-4xl font-black text-gold-gradient mb-2">{round.amount}</div>
                <div className={`text-sm font-medium ${round.timingColor} mb-6 font-cairo`}>{round.timing}</div>

                <div className="space-y-2 mb-6">
                  {round.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2 text-sm text-gray-400 font-cairo">
                      <span className="text-amber-400 text-xs">✦</span>
                      {f}
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                    round.status === 'LIVE'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-navy hover:from-amber-400 hover:to-yellow-300 glow-gold'
                      : 'bg-white/5 text-gray-400 border border-white/10 cursor-not-allowed'
                  }`}
                >
                  {round.status === 'LIVE' ? 'استثمر الآن' : 'قريباً'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="gradient-border p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h3 className="text-2xl font-black text-white mb-4 font-arabic">
                📩 تواصل مع فريق الاستثمار
              </h3>
              <p className="text-gray-400 font-cairo leading-relaxed mb-6">
                هل أنت مستثمر مؤسسي أو ملاك أو صندوق استثماري؟ تواصل معنا مباشرة للحصول على نشرة الاستثمار الكاملة والجلسة التعريفية.
              </p>
              <div className="space-y-3">
                {[
                  { icon: '📧', text: 'invest@manara.io' },
                  { icon: '📱', text: '+966 XX XXX XXXX' },
                  { icon: '🌐', text: 'manara.io/investors' },
                ].map((info, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-400 font-cairo text-sm">
                    <span>{info.icon}</span>
                    <span className="text-teal-400">{info.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-green-400 font-bold font-arabic text-lg">تم الإرسال بنجاح!</p>
                  <p className="text-gray-400 font-cairo text-sm mt-2">سيتواصل معك فريقنا قريباً</p>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="الاسم الكامل"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 font-cairo text-sm focus:outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all"
                  />
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 font-cairo text-sm focus:outline-none focus:border-amber-400/50 transition-all"
                  />
                  <select
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 font-cairo text-sm focus:outline-none focus:border-amber-400/50 transition-all"
                  >
                    <option value="">حجم الاستثمار المتوقع</option>
                    <option>$10K - $50K</option>
                    <option>$50K - $250K</option>
                    <option>$250K - $1M</option>
                    <option>أكثر من $1M</option>
                  </select>
                  <textarea
                    placeholder="رسالتك أو استفسارك..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 font-cairo text-sm focus:outline-none focus:border-amber-400/50 transition-all resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-navy font-black rounded-xl hover:from-amber-400 hover:to-yellow-300 transition-all duration-300 glow-gold text-sm"
                  >
                    إرسال الطلب 📩
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
