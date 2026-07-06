import { useState } from 'react';

const modules = [
  {
    id: 1,
    icon: '💰',
    name: 'المدفوعات الإسلامية',
    subtitle: 'ManaraPay',
    desc: 'بوابة دفع حلال شاملة تدعم العملات المشفرة الإسلامية والتحويلات الفورية وفق الشريعة.',
    features: ['حساب جارٍ حلال', 'تحويلات بلا فوائد', '+50 عملة مدعومة'],
    color: 'amber',
    gradient: 'from-amber-500/20 to-yellow-500/10',
    border: 'border-amber-400/30',
    glow: 'rgba(245, 158, 11, 0.2)',
    badge: 'متاح',
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  {
    id: 2,
    icon: '📿',
    name: 'الزكاة الرقمية',
    subtitle: 'ZakatChain',
    desc: 'نظام ذكي لحساب وتوزيع الزكاة بشفافية كاملة على البلوكتشين وتتبع المستفيدين في الوقت الفعلي.',
    features: ['حساب تلقائي دقيق', 'توزيع شفاف', 'تقارير سنوية'],
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-400/30',
    glow: 'rgba(16, 185, 129, 0.2)',
    badge: 'متاح',
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  {
    id: 3,
    icon: '🏛️',
    name: 'الوقف اللامركزي',
    subtitle: 'WaqfDAO',
    desc: 'تحويل مفهوم الوقف الإسلامي إلى DAO رقمية — بإدارة جماعية وعوائد مستدامة للمشاريع الخيرية.',
    features: ['تصويت جماعي', 'عوائد DeFi', 'مشاريع خيرية'],
    color: 'purple',
    gradient: 'from-purple-500/20 to-indigo-500/10',
    border: 'border-purple-400/30',
    glow: 'rgba(139, 92, 246, 0.2)',
    badge: 'قريباً',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    id: 4,
    icon: '🤝',
    name: 'التكافل الذكي',
    subtitle: 'TakafulNet',
    desc: 'نظام تأمين إسلامي تعاوني مدعوم بالذكاء الاصطناعي — تقييم المخاطر وتسوية المطالبات بشفافية.',
    features: ['تقييم مخاطر بالذكاء الاصطناعي', 'تسوية تلقائية', 'بلا غرر أو ربا'],
    color: 'cyan',
    gradient: 'from-cyan-500/20 to-sky-500/10',
    border: 'border-cyan-400/30',
    glow: 'rgba(6, 182, 212, 0.2)',
    badge: 'قريباً',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    id: 5,
    icon: '📚',
    name: 'التعليم الإسلامي',
    subtitle: 'IlmHub',
    desc: 'منصة تعلم إسلامي شاملة — الفقه والقرآن والاقتصاد الإسلامي مع شهادات NFT موثقة.',
    features: ['دروس مرئية', 'شهادات NFT', 'علماء معتمدون'],
    color: 'rose',
    gradient: 'from-rose-500/20 to-pink-500/10',
    border: 'border-rose-400/30',
    glow: 'rgba(244, 63, 94, 0.2)',
    badge: 'قريباً',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  {
    id: 6,
    icon: '🌙',
    name: 'التمويل اللامركزي',
    subtitle: 'HalalDeFi',
    desc: 'بروتوكول DeFi متوافق مع الشريعة — استثمار وإقراض وتمويل بلا فوائد ربوية.',
    features: ['مشاركة الأرباح', 'مرابحة رقمية', 'استثمار حلال'],
    color: 'teal',
    gradient: 'from-teal-500/20 to-emerald-500/10',
    border: 'border-teal-400/30',
    glow: 'rgba(20, 184, 166, 0.2)',
    badge: 'مستقبلي',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  {
    id: 7,
    icon: '⛑️',
    name: 'الإغاثة الإنسانية',
    subtitle: 'ReliefDAO',
    desc: 'نظام إغاثة إنساني لامركزي — تبرعات فورية وتوزيع شفاف وأثر موثق على البلوكتشين.',
    features: ['تبرعات عالمية فورية', 'تتبع الإغاثة', 'شراكات دولية'],
    color: 'orange',
    gradient: 'from-orange-500/20 to-amber-500/10',
    border: 'border-orange-400/30',
    glow: 'rgba(249, 115, 22, 0.2)',
    badge: 'مستقبلي',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
];

const colorMap: Record<string, string> = {
  amber: 'text-amber-400',
  emerald: 'text-emerald-400',
  purple: 'text-purple-400',
  cyan: 'text-cyan-400',
  rose: 'text-rose-400',
  teal: 'text-teal-400',
  orange: 'text-orange-400',
};

export default function Features() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="features" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A1628 0%, #071020 50%, #0A1628 100%)' }}>
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400 text-sm font-medium tracking-widest">✦ الوحدات الأساسية ✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 font-arabic">
            <span className="text-gold-gradient">7 وحدات</span> تشكّل منظومة متكاملة
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-cairo leading-relaxed">
            كل وحدة مصممة بدقة لخدمة حاجة إسلامية حقيقية — من المعاملات المالية إلى الزكاة والوقف والتكافل والتعليم
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className={`relative gradient-border p-6 card-hover cursor-default bg-gradient-to-br ${mod.gradient} group`}
              style={{ boxShadow: hovered === mod.id ? `0 0 40px ${mod.glow}` : 'none' }}
              onMouseEnter={() => setHovered(mod.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Badge */}
              <div className={`absolute top-4 left-4 px-2 py-0.5 rounded-full text-xs font-bold border ${mod.badgeColor}`}>
                {mod.badge}
              </div>

              {/* Icon */}
              <div className="text-4xl mb-4 mt-2">{mod.icon}</div>

              {/* Name */}
              <h3 className={`text-base font-black mb-1 font-arabic ${colorMap[mod.color]}`}>
                {mod.name}
              </h3>
              <p className="text-xs text-gray-500 font-cairo mb-3 tracking-wider">{mod.subtitle}</p>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mb-4 font-cairo">
                {mod.desc}
              </p>

              {/* Features List */}
              <div className="space-y-2">
                {mod.features.map((f, fi) => (
                  <div key={fi} className="flex items-center gap-2 text-sm">
                    <span className={`text-xs ${colorMap[mod.color]}`}>✓</span>
                    <span className="text-gray-400 font-cairo text-xs">{f}</span>
                  </div>
                ))}
              </div>

              {/* Learn More */}
              <button className={`mt-5 flex items-center gap-1 text-sm font-bold ${colorMap[mod.color]} hover:gap-2 transition-all duration-200`}>
                <span>اعرف المزيد</span>
                <span>→</span>
              </button>

              {/* Number */}
              <div className="absolute bottom-4 left-4 text-5xl font-black text-white/3 select-none font-cairo">
                {mod.id}
              </div>
            </div>
          ))}

          {/* Coming Soon Card */}
          <div className="relative gradient-border p-6 card-hover cursor-default flex flex-col items-center justify-center min-h-[280px]"
               style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.03), rgba(13,122,110,0.03))' }}>
            <div className="text-4xl mb-4 animate-float">🔮</div>
            <p className="text-amber-400 font-bold font-arabic text-lg">قريباً...</p>
            <p className="text-gray-500 text-xs font-cairo mt-2 text-center">المزيد من الوحدات الإسلامية قادمة</p>
          </div>
        </div>
      </div>
    </section>
  );
}
