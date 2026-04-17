<script setup lang="ts">
// app/components/media/image.vue → MediaImage
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
    /** true のとき NuxtImg（@nuxt/image）。既定は通常の img */
    nuxtImg?: boolean
    /** LCP 候補のときだけ true。通常 img は head の preload、NuxtImg は同コンポーネントの preload */
    preload?: boolean
    /** NuxtImg 用の sizes。未指定で preload のときは `100vw` */
    sizes?: string
  }>(),
  {
    nuxtImg: false,
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
  if (!props.nuxtImg) return undefined
  if (props.sizes) return props.sizes
  if (props.preload) return '100vw'
  return undefined
})

useHead(() => {
  if (!props.preload || props.nuxtImg) return {}
  return {
    link: [{ rel: 'preload', as: 'image', href: imageUrl.value }]
  }
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
      v-if="nuxtImg"
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
    <img
      v-else
      :src="imageUrl"
      :width="intrinsicFromSizeToken?.width"
      :height="intrinsicFromSizeToken?.height"
      :loading="preload ? 'eager' : 'lazy'"
      decoding="async"
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
