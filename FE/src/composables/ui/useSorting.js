import { ref, computed } from 'vue';
import { FOLDER_SORT_FIELDS, PROJECT_SORT_FIELDS, SORT_ORDER } from '@/constants/index.js';

/**
 * Composable for handling sorting functionality
 * @param {Array} items - Raw items to sort
 * @param {string} defaultSortBy - Default sort field
 * @param {string} defaultSortOrder - Default sort order
 */
export function useSorting(
  items,
  defaultSortBy = FOLDER_SORT_FIELDS.NAME,
  defaultSortOrder = SORT_ORDER.ASC
) {
  const sortBy = ref(defaultSortBy);
  const sortOrder = ref(defaultSortOrder);

  const sortedItems = computed(() => {
    if (!items.value || !Array.isArray(items.value)) return [];

    // Avoid mutating the original array
    return [...items.value].sort((a, b) => {
      let result = 0;

      switch (sortBy.value) {
        case FOLDER_SORT_FIELDS.NAME:
        case PROJECT_SORT_FIELDS.NAME: {
          const nameA = a.attributes?.name || '';
          const nameB = b.attributes?.name || '';
          result = nameA.localeCompare(nameB);
          break;
        }

        case PROJECT_SORT_FIELDS.STATUS: {
          const statusA = a.attributes?.status || '';
          const statusB = b.attributes?.status || '';
          result = statusA.localeCompare(statusB);
          break;
        }

        case PROJECT_SORT_FIELDS.PRICE: {
          const priceA = a.attributes?.price?.amount_euro || a.attributes?.price?.amount || 0;
          const priceB = b.attributes?.price?.amount_euro || b.attributes?.price?.amount || 0;
          result = priceA - priceB;
          break;
        }

        case FOLDER_SORT_FIELDS.CREATED_AT:
        case PROJECT_SORT_FIELDS.CREATED_AT: {
          const createdA = new Date(a.attributes?.created_at || 0);
          const createdB = new Date(b.attributes?.created_at || 0);
          result = createdA - createdB;
          break;
        }

        case FOLDER_SORT_FIELDS.UPDATED_AT:
        case PROJECT_SORT_FIELDS.UPDATED_AT: {
          const updatedA = new Date(a.attributes?.updated_at || 0);
          const updatedB = new Date(b.attributes?.updated_at || 0);
          result = updatedA - updatedB;
          break;
        }

        case FOLDER_SORT_FIELDS.TOTAL_PROJECTS: {
          const projectsA = a.attributes?.total_projects ?? 0;
          const projectsB = b.attributes?.total_projects ?? 0;
          result = projectsA - projectsB;
          break;
        }

        default:
          return 0;
      }

      // Apply sort order
      return sortOrder.value === SORT_ORDER.DESC ? -result : result;
    });
  });

  const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
  };

  return {
    sortBy,
    sortOrder,
    sortedItems,
    toggleSortOrder,
  };
}
