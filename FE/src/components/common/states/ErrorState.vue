<template>
  <div
    class="error-state text-center py-16 px-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 shadow-sm"
  >
    <i class="mdi mdi-alert-circle text-6xl mb-4 text-red-500 dark:text-red-400"></i>

    <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
      {{ title || 'Something went wrong' }}
    </h3>

    <p class="text-red-700 dark:text-red-300 mb-6 max-w-md mx-auto">
      {{ message || 'An unexpected error occurred. Please try again.' }}
    </p>

    <div class="flex justify-center space-x-3">
      <BaseButton text="Try Again" icon="refresh" variant="primary" @click="$emit('retry')" />

      <BaseButton
        v-if="showDetails && technicalError"
        :text="showTechnicalDetails ? 'Hide Details' : 'Show Details'"
        icon="information-outline"
        variant="outline"
        size="sm"
        @click="showTechnicalDetails = !showTechnicalDetails"
      />
    </div>

    <!-- Technical details (collapsible) -->
    <div v-if="showDetails && showTechnicalDetails && technicalError" class="mt-4">
      <details class="text-left">
        <summary
          class="text-sm font-medium text-red-600 dark:text-red-400 cursor-pointer hover:text-red-700 dark:hover:text-red-300"
        >
          Technical Details
        </summary>
        <pre
          class="mt-2 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-xs text-red-800 dark:text-red-200 overflow-auto max-h-40"
          >{{ technicalError }}</pre
        >
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { BaseButton } from '@/components/base/index.js';

defineProps({
  title: {
    type: String,
    default: null,
  },
  message: {
    type: String,
    default: null,
  },
  technicalError: {
    type: String,
    default: null,
  },
  showDetails: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['retry']);

const showTechnicalDetails = ref(false);
</script>
