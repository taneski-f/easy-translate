import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Language management composable
 * Provides utilities for switching languages and persisting preferences
 */
export function useLanguage() {
  const { locale, availableLocales } = useI18n();

  // Available languages with display names
  const availableLanguages = computed(() => [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  ]);

  // Current language info
  const currentLanguage = computed(() =>
    availableLanguages.value.find((lang) => lang.code === locale.value)
  );

  // Check if current locale is Danish
  const isDanish = computed(() => locale.value === 'da');
  const isEnglish = computed(() => locale.value === 'en');

  /**
   * Switch to a specific language
   * @param {string} languageCode - Language code (en/da)
   */
  function switchLanguage(languageCode) {
    if (availableLocales.includes(languageCode)) {
      locale.value = languageCode;
      localStorage.setItem('app-locale', languageCode);
    }
  }


  return {
    locale,
    availableLanguages,
    currentLanguage,
    isDanish,
    isEnglish,
    switchLanguage,
  };
}
