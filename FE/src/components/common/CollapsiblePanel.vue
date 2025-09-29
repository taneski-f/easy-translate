<template>
  <div class="collapsible-panel">
    <!-- Header as toggle button -->
    <button
      @click="toggle"
      class="panel-header w-full flex items-center justify-between p-4 text-left bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors rounded-lg border border-gray-200 dark:border-slate-600"
      :aria-expanded="isOpen"
      :aria-controls="`panel-content-${panelId}`"
    >
      <slot name="header">
        <span class="font-semibold text-gray-800 dark:text-slate-200">Panel Title</span>
      </slot>

      <i
        :class="[
          'mdi text-xl text-gray-500 dark:text-slate-400 transition-transform duration-200',
          isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down',
        ]"
        aria-hidden="true"
      ></i>
    </button>

    <!-- Collapsible content -->
    <div
      v-if="isOpen"
      :id="`panel-content-${panelId}`"
      class="panel-content mt-2"
      :class="contentClass"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, readonly, watch } from 'vue';

const props = defineProps({
  initialOpen: {
    type: Boolean,
    default: true,
  },
  contentClass: {
    type: String,
    default: '',
  },
  modelValue: {
    type: Boolean,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(props.modelValue !== null ? props.modelValue : props.initialOpen);

// Watch for changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== null) {
      isOpen.value = newValue;
    }
  }
);

const panelId = computed(() => `panel-${Math.random().toString(36).substr(2, 9)}`);

// Toggle function
const toggle = () => {
  isOpen.value = !isOpen.value;
  // Emit change for v-model support
  if (props.modelValue !== null) {
    emit('update:modelValue', isOpen.value);
  }
};

// Expose methods for parent components
defineExpose({
  toggle,
  isOpen: readonly(isOpen),
});
</script>

<style scoped>
.panel-header:focus {
  outline: 2px solid rgb(59, 130, 246);
  outline-offset: 2px;
}

.panel-content {
  animation: slideDown 0.2s ease-out;
}
</style>
