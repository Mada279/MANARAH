import { useState, type FormEvent } from 'react';
import { API_BASE_URL } from '../../lib/api';
import { loginAndStore } from '../../lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@manarah.local');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginAndStore(email);
      window.location.hash = 'dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#071020] relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 islamic-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.45) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center glow-gold">
            <span className="text-navy font-black text-3xl">م</span>
          </div>
          <h1 className="text-3xl font-black text-gold-gradient font-arabic mb-2">دخول لوحة مشكاة</h1>
          <p className="text-gray-400 text-sm font-cairo leading-relaxed">
            تسجيل دخول تجريبي للـ MVP المحلي. تأكد من تشغيل API عبر <code dir="ltr" className="text-amber-300">npm run server:dev</code>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="gradient-border p-6 md:p-8 space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2 font-cairo">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 font-cairo text-sm focus:outline-none focus:border-amber-400/50"
              dir="ltr"
            />
            <p className="mt-2 text-xs text-gray-600 font-cairo">المستخدم التجريبي: admin@manarah.local</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-200 text-sm leading-relaxed">
              تعذر تسجيل الدخول. تأكد من تشغيل API. التفاصيل: <span dir="ltr">{error}</span>
            </div>
          )}

          <button
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-navy font-black hover:from-amber-400 hover:to-yellow-300 transition-all disabled:opacity-60"
          >
            {loading ? 'جارٍ الدخول...' : 'دخول لوحة مشكاة'}
          </button>

          <div className="flex items-center justify-between text-xs text-gray-600 font-cairo">
            <span dir="ltr">API: {API_BASE_URL}</span>
            <a href="#hero" className="text-amber-400 hover:text-amber-300">العودة للموقع</a>
          </div>
        </form>
      </div>
    </div>
  );
}
