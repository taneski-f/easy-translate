<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="copyright">© {{ new Date().getFullYear() }} EasyTranslate</div>
      <div class="controls">
        <LanguageToggle />
      </div>
    </div>
  </footer>
</template>

<script setup>
import LanguageToggle from '@/components/common/toggles/LanguageToggle.vue';
</script>

<style lang="scss" scoped>
.app-footer {
  position: sticky;
  bottom: 0;
  z-index: 100;
  background-color: var(--color-surface-primary);
  border-top: 1px solid var(--color-border);
  padding: $space-6;
}

.footer-content {
  @include center-flex();
  justify-content: space-between;
}

.copyright {
  @include text-muted();
  font-size: 0.75rem; // text-xs
}

.controls {
  display: flex;
  align-items: center;
  gap: $space-6;
}
</style>
