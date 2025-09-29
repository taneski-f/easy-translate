<template>
  <section :class="sectionClasses" :data-testid="sectionTestId">
    <WorkspaceSectionHeader
      v-if="!hideHeader"
      :title="title || t(titleKey)"
      :item-count="filteredItems?.length || 0"
      :sort-options="sortOptions"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :sort-tooltip="sortTooltip"
      :button-text="t(buttonTextKey)"
      :button-icon="buttonIcon"
      :button-class="buttonClass"
      :show-search="true"
      :search-query="searchQuery"
      :search-placeholder-key="searchPlaceholderKey"
      @update:sort-by="$emit('update:sortBy', $event)"
      @toggle-sort-order="$emit('toggleSortOrder')"
      @update:search-query="$emit('update:searchQuery', $event)"
      @open-modal="$emit('openModal')"
    />

    <!-- Compact header for collapsible mode -->
    <div v-else class="section-controls mb-4 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <SearchInput
          :model-value="searchQuery"
          :placeholder="t(searchPlaceholderKey)"
          @update:model-value="$emit('update:searchQuery', $event)"
        />

        <!-- Sort controls -->
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-700 dark:text-slate-300">{{
            t('sorting.sortBy')
          }}</span>
          <select
            :value="sortBy"
            @change="$emit('update:sortBy', $event.target.value)"
            class="text-sm border border-gray-300 dark:border-slate-600 rounded px-3 py-1 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300"
          >
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>

          <button
            @click="$emit('toggleSortOrder')"
            class="p-1 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
            :title="sortTooltip"
          >
            <i :class="`mdi ${sortOrder === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down'}`"></i>
          </button>
        </div>
      </div>

      <!-- Create button -->
      <button
        @click="$emit('openModal')"
        :class="createButtonClasses"
        :data-testid="createButtonTestId"
      >
        <i :class="`mdi ${buttonIcon}`"></i>
        <span>{{ t(buttonTextKey) }}</span>
      </button>
    </div>

    <LoadingState v-if="loading" :message="t(loadingMessageKey)" />

    <!-- Empty state -->
    <EmptyState
      v-else-if="!filteredItems?.length"
      :item-type="itemType"
      :search-query="searchQuery"
      @open-modal="$emit('openModal')"
    />

    <!-- Items grid -->
    <div style="padding-top: 12px">
      <ScrollContainer
        v-if="filteredItems"
        :items="filteredItems"
        :layout="layout"
        :data-testid="itemsListTestId"
      >
        <slot :items="filteredItems"></slot>
      </ScrollContainer>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import WorkspaceSectionHeader from '@/components/workspace/WorkspaceSectionHeader.vue';
import EmptyState from '@/components/common/states/EmptyState.vue';
import LoadingState from '@/components/common/states/LoadingState.vue';
import ScrollContainer from '@/components/common/ScrollContainer.vue';
import SearchInput from '@/components/common/forms/SearchInput.vue';

const { t } = useI18n();

const props = defineProps({
  items: Array,
  loading: Boolean,
  sortBy: String,
  sortOrder: String,
  sortTooltip: String,
  sortOptions: Array,
  searchQuery: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: null,
  },
  hideHeader: {
    type: Boolean,
    default: false,
  },
  itemType: {
    type: String,
    required: true, // 'projects' or 'folders'
  },
  layout: {
    type: String,
    default: 'cards', // 'cards' or 'grid'
  },
  buttonColor: {
    type: String,
    default: 'blue', // 'blue' or 'green'
  },
});

// Computed properties for dynamic values based on itemType
const isProjects = computed(() => props.itemType === 'projects');
const isFolders = computed(() => props.itemType === 'folders');

const titleKey = computed(() => `sections.${props.itemType}.title`);
const buttonTextKey = computed(() => `sections.${props.itemType}.new`);
const loadingMessageKey = computed(() => `sections.${props.itemType}.loading`);
const searchPlaceholderKey = computed(() => `search.${props.itemType}`);

const buttonIcon = computed(() => {
  return isProjects.value ? 'mdi-plus' : 'mdi-folder-plus';
});

const buttonClass = computed(() => {
  return props.buttonColor === 'green' ? 'bg-green-600' : 'bg-blue-600';
});

const sectionClasses = computed(() => ({
  [props.itemType]: true,
  'mb-12': !props.hideHeader && isFolders.value,
}));

const sectionTestId = computed(() => `${props.itemType}-section`);
const createButtonTestId = computed(() => `create-${props.itemType.slice(0, -1)}-button`); // Remove 's'
const itemsListTestId = computed(() => `${props.itemType}-list`);

const createButtonClasses = computed(() => {
  const baseClasses = 'flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors text-sm';
  const colorClasses = props.buttonColor === 'green' 
    ? 'bg-green-600 hover:bg-green-700' 
    : 'bg-blue-600 hover:bg-blue-700';
  return `${baseClasses} ${colorClasses}`;
});

// Computed property for filtered items based on search query
const filteredItems = computed(() => {
  if (!props.items) return [];
  if (!props.searchQuery?.trim()) return props.items;

  const query = props.searchQuery.trim().toLowerCase();
  return props.items.filter((item) => {
    const name = (item?.attributes?.name || item?.name || '').toLowerCase();
    return name.includes(query) || name.startsWith(query);
  });
});

defineEmits(['update:sortBy', 'toggleSortOrder', 'openModal', 'update:searchQuery', 'openFolder']);
</script>

<style lang="scss" scoped>
/* No custom styles needed - ScrollContainer handles all styling */
</style>