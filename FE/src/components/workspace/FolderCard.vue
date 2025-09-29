<template>
  <div class="folder-card-wrapper relative" data-testid="folder-card-wrapper">
    <article
      ref="cardRef"
      :class="cardClasses"
      class="folder-card rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer group text-center"
      role="button"
      data-testid="folder-card"
      :aria-label="accessibilityLabel"
      tabindex="0"
      @click="handleCardClick"
      @keydown.enter="handleCardClick"
      @keydown.space.prevent="handleCardClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <!-- Centered folder icon -->
      <div class="icon-wrapper mb-2 flex-shrink-0" aria-hidden="true">
        <i
          class="mdi mdi-folder text-4xl text-blue-500 dark:text-blue-400 transition-transform"
        ></i>
      </div>

      <!-- Content container -->
      <div
        class="content-container flex-grow flex flex-col justify-center min-h-0"
        data-testid="folder-card-content"
      >
        <!-- Folder name -->
        <h3
          class="folder-name text-sm font-semibold text-gray-800 dark:text-slate-200 text-center mb-1 line-clamp-2"
          data-testid="folder-name"
          :title="folderName"
        >
          {{ folderName }}
        </h3>

        <!-- Project count -->
        <p class="project-count text-xs text-gray-600 dark:text-slate-400 text-center">
          {{ projectCountText }}
        </p>
      </div>
    </article>

    <!-- Hover tooltip -->
    <BasePopover
      :open="isTooltipVisible"
      :anchor-el="cardRef"
      placement="right"
      :width="320"
      :offset="16"
      :background-opacity="tooltipOpacity"
      :blur="8"
      :interactive="false"
      @close="isTooltipVisible = false"
    >
      <BaseCard
        :item="folder"
        icon="folder"
        :title="folderName"
        :subtitle="folderSubtitle"
        :metadata="folderMetadata"
        variant="primary"
        :backgroundless="true"
      />
    </BasePopover>
  </div>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { BaseCard, BasePopover } from '@/components/base/index.js';
import { formatDate } from '@/utils/dateUtils.js';

const { t } = useI18n();

const props = defineProps({
  folder: {
    type: Object,
    required: true,
  },
  tooltipOpacity: {
    type: Number,
    default: 0.8,
    validator: (v) => typeof v === 'number' && v >= 0 && v <= 1,
  },
});

const emit = defineEmits({
  open: (folder) => {
    return folder && typeof folder === 'object';
  },
});

const isTooltipVisible = ref(false);
const cardRef = ref(null);

const folderName = computed(() => props.folder.attributes?.name || '');
const projectCount = computed(() => props.folder.attributes?.total_projects ?? 0);
const projectCountText = computed(() => t('project.count', { count: projectCount.value }));
const folderSubtitle = computed(() => projectCountText.value);
const folderMetadata = computed(() => [
  { label: t('metadata.created'), value: formatDate(props.folder.attributes?.created_at) },
  { label: t('metadata.updated'), value: formatDate(props.folder.attributes?.updated_at) },
]);

const cardClasses = computed(() => ({
  'hover:bg-gray-100 dark:hover:bg-slate-800': true,
  'hover:bg-opacity-50 dark:hover:bg-opacity-50': true,
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50': true,
}));

const accessibilityLabel = computed(() => {
  return t('folder.openAction', {
    name: folderName.value,
    count: projectCount.value,
  });
});

// Event handlers
const handleCardClick = () => emit('open', props.folder);
const handleMouseEnter = async () => {
  isTooltipVisible.value = true;
  await nextTick();
};
const handleMouseLeave = () => {
  isTooltipVisible.value = false;
};
const handleFocus = async () => {
  isTooltipVisible.value = true;
  await nextTick();
};
const handleBlur = () => {
  isTooltipVisible.value = false;
};
</script>

<style lang="scss" scoped>
.folder-card {
  width: 100%;
  min-height: 120px;
  aspect-ratio: 4/3;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.folder-card:hover,
.folder-card:focus {
  transform: translateY(-2px);
}

.folder-name {
  line-height: 1.2;
  word-break: break-word;
  hyphens: auto;
}
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
.content-container {
  overflow: hidden;
}
.folder-card-wrapper {
  width: 100%;
  position: relative;
}

/* Focus styles for accessibility */
.folder-card:focus-visible {
  outline: 2px solid rgb(59, 130, 246);
  outline-offset: 2px;
}

/* Icon hover effect */
.icon-wrapper i {
  transition: transform 0.2s ease-in-out;
}
.folder-card:hover .icon-wrapper i {
  transform: scale(1.15);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .folder-card {
    min-height: 100px;
    padding: 0.75rem;
  }
  .icon-wrapper i {
    font-size: 2.5rem;
  }
  .folder-name {
    font-size: 0.75rem;
  }
  .project-count {
    font-size: 0.625rem;
  }
}
@media (min-width: 1024px) {
  .folder-card {
    min-height: 140px;
  }
  .icon-wrapper i {
    font-size: 3rem;
  }
}
</style>
