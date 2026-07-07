import { useState } from 'react';

const modules = [
  {
    id: 1,
    icon: '🌱',
    name: 'معراج',
    subtitle: 'Meraj | رحلة الإنسان',
    desc: 'رفيق رقمي لبناء الإنسان عبر الإيمان والمعرفة والمهارات والعادات والتطوع والعطاء.',
    features: ['ملف شخصي ذكي', 'رحلات نمو متكاملة', 'مساعد شخصي بالذكاء الاصطناعي'],
    color: 'amber',
    gradient: 'from-amber-500/20 to-yellow-500/10',
    glow: 'rgba(245, 158, 11, 0.2)',
    badge: 'منتج أساسي',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 2,
    icon: '🏛️',
    name: 'مشكاة',
    subtitle: 'Mishkat | تشغيل المؤسسات',
    desc: 'منصة لإدارة المؤسسات ذات الرسالة، وتشمل المدارس ودور التحفيظ: الفصول، الطلاب، المعلمون، الموارد البشرية، الماليات، والبرامج.',
    features: ['مدارس ودور تحفيظ', 'فصول وطلاب وموارد بشرية', 'ماليات وتقدم علمي'], 
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    glow: 'rgba(16, 185, 129, 0.2)',
    badge: 'MVP مقترح',
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  {
    id: 3,
    icon: '📊',
    name: 'محرك الأثر',
    subtitle: 'Impact Intelligence',
    desc: 'طبقة ذكاء تحول بيانات البرامج والمؤسسات إلى مؤشرات أثر وقرارات وتوصيات قابلة للتنفيذ.',
    features: ['KPIs و SROI', 'قصص نجاح', 'تحليلات وتوصيات'],
    color: 'blue',
    gradient: 'from-blue-500/20 to-cyan-500/10',
    glow: 'rgba(59, 130, 246, 0.2)',
    badge: 'طبقة مركزية',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    id: 4,
    icon: '♾️',
    name: 'الوقف الرقمي',
    subtitle: 'Digital Waqf',
    desc: 'منصة لإدارة الأصول الوقفية والعوائد والمصارف والحوكمة وربط التمويل بالأثر الحقيقي.',
    features: ['أصول وعوائد', 'مصارف وحوكمة', 'تقارير أثر وشفافية'],
    color: 'purple',
    gradient: 'from-purple-500/20 to-indigo-500/10',
    glow: 'rgba(139, 92, 246, 0.2)',
    badge: 'استدامة',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  {
    id: 5,
    icon: '⚙️',
    name: 'Manarah OS',
    subtitle: 'الطبقة المشتركة',
    desc: 'نواة المنظومة: الهوية، المؤسسات، الصلاحيات، النماذج، سير العمل، المستندات، التقارير، والتكاملات.',
    features: ['هوية وصلاحيات', 'Workflow و Forms', 'API و Audit Log'],
    color: 'cyan',
    gradient: 'from-cyan-500/20 to-sky-500/10',
    glow: 'rgba(6, 182, 212, 0.2)',
    badge: 'الأساس',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  },
  {
    id: 6,
    icon: '📚',
    name: 'المعرفة والأكاديمية',
    subtitle: 'Knowledge + Academy',
    desc: 'مكتبة ودورات ومسارات تعلم وشهادات وفهرسة معرفية تربط المحتوى بالإنسان والمؤسسة والأثر.',
    features: ['مكتبة رقمية', 'مسارات تعلم', 'بحث دلالي'],
    color: 'rose',
    gradient: 'from-rose-500/20 to-pink-500/10',
    glow: 'rgba(244, 63, 94, 0.2)',
    badge: 'معرفة',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  },
  {
    id: 7,
    icon: '🤝',
    name: 'مجتمع منارة',
    subtitle: 'Community',
    desc: 'مساحة للمجموعات والمبادرات والتطوع والنقاشات وربط الأفراد بالفرص والمؤسسات.',
    features: ['مجموعات ومبادرات', 'فرص تطوع', 'تفاعل مجتمعي'],
    color: 'teal',
    gradient: 'from-teal-500/20 to-emerald-500/10',
    glow: 'rgba(20, 184, 166, 0.2)',
    badge: 'تفاعل',
    badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  },
  {
    id: 8,
    icon: '🔌',
    name: 'بوابة المطورين',
    subtitle: 'Developer Portal',
    desc: 'واجهات API و SDK و Webhooks لربط منارة مع الأنظمة التعليمية والمالية والمؤسسية الأخرى.',
    features: ['REST/GraphQL', 'Webhooks', 'بيئة Sandbox'],
    color: 'orange',
    gradient: 'from-orange-500/20 to-amber-500/10',
    glow: 'rgba(249, 115, 22, 0.2)',
    badge: 'تكاملات',
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
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
  blue: 'text-blue-400',
};

export default function Features() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="features" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A1628 0%, #071020 50%, #0A1628 100%)' }}>
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400 text-sm font-medium tracking-widest">✦ مكونات المنظومة ✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 font-arabic">
            منصات مترابطة فوق <span className="text-gold-gradient">نواة واحدة</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto font-cairo leading-relaxed">
            كل مكوّن في منارة يخدم رحلة واضحة: الإنسان يتعلّم وينمو، المؤسسة تعمل بكفاءة، الأثر يُقاس، والاستدامة تُبنى عبر الوقف والمعرفة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className={`relative gradient-border p-6 card-hover cursor-default bg-gradient-to-br ${mod.gradient} group`}
              style={{ boxShadow: hovered === mod.id ? `0 0 40px ${mod.glow}` : 'none' }}
              onMouseEnter={() => setHovered(mod.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={`absolute top-4 left-4 px-2 py-0.5 rounded-full text-xs font-bold border ${mod.badgeColor}`}>
                {mod.badge}
              </div>

              <div className="text-4xl mb-4 mt-2">{mod.icon}</div>

              <h3 className={`text-base font-black mb-1 font-arabic ${colorMap[mod.color]}`}>{mod.name}</h3>
              <p className="text-xs text-gray-500 font-cairo mb-3 tracking-wider">{mod.subtitle}</p>

              <p className="text-gray-400 text-sm leading-relaxed mb-4 font-cairo">{mod.desc}</p>

              <div className="space-y-2">
                {mod.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <span className={`text-xs ${colorMap[mod.color]}`}>✓</span>
                    <span className="text-gray-400 font-cairo text-xs">{f}</span>
                  </div>
                ))}
              </div>

              <div className={`mt-5 flex items-center gap-1 text-sm font-bold ${colorMap[mod.color]}`}>
                <span>ضمن المنظومة</span>
                <span>→</span>
              </div>

              <div className="absolute bottom-4 left-4 text-5xl font-black text-white/3 select-none font-cairo">{mod.id}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
