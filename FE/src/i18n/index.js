import { createI18n } from 'vue-i18n';

import en from './locales/en.json';
import da from './locales/da.json';

// Get saved language preference or default to English
const savedLocale = localStorage.getItem('app-locale') || 'en';

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    da,
  },
});

export default i18n;
