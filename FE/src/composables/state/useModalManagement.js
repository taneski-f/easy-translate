// Modal management composable
import { ref, computed } from 'vue';
import { ItemTypes } from '@/constants/app.js';

export function useModalManagement() {
  const newItemModalOpen = ref(false);
  const selectedItemType = ref(ItemTypes.FOLDER);

  function openNewItemModal(type = ItemTypes.FOLDER) {
    selectedItemType.value = type;
    newItemModalOpen.value = true;
  }

  function closeNewItemModal() {
    newItemModalOpen.value = false;
    selectedItemType.value = ItemTypes.FOLDER;
  }

  // Could be abstracted for more modal types, keeping simple for only two types
  const modalTitle = computed(() => {
    return selectedItemType.value === ItemTypes.FOLDER ? 'Create New Folder' : 'Create New Project';
  });

  return {
    newItemModalOpen,
    selectedItemType,
    modalTitle,
    openNewItemModal,
    closeNewItemModal,
  };
}
