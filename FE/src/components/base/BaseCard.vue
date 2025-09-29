<template>
  <div
    :class="cardClasses"
    @click="$emit('click', item)"
    class="card rounded-lg p-6 hover:shadow-xl transition-all cursor-pointer group"
  >
    <div class="flex items-start space-x-4">
      <div class="icon group-hover:scale-110 transition-transform flex-shrink-0">
        <i :class="`mdi mdi-${icon} text-3xl text-gray-600 dark:text-slate-400`"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div
          :class="titleClasses"
          class="text-lg font-semibold text-gray-800 dark:text-slate-200 transition-colors truncate"
          data-testid="card-title"
          :title="title"
        >
          {{ title }}
        </div>
        <div class="meta text-sm text-gray-600 dark:text-slate-400 mt-1">
          {{ subtitle }}
        </div>

        <!-- Status badge if provided -->
        <div v-if="status" class="mt-2">
          <span
            :class="statusBadgeClass"
            class="inline-block px-2 py-1 text-xs font-medium rounded-full"
          >
            {{ status }}
          </span>
        </div>

        <!-- Additional metadata -->
        <div v-if="metadata && metadata.length > 0" class="mt-3 space-y-1">
          <div
            v-for="meta in metadata"
            :key="meta.label"
            class="flex justify-between items-center text-xs text-gray-500 dark:text-slate-500"
          >
            <span class="font-medium">{{ meta.label }}</span>
            <span>{{ meta.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  status: {
    type: [String, null],
    default: null,
  },
  statusKey: {
    type: [String, null],
    default: null,
    // Original status key for styling ('completed', 'in_progress')
  },
  metadata: {
    type: Array,
    default: () => [],
    validator: (arr) =>
      arr.every(
        (item) =>
          item &&
          typeof item === 'object' &&
          typeof item.label === 'string' &&
          typeof item.value === 'string'
      ),
  },

  // Styling
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value),
    // Visual variant: 'primary' (lighter) or 'secondary' (darker)
  },
  backgroundless: {
    type: Boolean,
    default: false,
  },
});

// Computed property for dynamic CSS classes based on variant
const cardClasses = computed(() => {
  if (props.backgroundless) {
    // Let parent control background; keep spacing and hover shadow from static classes
    return 'bg-transparent border border-transparent';
  }

  const baseClasses = 'bg-gradient-to-br border';

  // Conditional styling based on variant prop
  if (props.variant === 'primary') {
    return `${baseClasses} from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 border-gray-200 dark:border-slate-500 hover:border-gray-300 dark:hover:border-slate-400 hover:from-gray-100 hover:to-gray-150 dark:hover:from-slate-600 dark:hover:to-slate-500`;
  } else {
    return `${baseClasses} from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 border-gray-300 dark:border-slate-500 hover:border-gray-400 dark:hover:border-slate-400 hover:from-gray-150 hover:to-gray-200 dark:hover:from-slate-600 dark:hover:to-slate-500`;
  }
});

const titleClasses = computed(() => {
  return props.variant === 'primary'
    ? 'group-hover:text-gray-700 dark:group-hover:text-slate-300'
    : 'group-hover:text-gray-800 dark:group-hover:text-slate-200';
});

const statusBadgeClass = computed(() => {
  const baseClass = 'text-xs font-medium rounded-full px-2 py-1';

  // Use normalized statusKey for styling if available, otherwise fall back to status text
  const statusForStyling = (props.statusKey || props.status)?.toLowerCase();

  switch (statusForStyling) {
    case 'completed':
      return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
    case 'in_progress':
    case 'in progress':
      return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
    case 'pending':
      return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
    case 'cancelled':
    case 'failed':
      return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
    default:
      return `${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
  }
});

// Component event to notify parent when card is clicked
defineEmits(['click']);
</script>

<style lang="scss" scoped>
.card {
  @include surface-card();
  flex: 1 1 auto;
  min-width: 0;
  max-width: 480px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 10px 25px -5px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
  }

  .icon {
    transition: transform 0.2s ease;
    color: var(--color-text-secondary);
  }

  &:hover .icon {
    transform: scale(1.1);
  }

  .meta {
    @include text-secondary();
  }
}

/* Ensure proper sizing in flex containers */
.card {
  /* Default comfortable width for project cards */
  width: clamp(320px, 45%, 480px);
}

// Status badge styles using theme variables
.status-completed {
  @include status-success();
}

.status-warning,
.status-pending {
  @include status-warning();
}

.status-error,
.status-cancelled,
.status-failed {
  @include status-error();
}
</style>
