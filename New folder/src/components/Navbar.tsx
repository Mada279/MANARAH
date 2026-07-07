import { useEffect, useState } from 'react';

const navLinks = [
  { label: 'الرؤية', href: '#vision' },
  { label: 'المنظومة', href: '#features' },
  { label: 'خارطة البناء', href: '#roadmap' },
  { label: 'MVP مشكاة', href: '#mishkat-dashboard' },
  { label: 'Manarah OS', href: '#technology' },
  { label: 'التكاملات', href: '#api' },
  { label: 'الشركاء', href: '#investors' },
  { label: 'المجتمع', href: '#community' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
    setActiveSection(href);
  };

  return (
    <nav className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${scrolled ? 'nav-glass shadow-2xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center glow-gold animate-pulse-gold">
                <span className="text-navy font-bold text-lg">م</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full border-2 border-navy" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gold-gradient font-arabic leading-none">منارة</h1>
              <p className="text-xs text-teal-400 leading-none tracking-wider">MANARAH</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeSection === link.href
                    ? 'text-amber-400 bg-amber-400/10'
                    : 'text-gray-300 hover:text-amber-400 hover:bg-amber-400/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => scrollTo('#investors')}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-navy font-bold text-sm rounded-xl hover:from-amber-400 hover:to-yellow-300 transition-all duration-300 glow-gold"
            >
              ابدأ شراكة
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-amber-400/10 transition-colors"
            aria-label="فتح القائمة"
          >
            <span className={`block h-0.5 w-6 bg-amber-400 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-amber-400 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-amber-400 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden nav-glass border-t border-amber-400/10 animate-fadeInDown">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-right px-4 py-3 rounded-xl text-gray-300 hover:text-amber-400 hover:bg-amber-400/10 transition-all duration-200 font-medium"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-amber-400/10 flex gap-3">
              <button
                onClick={() => scrollTo('#investors')}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-navy font-bold rounded-xl text-center"
              >
                ابدأ شراكة 🤝
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
