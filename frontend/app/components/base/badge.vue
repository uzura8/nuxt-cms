<script setup lang="ts">
// app/components/base/Badge.vue

import { computed, resolveComponent, type Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { twMerge } from 'tailwind-merge'

defineOptions({
  inheritAttrs: false
})

export type BadgeVariant = 'brand' | 'light' | 'dark' | 'danger' | 'success' | 'warning'

type BadgeStyle = {
  base: string
  border: string
  ring: string
  hover: string
}

const props = withDefaults(
  defineProps<{
    variant?: BadgeVariant
    isBorder?: boolean
    isLarge?: boolean
    isRound?: boolean
    to?: RouteLocationRaw
    href?: string
  }>(),
  {
    variant: 'brand',
    isBorder: false,
    isLarge: false,
    isRound: false,
    to: undefined,
    href: undefined
  }
)

const badgeStyleMap: Record<BadgeVariant, BadgeStyle> = {
  brand: {
    base: 'bg-brand-softer text-fg-brand-strong',
    border: 'border-brand-subtle',
    ring: 'ring-brand-subtle',
    hover: 'hover:bg-brand-soft'
  },
  light: {
    base: 'bg-neutral-primary-soft text-heading',
    border: 'border-default',
    ring: 'ring-default',
    hover: 'hover:bg-neutral-secondary-medium'
  },
  dark: {
    base: 'bg-neutral-secondary-medium text-heading',
    border: 'border-default-medium',
    ring: 'ring-default-medium',
    hover: 'hover:bg-neutral-tertiary-medium'
  },
  danger: {
    base: 'bg-danger-soft text-fg-danger-strong',
    border: 'border-danger-subtle',
    ring: 'ring-danger-subtle',
    hover: 'hover:bg-danger-medium'
  },
  success: {
    base: 'bg-success-soft text-fg-success-strong',
    border: 'border-success-subtle',
    ring: 'ring-success-subtle',
    hover: 'hover:bg-success-medium'
  },
  warning: {
    base: 'bg-warning-soft text-fg-warning',
    border: 'border-warning-subtle',
    ring: 'ring-warning-subtle',
    hover: 'hover:bg-warning-medium'
  }
}

const currentStyle = computed(() => badgeStyleMap[props.variant])

// NuxtLink / a / span を自動で切り替える
const componentTag = computed<Component | string>(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'span'
})

const linkProps = computed(() => {
  if (props.to) {
    return {
      to: props.to
    }
  }

  if (props.href) {
    return {
      href: props.href
    }
  }

  return {}
})

// to / href があれば実質リンクとして扱う
const isInteractive = computed(() => !!props.to || !!props.href)

const sizeClass = computed(() => {
  return props.isLarge ? 'text-sm px-2 py-1' : 'text-xs px-1.5 py-0.5'
})

const roundedClass = computed(() => {
  return props.isRound ? 'rounded-full' : 'rounded'
})

const borderClass = computed(() => {
  if (!props.isBorder) return ''

  return props.isLarge
    ? `ring-1 ring-inset ${currentStyle.value.ring}`
    : `border ${currentStyle.value.border}`
})

const interactiveClass = computed(() => {
  if (!isInteractive.value) return ''

  return twMerge('transition-colors cursor-pointer no-underline', currentStyle.value.hover)
})

const badgeClass = computed(() => {
  return twMerge(
    'inline-flex items-center font-medium whitespace-nowrap',
    currentStyle.value.base,
    sizeClass.value,
    roundedClass.value,
    borderClass.value,
    interactiveClass.value
  )
})
</script>

<template>
  <component
    :is="componentTag"
    v-bind="{ ...linkProps, ...$attrs }"
    :class="badgeClass"
  >
    <slot />
  </component>
</template>
