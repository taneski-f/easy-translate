import { createStore } from 'vuex';
import folders from './modules/folders.js';
import projects from './modules/projects.js';
import ui from './modules/ui.js';

const store = createStore({
  modules: {
    folders,
    projects,
    ui,
  },
});

export default store;
