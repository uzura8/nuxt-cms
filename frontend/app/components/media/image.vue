<script setup lang="ts">
import { mediaUrl, assetUrl } from '@/lib/media'

const props = withDefaults(
  defineProps<{
    serviceId: string
    fileId: string
    mimeType: string
    size: string
    src?: string
    caption?: string
    isClickable?: boolean
    isRounded?: boolean
    isDisplayCaption?: boolean
    /** LCP 候補のときだけ true。head に preload を出して早期取得する */
    preload?: boolean
    /** img の sizes。preload 時は imagesizes 必須のため未指定なら `100vw` */
    sizes?: string
  }>(),
  {
    isClickable: false,
    isRounded: false,
    isDisplayCaption: false,
    preload: false
  }
)

const imageUrl = computed((): string => {
  if (props.src) return props.src
  return mediaUrl(props.serviceId, 'image', props.fileId, props.mimeType, props.size)
})

/** `400x400xs` のように WxH で始まる size トークンから CLS 用の intrinsic 寸法を得る */
const intrinsicFromSizeToken = computed((): { width: number; height: number } | undefined => {
  const m = props.size.match(/^(\d+)x(\d+)/)
  if (!m) return undefined
  return { width: Number(m[1]), height: Number(m[2]) }
})

const resolvedSizes = computed((): string | undefined => {
  if (props.sizes) return props.sizes
  if (props.preload) return '100vw'
  return undefined
})

/** 画像の error はブラウザのみ。SSR や HTMLImageElement 未定義環境では何もしない。 */
function noImageUrl(payload: string | Event): void {
  if (!import.meta.client) return
  if (typeof payload === 'string') return
  const target = payload.target
  if (!(target instanceof HTMLImageElement)) return
  target.src = assetUrl('assets/img/noimage.jpg')
}
</script>

<template>
  <figure class="">
    <NuxtImg
      :src="imageUrl"
      :width="intrinsicFromSizeToken?.width"
      :height="intrinsicFromSizeToken?.height"
      :sizes="resolvedSizes"
      :preload="preload"
      @error="noImageUrl"
      :class="{ 'rounded-lg': isRounded, 'cursor-pointer': isClickable }"
      class="h-auto max-w-full"
      :alt="caption ? caption : ''"
    />
    <figcaption
      v-if="caption && isDisplayCaption"
      class="mt-2 text-sm text-center text-gray-500 dark:text-gray-400"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>
