<script setup>
import { defineAsyncComponent } from 'vue';
// Lazy-load the toast system to improve initial load time
const ToastContainer = defineAsyncComponent(() => import('@/components/common/ToastContainer.vue'));
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
</script>

<template>
  <div class="app bg-gray-100 dark:bg-slate-900 min-h-screen flex flex-col">
    <AppHeader />

    <!-- Dynamic Content Area -->
    <main class="workspace-content flex-1">
      <router-view />
    </main>

    <AppFooter />

    <ToastContainer />
  </div>
</template>
