<script setup lang="ts">
// app/components/base/Button.vue

import { computed, useAttrs } from 'vue'
import { buttonClass, type ButtonSize, type ButtonVariant } from '@/utils/buttonStyles'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    isOutline?: boolean
    size?: ButtonSize
    isRound?: boolean
    nativeType?: 'button' | 'submit' | 'reset' // HTMLのbutton[type]
    disabled?: boolean // disabled を props でも受ける（attrsのdisabledでもOK）
  }>(),
  {
    variant: 'brand',
    isOutline: false,
    size: 'md',
    isRound: false,
    nativeType: 'button',
    disabled: false
  }
)

const attrs = useAttrs()

const isDisabled = computed(() => {
  if (props.disabled) return true
  const v = (attrs as Record<string, unknown>).disabled
  return v === '' || v === true || v === 'true'
})

const classes = computed(() =>
  buttonClass({
    variant: props.variant,
    isOutline: props.isOutline,
    size: props.size,
    isRound: props.isRound,
    disabled: isDisabled.value
  })
)

const passthroughAttrs = computed(() => {
  const {
    class: _class,
    variant: _variant,
    disabled: _disabled,
    ...rest
  } = attrs as Record<string, unknown>
  return rest
})
</script>

<template>
  <button
    :type="nativeType"
    :disabled="isDisabled"
    :class="[classes, attrs.class]"
    v-bind="passthroughAttrs"
  >
    <slot />
  </button>
</template>
