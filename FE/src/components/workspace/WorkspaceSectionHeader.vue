<template>
  <div class="flex items-center justify-between mb-6" data-testid="section-header">
    <h2 class="text-2xl font-bold text-slate-700 dark:text-slate-200">
      {{ title }}
      <span
        v-if="itemCount && itemCount > 0"
        class="text-lg font-normal text-slate-500 dark:text-slate-400"
      >
        ({{ itemCount }})
      </span>
    </h2>

    <div class="flex items-center space-x-4">
      <!-- Search input -->
      <SearchInput
        v-if="showSearch"
        :model-value="searchQuery"
        :placeholder-key="searchPlaceholderKey"
        data-testid="section-search"
        @update:model-value="$emit('update:searchQuery', $event)"
      />

      <!-- Sorting controls -->
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600 dark:text-slate-400 font-medium">{{
          t('sorting.sortBy')
        }}</span>
        <select
          :value="sortBy"
          @change="$emit('update:sortBy', $event.target.value)"
          class="text-sm bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg px-3 py-2 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
        >
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>

        <!-- Sort order toggle -->
        <button
          @click="$emit('toggleSortOrder')"
          class="text-sm bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg px-3 py-2 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center min-h-0"
          :title="sortTooltip"
          data-testid="sort-toggle"
        >
          <i
            :class="sortOrder === 'asc' ? 'mdi mdi-sort-ascending' : 'mdi mdi-sort-descending'"
            class="text-sm"
          ></i>
        </button>
      </div>

      <!-- Create button using BaseButton -->
      <BaseButton
        :text="buttonText"
        :icon="buttonIcon"
        :variant="buttonVariant"
        :data-testid="
          buttonIcon === 'plus'
            ? 'create-project-button'
            : buttonIcon === 'folder-plus'
              ? 'create-folder-button'
              : 'header-action-button'
        "
        @click="$emit('openModal')"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { BaseButton } from '@/components/base/index.js';
import { SearchInput } from '@/components/common/index.js';

const { t } = useI18n();

const props = defineProps({
  title: {
    type: String,
  },
  itemCount: {
    type: Number,
  },
  sortOptions: {
    type: Array,
  },
  sortBy: {
    type: String,
  },
  sortOrder: {
    type: String,
  },
  sortTooltip: {
    type: String,
  },
  buttonText: {
    type: String,
  },
  buttonIcon: {
    type: String,
  },
  buttonClass: {
    type: String,
  },
  showSearch: {
    type: Boolean,
    default: false,
  },
  searchQuery: {
    type: String,
    default: '',
  },
  searchPlaceholderKey: {
    type: String,
    default: 'search.placeholder',
  },
});

const buttonVariant = computed(() => {
  if (props.buttonClass?.includes('bg-blue')) return 'primary';
  if (props.buttonClass?.includes('bg-green')) return 'success';
  if (props.buttonClass?.includes('bg-gray')) return 'secondary';
  return 'primary'; // default
});

defineEmits(['update:sortBy', 'toggleSortOrder', 'openModal', 'update:searchQuery']);
</script>
