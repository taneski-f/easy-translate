<template>
  <div class="flex items-center space-x-3">
    <i :class="`mdi mdi-${icon} text-xl ${iconColor}`"></i>
    <span class="text-lg font-semibold text-gray-800 dark:text-slate-200">
      <slot />
    </span>
    <span
      v-if="count !== undefined && count > 0"
      class="text-sm text-gray-500 dark:text-slate-400 bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded-full"
    >
      {{ count }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  iconColor: {
    type: String,
    default: 'text-blue-500 dark:text-blue-400',
  },
  count: {
    type: [Number, String],
    default: undefined,
  },
});
</script>
