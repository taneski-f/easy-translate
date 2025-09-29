<template>
  <div class="text-input-wrapper">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
    </label>
    <div class="input-container">
      <i v-if="prependIcon" :class="`mdi ${prependIcon} input-icon`"></i>
      <input
        :id="inputId"
        ref="inputRef"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :disabled="disabled"
        :class="inputClasses"
        @input="handleInput"
        @focus="$emit('focus', $event)"
        @blur="handleBlur"
        @keyup.enter="$emit('keyup:enter', $event)"
      />
    </div>
    <div v-if="(showCounter && maxlength) || displayError" class="input-footer">
      <div v-if="displayError" class="input-error">
        {{ displayError }}
      </div>
      <div v-if="showCounter && maxlength" class="input-counter">
        {{ modelValue?.length || 0 }}/{{ maxlength }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  prependIcon: {
    type: String,
    default: '',
  },
  maxlength: {
    type: Number,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showCounter: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  rules: {
    type: Array,
    default: () => [],
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'keyup:enter']);

const inputRef = ref(null);
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);

// Validation state
const isValid = ref(true);
const validationMessage = ref('');
const isTouched = ref(false);

// Display error (prioritize external errorMessage, then validation message, but only if touched - to avoid showing errors on initial load)
const displayError = computed(() => {
  if (props.errorMessage) return props.errorMessage;
  if (isTouched.value && validationMessage.value) return validationMessage.value;
  return '';
});

const inputClasses = computed(() => [
  'text-input',
  {
    'text-input--with-icon': props.prependIcon,
    'text-input--error': displayError.value,
    'text-input--disabled': props.disabled,
  },
]);

// Validation methods
const validate = () => {
  // Reset validation state
  isValid.value = true;
  validationMessage.value = '';

  // If external error message is provided, use that
  if (props.errorMessage) {
    isValid.value = false;
    validationMessage.value = props.errorMessage;
    return false;
  }

  // Run validation rules if provided
  if (props.rules && props.rules.length > 0) {
    for (const rule of props.rules) {
      const result = rule(props.modelValue);
      if (typeof result === 'string') {
        isValid.value = false;
        validationMessage.value = result;
        return false;
      }
    }
  }

  return true;
};

const resetValidation = () => {
  isValid.value = true;
  validationMessage.value = '';
  isTouched.value = false;
};

// Handle input to mark as touched and emit value
const handleInput = (event) => {
  isTouched.value = true;
  emit('update:modelValue', event.target.value);
};

// Handle blur to mark as touched
const handleBlur = (event) => {
  isTouched.value = true;
  emit('blur', event);
};

// Watch for changes and run real-time validation - could also be implemented with a debounce function for performance
watch(
  () => props.modelValue,
  (newValue) => {
    if (props.rules && props.rules.length > 0) {
      isValid.value = true;
      validationMessage.value = '';

      for (const rule of props.rules) {
        const result = rule(newValue || '');
        if (typeof result === 'string') {
          isValid.value = false;
          validationMessage.value = result;
          break;
        }
      }
    } else {
      isValid.value = true;
      validationMessage.value = '';
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.autofocus && inputRef.value) {
    inputRef.value.focus();
  }
});

defineExpose({
  focus: () => inputRef.value?.focus(),
  validate,
  resetValidation,
});
</script>

<style lang="scss" scoped>
.text-input-wrapper {
  margin-bottom: 0.5rem;
}

.input-label {
  display: block;
  @include text-primary();
  font-weight: 500;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
}

.input-container {
  position: relative;
}

.text-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 0.5rem;
  background-color: var(--color-surface-primary);
  @include text-primary();
  font-size: 1rem;
  transition: all 0.2s ease;

  &::placeholder {
    @include text-muted();
  }

  &:focus {
    outline: none;
    border-color: var(--color-brand-primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &--with-icon {
    padding-left: 2.5rem;
  }

  &--error {
    border-color: $error;
  }

  &--disabled {
    background-color: var(--color-surface-secondary);
    @include text-muted();
    cursor: not-allowed;
  }
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  @include text-secondary();
  font-size: 1.25rem;
  pointer-events: none;
}

.input-footer {
  position: relative;
  margin-top: 0.25rem;
  min-height: 1rem;
}

.input-counter {
  @include text-muted();
  font-size: 0.75rem;
  text-align: right;
  line-height: 1;
  position: absolute;
  right: 0;
  top: 0;
}

.input-error {
  color: $error;
  font-size: 0.75rem;
  line-height: 1;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
