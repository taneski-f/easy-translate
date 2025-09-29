<template>
  <!-- Modal overlay -->
  <div class="modal-overlay" @click.self="emit('close')" data-testid="modal-overlay">
    <div class="modal-container" :style="{ maxWidth: maxWidth + 'px' }">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title-container">
            <i
              v-if="icon"
              :class="`mdi ${icon} modal-icon`"
              :style="{ color: getIconColor(iconColor) }"
            ></i>
            <h2 class="modal-title" data-testid="modal-title">{{ title }}</h2>
          </div>
          <button class="modal-close-btn" @click="emit('close')">
            <i class="mdi mdi-close"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="modal-content">
          <slot name="content" :emit="emit">
            <!-- Default slot content -->
          </slot>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <BaseButton
            :text="cancelText"
            variant="outline"
            data-testid="modal-cancel"
            @click="emit('close')"
          />
          <BaseButton
            :text="confirmText"
            :variant="confirmVariant"
            :loading="loading"
            :disabled="isDisabled"
            data-testid="modal-confirm"
            @click="handleConfirm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseButton from './BaseButton.vue';
const { t } = useI18n();
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: null,
  },
  iconColor: {
    type: String,
    default: 'primary',
  },
  maxWidth: {
    type: [String, Number],
    default: 500,
  },
  cancelText: {
    type: String,
    default: '',
  },
  confirmText: {
    type: String,
    default: '',
  },
  confirmColor: {
    type: String,
    default: 'primary',
  },
  canConfirm: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const cancelText = computed(() => props.cancelText || t('common.cancel'));
const confirmText = computed(() => props.confirmText || t('common.create'));

const emit = defineEmits(['close', 'confirm']);

const isDisabled = computed(() => !props.canConfirm || props.loading);

// Normalize confirm color to a BaseButton variant
const confirmVariant = computed(() => {
  const allowed = new Set(['primary', 'secondary', 'success', 'danger', 'outline']);
  return allowed.has(props.confirmColor) ? props.confirmColor : 'primary';
});

// Map icon color names to CSS custom properties
function getIconColor(color) {
  const colorMap = {
    primary: 'var(--color-brand-primary)',
    success: 'var(--color-brand-success, #22c55e)',
    warning: 'var(--color-brand-warning, #f59e0b)',
    error: 'var(--color-brand-error, #ef4444)',
  };

  return colorMap[color] || color;
}

function handleConfirm() {
  emit('confirm');
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-card {
  @include surface-card();
  background-color: var(--color-surface-primary);
  border-radius: 1rem;
  overflow: hidden;
  animation: modalEnter 0.2s ease-out;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.modal-title-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.modal-title {
  @include text-primary();
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.modal-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: none;
  border-radius: 0.375rem;
  @include text-secondary();
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: var(--color-surface-secondary);
    @include text-primary();
  }

  i {
    font-size: 1.125rem;
  }
}

.modal-content {
  padding: 1rem 1.25rem;
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem 1rem;
  border-top: 1px solid var(--color-border);
}

.modal-btn {
  @include button-base();
  font-weight: 500;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.15s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--cancel {
    background-color: transparent;
    @include text-secondary();
    border: 1px solid var(--color-border);

    &:hover:not(:disabled) {
      background-color: var(--color-surface-secondary);
      @include text-primary();
    }
  }

  &--confirm {
    background-color: var(--color-brand-primary);
    color: white;
    border: 1px solid var(--color-brand-primary);
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover:not(:disabled) {
      background-color: #1d4ed8;
      border-color: #1d4ed8;
    }

    &--loading {
      cursor: wait;
    }
  }
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (max-width: 640px) {
  .modal-container {
    width: 95%;
    margin: 1rem;
  }

  .modal-header,
  .modal-content,
  .modal-actions {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
