import { useState } from 'react';

const endpoints = [
  { method: 'POST', path: '/api/v1/payment/halal-transfer', desc: 'تنفيذ تحويل مالي حلال', color: 'bg-emerald-500' },
  { method: 'GET', path: '/api/v1/zakat/calculate', desc: 'حساب الزكاة تلقائيًا', color: 'bg-blue-500' },
  { method: 'POST', path: '/api/v1/waqf/create-dao', desc: 'إنشاء وقف رقمي جديد', color: 'bg-emerald-500' },
  { method: 'GET', path: '/api/v1/sharia/verify', desc: 'التحقق من الامتثال الشرعي', color: 'bg-blue-500' },
];

const codeExample = `// التحقق من الامتثال الشرعي
const check = await fetch(
  'https://api.manara.io/v1/sharia/verify' +
  '?contract=0xContract...&type=investment',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
    },
  }
);

// الاستجابة
{
  "contract": "0xContract...",
  "compliant": true,
  "score": 98,
  "checks": {
    "no_riba": true,
    "no_gharar": true,
    "halal_assets": true,
    "board_approved": true
  },
  "platform": "manara",
  "certificate": "SC-VERIFIED-2025"
}`;

export default function ApiDocs() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section id="api" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #071020 0%, #0A1628 100%)' }}>
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400 text-sm font-medium tracking-widest">✦ واجهة برمجة التطبيقات ✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 font-arabic">
            API <span className="text-gold-gradient">للمطورين</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-cairo">
            توثيق API شامل لبناء تطبيقات إسلامية متوافقة مع منظومة منارة
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left: Endpoints */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-white mb-6 font-arabic flex items-center gap-2">
              <span className="w-8 h-8 bg-amber-400/10 rounded-lg flex items-center justify-center text-amber-400 border border-amber-400/20">⚡</span>
              نقاط الوصول
            </h3>
            {endpoints.map((ep, i) => (
              <div key={i} className="gradient-border p-5 card-hover group cursor-default">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`${ep.color} text-white text-xs font-mono font-bold px-2 py-0.5 rounded`}>
                    {ep.method}
                  </span>
                  <code className="text-teal-400 text-sm font-mono" dir="ltr">{ep.path}</code>
                </div>
                <p className="text-gray-400 text-sm font-cairo">{ep.desc}</p>
              </div>
            ))}

            {/* Base URL */}
            <div className="gradient-border p-5 mt-4">
              <div className="text-xs text-gray-500 font-cairo mb-2">الرابط الأساسي</div>
              <div className="flex items-center gap-3">
                <code className="text-amber-400 font-mono text-sm" dir="ltr">https://api.manara.io</code>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                { icon: '🔐', label: 'مصادقة JWT آمنة' },
                { icon: '⚡', label: 'استجابة < 100ms' },
                { icon: '📊', label: 'تحليلات متقدمة' },
                { icon: '🌍', label: 'إتاحة عالمية 99.9%' },
              ].map((f, fi) => (
                <div key={fi} className="flex items-center gap-2 text-sm text-gray-400 font-cairo">
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Code Example */}
          <div className="gradient-border overflow-hidden">
            {/* Code Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-amber-400/10 bg-white/2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                </div>
                <span className="text-gray-500 text-xs font-mono mr-3">GET /api/v1/sharia/verify</span>
              </div>
              <button
                onClick={handleCopy}
                className="text-xs text-gray-500 hover:text-amber-400 transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-amber-400/10"
              >
                {copied ? '✓ تم النسخ' : '📋 نسخ'}
              </button>
            </div>

            {/* Code Body */}
            <div className="p-6 overflow-x-auto" dir="ltr">
              <pre className="code-block text-sm leading-relaxed">
                {codeExample.split('\n').map((line, li) => {
                  // Colorize
                  const colored = line
                    .replace(/(\/\/.*$)/g, '<span style="color:#6272a4">$1</span>')
                    .replace(/('https[^']*'|'[^']*')/g, '<span style="color:#a6e3a1">$1</span>')
                    .replace(/\b(const|await|fetch|true|false)\b/g, '<span style="color:#ff79c6">$1</span>')
                    .replace(/\b(\d+)\b/g, '<span style="color:#bd93f9">$1</span>');
                  return (
                    <div key={li} className="flex">
                      <span className="text-gray-600 select-none w-8 flex-shrink-0 text-right mr-4 text-xs leading-6">
                        {li + 1}
                      </span>
                      <span
                        className="text-gray-300 leading-6"
                        dangerouslySetInnerHTML={{ __html: colored }}
                      />
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>
        </div>

        {/* SDKs */}
        <div className="mt-12 gradient-border p-8">
          <h3 className="text-lg font-bold text-white mb-6 font-arabic text-center">حزم SDK المتاحة</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { lang: 'JavaScript', icon: '🟨', color: 'text-yellow-400' },
              { lang: 'Python', icon: '🐍', color: 'text-blue-400' },
              { lang: 'Dart / Flutter', icon: '💙', color: 'text-cyan-400' },
              { lang: 'Rust', icon: '🦀', color: 'text-orange-400' },
            ].map((sdk, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/3 hover:bg-white/6 transition-colors cursor-default border border-white/5">
                <span className="text-2xl">{sdk.icon}</span>
                <span className={`text-sm font-bold ${sdk.color} font-mono`}>{sdk.lang}</span>
                <span className="text-xs text-gray-500 font-cairo">قريباً</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
