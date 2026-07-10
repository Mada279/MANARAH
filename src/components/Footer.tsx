const footerLinks = {
  ecosystem: {
    title: 'المنظومة',
    links: ['معراج', 'مشكاة', 'محرك الأثر', 'الوقف الرقمي', 'المعرفة والأكاديمية', 'مجتمع منارة'],
  },
  platform: {
    title: 'Manarah OS',
    links: ['الهوية', 'المؤسسات', 'سير العمل', 'النماذج', 'التقارير', 'API والتكاملات'],
  },
  company: {
    title: 'المشروع',
    links: ['الرؤية', 'خارطة البناء', 'الشركاء', 'الوثائق', 'تواصل معنا'],
  },
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-amber-400/10" style={{ background: 'linear-gradient(180deg, #0A1628 0%, #050D1A 100%)' }}>
      <div className="absolute inset-0 islamic-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center glow-gold">
                <span className="text-navy font-black text-xl">م</span>
              </div>
              <div>
                <h2 className="text-2xl font-black text-gold-gradient font-arabic">منارة</h2>
                <p className="text-xs text-teal-400 tracking-widest">MANARAH</p>
              </div>
            </div>

            <p className="text-gray-400 font-cairo text-sm leading-relaxed mb-6 max-w-xs">
              منظومة رقمية لبناء الإنسان، وتمكين المؤسسة، وقياس الأثر، وضمان الاستدامة.
            </p>

            <p className="text-gray-600 text-xs font-arabic mb-3">نبني الإنسان... ونمكّن المؤسسة... ونقيس الأثر... ونضمن الاستدامة.</p>

            <div className="flex items-center gap-3">
              {['𝕏', '💬', '💼', '🐙', '📹'].map((icon) => (
                <button key={icon} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-amber-400/10 border border-white/5 hover:border-amber-400/30 flex items-center justify-center text-sm transition-all duration-300 hover:scale-110">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="text-white font-bold mb-4 font-arabic text-sm">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-500 hover:text-amber-400 text-sm font-cairo transition-colors duration-200 hover:translate-x-1 inline-block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="section-divider" />

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-gray-600 text-xs font-cairo text-center sm:text-right">
            © 2026 منارة | MANARAH. جميع الحقوق محفوظة.
            <span className="text-gray-700 mx-2">|</span>
            <span>بُنيت لخدمة الإنسان والمؤسسات ذات الرسالة</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-600 font-cairo">
            <a href="#" className="hover:text-amber-400 transition-colors">الخصوصية</a>
            <a href="#" className="hover:text-amber-400 transition-colors">الشروط</a>
            <a href="#" className="hover:text-amber-400 transition-colors">الحوكمة</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
