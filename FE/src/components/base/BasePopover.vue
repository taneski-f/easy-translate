<template>
  <Teleport :to="portalTarget">
    <div
      v-if="open"
      ref="popoverRef"
      class="et-popover fixed"
      :style="containerStyle"
      role="tooltip"
      :aria-hidden="!open"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <div class="et-popover-inner" :style="innerStyle">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  anchorEl: {
    type: Object,
    default: null,
  },
  placement: {
    type: String,
    default: 'right',
  },
  offset: {
    type: Number,
    default: 16,
  },
  width: {
    type: Number,
    default: 300,
  },
  zIndex: {
    type: Number,
    default: 9999,
  },
  backgroundOpacity: {
    type: Number,
    default: 0.85,
    validator: (v) => v >= 0 && v <= 1,
  },
  blur: {
    type: Number,
    default: 8,
  },
  interactive: {
    type: Boolean,
    default: false,
  },
  portalTarget: {
    type: String,
    default: 'body',
  },
});

const emit = defineEmits(['close']);

const popoverRef = ref(null);
const containerStyle = ref({});
const isDarkMode = ref(document.documentElement.classList.contains('dark'));

// Watch for theme changes on the document element
const themeObserver = new MutationObserver(() => {
  isDarkMode.value = document.documentElement.classList.contains('dark');
});

const innerStyle = computed(() => {
  const bg = isDarkMode.value
    ? `rgba(15, 23, 42, ${props.backgroundOpacity})`
    : `rgba(255, 255, 255, ${props.backgroundOpacity})`;
  const borderColor = isDarkMode.value ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  return {
    background: bg,
    backdropFilter: `blur(${props.blur}px)`,
    WebkitBackdropFilter: `blur(${props.blur}px)`,
    borderRadius: '12px',
    border: `1px solid ${borderColor}`,
    boxShadow: isDarkMode.value
      ? '0 20px 40px rgba(0,0,0,0.4), 0 6px 12px rgba(0,0,0,0.2)'
      : '0 20px 40px rgba(0,0,0,0.15), 0 6px 12px rgba(0,0,0,0.1)',
  };
});

function updatePosition() {
  const anchor = props.anchorEl?.$el || props.anchorEl; // accept refs to components or elements
  if (!anchor) return;
  const rect = anchor.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = props.width;
  const h = 200; // content will grow but we avoid overflow
  const o = props.offset;

  let left, top;

  switch (props.placement) {
    case 'left':
      left = rect.left - w - o;
      top = rect.top;
      break;
    case 'top':
      left = rect.left;
      top = rect.top - h - o;
      break;
    case 'bottom':
      left = rect.left;
      top = rect.bottom + o;
      break;
    case 'right':
    default:
      left = rect.right + o;
      top = rect.top;
  }

  // collision handling
  if (left + w > vw) left = Math.max(props.offset, rect.left - w - o);
  if (left < props.offset) left = props.offset;
  if (top + h > vh) top = vh - h - props.offset;
  if (top < props.offset) top = props.offset;

  containerStyle.value = {
    left: `${left}px`,
    top: `${top}px`,
    width: `${w}px`,
    zIndex: props.zIndex,
    pointerEvents: props.interactive ? 'auto' : 'none',
    animation: 'fadeInScale 0.2s ease-out',
  };
}

function onKeydown(e) {
  if (e.key === 'Escape') emit('close');
}

function onMouseEnter() {
  // allow interactive popover to keep open on hover
}

function onMouseLeave() {
  if (!props.interactive) return;
  emit('close');
}

watch(
  () => [props.open, props.anchorEl, props.placement, props.width, props.offset],
  () => updatePosition(),
  { immediate: true }
);

onMounted(() => {
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition, true);
  window.addEventListener('keydown', onKeydown);

  // Start observing theme changes
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  updatePosition();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, true);
  window.removeEventListener('keydown', onKeydown);

  // Stop observing theme changes
  themeObserver.disconnect();
});
</script>

<style lang="scss" scoped>
/* Animation keyframes are defined globally in main.scss */
</style>
