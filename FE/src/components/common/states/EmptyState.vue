<template>
  <div
    class="text-center py-16 px-8 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm"
  >
    <i
      :class="itemType === 'folders' ? 'mdi mdi-folder-outline' : 'mdi mdi-file-document-outline'"
      class="text-6xl mb-4 opacity-50 text-gray-400 dark:text-slate-500"
    ></i>
    <p class="text-gray-600 dark:text-slate-400 text-lg mb-6 max-w-md mx-auto">
      {{ emptyStateText }}
    </p>
    <BaseButton
      :text="createButtonText"
      icon="plus"
      variant="primary"
      @click="$emit('openModal')"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { BaseButton } from '@/components/base/index.js';

const props = defineProps({
  itemType: {
    type: String,
  },
  searchQuery: {
    type: String,
    default: '',
  },
});

defineEmits(['openModal']);
const { t } = useI18n();

const emptyStateText = computed(() => {
  const searchQuery = (props.searchQuery || '').trim();
  const type = props.itemType;
  if (searchQuery) {
    return `No ${type} containing "${searchQuery}", but you can create one!`;
  }
  return t(`sections.${type}.empty`);
});

const createButtonText = computed(() =>
  props.itemType === 'folders' ? t('sections.folders.new') : t('sections.projects.new')
);
</script>
