import { useState, type FormEvent } from 'react';

const mosqueBackgroundUrl = `${import.meta.env.BASE_URL}images/mosque-bg.jpg`;

const impactStats = [
  { value: 'تعلم', label: 'رحلات معرفة', desc: 'ربط الدورات والمكتبة والشهادات بسجل نمو المستخدم', icon: '📖' },
  { value: 'تطوع', label: 'ساعات ومبادرات', desc: 'تحويل المشاركة المجتمعية إلى أثر مرئي وقابل للقياس', icon: '🤝' },
  { value: 'مؤسسة', label: 'تشغيل وحوكمة', desc: 'تمكين المؤسسات من تنظيم أعمالها وقياس نتائجها', icon: '🏛️' },
  { value: 'وقف', label: 'استدامة', desc: 'ربط الموارد طويلة الأجل بالمشاريع والمستفيدين والأثر', icon: '♾️' },
];

const socials = [
  { icon: '𝕏', label: 'Twitter / X', handle: '@Manarah', color: 'hover:text-white', bg: 'hover:bg-white/10', href: '#' },
  { icon: '💬', label: 'Telegram', handle: 't.me/Manarah', color: 'hover:text-blue-400', bg: 'hover:bg-blue-400/10', href: '#' },
  { icon: '💼', label: 'LinkedIn', handle: 'Manarah', color: 'hover:text-blue-500', bg: 'hover:bg-blue-500/10', href: '#' },
  { icon: '💻', label: 'Developers', handle: 'developers.manarah.io', color: 'hover:text-indigo-400', bg: 'hover:bg-indigo-400/10', href: '#' },
  { icon: '🐙', label: 'GitHub', handle: 'github.com/manarah', color: 'hover:text-gray-300', bg: 'hover:bg-white/10', href: '#' },
  { icon: '📹', label: 'YouTube', handle: 'Manarah', color: 'hover:text-red-400', bg: 'hover:bg-red-400/10', href: '#' },
];

export default function Community() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section id="community" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0D1F3C 0%, #0A1628 100%)' }}>
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-8"
        style={{
          backgroundImage: `url(${mosqueBackgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400 text-sm font-medium tracking-widest">✦ المجتمع والأثر ✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 font-arabic">
            مجتمع يصنع <span className="text-gold-gradient">أثرًا مستدامًا</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-cairo leading-relaxed">
            هدف منارة أن تصبح مساحة يلتقي فيها الإنسان والمؤسسة والمعرفة والوقف، لاكتشاف الفرص، وتوثيق الجهود، وتحويل المشاركة إلى أثر حقيقي.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {impactStats.map((stat) => (
            <div key={stat.label} className="gradient-border p-6 text-center card-hover group">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-black text-gold-gradient mb-1 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
              <div className="text-amber-300 text-sm font-bold font-arabic mb-2">{stat.label}</div>
              <div className="text-gray-500 text-xs font-cairo leading-relaxed">{stat.desc}</div>
            </div>
          ))}
        </div>

        <div className="gradient-border p-8 mb-10">
          <h3 className="text-xl font-black text-white mb-8 font-arabic text-center flex items-center justify-center gap-2">
            <span>🌐</span> قنوات التواصل المقترحة
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {socials.map((social) => (
              <a key={social.label} href={social.href} className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 cursor-pointer transition-all duration-300 ${social.bg} ${social.color} group`}>
                <span className="text-2xl">{social.icon}</span>
                <span className="text-xs font-bold text-gray-400 group-hover:text-inherit transition-colors font-cairo">{social.label}</span>
                <span className="text-xs text-gray-600 group-hover:text-inherit transition-colors font-mono text-center" dir="ltr">{social.handle}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="gradient-border p-8 md:p-12 text-center" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.05), rgba(13,122,110,0.05))' }}>
          <div className="text-4xl mb-4">📬</div>
          <h3 className="text-2xl font-black text-white mb-3 font-arabic">انضم إلى رحلة بناء منارة</h3>
          <p className="text-gray-400 font-cairo mb-8 max-w-xl mx-auto leading-relaxed">
            تابع تطور المنظومة من الرؤية إلى المنتج، واحصل على تحديثات حول Manarah OS وMishkat MVP ومحرك الأثر.
          </p>

          {subscribed ? (
            <div className="inline-flex flex-col items-center gap-3">
              <div className="text-5xl animate-scaleIn">🎉</div>
              <p className="text-green-400 font-bold font-arabic text-xl">أهلاً بك في رحلة منارة!</p>
              <p className="text-gray-400 font-cairo text-sm">تم تسجيلك محليًا في هذه الواجهة التجريبية</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 font-cairo text-sm focus:outline-none focus:border-amber-400/50 transition-all"
              />
              <button type="submit" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-navy font-black rounded-xl hover:from-amber-400 hover:to-yellow-300 transition-all duration-300 glow-gold whitespace-nowrap text-sm">
                تابع الرحلة
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
