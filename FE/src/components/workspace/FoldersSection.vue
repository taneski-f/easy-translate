<template>
  <WorkspaceSection
    :items="folders"
    :loading="loading"
    :sort-by="sortBy"
    :sort-order="sortOrder"
    :sort-tooltip="sortTooltip"
    :sort-options="folderSortOptions"
    :search-query="searchQuery"
    :hide-header="hideHeader"
    item-type="folders"
    layout="grid"
    button-color="blue"
    @update:sort-by="$emit('update:sortBy', $event)"
    @toggle-sort-order="$emit('toggleSortOrder')"
    @update:search-query="$emit('update:searchQuery', $event)"
    @open-modal="$emit('openModal')"
    @open-folder="$emit('openFolder', $event)"
  >
    <template #default="{ items }">
      <FolderCard
        v-for="folder in items"
        :key="folder?.id"
        :folder="folder"
        @open="$emit('openFolder', folder)"
      />
    </template>
  </WorkspaceSection>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import FolderCard from '@/components/workspace/FolderCard.vue';
import WorkspaceSection from '@/components/workspace/WorkspaceSection.vue';
import { getFolderSortOptions } from '@/constants/index.js';

const { t } = useI18n();
const folderSortOptions = computed(() => getFolderSortOptions(t));


defineProps({
  folders: Array,
  loading: Boolean,
  sortBy: String,
  sortOrder: String,
  sortTooltip: String,
  searchQuery: {
    type: String,
    default: '',
  },
  hideHeader: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['update:sortBy', 'toggleSortOrder', 'openFolder', 'openModal', 'update:searchQuery']);
</script>

<style lang="scss" scoped>
/* No custom styles needed - ScrollContainer handles all styling */
</style>
