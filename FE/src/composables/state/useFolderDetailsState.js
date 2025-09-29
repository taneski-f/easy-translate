import { ref, watch } from 'vue';
import { useLocalStorage } from '../useLocalStorage.js';
import { PROJECT_SORT_FIELDS, SORT_ORDER } from '@/constants/index.js';

/**
 * Composable for persisting folder details state - search, sort, sort direction, panel open/closed
 */
export function useFolderDetailsState(folderId) {
  // Default state
  const defaultState = {
    searchQuery: '',
    sortBy: PROJECT_SORT_FIELDS.NAME,
    sortOrder: SORT_ORDER.ASC,
    panelOpen: true,
  };

  // Persistent state - per folder
  const storageKey = `folder-${folderId}-state`;
  const { value: folderState } = useLocalStorage(storageKey, defaultState);

  // Reactive refs
  const searchQuery = ref(folderState.value.searchQuery);
  const sortBy = ref(folderState.value.sortBy);
  const sortOrder = ref(folderState.value.sortOrder);
  const panelOpen = ref(folderState.value.panelOpen);

  // Update persistent state upon changes
  watch(
    [searchQuery, sortBy, sortOrder, panelOpen],
    () => {
      folderState.value = {
        searchQuery: searchQuery.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
        panelOpen: panelOpen.value,
      };
    },
    { deep: true }
  );

  // Keeps local refs in sync when persistent folderState changes
  watch(
    folderState,
    (newState) => {
      const s = newState || defaultState;
      searchQuery.value = s.searchQuery ?? defaultState.searchQuery;
      sortBy.value = s.sortBy ?? defaultState.sortBy;
      sortOrder.value = s.sortOrder ?? defaultState.sortOrder;
      panelOpen.value = s.panelOpen ?? defaultState.panelOpen;
    },
    { immediate: true, deep: true }
  );

  const resetState = () => {
    searchQuery.value = defaultState.searchQuery;
    sortBy.value = defaultState.sortBy;
    sortOrder.value = defaultState.sortOrder;
    panelOpen.value = defaultState.panelOpen;
  };

  return {
    searchQuery,
    sortBy,
    sortOrder,
    panelOpen,
    resetState,
  };
}
