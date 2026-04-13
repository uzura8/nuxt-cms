<script setup lang="ts">
// app/components/input/AutoGrowTextarea.vue

import { computed, nextTick, onMounted, ref, useAttrs, watch } from 'vue'
import { twMerge } from 'tailwind-merge'

defineOptions({ inheritAttrs: false }) // class含むattrsを自前でマージする

type Props = {
  modelValue: string
  submitOnEnter?: boolean // Enterでsubmitするか
  newlineOnShiftEnter?: boolean // Shift+Enterで改行を許可するか
  cancelOnEscape?: boolean // Escapeでcancel emitするか
  autofocus?: boolean // true のときフォーカス（isEditing切替に使える）
  cursor?: 'start' | 'end' | 'none' // カーソル位置
  rows?: number // 初期rows
  unstyled?: boolean // デフォルトclassを無効化して、呼び出し側classのみで描画したい時用

  // 親からキャレット位置を直接受け取る
  selectionStart?: number | null
  selectionEnd?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  submitOnEnter: true,
  newlineOnShiftEnter: true,
  cancelOnEscape: false,
  autofocus: false,
  cursor: 'none',
  rows: 1,
  unstyled: false,
  selectionStart: null,
  selectionEnd: null
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'submit', value: string): void
  (e: 'cancel'): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'request-tab-indent', ev: KeyboardEvent): void
}>()

const attrs = useAttrs()
const el = ref<HTMLTextAreaElement | null>(null)

const DEFAULT_CLASS =
  'block w-full py-3 ps-4 pe-16 bg-neutral-secondary-medium border border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-gray-400 resize-none overflow-hidden'

// attrsからclassを除いたもの（classは別で :class に渡す）
const passthroughAttrs = computed(() => {
  // attrs は Proxy なので毎回取り出す
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _class, ...rest } = attrs
  return rest
})

const mergedClass = computed(() => {
  const userClass = attrs.class // string | string[] | object も来うる

  if (props.unstyled) {
    return userClass
  }

  return twMerge(DEFAULT_CLASS, normalizeClassToString(userClass))
})

function normalizeClassToString(value: unknown): string {
  if (!value) return ''

  if (typeof value === 'string') return value

  if (Array.isArray(value)) {
    return value.map(normalizeClassToString).filter(Boolean).join(' ')
  }

  if (typeof value === 'object') {
    return Object.entries(value as Record<string, boolean>)
      .filter(([, enabled]) => enabled)
      .map(([className]) => className)
      .join(' ')
  }

  return ''
}

const resize = async () => {
  await nextTick()
  const t = el.value
  if (!t) return
  t.style.height = 'auto'
  t.style.height = `${t.scrollHeight}px`
}

// 値の長さに収まるようにキャレット位置を補正
const clampSelection = (value: number, max: number) => {
  return Math.min(Math.max(value, 0), max)
}

// selectionStart / selectionEnd があればそれを優先して適用
const applySelection = () => {
  const t = el.value
  if (!t) return

  const valueLength = t.value.length

  if (props.selectionStart != null || props.selectionEnd != null) {
    const start = clampSelection(props.selectionStart ?? 0, valueLength)
    const end = clampSelection(props.selectionEnd ?? start, valueLength)
    t.setSelectionRange(start, end)
    return
  }

  if (props.cursor === 'end') {
    t.setSelectionRange(valueLength, valueLength)
  } else if (props.cursor === 'start') {
    t.setSelectionRange(0, 0)
  }
}

const focus = async () => {
  await nextTick()
  const t = el.value
  if (!t) return
  t.focus()

  // focus 後に 1 フレーム待ってから selection を適用
  requestAnimationFrame(() => {
    applySelection()
  })
}

const onBlur = (e: FocusEvent) => {
  emit('blur', e)
}

const onInput = (e: Event) => {
  const t = e.target as HTMLTextAreaElement
  emit('update:modelValue', t.value)
  void resize()
}

const onKeydown = (e: KeyboardEvent) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((e as any).isComposing) return

  if (props.cancelOnEscape && e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
    emit('cancel')
    return
  }

  if (e.key === 'Tab' && !e.shiftKey) {
    e.preventDefault()
    e.stopPropagation()
    emit('request-tab-indent', e)
    return
  }

  if (e.key !== 'Enter') return

  // Shift+Enter は改行
  if (props.newlineOnShiftEnter && e.shiftKey) {
    // 改行後に高さ追従（inputでも追従するけど保険）
    requestAnimationFrame(() => void resize())
    return
  }

  // Enter で submit（改行させない）
  if (props.submitOnEnter && !e.shiftKey) {
    e.preventDefault()
    e.stopPropagation() // 外側に渡さない
    const v = (e.target as HTMLTextAreaElement | null)?.value ?? props.modelValue
    emit('submit', v) // 値付き
  }
}

onMounted(() => {
  void resize()
  if (props.autofocus) void focus()
})

watch(
  () => props.modelValue,
  () => void resize()
)

watch(
  () => props.autofocus,
  (v) => {
    if (v) void focus()
  }
)

// 編集中に selectionStart / selectionEnd が更新されたら、その位置を反映する
watch([() => props.selectionStart, () => props.selectionEnd], () => {
  if (!el.value) return
  if (document.activeElement !== el.value) return

  requestAnimationFrame(() => {
    applySelection()
  })
})

defineExpose({ focus, resize })
</script>

<template>
  <textarea
    ref="el"
    v-bind="passthroughAttrs"
    :rows="rows"
    :class="mergedClass"
    :value="modelValue"
    @input="onInput"
    @keydown="onKeydown"
    @blur="onBlur"
  />
</template>
