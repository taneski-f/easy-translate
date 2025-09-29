import { useI18n } from 'vue-i18n';

/**
 * Composable for formatting status with internationalization
 */
export function useStatusFormatter() {
  const { t } = useI18n();

  /**
   * Format status strings with translation
   * @param {string} status - Raw status string from API
   * @returns {string} Translated and formatted status
   */
  function formatStatus(status) {
    if (!status) return t('status.unknown');

    // Normalize status
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');

    // Attempt to translate
    const translationKey = `status.${normalizedStatus}`;

    if (t(translationKey) !== translationKey) {
      return t(translationKey);
    }

    // Fallback
    return status
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return {
    formatStatus,
  };
}
