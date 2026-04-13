<script setup lang="ts">
// app/components/base/Button.vue

import { computed, useAttrs } from 'vue'

type ButtonVariant = 'brand' | 'light' | 'success' | 'danger' | 'warning' | 'dark'
type ButtonSize = 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl'

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

const baseClass =
  'inline-flex items-center justify-center box-border font-medium focus:outline-none cursor-pointer rounded-base'

const sizeClass = computed(() => {
  // base と md を同義にする
  const s = props.size === 'base' ? 'md' : props.size

  // ※あなたのサンプルに合わせて「outline + sm は text-xs」に寄せる
  if (props.isOutline && s === 'sm') return 'leading-5 text-xs px-3 py-2'

  switch (s) {
    case 'xs':
      return 'leading-5 text-xs px-3 py-1.5'
    case 'sm':
      return 'leading-5 text-sm px-3 py-2'
    case 'md':
      return 'leading-5 text-sm px-4 py-2.5'
    case 'lg':
      return 'text-base px-5 py-3'
    case 'xl':
      return 'text-base px-6 py-3.5'
    default:
      return 'leading-5 text-sm px-4 py-2.5'
  }
})

const roundClass = computed(() => (props.isRound ? 'rounded-full' : 'rounded-base'))

const filledByVariant: Record<ButtonVariant, string> = {
  brand:
    'text-white bg-brand border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs',
  light:
    'text-body bg-neutral-secondary-medium border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs',
  success:
    'text-white bg-success border border-transparent hover:bg-success-strong focus:ring-4 focus:ring-success-medium shadow-xs',
  danger:
    'text-white bg-danger border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs',
  warning:
    'text-white bg-warning border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-warning-medium shadow-xs',
  dark: 'text-white bg-dark border border-transparent hover:bg-dark-strong focus:ring-4 focus:ring-neutral-tertiary shadow-xs'
}

const outlineByVariant: Record<ButtonVariant, string> = {
  brand:
    'text-fg-brand bg-neutral-primary border border-brand hover:bg-brand hover:text-white focus:ring-4 focus:ring-brand-subtle',
  light:
    'text-body bg-neutral-primary border border-default hover:bg-neutral-secondary-soft hover:text-heading focus:ring-4 focus:ring-neutral-tertiary',
  success:
    'text-success bg-neutral-primary border border-success hover:bg-success hover:text-white focus:ring-4 focus:ring-neutral-tertiary',
  danger:
    'text-danger bg-neutral-primary border border-danger hover:bg-danger hover:text-white focus:ring-4 focus:ring-neutral-tertiary',
  warning:
    'text-warning bg-neutral-primary border border-warning hover:bg-warning hover:text-white focus:ring-4 focus:ring-neutral-tertiary',
  dark: 'text-dark bg-neutral-primary border border-dark hover:bg-dark hover:text-white focus:ring-4 focus:ring-neutral-tertiary'
}

const variantClass = computed(() =>
  props.isOutline ? outlineByVariant[props.variant] : filledByVariant[props.variant]
)

const disabledClass =
  'text-fg-disabled bg-disabled border border-default-medium shadow-xs cursor-not-allowed'

const passthroughAttrs = computed(() => {
  const {
    class: _class,
    variant: _variant,
    disabled: _disabled,
    ...rest
  } = attrs as Record<string, unknown>
  return rest
})

const classes = computed(() => [
  baseClass,
  sizeClass.value,
  variantClass.value,
  roundClass.value, // sizeClassにrounded-baseが入ってても、最後に上書きするために置いてる
  isDisabled.value ? disabledClass : null
])
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
