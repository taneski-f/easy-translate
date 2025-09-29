import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SORT_ORDER } from '@/constants/index.js';

/**
 * Composable for generating internationalized sort tooltips consistently
 * @param {Ref} sortBy - Current sort field
 * @param {Ref} sortOrder - Current sort order
 * @returns {ComputedRef} Tooltip text
 */
export function useSortTooltip(sortBy, sortOrder) {
  const { t } = useI18n();

  return computed(() => {
    // Map field names to tooltip keys
    const fieldKeyMap = {
      name: 'name',
      total_projects: 'projects',
      created_at: 'created',
      updated_at: 'updated',
      status: 'status',
      price: 'price',
    };

    const fieldKey = fieldKeyMap[sortBy.value];
    const orderSuffix = sortOrder.value === SORT_ORDER.ASC ? 'Asc' : 'Desc';

    if (fieldKey) {
      const tooltipKey = `sorting.tooltips.${fieldKey}${orderSuffix}`;
      const specificTooltip = t(tooltipKey);

      // Use translation if available
      if (specificTooltip !== tooltipKey) {
        return specificTooltip;
      }
    }

    // Fallback if no translation is available
    return sortOrder.value === SORT_ORDER.ASC
      ? t('sorting.tooltips.ascending')
      : t('sorting.tooltips.descending');
  });
}
