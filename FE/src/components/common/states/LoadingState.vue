<template>
  <div
    class="bg-gray-50 dark:bg-slate-800 p-8 rounded-lg text-center border border-gray-200 dark:border-slate-700 shadow-sm"
  >
    <div class="flex items-center justify-center space-x-3">
      <i class="mdi mdi-loading text-2xl text-gray-600 dark:text-slate-400 animate-spin"></i>
      <p class="text-gray-600 dark:text-slate-400">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Loading...',
  },
});
</script>

<style scoped></style>
