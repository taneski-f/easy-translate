import { fetchFolders, createFolder, fetchFolderProjects } from '@/api/index.js';
import { sortItemsByName, handleAsyncStoreAction } from '@/store/utils/storeHelpers.js';
import { getErrorMessage } from '@/composables/data/useErrorHandling.js';

const state = () => ({
  folders: [],
  currentFolder: null,
  folderProjects: [],
  isLoading: false,
  creating: false,
  loadingProjects: false,
  error: null,
});

const getters = {
  foldersRaw: (state) => state.folders || [],
  folders: (state) => sortItemsByName(state.folders),
  currentFolder: (state) => state.currentFolder,
  folderProjects: (state) => sortItemsByName(state.folderProjects),
  isLoading: (state) => state.isLoading,
  creating: (state) => state.creating,
  loadingProjects: (state) => state.loadingProjects,
  error: (state) => state.error,
  hasError: (state) => Boolean(state.error),
};

const actions = {
  async loadFolders({ commit }) {
    await handleAsyncStoreAction({
      commit,
      apiCall: fetchFolders,
      dataField: 'folders',
      dataMutation: 'setFolders',
      errorContext: 'folders',
    });
  },

  async loadFolderProjects({ commit, dispatch }, folderId) {
    commit('setLoadingProjects', true);
    commit('setError', null);
    try {
      const data = await fetchFolderProjects(folderId);
      commit('setFolderProjects', data.data || []);
    } catch (error) {
      const userMessage = getErrorMessage(error, 'loading folder projects');
      commit('setError', { message: userMessage, technical: error });
      commit('setFolderProjects', []);
      // Toast error
      dispatch('ui/notify', { type: 'error', message: userMessage }, { root: true });
      throw error;
    } finally {
      commit('setLoadingProjects', false);
    }
  },
  async createNewFolder({ commit, dispatch }, folderName) {
    commit('setCreating', true);
    commit('setError', null);
    try {
      const payload = {
        data: {
          type: 'project-folder',
          attributes: {
            name: folderName,
          },
        },
      };
      const folder = await createFolder(payload);
      if (folder && folder.data) {
        commit('addFolder', folder.data);
        // Toast success
        dispatch(
          'ui/notify',
          { type: 'success', message: `Folder "${folderName}" created.` },
          { root: true }
        );
      }
      return folder?.data || null;
    } catch (error) {
      const userMessage = getErrorMessage(error, 'creating folder');
      commit('setError', { message: userMessage, technical: error });
      // toast error
      dispatch('ui/notify', { type: 'error', message: userMessage }, { root: true });
      throw error;
    } finally {
      commit('setCreating', false);
    }
  },
  clearCurrentFolder({ commit }) {
    commit('setCurrentFolder', null);
    commit('setFolderProjects', []);
  },
};

const mutations = {
  setFolders(state, folders) {
    state.folders = folders || [];
  },
  setCurrentFolder(state, folder) {
    state.currentFolder = folder;
  },
  setFolderProjects(state, projects) {
    state.folderProjects = projects || [];
  },
  addFolder(state, folder) {
    state.folders.push(folder);
  },
  setLoading(state, isLoading) {
    state.isLoading = isLoading;
  },
  setCreating(state, creating) {
    state.creating = creating;
  },
  setLoadingProjects(state, loading) {
    state.loadingProjects = loading;
  },
  setError(state, error) {
    state.error = error;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
