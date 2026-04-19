<script setup lang="ts">
import { computed } from 'vue'

// app/components/base/loading.vue
/** 未指定時は `normal`（自前の最低高さブロック）として扱う */
export type LoadingFit = 'screen' | 'parent'
export type LoadingSpinnerSize = 'sm' | 'md' | 'lg'

interface Props {
  isActive?: boolean
  /**
   * `screen`: ビューポート全体
   * `parent`: 直近の `position: relative` かつ高さのある親を覆う
   * 未指定: `normal`（`relative min-h-40` のブロック）
   */
  fit?: LoadingFit
  spinnerSize?: LoadingSpinnerSize
  disableTransparency?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  spinnerSize: 'md',
  disableTransparency: false
})

const spinnerRingClass = computed(() => {
  switch (props.spinnerSize) {
    case 'sm':
      return 'h-6 w-6 border-2'
    case 'lg':
      return 'h-14 w-14 border-4'
    default:
      return 'h-10 w-10 border-4'
  }
})
</script>

<template>
  <template v-if="isActive">
    <div
      v-if="fit === 'screen'"
      role="status"
      aria-busy="true"
      class="fixed inset-0 z-50 flex items-center justify-center transition-opacity"
      :class="disableTransparency ? 'bg-gray-100' : 'bg-gray-100/60'"
    >
      <div
        class="animate-spin rounded-full border-primary-500 border-t-transparent"
        :class="spinnerRingClass"
        aria-hidden="true"
      />
    </div>
    <div
      v-else-if="fit === 'parent'"
      role="status"
      aria-busy="true"
      class="absolute inset-0 z-10 flex min-h-12 items-center justify-center transition-opacity"
      :class="disableTransparency ? 'bg-gray-100' : 'bg-gray-100/60'"
    >
      <div
        class="animate-spin rounded-full border-primary-500 border-t-transparent"
        :class="spinnerRingClass"
        aria-hidden="true"
      />
    </div>
    <div
      v-else
      class="relative min-h-40 w-full"
    >
      <div
        role="status"
        aria-busy="true"
        class="absolute inset-0 z-10 flex items-center justify-center transition-opacity"
        :class="disableTransparency ? 'bg-gray-100' : 'bg-gray-100/60'"
      >
        <div
          class="animate-spin rounded-full border-primary-500 border-t-transparent"
          :class="spinnerRingClass"
          aria-hidden="true"
        />
      </div>
    </div>
  </template>
</template>
