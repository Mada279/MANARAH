import { useEffect, useRef } from 'react';

const heroBackgroundUrl = `${import.meta.env.BASE_URL}images/hero-bg.jpg`;

const stats = [
  { value: '01', label: 'بناء الإنسان', icon: '🌱' },
  { value: '02', label: 'تمكين المؤسسة', icon: '🏛️' },
  { value: '03', label: 'قياس الأثر', icon: '📊' },
  { value: '04', label: 'ضمان الاستدامة', icon: '♾️' },
];

export default function Hero() {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsRef.current || starsRef.current.children.length) return;

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
      <div ref={starsRef} className="absolute inset-0 pointer-events-none overflow-hidden" />

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroBackgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(13,122,110,0.5) 0%, transparent 70%)' }}
      />

      <div className="absolute inset-0 islamic-pattern opacity-30 pointer-events-none" />

      <div className="absolute top-20 left-10 w-24 h-24 border border-amber-400/20 rotate-45 animate-spin-slow pointer-events-none hidden md:block" />
      <div
        className="absolute bottom-32 right-10 w-16 h-16 border border-teal-400/20 rotate-12 animate-spin-slow pointer-events-none hidden md:block"
        style={{ animationDirection: 'reverse', animationDuration: '15s' }}
      />
      <div className="absolute top-1/3 right-16 w-2 h-2 bg-amber-400 rounded-full animate-pulse pointer-events-none hidden md:block" />
      <div
        className="absolute bottom-1/3 left-16 w-3 h-3 bg-teal-400 rounded-full animate-pulse pointer-events-none hidden md:block"
        style={{ animationDelay: '1s' }}
      />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-sm font-medium mb-8 animate-fadeInDown backdrop-blur-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>منظومة رقمية متكاملة | Manarah Digital Ecosystem</span>
          <span>✦</span>
        </div>

        <div className="animate-fadeInUp mb-6" style={{ animationDelay: '0.2s' }}>
          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-black font-arabic text-gold-gradient leading-tight mb-3"
            style={{ textShadow: '0 0 60px rgba(201,168,76,0.3)' }}
          >
            منارة
          </h1>
          <p className="text-2xl sm:text-3xl text-amber-200/70 font-light tracking-[0.3em] font-cairo">
            M A N A R A H
          </p>
        </div>

        <div className="animate-fadeInUp mb-4" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/90 leading-relaxed">
            المنظومة الرقمية لبناء الإنسان وتمكين المؤسسة
          </h2>
        </div>

        <div className="animate-fadeInUp mb-4" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-wrap items-center justify-center gap-3 text-lg sm:text-xl text-amber-300/80 font-medium">
            <span>نبني الإنسان</span>
            <span className="text-amber-500">✦</span>
            <span>نمكّن المؤسسة</span>
            <span className="text-amber-500">✦</span>
            <span>نقيس الأثر</span>
            <span className="text-amber-500">✦</span>
            <span>نضمن الاستدامة</span>
          </div>
        </div>

        <p
          className="animate-fadeInUp text-lg sm:text-xl text-gray-300/80 max-w-3xl mx-auto leading-loose mb-10 font-cairo"
          style={{ animationDelay: '0.6s' }}
        >
          منارة ليست تطبيقًا واحدًا، بل بنية رقمية حضارية تجمع <span className="text-amber-400 font-bold">معراج</span> لرحلة الإنسان، و<span className="text-teal-400 font-bold">مشكاة</span> لتمكين المؤسسات، ومحرك الأثر، والوقف الرقمي، وManarah OS في منصة واحدة قابلة للنمو.
        </p>

        <div
          className="animate-fadeInUp flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          style={{ animationDelay: '0.8s' }}
        >
          <button
            onClick={() => scrollTo('#features')}
            className="group px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-navy font-black text-lg rounded-2xl hover:scale-105 transition-all duration-300 glow-gold shadow-2xl animate-gradient"
          >
            <span className="flex items-center gap-2">
              اكتشف المنظومة
              <span className="group-hover:translate-x-1 transition-transform duration-300">←</span>
            </span>
          </button>
          <button
            onClick={() => scrollTo('#roadmap')}
            className="group px-8 py-4 bg-transparent border-2 border-amber-400/50 text-amber-400 font-bold text-lg rounded-2xl hover:bg-amber-400/10 hover:border-amber-400 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              خارطة البناء
              <span>🧭</span>
            </span>
          </button>
        </div>

        <div className="animate-fadeInUp grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto" style={{ animationDelay: '1s' }}>
          {stats.map((stat) => (
            <div key={stat.label} className="gradient-border p-4 text-center card-hover group cursor-default backdrop-blur-sm">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-black text-gold-gradient mb-1 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 font-cairo leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-gray-500 text-xs">اكتشف المزيد</span>
        <div className="w-6 h-10 border-2 border-amber-400/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-amber-400/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
