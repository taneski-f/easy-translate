<template>
  <div
    class="toast-container fixed bottom-6 right-6 z-[10000] space-y-3"
    data-testid="toast-container"
  >
    <transition-group name="toast-fade" tag="div">
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="toastClass(t.type)"
        class="toast-item min-w-[280px] max-w-sm rounded-xl shadow-lg px-4 py-3 flex items-start gap-3 border backdrop-blur-sm"
        :data-testid="`toast-item-${t.type || 'info'}`"
        role="status"
        aria-live="polite"
      >
        <i :class="iconClass(t.type)" class="text-xl"></i>
        <div class="flex-1">
          <p v-if="t.title" class="text-sm font-semibold mb-0.5">{{ t.title }}</p>
          <p class="text-sm leading-snug">
            {{ t.message }}
            <span v-if="t.status || t.reason" class="block mt-0.5 text-xs opacity-80">
              <span v-if="t.status">{{ $t('toast.status') }}: {{ t.status }}</span>
              <span v-if="t.status && t.reason"> · </span>
              <span v-if="t.reason">{{ t.reason }}</span>
            </span>
          </p>
        </div>
        <button class="opacity-70 hover:opacity-100" @click="dismiss(t.id)">
          <i class="mdi mdi-close"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const toasts = computed(() => store.getters['ui/toasts']);

const dismiss = (id) => store.dispatch('ui/dismiss', id);

const iconClass = (type) => {
  switch (type) {
    case 'success':
      return 'mdi mdi-check-circle text-green-500';
    case 'error':
      return 'mdi mdi-alert-circle text-red-500';
    case 'warning':
      return 'mdi mdi-alert text-yellow-500';
    default:
      return 'mdi mdi-information text-blue-500';
  }
};

const toastClass = () => {
  const base =
    'bg-white/90 dark:bg-slate-800/80 text-gray-800 dark:text-slate-200 border-gray-200/70 dark:border-slate-700/60';
  const ring = 'ring-1 ring-black/5 dark:ring-white/5';
  return `${base} ${ring}`;
};
</script>

<style lang="scss" scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.25s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
