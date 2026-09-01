/**
 * useAppTranslation
 * Thin wrapper around react-i18next's useTranslation that also
 * exposes the language store so components need only one import.
 */
import { useTranslation } from 'react-i18next';
import useLanguageStore from '../store/languageStore';

export function useAppTranslation(ns = 'translation') {
  const { t, i18n } = useTranslation(ns);
  const { currentLang, setLanguage, cycleLanguage, isChanging, getCurrentLanguage, supportedLanguages } =
    useLanguageStore();

  return {
    t,
    i18n,
    currentLang,
    currentLanguage: getCurrentLanguage(),
    supportedLanguages,
    isChanging,
    setLanguage,
    cycleLanguage,
  };
}
