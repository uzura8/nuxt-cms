<script setup lang="ts">
// app/components/input/select.vue

import { twMerge } from 'tailwind-merge'

defineOptions({
  inheritAttrs: false
})

const { t } = useI18n()

const attrs = useAttrs()

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    options?: SelectOption[]
    optionValues?: string[]
    optionsLabelLocalePrefix?: string // optionValuesを国際化する際の翻訳キー接頭辞
    defaultOptionLabel?: string
    isDisabled?: boolean
    isWidthFull?: boolean
  }>(),
  {
    modelValue: '',
    options: () => [],
    optionValues: () => [],
    optionsLabelLocalePrefix: '',
    defaultOptionLabel: '',
    isDisabled: false,
    isWidthFull: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string, oldValue: string): void
}>()

const selectedValue = ref(props.modelValue)
watch(
  () => props.modelValue,
  (value) => {
    selectedValue.value = value
  }
)

watch(selectedValue, (value, oldValue) => {
  emit('update:modelValue', value)
  emit('change', value, oldValue)
})

const optionText = (key: string) => {
  if (!props.optionsLabelLocalePrefix) return key
  return t(`${props.optionsLabelLocalePrefix}.${key}`)
}

// class を twMerge で統合
const selectClass = computed(() =>
  twMerge(
    'pl-3 pr-8 py-2.5 min-w-16 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body',
    props.isWidthFull && 'block w-full',
    props.isDisabled && 'text-gray-300',
    attrs.class as string
  )
)

// class を除いた attrs を select に渡す
const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})
</script>

<template>
  <select
    v-bind="forwardedAttrs"
    v-model="selectedValue"
    :class="selectClass"
  >
    <option
      v-if="defaultOptionLabel"
      value=""
    >
      {{ defaultOptionLabel }}
    </option>
    <template v-if="options.length > 0">
      <option
        v-for="(optionObj, index) in options"
        :key="`${index}-${optionObj.value}`"
        :value="optionObj.value"
        :selected="optionObj.value === selectedValue"
        :disabled="optionObj.disabled"
        v-text="optionObj.label"
      ></option>
    </template>
    <template v-else-if="optionValues.length > 0">
      <option
        v-for="(optionValue, index) in optionValues"
        :key="`${index}-${optionValue}`"
        :value="optionValue"
        :selected="optionValue === selectedValue"
        v-text="optionText(optionValue)"
      ></option>
    </template>
  </select>
</template>
