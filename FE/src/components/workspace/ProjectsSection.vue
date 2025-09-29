<template>
  <WorkspaceSection
    :items="projects"
    :loading="loading"
    :sort-by="sortBy"
    :sort-order="sortOrder"
    :sort-tooltip="sortTooltip"
    :sort-options="projectSortOptions"
    :search-query="searchQuery"
    :title="title"
    :hide-header="hideHeader"
    item-type="projects"
    layout="cards"
    button-color="green"
    @update:sort-by="$emit('update:sortBy', $event)"
    @toggle-sort-order="$emit('toggleSortOrder')"
    @update:search-query="$emit('update:searchQuery', $event)"
    @open-modal="$emit('openModal')"
  >
    <template #default="{ items }">
      <ProjectCard v-for="project in items" :key="project?.id" :project="project" />
    </template>
  </WorkspaceSection>
</template>
<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ProjectCard from '@/components/workspace/ProjectCard.vue';
import WorkspaceSection from '@/components/workspace/WorkspaceSection.vue';
import { getProjectSortOptions } from '@/constants/index.js';

const { t } = useI18n();
const projectSortOptions = computed(() => getProjectSortOptions(t));


defineProps({
  projects: Array,
  loading: Boolean,
  sortBy: String,
  sortOrder: String,
  sortTooltip: String,
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
});

defineEmits(['update:sortBy', 'toggleSortOrder', 'openModal', 'update:searchQuery']);
</script>

<style lang="scss" scoped>
/* No custom styles needed - ScrollContainer handles all styling */
</style>
