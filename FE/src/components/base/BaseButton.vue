<template>
  <button @click="$emit('click')" :disabled="disabled" :class="buttonClasses" :type="type">
    <i v-if="loading" class="mdi mdi-loading animate-spin text-sm mr-2"></i>
    <i v-else-if="icon" :class="`mdi mdi-${icon} text-sm mr-2`"></i>

    <span>{{ text }}</span>

    <!-- Slot for custom content -->
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },

  // Appearance props
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'outline'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
});

defineEmits(['click']);

const buttonClasses = computed(() => {
  const baseClasses =
    'inline-flex items-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    outline:
      'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600',
  };

  const disabledClasses =
    props.disabled || props.loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  return [baseClasses, sizeClasses[props.size], variantClasses[props.variant], disabledClasses]
    .filter(Boolean)
    .join(' ');
});
</script>

<style lang="scss" scoped></style>
