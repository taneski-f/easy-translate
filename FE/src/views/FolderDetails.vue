<template>
  <div class="folder-content p-8">
    <!-- Breadcrumb navigation -->
    <div class="mb-8">
      <div class="flex items-center space-x-3 mb-4">
        <button
          @click="$router.push('/')"
          class="text-2xl font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer hover:underline underline-offset-4 decoration-2 transition-all"
          data-testid="back-to-folders"
        >
          {{ t('navigation.backToFolders') }}
        </button>
        <span class="text-2xl text-slate-400 dark:text-slate-500 font-bold">›</span>
        <span class="text-2xl font-bold text-slate-800 dark:text-slate-200">{{ folderName }}</span>
      </div>

      <div class="flex items-center space-x-3">
        <i class="mdi mdi-folder-open text-3xl text-gray-600 dark:text-slate-400"></i>
        <div>
          <h2
            class="text-2xl font-bold text-slate-800 dark:text-slate-200"
            data-testid="folder-title"
          >
            {{ folderName }}
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {{ t('project.count', { count: projectCount }) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Projects Panel -->
    <CollapsiblePanel v-model="projectPanelOpen">
      <template #header>
        <SectionHeader
          icon="translate"
          icon-color="text-green-500 dark:text-green-400"
          :count="sortedProjects?.length"
        >
          {{ t('sections.projects.inFolder') }}
        </SectionHeader>
      </template>

      <ProjectsSection
        :projects="sortedProjects"
        :loading="loadingProjects"
        :sort-by="projectSortBy"
        :sort-order="projectSortOrder"
        :sort-tooltip="getProjectSortOrderTooltip"
        :search-query="projectSearchQuery"
        :hide-header="true"
        @update:sort-by="
          projectSortBy = $event;
          projectSortByRef = $event;
        "
        @toggle-sort-order="handleToggleProjectSort"
        @update:search-query="projectSearchQuery = $event"
        @open-modal="handleCreateProject"
      />
    </CollapsiblePanel>

    <!-- Generic Item Modal -->
    <NewItemModal
      v-if="showNewItemModal"
      :type="modalType"
      :loading="projectsCreating"
      @close="closeNewItemModal"
      @create="createItem"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed, watch, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import ProjectsSection from '@/components/workspace/ProjectsSection.vue';
// Import common components directly instead of through the index barrel
import CollapsiblePanel from '@/components/common/CollapsiblePanel.vue';
import SectionHeader from '@/components/common/SectionHeader.vue';
// Lazy load the NewItemModal component - we don't want to load this until needed
const NewItemModal = defineAsyncComponent(
  () =>
    import(/* webpackChunkName: "new-item-modal" */ '@/components/common/forms/NewItemModal.vue')
);
import { useSorting } from '@/composables/ui/useSorting.js';
import { useSortTooltip } from '@/composables/ui/useSortTooltip.js';
import { useModalManagement } from '@/composables/state/useModalManagement.js';
import { useFolderDetailsState } from '@/composables/state/useFolderDetailsState.js';
import { ItemTypes } from '@/constants/app.js';
const { t } = useI18n();

const store = useStore();
const route = useRoute();
const folderId = route.params.id;

// Persistent folder state
const {
  searchQuery: projectSearchQuery,
  sortBy: projectSortBy,
  sortOrder: projectSortOrder,
  panelOpen: projectPanelOpen,
} = useFolderDetailsState(folderId);

const {
  newItemModalOpen: showNewItemModal,
  selectedItemType: modalType,
  openNewItemModal,
  closeNewItemModal,
} = useModalManagement();

const folder = computed(() => store.getters['folders/currentFolder']);
const fallbackFolder = computed(() =>
  (store.getters['folders/folders'] || []).find((f) => String(f.id) === String(folderId))
);
const folderName = computed(
  () => folder.value?.attributes?.name || fallbackFolder.value?.attributes?.name || 'Folder'
);
const rawProjectsForFolder = computed(() => store.getters['folders/folderProjects']);
const loadingProjects = computed(() => store.getters['folders/loadingProjects']);
const projectsCreating = computed(() => store.getters['projects/creating'] || false);

const {
  sortedItems: sortedProjects,
  toggleSortOrder: toggleProjectSortOrder,
  sortBy: projectSortByRef,
  sortOrder: projectSortOrderRef,
} = useSorting(rawProjectsForFolder, projectSortBy.value, projectSortOrder.value);

// Keep useSorting refs in sync with persistent state
watch(projectSortBy, (newValue) => {
  projectSortByRef.value = newValue;
});
watch(projectSortOrder, (newValue) => {
  projectSortOrderRef.value = newValue;
});

// Updates both persistent and useSorting refs
const handleToggleProjectSort = () => {
  toggleProjectSortOrder();
  projectSortOrder.value = projectSortOrderRef.value;
};

const getProjectSortOrderTooltip = useSortTooltip(projectSortBy, projectSortOrder);

// Use actual loaded projects count, or fall back to folder's cached count
const projectCount = computed(() => {
  const loadedProjects = rawProjectsForFolder.value?.length || 0;
  const cachedCount =
    folder.value?.attributes?.total_projects ||
    fallbackFolder.value?.attributes?.total_projects ||
    0;

  // If we have loaded projects, use that count, otherwise use cached count
  return loadedProjects > 0 ? loadedProjects : cachedCount;
});

const handleCreateProject = () => {
  openNewItemModal(ItemTypes.PROJECT);
};

async function createItem(itemData) {
  try {
    if (itemData?.type === ItemTypes.PROJECT) {
      const name = itemData?.name || 'New Project';
      await store.dispatch('projects/createNewProject', { name, folderId });
      // Refresh folder projects if creation succeeded
      await store.dispatch('folders/loadFolderProjects', folderId);
      closeNewItemModal();
      return;
    }
    if (itemData?.type === ItemTypes.FOLDER) {
      store.dispatch('folders/createNewFolder', itemData?.name);
    }
  } catch (error) {
    // Error handled by toast system
    console.log(error);
  }
}

onMounted(async () => {
  // Ensure folders are loaded, then set current folder from the list
  if (!store.getters['folders/folders']?.length) {
    await store.dispatch('folders/loadFolders');
  }
  const existingFolder = store.getters['folders/folders']?.find(
    (f) => String(f.id) === String(folderId)
  );
  if (existingFolder) {
    store.commit('folders/setCurrentFolder', existingFolder);
  }

  await store.dispatch('folders/loadFolderProjects', folderId);
});

onUnmounted(() => {
  store.dispatch('folders/clearCurrentFolder');
});
</script>

<style lang="scss" scoped>
/* ProjectsSection handles styling */
</style>
