<script setup lang="ts">
import { computed } from 'vue'
import type { SelectOption } from '../input/select.vue'

defineOptions({
  name: 'FieldInputSelect',
  inheritAttrs: false
})

const props = withDefaults(
  defineProps<{
    modelValue?: string
    id?: string
    label?: string
    error?: string
    helpers?: string | string[]
    options?: SelectOption[]
    optionValues?: string[]
    optionsLabelLocalePrefix?: string
    defaultOptionLabel?: string
    disabled?: boolean
    isWidthFull?: boolean
  }>(),
  {
    modelValue: '',
    id: '',
    label: '',
    error: '',
    helpers: '',
    options: () => [],
    optionValues: () => [],
    optionsLabelLocalePrefix: '',
    defaultOptionLabel: '',
    disabled: false,
    isWidthFull: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string, oldValue: string): void
}>()

const autoId = useId()

const inputId = computed(() => {
  return props.id || autoId
})

const helperMessages = computed(() => {
  if (Array.isArray(props.helpers)) {
    return props.helpers.filter((helper) => !!helper)
  }

  return props.helpers ? [props.helpers] : []
})

const onUpdateModelValue = (value: string) => {
  emit('update:modelValue', value)
}

const onChange = (value: string, oldValue: string) => {
  emit('change', value, oldValue)
}
</script>

<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-heading"
    >
      {{ label }}
    </label>

    <InputSelect
      :id="inputId"
      :model-value="modelValue"
      :options="options"
      :option-values="optionValues"
      :options-label-locale-prefix="optionsLabelLocalePrefix"
      :default-option-label="defaultOptionLabel"
      :is-disabled="disabled"
      :is-width-full="isWidthFull"
      v-bind="$attrs"
      @update:model-value="onUpdateModelValue"
      @change="onChange"
    />

    <p
      v-if="error"
      class="text-sm text-fg-danger-strong"
    >
      {{ error }}
    </p>

    <div
      v-else-if="helperMessages.length > 0"
      class="space-y-1"
    >
      <p
        v-for="(helper, index) in helperMessages"
        :key="`${inputId}-helper-${index}`"
        class="text-sm text-body"
      >
        {{ helper }}
      </p>
    </div>
  </div>
</template>
