<template>
  <div class="search-input-wrapper flex items-center space-x-2">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i class="mdi mdi-magnify text-gray-400 dark:text-slate-500 text-sm"></i>
      </div>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text"
        :placeholder="placeholder"
        class="search-input w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 focus:bg-white dark:focus:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-slate-400"
        data-testid="search-input"
      />
      <div
        v-if="modelValue"
        class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        @click="$emit('update:modelValue', '')"
      >
        <i
          class="mdi mdi-close text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 text-sm transition-colors"
        ></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholderKey: {
    type: String,
    default: 'search.placeholder',
  },
  width: {
    type: String,
    default: 'w-64',
  },
});

const placeholder = computed(() => t(props.placeholderKey));

defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
.search-input {
  min-width: 200px;
}

.search-input:focus {
  box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.1);
}

.dark .search-input:focus {
  box-shadow: 0 0 0 2px rgba(148, 163, 184, 0.1);
}

.search-input-wrapper {
  flex-shrink: 0;
}
</style>
