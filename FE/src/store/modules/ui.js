// Simple UI module for global toasts/notifications

const state = () => ({
  toasts: [],
});

let nextId = 1;

const getters = {
  toasts: (state) => state.toasts,
};

const mutations = {
  PUSH_TOAST(state, toast) {
    state.toasts.push(toast);
  },
  REMOVE_TOAST(state, id) {
    state.toasts = state.toasts.filter((t) => t.id !== id);
  },
  CLEAR_TOASTS(state) {
    state.toasts = [];
  },
};

const actions = {
  notify({ commit }, { message, type = 'info', duration = 6000, ...rest }) {
    const id = nextId++;
    commit('PUSH_TOAST', { id, type, message, ...rest });
    setTimeout(() => commit('REMOVE_TOAST', id), duration);
    return id;
  },
  dismiss({ commit }, id) {
    commit('REMOVE_TOAST', id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
