<template>
  <div :class="controlClasses">
    <label :class="`${props.cssClass}__label`">
      <input
        v-model="model"
        :type="props.type"
        :placeholder="defaultPlaceholder"
        :autocomplete="props.autocomplete ? 'on' : 'off'"
        :disabled="props.disabled"
        :class="`${props.cssClass}__input`"
        :name="props.name"
        v-on="listeners"
        @mouseover="hover = true"
        @mouseleave="hover = false"
      />
    </label>

    <div v-if="!!slots.placeholder" :class="`${props.cssClass}__placeholder`">
      <slot name="placeholder" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Vue
import { ref, computed, Ref } from 'vue';

// Types
import type { IInputTextProps, IInputTextSlots, IInputTextEmits } from './InputText';

const props = withDefaults(defineProps<IInputTextProps>(), {
  type: 'text',
  autocomplete: false,
  disabled: false,
  cssClass: 'input-text',
  valid: false,
  error: false,
});

const emit = defineEmits<IInputTextEmits>();
const slots = defineSlots<IInputTextSlots>();

const focused: Ref<boolean> = ref(false);
const hover: Ref<boolean> = ref(false);

const controlClasses = computed(() => {
  return [
    props.cssClass,
    {
      [`${props.cssClass}--${props.theme}`]: props.theme,
      [`${props.cssClass}--focused`]: focused.value,
      [`${props.cssClass}--hover`]: hover.value && !focused.value,
      [`${props.cssClass}--disabled`]: props.disabled,
      [`${props.cssClass}--filled`]: !!props.modelValue,
      [`${props.cssClass}--valid`]: props.valid,
      [`${props.cssClass}--invalid`]: props.error,
    },
  ];
});

/**
 * @description Computed property for custom v-model
 * @type {WritableComputedRef<Date & boolean>}
 */
const model = computed({
  get() {
    return props.modelValue;
  },

  set(value) {
    emit('update:model-value', value);
  },
});

/**
 * @description Default placeholder
 * @type {ComputedRef<string>}
 */
const defaultPlaceholder = computed(() => {
  return !!slots.placeholder ? undefined : props.placeholder;
});

/**
 * @description Object of listeners
 * @type {ComputedRef<{change: (event: Event) => void, blur: (event: Event) => void, focus: (event: Event) => void}>}
 */
const listeners = computed(() => {
  return {
    blur: onBlur,
    focus: onFocus,
    change: onChange,
  };
});

/**
 * @description Blur event handler
 * @param {Event} event
 */
const onBlur = (event: Event) => {
  focused.value = false;
  emit('blur', event);
};

/**
 * @description Focus event handler
 * @param {Event} event
 */
const onFocus = (event: Event) => {
  focused.value = true;
  emit('focus', event);
};

/**
 * @description Change event handler
 * @param {Event} event
 */
const onChange = (event: Event) => {
  emit('change', event);
};
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
