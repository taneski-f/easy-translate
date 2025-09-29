<template>
  <BaseModal
    :title="modalConfig.title"
    :icon="modalConfig.icon"
    :icon-color="modalConfig.iconColor"
    :confirm-text="modalConfig.confirmText"
    :confirm-color="modalConfig.confirmColor"
    :can-confirm="name.trim().length > 0"
    :loading="loading"
    @close="closeModal"
    @confirm="submit"
  >
    <template #content>
      <TextInput
        ref="nameField"
        v-model="name"
        :label="modalConfig.label"
        :placeholder="modalConfig.placeholder"
        :prepend-icon="modalConfig.fieldIcon"
        :rules="nameRules"
        :show-counter="true"
        :maxlength="50"
        autofocus
        @keyup:enter="submit"
      />
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { ItemTypes, AllowedItemTypes } from '@/constants/app.js';
import { useI18n } from 'vue-i18n';
import { buildNameRules, isValid } from '@/composables/data/useValidation.js';
import { BaseModal } from '@/components/base/index.js';
import TextInput from '../TextInput.vue';

const props = defineProps({
  type: {
    type: String,
    default: ItemTypes.FOLDER,
    validator: (value) => AllowedItemTypes.has(value),
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'create']);
const name = ref('');
const nameField = ref(null);
const { t } = useI18n();

// Reusable rules via composable
const nameRules = computed(() => buildNameRules(props.type));
const isNameValid = computed(() => isValid(nameRules.value, name.value));

// Reset form state when closing
function closeModal() {
  if (nameField.value && typeof nameField.value.resetValidation === 'function') {
    nameField.value.resetValidation();
  }
  name.value = '';
  // Emit close event
  emit('close');
}

const modalConfig = computed(() => {
  if (props.type === ItemTypes.PROJECT) {
    return {
      title: t('sections.projects.create'),
      icon: 'mdi-plus',
      iconColor: 'success',
      confirmText: t('sections.projects.create'),
      confirmColor: 'success',
      label: t('forms.projectName'),
      placeholder: t('forms.enterProjectName'),
      fieldIcon: 'mdi-translate',
    };
  }

  // Default to folder
  return {
    title: t('sections.folders.create'),
    icon: 'mdi-folder-plus',
    iconColor: 'primary',
    confirmText: t('sections.folders.create'),
    confirmColor: 'primary',
    label: t('forms.folderName'),
    placeholder: t('forms.enterFolderName'),
    fieldIcon: 'mdi-folder',
  };
});

function submit() {
  // Trigger field validation
  let isFormValid = true;
  if (nameField.value && typeof nameField.value.validate === 'function') {
    isFormValid = nameField.value.validate();
  }

  // Don't submit if validation failed or name is invalid
  if (!isFormValid || !isNameValid.value) {
    return;
  }

  // Emit create first so parent can dispatch actions (request + toast)
  emit('create', { name: name.value.trim(), type: props.type });
  nextTick(() => emit('close'));
  name.value = '';
}
</script>
