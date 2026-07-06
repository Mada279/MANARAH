import { useEffect, useRef } from 'react';

const stats = [
  { value: '1.8B', label: 'مسلم حول العالم', icon: '🌙' },
  { value: '$3.8T', label: 'الاقتصاد الإسلامي', icon: '💎' },
  { value: '7', label: 'وحدات متكاملة', icon: '⛓' },
  { value: '2025', label: 'الإطلاق الرسمي', icon: '🚀' },
];

export default function Hero() {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsRef.current) return;
    const container = starsRef.current;
    for (let i = 0; i < 80; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 3 + 1;
      star.className = 'star';
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.8 + 0.2};
        animation: starTwinkle ${Math.random() * 4 + 2}s ${Math.random() * 3}s ease-in-out infinite;
      `;
      container.appendChild(star);
    }
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #030B1A 0%, #0A1628 30%, #0D1F3C 60%, #071525 100%)',
      }}
    >
      {/* Stars Background */}
      <div ref={starsRef} className="absolute inset-0 pointer-events-none overflow-hidden" />

      {/* Hero BG Image with Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)' }}
      />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(13,122,110,0.5) 0%, transparent 70%)' }}
      />

      {/* Islamic Pattern Overlay */}
      <div className="absolute inset-0 islamic-pattern opacity-30 pointer-events-none" />

      {/* Geometric Decorations */}
      <div className="absolute top-20 left-10 w-24 h-24 border border-amber-400/20 rotate-45 animate-spin-slow pointer-events-none hidden md:block" />
      <div className="absolute bottom-32 right-10 w-16 h-16 border border-teal-400/20 rotate-12 animate-spin-slow pointer-events-none hidden md:block" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
      <div className="absolute top-1/3 right-16 w-2 h-2 bg-amber-400 rounded-full animate-pulse pointer-events-none hidden md:block" />
      <div className="absolute bottom-1/3 left-16 w-3 h-3 bg-teal-400 rounded-full animate-pulse pointer-events-none hidden md:block" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-sm font-medium mb-8 animate-fadeInDown backdrop-blur-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span>منصة إسلامية رقمية | فكرة أبو عمير محمد فرج</span>
          <span>🌙</span>
        </div>

        {/* Main Title */}
        <div className="animate-fadeInUp mb-6" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black font-arabic text-gold-gradient leading-tight mb-3"
              style={{ textShadow: '0 0 60px rgba(201,168,76,0.3)' }}>
            منارة
          </h1>
          <p className="text-2xl sm:text-3xl text-amber-200/70 font-light tracking-[0.3em] font-cairo">
            M A N A R A
          </p>
        </div>

        {/* Tagline */}
        <div className="animate-fadeInUp mb-4" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/90 leading-relaxed">
            البنية التحتية الإسلامية{' '}
            <span className="text-gold-gradient">للمستقبل</span>
          </h2>
        </div>

        {/* Sub Tagline */}
        <div className="animate-fadeInUp mb-4" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-center gap-3 text-lg sm:text-xl text-amber-300/80 font-medium">
            <span>أمة واحدة</span>
            <span className="text-amber-500">✦</span>
            <span>سلسلة واحدة</span>
            <span className="text-amber-500">✦</span>
            <span>مستقبل واحد</span>
          </div>
        </div>

        {/* Description */}
        <p className="animate-fadeInUp text-lg sm:text-xl text-gray-300/80 max-w-3xl mx-auto leading-loose mb-10 font-cairo"
           style={{ animationDelay: '0.6s' }}>
          بناء المنظومة الإسلامية الرقمية الشاملة — تجمع بين الذكاء الاصطناعي وتقنية البلوكتشين والقيم الإسلامية في منصة موحدة تخدم{' '}
          <span className="text-amber-400 font-bold">1.8 مليار مسلم</span> حول العالم
        </p>

        {/* CTA Buttons */}
        <div className="animate-fadeInUp flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
             style={{ animationDelay: '0.8s' }}>
          <button
            onClick={() => scrollTo('#features')}
            className="group px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-navy font-black text-lg rounded-2xl hover:scale-105 transition-all duration-300 glow-gold shadow-2xl animate-gradient"
          >
            <span className="flex items-center gap-2">
              ابدأ الآن
              <span className="group-hover:translate-x-1 transition-transform duration-300">←</span>
            </span>
          </button>
          <button
            onClick={() => scrollTo('#investors')}
            className="group px-8 py-4 bg-transparent border-2 border-amber-400/50 text-amber-400 font-bold text-lg rounded-2xl hover:bg-amber-400/10 hover:border-amber-400 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              للمستثمرين
              <span>📊</span>
            </span>
          </button>
        </div>

        {/* Stats */}
        <div className="animate-fadeInUp grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
             style={{ animationDelay: '1s' }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              className="gradient-border p-4 text-center card-hover group cursor-default backdrop-blur-sm"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-black text-gold-gradient mb-1 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 font-cairo leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-gray-500 text-xs">اكتشف المزيد</span>
        <div className="w-6 h-10 border-2 border-amber-400/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-amber-400/60 rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
