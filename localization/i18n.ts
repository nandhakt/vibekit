import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import polyfill for Intl.PluralRules
import 'intl-pluralrules/polyfill';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
};

// Initialize i18n synchronously with default language
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    // Add compatibility settings for better web support
    compatibilityJSON: 'v3',
    // Disable pluralization if still causing issues
    pluralSeparator: '_',
    contextSeparator: '_',
  });

export default i18n;