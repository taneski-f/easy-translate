import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import store from './store/index.js';
import i18n from './i18n/index.js';
import './styles/main.scss';
import '@mdi/font/css/materialdesignicons.css';

createApp(App).use(router).use(store).use(i18n).mount('#app');
