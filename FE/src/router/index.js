import { createRouter, createWebHistory } from 'vue-router';
import { RouteNames } from '@/constants/index.js';

const routes = [
  {
    path: '/',
    name: RouteNames.WORKSPACE,
    component: () => import(/* webpackChunkName: "workspace" */ '@/views/MyWorkspace.vue'),
  },
  {
    path: '/folders/:id',
    name: RouteNames.FOLDER_DETAILS,
    component: () => import(/* webpackChunkName: "folder-details" */ '@/views/FolderDetails.vue'),
    props: true,
  },
];

const router = createRouter({ history: createWebHistory(), routes });
export default router;
