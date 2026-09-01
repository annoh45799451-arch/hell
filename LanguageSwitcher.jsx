import { useState } from 'react';
import { useAppTranslation } from '../hooks/useAppTranslation';

export default function LanguageSwitcher() {
  const { currentLanguage, supportedLanguages, setLanguage, isChanging } = useAppTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="lang-switcher">
      <button
        className="lang-trigger"
        onClick={() => setOpen((o) => !o)}
        disabled={isChanging}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flag">{currentLanguage.flag}</span>
        <span className="native-label">{currentLanguage.nativeLabel}</span>
        <span className="chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <ul className="lang-dropdown" role="listbox">
          {supportedLanguages.map((lang) => (
            <li
              key={lang.code}
              role="option"
              aria-selected={lang.code === currentLanguage.code}
              className={`lang-option ${lang.code === currentLanguage.code ? 'active' : ''}`}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
            >
              <span className="flag">{lang.flag}</span>
              <span className="option-labels">
                <span className="native">{lang.nativeLabel}</span>
                <span className="english">{lang.label}</span>
              </span>
              {lang.code === currentLanguage.code && <span className="check">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
