<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineOptions({
  // Teleport root では自動継承できないので明示制御する
  inheritAttrs: false
})

const props = withDefaults(
  defineProps<{
    isActive?: boolean
    title?: string
    isNoPadding?: boolean
    isDialogMode?: boolean
    classType?: string
    contentClass?: string | string[]
  }>(),
  {
    isActive: false,
    title: '',
    isNoPadding: false,
    isDialogMode: false,
    classType: '',
    contentClass: 'max-w-sm'
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalRoot = ref<HTMLElement | null>(null)
const modalContent = ref<HTMLElement | null>(null)

let scrollPosition = 0

const closeModal = () => {
  emit('close')
}

const openModal = () => {
  if (!import.meta.client) return

  scrollPosition = window.scrollY || document.documentElement.scrollTop
  document.body.classList.add('fixed', 'left-0', 'right-0', 'overflow-hidden', 'w-full')
  document.body.style.top = `-${scrollPosition}px`
}

const closeModalBehavior = () => {
  if (!import.meta.client) return

  document.body.classList.remove('fixed', 'left-0', 'right-0', 'overflow-hidden', 'w-full')
  document.body.style.top = ''
  window.scrollTo(0, scrollPosition)
}

const titleClass = computed(() => {
  switch (props.classType) {
    case 'danger':
      return 'text-danger-700'
    case 'success':
      return 'text-success-600'
    case 'warning':
      return 'text-warning-600'
    case 'info':
      return 'text-info-600'
    case 'light':
      return 'text-gray-500'
    default:
      return 'text-gray-700'
  }
})

const baseClasses =
  'relative w-full text-center shadow dark:bg-gray-800 min-h-[8rem] overflow-y-auto max-h-full'
const paddingClasses = 'px-5 py-4 sm:p-5 rounded-lg bg-white'

watch(
  () => props.isActive,
  async (newVal) => {
    if (newVal) {
      openModal()

      await nextTick()
      modalRoot.value?.focus()
    } else {
      closeModalBehavior()
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  closeModalBehavior()
})

onClickOutside(modalContent, () => {
  if (props.isDialogMode) return
  closeModal()
})
</script>

<template>
  <Teleport
    v-if="isActive"
    to="body"
  >
    <div
      ref="modalRoot"
      v-bind="$attrs"
      tabindex="-1"
      class="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/50 backdrop-blur-[0.5px] px-4 pt-12 pb-8"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
    <button
      v-if="isDialogMode === false && isNoPadding"
      type="button"
      class="absolute top-1.5 right-1.5 text-gray-200 bg-transparent hover:text-white rounded-lg p-1.5 ml-auto inline-flex items-center dark:hover:text-white"
      @click="closeModal"
    >
      <FontAwesomeIcon
        icon="xmark"
        class="w-8 h-8"
      />
      <span class="sr-only">Close modal</span>
    </button>

    <div
      ref="modalContent"
      class="relative w-full text-center shadow dark:bg-gray-800 min-h-32 overflow-y-auto max-h-full"
      :class="[baseClasses, contentClass, !isNoPadding && paddingClasses]"
    >
      <h3
        v-if="title"
        class="text-lg font-semibold dark:text-white"
        :class="titleClass"
      >
        {{ title }}
      </h3>

      <button
        v-if="isDialogMode === false"
        type="button"
        class="absolute top-1.5 right-1.5 text-white bg-transparent hover:text-gray-100 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
        @click="closeModal"
      >
        <FontAwesomeIcon
          icon="xmark"
          class="w-8 h-8"
        />
        <span class="sr-only">Close modal</span>
      </button>

      <div
        class="text-left text-gray-600 dark:text-gray-400"
        :class="{ 'mt-4': !isNoPadding }"
      >
        <slot />
      </div>

      <slot name="footer" />
    </div>
    </div>
  </Teleport>
</template>
