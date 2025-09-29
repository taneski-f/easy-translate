<template>
  <div class="workspace-content p-8 bg-gray-100 dark:bg-slate-900 min-h-screen space-y-6">
    <!-- Projects Panel (moved to top) -->
    <CollapsiblePanel v-model="projectPanelOpen" class="projects-panel">
      <template #header>
        <SectionHeader
          icon="translate"
          icon-color="text-green-500 dark:text-green-400"
          :count="workspaceProjects?.length"
        >
          {{ $t('sections.projects.title') }}
        </SectionHeader>
      </template>

      <ProjectsSection
        :projects="workspaceProjects"
        :loading="projectsLoading"
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
        @open-modal="() => openNewModal(ItemTypes.PROJECT)"
      />
    </CollapsiblePanel>

    <!-- Folders Panel (moved below projects) -->
    <CollapsiblePanel v-model="folderPanelOpen" class="folders-panel">
      <template #header>
        <SectionHeader icon="folder" :count="folders?.length">
          {{ $t('sections.folders.title') }}
        </SectionHeader>
      </template>

      <FoldersSection
        :folders="folders"
        :loading="foldersLoading"
        :sort-by="folderSortBy"
        :sort-order="folderSortOrder"
        :sort-tooltip="getSortOrderTooltip"
        :search-query="folderSearchQuery"
        :hide-header="true"
        @update:sort-by="
          folderSortBy = $event;
          folderSortByRef = $event;
        "
        @toggle-sort-order="handleToggleFolderSort"
        @update:search-query="folderSearchQuery = $event"
        @open-folder="openFolder"
        @open-modal="() => openNewModal(ItemTypes.FOLDER)"
      />
    </CollapsiblePanel>

    <!-- Generic Item Modal -->
    <NewItemModal
      v-if="showNewItemModal"
      :type="modalType"
      :loading="modalType === ItemTypes.FOLDER ? foldersCreating : projectsCreating"
      @close="closeNewItemModal"
      @create="createItem"
    />
  </div>
</template>

<script setup>
import { onMounted, computed, watch, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import FoldersSection from '@/components/workspace/FoldersSection.vue';
import ProjectsSection from '@/components/workspace/ProjectsSection.vue';
import CollapsiblePanel from '@/components/common/CollapsiblePanel.vue';
import SectionHeader from '@/components/common/SectionHeader.vue';

const NewItemModal = defineAsyncComponent(
  () =>
    import(/* webpackChunkName: "new-item-modal" */ '@/components/common/forms/NewItemModal.vue')
);
import { ItemTypes, AllowedItemTypes } from '@/constants/app.js';
import { RouteNames } from '@/constants/index.js';
// Import composables directly to prevent loading all composables via the index.js barrel export
import { useSorting } from '@/composables/ui/useSorting.js';
import { useSortTooltip } from '@/composables/ui/useSortTooltip.js';
import { useModalManagement } from '@/composables/state/useModalManagement.js';
import { useWorkspaceState } from '@/composables/state/useWorkspaceState.js';

const store = useStore();
const router = useRouter();

// Manages modal open/close state and tracks which type of modal is active
const {
  newItemModalOpen: showNewItemModal,
  selectedItemType: modalType,
  openNewItemModal,
  closeNewItemModal,
} = useModalManagement();

const rawFolders = computed(() => store.getters['folders/foldersRaw'] || []);
const rawProjects = computed(() => store.getters['projects/workspaceProjectsRaw'] || []);
const foldersLoading = computed(() => store.getters['folders/isLoading']);
const projectsLoading = computed(() => store.getters['projects/isLoading']);
const foldersCreating = computed(() => store.getters['folders/creating']);
const projectsCreating = computed(() => store.getters['projects/creating']);

// General workspace state
const {
  folderSearchQuery,
  folderSortBy,
  folderSortOrder,
  folderPanelOpen,
  projectSearchQuery,
  projectSortBy,
  projectSortOrder,
  projectPanelOpen,
} = useWorkspaceState();

// Sorting composables - create useSorting instances with initial values
const {
  sortedItems: folders,
  toggleSortOrder: toggleFolderSortOrder,
  sortBy: folderSortByRef,
  sortOrder: folderSortOrderRef,
} = useSorting(rawFolders, folderSortBy.value, folderSortOrder.value);

const {
  sortedItems: workspaceProjects,
  toggleSortOrder: toggleProjectSortOrder,
  sortBy: projectSortByRef,
  sortOrder: projectSortOrderRef,
} = useSorting(rawProjects, projectSortBy.value, projectSortOrder.value);

// Keep useSorting refs in sync
watch(folderSortBy, (newValue) => {
  folderSortByRef.value = newValue;
});
watch(folderSortOrder, (newValue) => {
  folderSortOrderRef.value = newValue;
});
watch(projectSortBy, (newValue) => {
  projectSortByRef.value = newValue;
});
watch(projectSortOrder, (newValue) => {
  projectSortOrderRef.value = newValue;
});

// Custom toggle functions that update both persistent and useSorting refs
const handleToggleFolderSort = () => {
  toggleFolderSortOrder();
  folderSortOrder.value = folderSortOrderRef.value;
};

const handleToggleProjectSort = () => {
  toggleProjectSortOrder();
  projectSortOrder.value = projectSortOrderRef.value;
};

const getSortOrderTooltip = useSortTooltip(folderSortBy, folderSortOrder);
const getProjectSortOrderTooltip = useSortTooltip(projectSortBy, projectSortOrder);

onMounted(() => {
  // Check existing data in store
  const existingFolders = store.getters['folders/foldersRaw'];
  const existingProjects = store.getters['projects/workspaceProjectsRaw'];
  const foldersLoading = store.getters['folders/isLoading'];
  const projectsLoading = store.getters['projects/isLoading'];

  // Only fetch data if we don't have it and isn't already loading
  if ((!existingFolders || existingFolders?.length === 0) && !foldersLoading) {
    store.dispatch('folders/loadFolders');
  }

  if ((!existingProjects || existingProjects?.length === 0) && !projectsLoading) {
    store.dispatch('projects/loadWorkspaceProjects');
  }
});

function openFolder(folder) {
  router.push({ name: RouteNames.FOLDER_DETAILS, params: { id: folder?.id } });
}

function openNewModal(itemType) {
  const type = (itemType || '').toString();
  if (!AllowedItemTypes.has(type)) return;
  openNewItemModal(type);
}

async function createItem(itemData) {
  try {
    if (itemData?.type === ItemTypes.FOLDER) {
      await store.dispatch('folders/createNewFolder', itemData?.name);
    } else if (itemData?.type === ItemTypes.PROJECT) {
      await store.dispatch('projects/createNewProject', { name: itemData?.name });
    }
  } catch (error) {
    // Error handled by toast system
    console.log(error);
  }
}
</script>

<style scoped>
.projects-panel :deep(.scroll-container) {
  min-height: 30vh;
  max-height: 72vh;
  overflow-y: auto;
  overflow-x: hidden;
}
.folders-panel :deep(.scroll-container) {
  min-height: 720px;
}
</style>
