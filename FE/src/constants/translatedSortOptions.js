import { FOLDER_SORT_FIELDS, PROJECT_SORT_FIELDS } from './sortOptions.js';

/**
 * Generate translated sort options for folders
 * @param {Function} t - i18n translation function
 */
export function getFolderSortOptions(t) {
  return [
    { value: FOLDER_SORT_FIELDS.NAME, label: t('sorting.name') },
    { value: FOLDER_SORT_FIELDS.TOTAL_PROJECTS, label: t('sorting.projects') },
    { value: FOLDER_SORT_FIELDS.CREATED_AT, label: t('sorting.created') },
    { value: FOLDER_SORT_FIELDS.UPDATED_AT, label: t('sorting.updated') },
  ];
}

/**
 * Generate translated sort options for projects
 * @param {Function} t - Translation function from i18n
 */
export function getProjectSortOptions(t) {
  return [
    { value: PROJECT_SORT_FIELDS.NAME, label: t('sorting.name') },
    { value: PROJECT_SORT_FIELDS.STATUS, label: t('sorting.status') },
    { value: PROJECT_SORT_FIELDS.PRICE, label: t('sorting.price') },
    { value: PROJECT_SORT_FIELDS.CREATED_AT, label: t('sorting.created') },
    { value: PROJECT_SORT_FIELDS.UPDATED_AT, label: t('sorting.updated') },
  ];
}
