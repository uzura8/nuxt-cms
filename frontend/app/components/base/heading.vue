<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, normalizeClass, useAttrs } from 'vue'
import { twMerge } from 'tailwind-merge'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const defaultTextSizeMap: Record<HeadingTag, string> = {
  h1: 'text-3xl lg:text-4xl',
  h2: 'text-2xl lg:text-3xl',
  h3: 'text-xl lg:text-2xl',
  h4: 'text-lg lg:text-xl',
  h5: 'text-base lg:text-lg',
  h6: 'text-sm lg:text-base'
}

export default defineComponent({
  inheritAttrs: false,

  props: {
    tag: {
      type: String as PropType<HeadingTag>,
      default: 'h1',
      validator: (value: string) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(value)
    },
    textSize: {
      type: String,
      default: ''
    },
    textColor: {
      type: String,
      default: 'text-gray-800 dark:text-white'
    }
  },

  setup(props) {
    const attrs = useAttrs()

    const resolvedTextSize = computed(() => {
      return props.textSize || defaultTextSizeMap[props.tag]
    })

    const mergedClass = computed(() => {
      return twMerge(
        'font-semibold',
        resolvedTextSize.value,
        props.textColor,
        normalizeClass(attrs.class)
      )
    })

    const forwardedAttrs = computed(() => {
      const { class: _class, ...rest } = attrs
      return rest
    })

    return {
      mergedClass,
      forwardedAttrs
    }
  }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="forwardedAttrs"
    :class="mergedClass"
  >
    <slot />
  </component>
</template>
