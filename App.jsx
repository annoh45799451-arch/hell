import './i18n'; // must be first
import { useState } from 'react';
import { useAppTranslation } from './hooks/useAppTranslation';
import LanguageSwitcher from './components/LanguageSwitcher';
import Toast, { showToast } from './components/Toast';
import './App.css';

const SECTIONS = ['common', 'nav', 'auth', 'dashboard', 'profile', 'settings', 'errors', 'notifications'];

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function KeyValueGrid({ namespace, keyList, t }) {
  return (
    <div className="kv-grid">
      {keyList.map((k) => (
        <div key={k} className="kv-row">
          <code className="kv-key">{namespace}.{k}</code>
          <span className="kv-value">{t(`${namespace}.${k}`, { name: 'Arjun', timeOfDay: getTimeOfDay(), date: 'Jan 2024' })}</span>
        </div>
      ))}
    </div>
  );
}

const sectionKeys = {
  common: ['appName','tagline','loading','error','retry','save','cancel','delete','edit','close','confirm','back','next','submit','search','filter','sort','reset','clear','yes','no','ok','or'],
  nav: ['home','dashboard','profile','settings','notifications','help','logout','login','register'],
  auth: ['welcomeBack','signInToContinue','emailLabel','emailPlaceholder','passwordLabel','passwordPlaceholder','forgotPassword','rememberMe','signIn','signUp','noAccount','alreadyAccount','fullName','confirmPassword','termsAgree','resetPasswordTitle','sendResetLink','newPassword','updatePassword'],
  dashboard: ['greeting','overview','recentActivity','totalUsers','activeNow','revenue','growth','thisWeek','thisMonth','viewAll','noActivity','quickActions'],
  profile: ['editProfile','avatar','changeAvatar','displayName','bio','bioPlaceholder','location','website','joinedDate','saveChanges','changePassword','dangerZone','deleteAccount','deleteWarning'],
  settings: ['title','language','theme','themeLight','themeDark','themeSystem','notifications','emailNotifications','pushNotifications','privacy','publicProfile','showEmail','timezone','dateFormat','currency'],
  errors: ['required','invalidEmail','passwordTooShort','passwordMismatch','networkError','unauthorized','notFound','serverError','sessionExpired'],
  notifications: ['successSave','successDelete','successSignIn','successSignUp','errorGeneric','copied'],
};

