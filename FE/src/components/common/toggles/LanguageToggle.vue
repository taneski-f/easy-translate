<template>
  <div class="language-control flex items-center space-x-2" data-testid="language-toggle">
    <span class="text-sm font-medium text-gray-700 dark:text-slate-400 hidden sm:inline">{{
      t('settings.language')
    }}</span>
    <div
      class="language-switcher bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg p-1 flex items-center"
    >
      <button
        v-for="lang in availableLanguages"
        :key="`lang-${lang.code}`"
        @click="switchLanguage(lang.code)"
        :class="[
          'flex items-center space-x-1.5 px-2 py-1 text-xs font-medium rounded transition-all duration-200',
          currentLanguage?.code === lang.code
            ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 shadow-sm'
            : 'text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200',
        ]"
        :data-testid="`lang-button-${lang.code}`"
        :title="t('settings.switchTo', { language: lang.name })"
      >
        <span class="text-sm">{{ lang.flag }}</span>
        <span class="uppercase">{{ lang.code }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useLanguage } from '@/composables/ui/useLanguage.js';
import { useI18n } from 'vue-i18n';

const { currentLanguage, switchLanguage, availableLanguages } = useLanguage();
const { t } = useI18n();
</script>

<style lang="scss" scoped>
.language-switcher {
  transition: all 0.2s ease;
}
.language-switcher:hover {
  border-color: rgb(156 163 175);
}
.dark .language-switcher:hover {
  border-color: rgb(100 116 139);
}
</style>
