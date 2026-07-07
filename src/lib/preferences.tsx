import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Language = 'ar' | 'en' | 'fr';
export type ThemeMode = 'dark' | 'light';

type Dictionary = Record<string, Record<Language, string>>;

const dictionary: Dictionary = {
  'app.name': { ar: 'منارة', en: 'MANARAH', fr: 'MANARAH' },
  'login.title': { ar: 'دخول لوحة مشكاة', en: 'Mishkat Login', fr: 'Connexion Mishkat' },
  'login.email': { ar: 'البريد الإلكتروني', en: 'Email', fr: 'E-mail' },
  'login.submit': { ar: 'دخول', en: 'Sign in', fr: 'Connexion' },
  'login.back': { ar: 'العودة للموقع', en: 'Back to site', fr: 'Retour au site' },
  'dashboard.title': { ar: 'لوحة مشكاة', en: 'Mishkat Dashboard', fr: 'Tableau Mishkat' },
  'dashboard.refresh': { ar: 'تحديث البيانات', en: 'Refresh data', fr: 'Actualiser' },
  'dashboard.logout': { ar: 'تسجيل الخروج', en: 'Sign out', fr: 'Déconnexion' },
  'dashboard.back': { ar: 'العودة للموقع', en: 'Back to site', fr: 'Retour au site' },
  'tabs.overview': { ar: 'نظرة عامة', en: 'Overview', fr: 'Vue générale' },
  'tabs.programs': { ar: 'البرامج', en: 'Programs', fr: 'Programmes' },
  'tabs.beneficiaries': { ar: 'المستفيدون', en: 'Beneficiaries', fr: 'Bénéficiaires' },
  'tabs.volunteers': { ar: 'المتطوعون', en: 'Volunteers', fr: 'Bénévoles' },
  'tabs.impact': { ar: 'مؤشرات الأثر', en: 'Impact metrics', fr: "Indicateurs d'impact" },
  'tabs.education': { ar: 'التعليم والتحفيظ', en: 'Education & Quran', fr: 'Éducation & Coran' },
  'tabs.boarding': { ar: 'داخلي البنين', en: 'Boys boarding', fr: 'Internat garçons' },
  'tabs.supervisor': { ar: 'لوحة المشرف', en: 'Supervisor', fr: 'Superviseur' },
  'tabs.erp': { ar: 'ERP المدرسة', en: 'School ERP', fr: 'ERP scolaire' },
  'tabs.settings': { ar: 'الإعدادات', en: 'Settings', fr: 'Paramètres' },
  'erp.title': { ar: 'ERP المدرسة والموارد', en: 'School ERP & Resources', fr: 'ERP scolaire & ressources' },
  'erp.finance': { ar: 'الإدارة المالية والمصروفات', en: 'Finance & fees', fr: 'Finances & frais' },
  'erp.students': { ar: 'إدارة الطلاب', en: 'Student management', fr: 'Gestion des élèves' },
  'erp.teachers': { ar: 'إدارة المدرسين والموارد البشرية', en: 'Teachers & HR', fr: 'Enseignants & RH' },
  'erp.addStaff': { ar: 'إضافة موظف/مدرس', en: 'Add staff/teacher', fr: 'Ajouter enseignant/personnel' },
  'erp.addFinance': { ar: 'إضافة قيد مالي', en: 'Add finance entry', fr: 'Ajouter écriture' },
  'parent.title': { ar: 'لوحة ولي الأمر', en: 'Parent Portal', fr: 'Portail parent' },
  'parent.policy': { ar: 'ولي الأمر يرى النتائج العامة فقط دون تفاصيل الإشراف الداخلي.', en: 'Parents see public results only, without internal supervision details.', fr: 'Les parents voient seulement les résultats généraux, sans détails internes.' },
  'theme.light': { ar: 'فاتح', en: 'Light', fr: 'Clair' },
  'theme.dark': { ar: 'داكن', en: 'Dark', fr: 'Sombre' },
};

type PreferencesContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  t: (key: string) => string;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function getInitialLanguage(): Language {
  const stored = localStorage.getItem('manarah_language');
  return stored === 'en' || stored === 'fr' || stored === 'ar' ? stored : 'ar';
}

function getInitialTheme(): ThemeMode {
  const stored = localStorage.getItem('manarah_theme');
  return stored === 'light' || stored === 'dark' ? stored : 'dark';
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    localStorage.setItem('manarah_language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    localStorage.setItem('manarah_theme', theme);
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
  }, [theme]);

  const value = useMemo<PreferencesContextValue>(() => ({
    language,
    setLanguage: setLanguageState,
    theme,
    setTheme: setThemeState,
    toggleTheme: () => setThemeState((current) => (current === 'dark' ? 'light' : 'dark')),
    t: (key: string) => dictionary[key]?.[language] ?? dictionary[key]?.ar ?? key,
  }), [language, theme]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used inside PreferencesProvider');
  return context;
}

export function LanguageThemeControls() {
  const { language, setLanguage, theme, toggleTheme, t } = usePreferences();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {(['ar', 'en', 'fr'] as Language[]).map((item) => (
        <button
          key={item}
          onClick={() => setLanguage(item)}
          className={`px-3 py-1 rounded-full border text-xs font-bold transition-colors ${
            language === item
              ? 'bg-amber-400 text-navy border-amber-400'
              : 'bg-white/5 text-gray-400 border-white/10 hover:text-amber-300'
          }`}
        >
          {item.toUpperCase()}
        </button>
      ))}
      <button
        onClick={toggleTheme}
        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold hover:bg-white/10 transition-colors"
      >
        {theme === 'dark' ? `☀️ ${t('theme.light')}` : `🌙 ${t('theme.dark')}`}
      </button>
    </div>
  );
}
