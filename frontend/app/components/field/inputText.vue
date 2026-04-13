<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'FieldInputText',
  inheritAttrs: false
})

type InputSize = 'sm' | 'md' | 'lg' | 'xl'
type DisplayMode = 'block' | 'inline'
type InputType = 'text' | 'password' | 'email' | 'search' | 'tel' | 'url' | 'number'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    id?: string
    label?: string
    error?: string
    helpers?: string | string[]
    placeholder?: string
    disabled?: boolean
    pattern?: string
    size?: InputSize
    display?: DisplayMode
    type?: InputType
  }>(),
  {
    modelValue: '',
    id: '',
    label: '',
    error: '',
    helpers: '',
    placeholder: '',
    disabled: false,
    pattern: '',
    size: 'md',
    display: 'block',
    type: 'text'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur', value: string, event: FocusEvent): void
  (e: 'change', value: string, event: Event): void
  (e: 'changed', value: string, event: Event): void
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

const onBlur = (value: string, event: FocusEvent) => {
  emit('blur', value, event)
}

const onChange = (value: string, event: Event) => {
  emit('change', value, event)
}

const onChanged = (value: string, event: Event) => {
  emit('changed', value, event)
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

    <InputText
      :id="inputId"
      :model-value="modelValue"
      :size="size"
      :display="display"
      :type="type"
      :placeholder="placeholder"
      :pattern="pattern"
      :disabled="disabled"
      :is-error="!!error"
      v-bind="$attrs"
      @update:model-value="onUpdateModelValue"
      @blur="onBlur"
      @change="onChange"
      @changed="onChanged"
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
