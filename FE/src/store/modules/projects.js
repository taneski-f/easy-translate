import { fetchWorkspaceProjects, fetchFolderProjects, createProject } from '@/api/index.js';
import { ResourceTypes } from '@/constants/app.js';
import i18n from '@/i18n/index.js';
import { sortItemsByName, handleAsyncStoreAction } from '@/store/utils/storeHelpers.js';

const state = () => ({
  workspaceProjects: [],
  folderProjects: {},
  isLoading: false,
  creating: false,
  error: null,
});

const getters = {
  workspaceProjectsRaw: (state) => state.workspaceProjects || [],
  workspaceProjects: (state) => sortItemsByName(state.workspaceProjects),
  folderProjects: (state) => (folderId) => sortItemsByName(state.folderProjects[folderId] || []),
  isLoading: (state) => state.isLoading,
  creating: (state) => state.creating,
  error: (state) => state.error,
};

const actions = {
  async loadWorkspaceProjects({ commit }) {
    await handleAsyncStoreAction({
      commit,
      apiCall: fetchWorkspaceProjects,
      dataField: 'workspaceProjects',
      dataMutation: 'setWorkspaceProjects',
      errorContext: 'workspace projects',
    });
  },
  async loadFolderProjects({ commit }, folderId) {
    commit('setLoading', true);
    try {
      const response = await fetchFolderProjects(folderId);
      const projects = response?.data || [];
      commit('setFolderProjects', { data: projects, folderId });
    } catch (error) {
      console.error('Error loading folder projects:', error);
      commit('setFolderProjects', { data: [], folderId });
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  /*
   Creating a project is not part of the API specs, but implemented for 
   demo purposes of item creation failure handling 
   */
  async createNewProject({ commit, dispatch, rootState }, { name, folderId }) {
    commit('setCreating', true);
    commit('setError', null);
    try {
      const payload = {
        data: {
          type: ResourceTypes.PROJECT,
          attributes: {
            name,
          },
          ...(folderId
            ? {
              relationships: {
                folder: {
                  data: { type: ResourceTypes.PROJECT_FOLDER, id: String(folderId) },
                },
              },
            }
            : {}),
        },
      };

      const created = await createProject(payload);

      const proj = created?.data;
      if (proj) {
        const ws = Array.isArray(rootState.projects.workspaceProjects)
          ? rootState.projects.workspaceProjects
          : [];
        commit('setWorkspaceProjects', [...ws, proj]);
        if (folderId) {
          const current = rootState.projects.folderProjects[folderId] || [];
          commit('setFolderProjects', { data: [...current, proj], folderId });
        }
      }
      // Toast success
      dispatch(
        'ui/notify',
        {
          type: 'success',
          title: i18n?.global?.t?.('toast.projectCreated') || 'Project created',
          message: `"${name}"`,
        },
        { root: true }
      );
      return proj || null;
    } catch (error) {
      const status = error?.response?.status || error?.status;
      const rawReason =
        error?.response?.data?.error || error?.response?.data?.message || error?.message;
        
      // Map status code to i18n message
      const reason = status ? i18n?.global?.t?.(`http.${status}`) || rawReason : rawReason;
      const message = i18n?.global?.t?.('toast.projectFailed') || 'Project creation failed';
      commit('setError', { message, technical: error, status, reason });
      // Toast error
      dispatch(
        'ui/notify',
        {
          type: 'error',
          title: i18n?.global?.t?.('toast.projectFailed') || 'Project creation failed',
          message,
          status,
          reason,
        },
        { root: true }
      );
      throw error;
    } finally {
      commit('setCreating', false);
    }
  },
};

const mutations = {
  setWorkspaceProjects(state, projects) {
    state.workspaceProjects = projects || [];
  },
  setFolderProjects(state, { data: projects, folderId }) {
    state.folderProjects = {
      ...state.folderProjects,
      [folderId]: projects || [],
    };
  },
  setLoading(state, isLoading) {
    state.isLoading = isLoading;
  },
  setCreating(state, creating) {
    state.creating = creating;
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
