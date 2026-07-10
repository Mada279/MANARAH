import { useState } from 'react';

const endpoints = [
  { method: 'POST', path: '/api/v1/organizations', desc: 'إنشاء مؤسسة أو فرع داخل Manarah OS', color: 'bg-emerald-500' },
  { method: 'GET', path: '/api/v1/impact/reports', desc: 'استخراج تقارير الأثر ومؤشرات الأداء', color: 'bg-blue-500' },
  { method: 'POST', path: '/api/v1/workflows/run', desc: 'تشغيل سير عمل أو موافقة مؤسسية', color: 'bg-purple-500' },
  { method: 'GET', path: '/api/v1/knowledge/search', desc: 'بحث معرفي موحد داخل المنظومة', color: 'bg-amber-500' },
];

const codeExample = `// مثال: إنشاء تقرير أثر لبرنامج داخل مؤسسة
const report = await fetch(
  'https://api.manarah.io/v1/impact/reports',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      organization_id: 'org_123',
      program_id: 'program_456',
      period: 'quarterly',
      metrics: ['beneficiaries', 'volunteer_hours', 'learning_outcomes']
    })
  }
);

// الاستجابة
{
  "report_id": "impact_789",
  "organization": "org_123",
  "score": 87,
  "metrics": {
    "beneficiaries": 1240,
    "volunteer_hours": 3600,
    "learning_outcomes": 92
  },
  "recommendations": [
    "زيادة فرص التطوع في البرنامج",
    "تحسين متابعة المستفيدين بعد انتهاء الخدمة"
  ]
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
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400 text-sm font-medium tracking-widest">✦ التكاملات وواجهة المطورين ✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 font-arabic">
            API تربط <span className="text-gold-gradient">المنظومة بالعالم</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto font-cairo leading-relaxed">
            منارة ليست نظامًا مغلقًا؛ بوابة المطورين تتيح ربط المؤسسات والأنظمة التعليمية والمالية والمعرفية بمحرك الأثر وManarah OS.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-white mb-6 font-arabic flex items-center gap-2">
              <span className="w-8 h-8 bg-amber-400/10 rounded-lg flex items-center justify-center text-amber-400 border border-amber-400/20">⚡</span>
              نقاط وصول مقترحة
            </h3>
            {endpoints.map((ep) => (
              <div key={ep.path} className="gradient-border p-5 card-hover group cursor-default">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`${ep.color} text-white text-xs font-mono font-bold px-2 py-0.5 rounded`}>{ep.method}</span>
                  <code className="text-teal-400 text-sm font-mono" dir="ltr">{ep.path}</code>
                </div>
                <p className="text-gray-400 text-sm font-cairo">{ep.desc}</p>
              </div>
            ))}

            <div className="gradient-border p-5 mt-4">
              <div className="text-xs text-gray-500 font-cairo mb-2">الرابط الأساسي المقترح</div>
              <div className="flex items-center gap-3">
                <code className="text-amber-400 font-mono text-sm" dir="ltr">https://api.manarah.io</code>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                { icon: '🔐', label: 'مصادقة آمنة' },
                { icon: '🧩', label: 'Webhooks' },
                { icon: '📊', label: 'تقارير أثر' },
                { icon: '🧪', label: 'Sandbox' },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 text-sm text-gray-400 font-cairo">
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="gradient-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-amber-400/10 bg-white/2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-gray-500 text-xs font-mono mr-3">POST /api/v1/impact/reports</span>
              </div>
              <button onClick={handleCopy} className="text-xs text-gray-500 hover:text-amber-400 transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-amber-400/10">
                {copied ? '✓ تم النسخ' : '📋 نسخ'}
              </button>
            </div>

            <div className="p-6 overflow-x-auto" dir="ltr">
              <pre className="code-block text-sm leading-relaxed">
                {codeExample.split('\n').map((line, li) => {
                  const colored = line
                    .replace(/(\/\/.*$)/g, '<span style="color:#6272a4">$1</span>')
                    .replace(/('https[^']*'|'[^']*')/g, '<span style="color:#a6e3a1">$1</span>')
                    .replace(/\b(const|await|fetch|true|false|method|headers|body)\b/g, '<span style="color:#ff79c6">$1</span>')
                    .replace(/\b(\d+)\b/g, '<span style="color:#bd93f9">$1</span>');
                  return (
                    <div key={li} className="flex">
                      <span className="text-gray-600 select-none w-8 flex-shrink-0 text-right mr-4 text-xs leading-6">{li + 1}</span>
                      <span className="text-gray-300 leading-6" dangerouslySetInnerHTML={{ __html: colored }} />
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-12 gradient-border p-8">
          <h3 className="text-lg font-bold text-white mb-6 font-arabic text-center">حزم SDK المقترحة</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { lang: 'JavaScript', icon: '🟨', color: 'text-yellow-400' },
              { lang: 'Python', icon: '🐍', color: 'text-blue-400' },
              { lang: 'Dart / Flutter', icon: '💙', color: 'text-cyan-400' },
              { lang: 'REST / Webhooks', icon: '🔌', color: 'text-orange-400' },
            ].map((sdk) => (
              <div key={sdk.lang} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/3 hover:bg-white/6 transition-colors cursor-default border border-white/5">
                <span className="text-2xl">{sdk.icon}</span>
                <span className={`text-sm font-bold ${sdk.color} font-mono`}>{sdk.lang}</span>
                <span className="text-xs text-gray-500 font-cairo">ضمن الخطة</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
