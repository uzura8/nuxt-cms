import { computed, toValue, type MaybeRefOrGetter } from 'vue'

import config from '@/configs/config.json'
import { documentMetaTitle } from '@/lib/siteHead'

/**
 * `useSeoMeta` の `ogType` が受け付ける値（Nuxt / unhead の定義に合わせる）。
 */
export type UsePageSeoOgType =
  | 'website'
  | 'article'
  | 'book'
  | 'profile'
  | 'music.song'
  | 'music.album'
  | 'music.playlist'
  | 'music.radio_status'
  | 'video.movie'
  | 'video.episode'
  | 'video.tv_show'
  | 'video.other'

export type UsePageSeoInput = {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  /**
   * `og:title` に使う文字列。省略時は `documentMetaTitle(config.site, title)`。
   * トップのように `<title>` と `og:title` を同じにしたいページで指定する。
   */
  ogTitle?: MaybeRefOrGetter<string>
  /**
   * Canonical pathname (e.g. `/posts`). Must start with `/` when set.
   * Omit to use the current route path (`useRoute().path`).
   */
  canonicalPath?: MaybeRefOrGetter<string | undefined>
  ogType?: MaybeRefOrGetter<UsePageSeoOgType | undefined>
  ogImage?: MaybeRefOrGetter<string | false | undefined>
  /**
   * When omitted but `ogImage` is set, defaults to the same value as `ogImage`.
   */
  twitterImage?: MaybeRefOrGetter<string | false | undefined>
}

/**
 * Sets `useSeoMeta` (title/description/OG) and a single canonical `link` via `useHead`.
 */
export function usePageSeo(input: UsePageSeoInput) {
  const runtimeConfig = useRuntimeConfig()
  const route = useRoute()

  const siteUrlBase = computed(() => String(runtimeConfig.public.siteUrl || '').replace(/\/$/, ''))

  const canonicalPath = computed(() => {
    const override = input.canonicalPath != null ? toValue(input.canonicalPath) : undefined
    if (override != null && override !== '') {
      return override.startsWith('/') ? override : `/${override}`
    }
    return route.path
  })

  const canonicalUrl = computed(() => `${siteUrlBase.value}${canonicalPath.value}`)

  const title = computed(() => toValue(input.title))
  const description = computed(() => toValue(input.description))
  const ogTitle =
    input.ogTitle !== undefined
      ? computed(() => toValue(input.ogTitle!))
      : computed(() => documentMetaTitle(config.site, title.value))

  const ogType =
    input.ogType !== undefined
      ? computed((): UsePageSeoOgType | undefined => toValue(input.ogType!))
      : null

  const ogImage =
    input.ogImage !== undefined ? computed(() => toValue(input.ogImage!)) : null

  const twitterImage =
    input.twitterImage !== undefined
      ? computed(() => toValue(input.twitterImage!))
      : ogImage

  useSeoMeta({
    title,
    description,
    ogTitle,
    ogDescription: description,
    ogUrl: canonicalUrl
  })

  if (ogType) {
    useSeoMeta({ ogType })
  }

  if (ogImage !== null) {
    const twitter = twitterImage ?? ogImage
    useSeoMeta({ ogImage, twitterImage: twitter })
  }

  useHead({
    link: [{ rel: 'canonical', key: 'canonical', href: canonicalUrl }]
  })

  return {
    canonicalUrl
  }
}
