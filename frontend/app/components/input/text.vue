<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'InputText',
  inheritAttrs: false
})

type InputSize = 'sm' | 'md' | 'lg' | 'xl'
type DisplayMode = 'block' | 'inline'
type InputType = 'text' | 'password' | 'email' | 'search' | 'tel' | 'url' | 'number'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    size?: InputSize
    display?: DisplayMode
    type?: InputType
    placeholder?: string
    pattern?: string
    disabled?: boolean
    isError?: boolean
  }>(),
  {
    modelValue: '',
    size: 'md',
    display: 'block',
    type: 'text',
    placeholder: '',
    pattern: '',
    disabled: false,
    isError: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur', value: string, event: FocusEvent): void
  (e: 'change', value: string, event: Event): void
  (e: 'changed', value: string, event: Event): void
}>()

const sizeClassMap: Record<InputSize, string> = {
  sm: 'text-sm px-2.5 py-2',
  md: 'text-sm px-3 py-2.5',
  lg: 'text-base px-3.5 py-3',
  xl: 'text-base px-4 py-3.5'
}

const displayClassMap: Record<DisplayMode, string> = {
  block: 'block w-full',
  inline: 'inline-block'
}

const normalBaseClass =
  'bg-neutral-secondary-medium border border-default-medium rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body'

const errorBaseClass =
  'bg-danger-soft border border-danger-subtle rounded-base focus:ring-danger focus:border-danger shadow-xs placeholder:text-fg-danger-strong'

const enabledTextClass = 'text-heading'
const disabledTextClass = 'text-fg-disabled'
const errorTextClass = 'text-fg-danger-strong' // ★追加

const inputClass = computed(() => {
  return [
    props.isError ? errorBaseClass : normalBaseClass,
    props.disabled ? disabledTextClass : props.isError ? errorTextClass : enabledTextClass,
    sizeClassMap[props.size],
    displayClassMap[props.display]
  ]
})

const onInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
}

const onBlur = (event: FocusEvent) => {
  const value = (event.target as HTMLInputElement).value
  emit('blur', value, event)
}

const onChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('change', value, event)
  emit('changed', value, event)
}
</script>

<template>
  <input
    v-bind="$attrs"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :pattern="pattern || undefined"
    :disabled="disabled"
    :class="inputClass"
    @input="onInput"
    @blur="onBlur"
    @change="onChange"
  />
</template>
