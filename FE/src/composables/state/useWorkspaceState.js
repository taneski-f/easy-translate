import { ref, watch } from 'vue';
import { useLocalStorage } from '../useLocalStorage.js';
import { FOLDER_SORT_FIELDS, PROJECT_SORT_FIELDS, SORT_ORDER } from '@/constants/index.js';

/**
 * Composable for persisting workspace state (filters, sorting, panel states)
 */
export function useWorkspaceState() {
  const defaultState = {
    folders: {
      searchQuery: '',
      sortBy: FOLDER_SORT_FIELDS.NAME,
      sortOrder: SORT_ORDER.ASC,
      panelOpen: true,
    },
    projects: {
      searchQuery: '',
      sortBy: PROJECT_SORT_FIELDS.NAME,
      sortOrder: SORT_ORDER.ASC,
      panelOpen: true,
    },
  };

  const { value: workspaceState } = useLocalStorage('workspace-state', defaultState);

  const folderSearchQuery = ref(workspaceState.value.folders.searchQuery);
  const folderSortBy = ref(workspaceState.value.folders.sortBy);
  const folderSortOrder = ref(workspaceState.value.folders.sortOrder);
  const folderPanelOpen = ref(workspaceState.value.folders.panelOpen);

  const projectSearchQuery = ref(workspaceState.value.projects.searchQuery);
  const projectSortBy = ref(workspaceState.value.projects.sortBy);
  const projectSortOrder = ref(workspaceState.value.projects.sortOrder);
  const projectPanelOpen = ref(workspaceState.value.projects.panelOpen);

  // Persist changes from components into workspaceState
  watch(
    [folderSearchQuery, folderSortBy, folderSortOrder, folderPanelOpen],
    () => {
      workspaceState.value.folders = {
        searchQuery: folderSearchQuery.value,
        sortBy: folderSortBy.value,
        sortOrder: folderSortOrder.value,
        panelOpen: folderPanelOpen.value,
      };
    },
    { deep: true }
  );

  watch(
    [projectSearchQuery, projectSortBy, projectSortOrder, projectPanelOpen],
    () => {
      workspaceState.value.projects = {
        searchQuery: projectSearchQuery.value,
        sortBy: projectSortBy.value,
        sortOrder: projectSortOrder.value,
        panelOpen: projectPanelOpen.value,
      };
    },
    { deep: true }
  );

  // Apply persisted values into local refs (initial load & cross-tab updates)
  watch(
    workspaceState,
    (s) => {
      const folders = s && s.folders ? s.folders : defaultState.folders;
      const projects = s && s.projects ? s.projects : defaultState.projects;

      folderSearchQuery.value = folders.searchQuery ?? defaultState.folders.searchQuery;
      folderSortBy.value = folders.sortBy ?? defaultState.folders.sortBy;
      folderSortOrder.value = folders.sortOrder ?? defaultState.folders.sortOrder;
      folderPanelOpen.value = folders.panelOpen ?? defaultState.folders.panelOpen;

      projectSearchQuery.value = projects.searchQuery ?? defaultState.projects.searchQuery;
      projectSortBy.value = projects.sortBy ?? defaultState.projects.sortBy;
      projectSortOrder.value = projects.sortOrder ?? defaultState.projects.sortOrder;
      projectPanelOpen.value = projects.panelOpen ?? defaultState.projects.panelOpen;
    },
    { immediate: true, deep: true }
  );

  const resetFolderState = () => {
    folderSearchQuery.value = defaultState.folders.searchQuery;
    folderSortBy.value = defaultState.folders.sortBy;
    folderSortOrder.value = defaultState.folders.sortOrder;
    folderPanelOpen.value = defaultState.folders.panelOpen;
  };

  const resetProjectState = () => {
    projectSearchQuery.value = defaultState.projects.searchQuery;
    projectSortBy.value = defaultState.projects.sortBy;
    projectSortOrder.value = defaultState.projects.sortOrder;
    projectPanelOpen.value = defaultState.projects.panelOpen;
  };

  const resetAllState = () => {
    resetFolderState();
    resetProjectState();
  };

  const clearAllStoredData = () => {
    localStorage.removeItem('workspace-state');
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('folder-') && key.endsWith('-state')) localStorage.removeItem(key);
    });
    resetAllState();
  };

  return {
    folderSearchQuery,
    folderSortBy,
    folderSortOrder,
    folderPanelOpen,
    projectSearchQuery,
    projectSortBy,
    projectSortOrder,
    projectPanelOpen,
    resetFolderState,
    resetProjectState,
    resetAllState,
    clearAllStoredData,
  };
}