export default function App() {
  const { t, currentLanguage, supportedLanguages, setLanguage, isChanging } = useAppTranslation();
  const [activeSection, setActiveSection] = useState('common');
  const [formEmail, setFormEmail] = useState('');
  const [formPass, setFormPass] = useState('');

  return (
    <div className="app">
      <Toast />

      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <div className="logo">⚡ {t('common.appName')}</div>
          <p className="tagline">{t('common.tagline')}</p>
        </div>
        <div className="header-right">
          <div className="lang-badges">
            {supportedLanguages.map((l) => (
              <button
                key={l.code}
                className={`lang-badge ${l.code === currentLanguage.code ? 'active' : ''}`}
                onClick={() => { setLanguage(l.code); showToast(`Switched to ${l.nativeLabel}`); }}
                disabled={isChanging}
              >
                {l.flag} {l.nativeLabel}
              </button>
            ))}
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* LIVE DEMO BANNER */}
      <div className="demo-banner">
        <span className="demo-label">🌐 Live i18n Demo</span>
        <span>{t('dashboard.greeting', { name: 'Arjun', timeOfDay: getTimeOfDay() })}</span>
        {isChanging && <span className="switching-badge">⟳ {t('common.loading')}</span>}
      </div>

      <main className="main-grid">
        {/* LOGIN CARD */}
        <section className="card login-card">
          <h2 className="card-title">{t('auth.welcomeBack')}</h2>
          <p className="card-subtitle">{t('auth.signInToContinue')}</p>
          <div className="form-group">
            <label>{t('auth.emailLabel')}</label>
            <input placeholder={t('auth.emailPlaceholder')} value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t('auth.passwordLabel')}</label>
            <input type="password" placeholder={t('auth.passwordPlaceholder')} value={formPass} onChange={(e) => setFormPass(e.target.value)} />
          </div>
          <div className="form-row">
            <label className="checkbox-label"><input type="checkbox" /> {t('auth.rememberMe')}</label>
            <a href="#" className="link">{t('auth.forgotPassword')}</a>
          </div>
          <button className="btn-primary" onClick={() => showToast(t('notifications.successSignIn'))}>{t('auth.signIn')}</button>
          <p className="form-footer">{t('auth.noAccount')} <a href="#" className="link">{t('auth.signUp')}</a></p>
        </section>

        {/* DASHBOARD STATS */}
        <section className="card stats-card">
          <h2 className="card-title">{t('dashboard.overview')}</h2>
          <div className="stats-grid">
            {[
              { label: t('dashboard.totalUsers'), value: '12,840', trend: '+8%' },
              { label: t('dashboard.activeNow'),  value: '342',    trend: '+12%' },
              { label: t('dashboard.revenue'),    value: '₹4.2L',  trend: '+5%' },
              { label: t('dashboard.growth'),     value: '23%',    trend: '+2%' },
            ].map((s) => (
              <div key={s.label} className="stat-box">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-trend">{s.trend} <span className="trend-period">{t('dashboard.thisMonth')}</span></div>
              </div>
            ))}
          </div>
          <div className="quick-actions">
            <span className="section-label">{t('dashboard.quickActions')}</span>
            <div className="action-buttons">
              <button className="btn-outline" onClick={() => showToast(t('notifications.successSave'))}>{t('common.save')}</button>
              <button className="btn-outline" onClick={() => showToast(t('notifications.copied'))}>{t('nav.notifications')}</button>
              <button className="btn-danger" onClick={() => showToast(t('notifications.errorGeneric'), 'error')}>{t('common.delete')}</button>
            </div>
          </div>
        </section>

        {/* SETTINGS */}
        <section className="card settings-card">
          <h2 className="card-title">{t('settings.title')}</h2>
          <div className="settings-list">
            <div className="setting-row">
              <span>{t('settings.language')}</span>
              <LanguageSwitcher />
            </div>
            <div className="setting-row">
              <span>{t('settings.theme')}</span>
              <div className="theme-pills">
                {['themeLight', 'themeDark', 'themeSystem'].map((k) => (
                  <span key={k} className="pill">{t(`settings.${k}`)}</span>
                ))}
              </div>
            </div>
            <div className="setting-row toggle-row">
              <span>{t('settings.emailNotifications')}</span>
              <label className="toggle"><input type="checkbox" defaultChecked /><span className="slider" /></label>
            </div>
            <div className="setting-row toggle-row">
              <span>{t('settings.pushNotifications')}</span>
              <label className="toggle"><input type="checkbox" /><span className="slider" /></label>
            </div>
            <div className="setting-row toggle-row">
              <span>{t('settings.publicProfile')}</span>
              <label className="toggle"><input type="checkbox" defaultChecked /><span className="slider" /></label>
            </div>
          </div>
        </section>

        {/* ERRORS */}
        <section className="card errors-card">
          <h2 className="card-title">⚠ Validation & Errors</h2>
          <div className="error-list">
            {sectionKeys.errors.map((k) => (
              <div key={k} className="error-item">✕ {t(`errors.${k}`)}</div>
            ))}
          </div>
        </section>
      </main>

      {/* TRANSLATION EXPLORER */}
      <section className="explorer">
        <h2 className="explorer-title">📋 Translation Explorer — all 100 strings</h2>
        <div className="section-tabs">
          {SECTIONS.map((s) => (
            <button key={s} className={`tab ${s === activeSection ? 'active' : ''}`} onClick={() => setActiveSection(s)}>
              {s}
            </button>
          ))}
        </div>
        <KeyValueGrid namespace={activeSection} keyList={sectionKeys[activeSection] || []} t={t} />
      </section>

      <footer className="footer">
        <p>{t('common.appName')} · i18n via react-i18next + Zustand · EN / HI / GU</p>
      </footer>
    </div>
  );
}
