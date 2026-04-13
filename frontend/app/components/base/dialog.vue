<script setup lang="ts">
// import { computed, type PropType } from 'vue'
import type { ButtonVariant } from './button/types'

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(
  defineProps<{
    isActive?: boolean
    title?: string
    contentClass?: string | string[]
    confirmLabel?: string
    confirmVariant?: ButtonVariant
    cancelLabel?: string
  }>(),
  {
    isActive: false,
    title: '',
    contentClass: 'max-w-sm',
    confirmLabel: '',
    confirmVariant: 'danger',
    cancelLabel: ''
  }
)

const emit = defineEmits<{
  (e: 'confirmed'): void
  (e: 'close'): void
}>()

const { t } = useI18n()

const confirm = () => {
  emit('confirmed')
}

const closeModal = () => {
  emit('close')
}

const confirmBtnLabel = computed(() => props.confirmLabel || t('common.yes'))
const cancelBtnLabel = computed(() => props.cancelLabel || t('common.cancel'))
</script>

<template>
  <BaseModal
    v-if="isActive"
    v-bind="$attrs"
    :is-active="isActive"
    :is-dialog-mode="true"
    :title="title"
    :content-class="contentClass"
    @close="closeModal"
    @keydown.enter="confirm"
  >
    <slot />
    <template #footer>
      <div class="flex justify-center items-center space-x-4 mt-6">
        <BaseButton
          nativeType="button"
          variant="light"
          @click="closeModal"
        >
          {{ cancelBtnLabel }}
        </BaseButton>
        <BaseButton
          nativeType="button"
          :variant="confirmVariant"
          @click="confirm"
        >
          {{ confirmBtnLabel }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
