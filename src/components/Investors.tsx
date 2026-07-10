import { useState, type FormEvent } from 'react';

const partnerStats = [
  { value: 'MVP', label: 'بداية عملية', sub: 'منتج صغير قابل للتجربة', icon: '🧩', color: 'text-amber-400' },
  { value: 'OS', label: 'نواة مشتركة', sub: 'قابلة لتشغيل عدة منتجات', icon: '⚙️', color: 'text-teal-400' },
  { value: 'Impact', label: 'أثر قابل للقياس', sub: 'مؤشرات وتقارير وقرارات', icon: '📊', color: 'text-purple-400' },
  { value: 'Waqf', label: 'استدامة طويلة', sub: 'وقف وتمويل وحوكمة', icon: '♾️', color: 'text-rose-400' },
];

const opportunities = [
  {
    status: 'مناسب الآن',
    name: 'مؤسسات تجريبية',
    nameEn: 'Pilot Organizations',
    amount: 'Mishkat MVP',
    timing: 'تشغيل مؤسسي مبكر',
    timingColor: 'text-green-400',
    borderColor: 'border-amber-400',
    bgColor: 'from-amber-500/15 to-transparent',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    badgeColor: 'bg-green-500 text-white',
    features: ['تجربة إدارة البرامج والمستفيدين', 'تحديد مؤشرات الأثر', 'تحسين سير العمل', 'تغذية راجعة مباشرة للفريق'],
  },
  {
    status: 'شراكة',
    name: 'أوقاف وجهات مانحة',
    nameEn: 'Waqf & Grant Partners',
    amount: 'Digital Waqf',
    timing: 'استدامة وحوكمة',
    timingColor: 'text-blue-400',
    borderColor: 'border-blue-400',
    bgColor: 'from-blue-500/15 to-transparent',
    glowColor: 'rgba(59, 130, 246, 0.2)',
    badgeColor: 'bg-blue-500/30 text-blue-300 border border-blue-500/50',
    features: ['ربط التمويل بالأثر', 'تقارير شفافة', 'حوكمة المصارف', 'بناء نماذج استدامة طويلة الأجل'],
  },
  {
    status: 'تكاملات',
    name: 'مطورو الأنظمة',
    nameEn: 'Developers & Integrators',
    amount: 'API Platform',
    timing: 'ربط منظومي',
    timingColor: 'text-purple-400',
    borderColor: 'border-purple-400',
    bgColor: 'from-purple-500/15 to-transparent',
    glowColor: 'rgba(139, 92, 246, 0.2)',
    badgeColor: 'bg-purple-500/30 text-purple-300 border border-purple-500/50',
    features: ['تكامل مع LMS/ERP/CRM', 'Webhooks و API', 'تبادل بيانات آمن', 'بناء إضافات فوق Manarah OS'],
  },
];

export default function Investors() {
  const [formData, setFormData] = useState({ name: '', email: '', type: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="investors" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A1628 0%, #0D1F3C 100%)' }}>
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 pointer-events-none" style={{ background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400 text-sm font-medium tracking-widest">✦ الشركاء والبناء المشترك ✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 font-arabic">
            نبدأ من <span className="text-gold-gradient">مشكلة حقيقية</span> لا من عرض تسويقي
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto font-cairo leading-relaxed">
            المرحلة الأنسب لمنارة هي التعاون مع مؤسسات ذات رسالة لتجربة Mishkat MVP ومحرك الأثر، ثم التوسع بناءً على احتياج واقعي وبيانات فعلية.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {partnerStats.map((stat) => (
            <div key={stat.label} className="gradient-border p-6 text-center card-hover group">
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className={`text-2xl sm:text-3xl font-black mb-1 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>{stat.value}</div>
              <div className="text-gray-400 text-xs font-cairo mb-1">{stat.label}</div>
              <div className="text-gray-500 text-xs font-cairo">{stat.sub}</div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-black text-white mb-8 font-arabic flex items-center gap-2">
          <span className="text-amber-400">🤝</span> فرص الشراكة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {opportunities.map((item) => (
            <div
              key={item.name}
              className={`relative gradient-border p-6 card-hover bg-gradient-to-b ${item.bgColor} border-2 ${item.borderColor}`}
              style={{ boxShadow: item.status === 'مناسب الآن' ? `0 0 40px ${item.glowColor}` : 'none' }}
            >
              <div className={`absolute -top-3 right-4 px-4 py-1 rounded-full text-xs font-bold ${item.badgeColor}`}>{item.status}</div>

              <div className="mt-2">
                <h4 className="text-xl font-black text-white font-arabic mb-1">{item.name}</h4>
                <p className="text-gray-500 text-xs font-cairo mb-4">{item.nameEn}</p>

                <div className="text-3xl font-black text-gold-gradient mb-2">{item.amount}</div>
                <div className={`text-sm font-medium ${item.timingColor} mb-6 font-cairo`}>{item.timing}</div>

                <div className="space-y-2 mb-6">
                  {item.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-400 font-cairo">
                      <span className="text-amber-400 text-xs">✦</span>
                      {f}
                    </div>
                  ))}
                </div>

                <button className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 bg-white/5 text-gray-300 border border-white/10 hover:bg-amber-400/10 hover:text-amber-300 hover:border-amber-400/30">
                  ناقش الشراكة
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="gradient-border p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h3 className="text-2xl font-black text-white mb-4 font-arabic">📩 تواصل لبناء تجربة أولى</h3>
              <p className="text-gray-400 font-cairo leading-relaxed mb-6">
                إذا كنت تمثل مؤسسة خيرية أو تعليمية أو وقفية أو فريقًا تقنيًا، يمكننا تحويل احتياجك إلى تجربة عملية داخل خارطة منارة.
              </p>
              <div className="space-y-3">
                {[
                  { icon: '📧', text: 'hello@manarah.io' },
                  { icon: '🧭', text: 'Pilot: Mishkat + Impact Dashboard' },
                  { icon: '🔌', text: 'API-ready ecosystem approach' },
                ].map((info) => (
                  <div key={info.text} className="flex items-center gap-3 text-gray-400 font-cairo text-sm">
                    <span>{info.icon}</span>
                    <span className="text-teal-400" dir="ltr">{info.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-green-400 font-bold font-arabic text-lg">تم تسجيل اهتمامك!</p>
                  <p className="text-gray-400 font-cairo text-sm mt-2">هذه نسخة واجهة فقط؛ سيتم ربط النموذج لاحقًا بخدمة فعلية.</p>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="الاسم أو اسم المؤسسة"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 font-cairo text-sm focus:outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all"
                  />
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 font-cairo text-sm focus:outline-none focus:border-amber-400/50 transition-all"
                  />
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 font-cairo text-sm focus:outline-none focus:border-amber-400/50 transition-all"
                    required
                  >
                    <option value="">نوع الشراكة</option>
                    <option>مؤسسة ترغب في تجربة MVP</option>
                    <option>جهة وقفية أو مانحة</option>
                    <option>شريك تقني أو مطور</option>
                    <option>مستشار أو خبير مجال</option>
                  </select>
                  <textarea
                    placeholder="ما المشكلة أو الاحتياج الذي تريد حله؟"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 font-cairo text-sm focus:outline-none focus:border-amber-400/50 transition-all resize-none"
                  />
                  <button type="submit" className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-navy font-black rounded-xl hover:from-amber-400 hover:to-yellow-300 transition-all duration-300 glow-gold text-sm">
                    إرسال طلب الشراكة 📩
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
