<template>
  <div class="workspace-header">
    <div class="flex">
      <div class="flex items-center space-x-3">
        <i class="mdi mdi-view-dashboard"></i>
        <h1>{{ t('app.workspace') }}</h1>
      </div>
      <ThemeToggle />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import ThemeToggle from '@/components/common/toggles/ThemeToggle.vue';
const { t } = useI18n();
</script>

<style lang="scss" scoped>
.workspace-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-surface-primary);
  border-bottom: 1px solid var(--color-border);
  padding: $space-6;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .flex.items-center.space-x-3 {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    i {
      font-size: 1.875rem;
      color: var(--color-brand-primary);
    }

    h1 {
      font-size: 1.875rem;
      font-weight: 700;
      @include text-primary();
      margin: 0;
    }
  }
}
</style>
