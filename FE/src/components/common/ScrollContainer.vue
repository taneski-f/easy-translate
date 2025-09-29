<template>
  <div class="scroll-wrapper relative" data-testid="scroll-wrapper">
    <div
      class="scroll-container"
      ref="scrollContainer"
      @scroll="handleScroll"
      :style="{ maxHeight: maxHeight }"
      data-testid="scroll-container"
    >
      <div :class="['scroll-grid', { 'grid-layout': layout === 'grid' }]" data-testid="scroll-grid">
        <slot></slot>
      </div>
    </div>

    <!-- Scroll indicators -->
    <div
      v-if="showTopIndicator"
      class="scroll-indicator-top absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-100 dark:from-slate-900 to-transparent pointer-events-none z-10"
    />
    <div
      v-if="showBottomIndicator"
      class="scroll-indicator-bottom absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-100 dark:from-slate-900 to-transparent pointer-events-none z-10"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  maxHeight: {
    type: String,
    default: '420px',
  },
  minCardWidth: {
    type: String,
    default: '320px',
  },
  maxCardWidth: {
    type: String,
    default: '400px',
  },
  layout: {
    type: String,
    default: 'cards',
    validator: (value) => ['cards', 'grid'].includes(value),
  },
});

// Scroll indicators
const scrollContainer = ref(null);
const showTopIndicator = ref(false);
const showBottomIndicator = ref(false);

function handleScroll() {
  if (!scrollContainer.value) return;

  const container = scrollContainer.value;
  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight;
  const clientHeight = container.clientHeight;

  showTopIndicator.value = scrollTop > 20;
  showBottomIndicator.value = scrollTop < scrollHeight - clientHeight - 20;
}

function initScrollIndicators() {
  setTimeout(() => {
    if (scrollContainer.value) {
      handleScroll();
    }
  }, 100);
}

onMounted(() => {
  initScrollIndicators();
});

watch(
  () => props.items,
  (newItems) => {
    if (newItems?.length > 0) {
      initScrollIndicators();
    }
  }
);
</script>

<style lang="scss" scoped>
.scroll-wrapper {
  position: relative;
}

.scroll-container {
  overflow-y: auto;
  padding-right: 8px;
  margin-right: -8px;
  scroll-behavior: smooth;
}

/* Default flex layout for cards (BaseCard components) */

.scroll-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-bottom: 8px;
  padding-top: 28px;
  justify-content: flex-start;
  align-items: stretch;
}

.scroll-grid > :deep(*) {
  flex: 0 1 auto;
  min-width: 0; /* Allow shrinking */
}

/* Grid layout for compact items (FolderCard components) */
.scroll-grid.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 180px));
  justify-content: start;
  width: 100%;
}

.scroll-grid.grid-layout > :deep(*) {
  justify-self: stretch;
  width: 100%;
}

/* Responsive grid adjustments for grid layout only */
@media (max-width: 640px) {
  .scroll-grid.grid-layout {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .scroll-grid.grid-layout {
    grid-template-columns: repeat(auto-fit, minmax(140px, 160px));
    gap: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .scroll-grid.grid-layout {
    grid-template-columns: repeat(auto-fit, minmax(150px, 180px));
    gap: 1.5rem;
  }
}

.scroll-container::-webkit-scrollbar {
  width: 8px;
}

.scroll-container::-webkit-scrollbar-track {
  background: rgb(243 244 246);
  border-radius: 4px;
}

.dark .scroll-container::-webkit-scrollbar-track {
  background: rgb(71 85 105);
}

.scroll-container::-webkit-scrollbar-thumb {
  background: rgb(156 163 175);
  border-radius: 4px;
}

.dark .scroll-container::-webkit-scrollbar-thumb {
  background: rgb(100 116 139);
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgb(107 114 128);
}

.dark .scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgb(148 163 184);
}

.scroll-indicator-top,
.scroll-indicator-bottom {
  transition: opacity 0.2s ease;
}
</style>
