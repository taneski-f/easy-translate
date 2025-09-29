<template>
  <div class="theme-control" data-testid="theme-toggle">
    <span class="theme-label">{{ t('settings.theme') }}</span>
    <div class="theme-switch" :class="{ 'switch-active': isDark }">
      <input
        :id="switchId"
        type="checkbox"
        :checked="isDark"
        @change="isDark = $event.target.checked"
        class="switch-input"
        data-testid="theme-toggle-input"
      />
      <label :for="switchId" class="switch-label" data-testid="theme-toggle-label">
        <span class="switch-track">
          <span class="switch-thumb"></span>
        </span>
      </label>
    </div>
    <div class="theme-icon">
      <i :class="`mdi ${isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'}`"></i>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { useAppTheme } from '@/composables/ui/useTheme.js';
import { useI18n } from 'vue-i18n';

const { isDark } = useAppTheme();
const { t } = useI18n();

const switchId = computed(() => `theme-switch-${Math.random().toString(36).substr(2, 9)}`);
</script>

<style lang="scss" scoped>
.theme-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 20px;
}

.theme-label {
  @include text-secondary();
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  line-height: 20px;
  margin: 0;
}

.theme-switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  height: 20px;
}

.switch-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-label {
  display: block;
  cursor: pointer;
  user-select: none;
}

.switch-track {
  position: relative;
  display: block;
  width: 36px;
  height: 20px;
  background-color: var(--color-border);
  border-radius: 20px;
  transition: background-color 0.2s ease;
  border: 1px solid var(--color-border-subtle);
}

.switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.switch-active .switch-track {
  background-color: var(--color-brand-primary);
  border-color: var(--color-brand-primary);
}

.switch-active .switch-thumb {
  transform: translateX(16px);
}

.switch-input:focus + .switch-label .switch-track {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 2px;
}

.switch-label:hover .switch-track {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.theme-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  i {
    @include text-secondary();
    font-size: 1rem;
    line-height: 1;
  }
}
</style>
