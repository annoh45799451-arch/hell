import { create } from 'zustand';
import i18n, { SUPPORTED_LANGUAGES, LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE } from '../i18n';

const useLanguageStore = create((set, get) => ({
  // ─── State ──────────────────────────────────────────────────
  currentLang: localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE,
  isChanging: false,
  supportedLanguages: SUPPORTED_LANGUAGES,

  // ─── Derived Helpers ────────────────────────────────────────
  getCurrentLanguage: () => {
    const code = get().currentLang;
    return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
  },

  // ─── Actions ────────────────────────────────────────────────
  /**
   * Switch UI language.
   * Persists to localStorage, updates i18n, and sets HTML lang attr.
   * Returns a Promise so callers can await the swap if needed.
   */
  setLanguage: async (code) => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    if (!lang || code === get().currentLang) return;

    set({ isChanging: true });

    await i18n.changeLanguage(code);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);

    // Accessibility: keep <html lang> in sync
    document.documentElement.lang = code;
    document.documentElement.dir = lang.dir;

    set({ currentLang: code, isChanging: false });
  },

  /** Cycle through languages in order — handy for a single toggle button */
  cycleLanguage: () => {
    const { currentLang, setLanguage } = get();
    const idx = SUPPORTED_LANGUAGES.findIndex((l) => l.code === currentLang);
    const next = SUPPORTED_LANGUAGES[(idx + 1) % SUPPORTED_LANGUAGES.length];
    setLanguage(next.code);
  },
}));

export default useLanguageStore;
