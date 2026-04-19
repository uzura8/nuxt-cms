import { computed, toValue, type MaybeRefOrGetter } from 'vue'

import { documentMetaTitle, siteHeadTitleLine } from '@/lib/siteHead'

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
  /**
   * 省略時は `t('site.name')`。
   */
  title?: MaybeRefOrGetter<string>
  /**
   * 省略時は `t('site.description')`。
   */
  description?: MaybeRefOrGetter<string>
  /**
   * `og:title` に使う文字列。省略時は `documentMetaTitle`（`site.name` / `site.caption` とページタイトル）。
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
  /**
   * `useHead` の `titleTemplate`。指定時のみグローバル（例: `nuxt.config` の `%s | …`）を上書きする。
   * 省略時、**引数なし（空オブジェクト）かつルート `/`** のときはトップ用に `'%s'` を付与する。
   */
  titleTemplate?: MaybeRefOrGetter<string>
}

function isBarePageSeoInput(input: UsePageSeoInput): boolean {
  return Object.keys(input).length === 0
}

/**
 * Sets `useSeoMeta` (title/description/OG) and `useHead`（canonical `link`、任意で `titleTemplate`）。
 *
 * `usePageSeo()`（引数なし）を **`/` のページ**だけで使うと、トップ向けの既定（`siteHeadTitleLine` 由来の title / og:title、`titleTemplate: '%s'`、説明は `site.description`）になる。
 */
export function usePageSeo(input: UsePageSeoInput = {}) {
  const { t } = useI18n()
  const runtimeConfig = useRuntimeConfig()
  const route = useRoute()

  const bareHomeSeo = computed(() => isBarePageSeoInput(input) && route.path === '/')

  const siteUrlBase = computed(() => String(runtimeConfig.public.siteUrl || '').replace(/\/$/, ''))

  const canonicalPath = computed(() => {
    const override = input.canonicalPath != null ? toValue(input.canonicalPath) : undefined
    if (override != null && override !== '') {
      return override.startsWith('/') ? override : `/${override}`
    }
    return route.path
  })

  const canonicalUrl = computed(() => `${siteUrlBase.value}${canonicalPath.value}`)

  const siteForMeta = computed(() => ({
    name: t('site.name'),
    caption: t('site.caption')
  }))

  const homeLineTitle = computed(
    () => siteHeadTitleLine(siteForMeta.value) || t('site.name').trim()
  )

  const title = computed(() => {
    if (bareHomeSeo.value) return homeLineTitle.value
    return input.title !== undefined ? toValue(input.title) : t('site.name')
  })

  const description = computed(() =>
    input.description !== undefined ? toValue(input.description) : t('site.description')
  )

  const ogTitle = computed(() => {
    if (bareHomeSeo.value) return homeLineTitle.value
    return input.ogTitle !== undefined
      ? toValue(input.ogTitle!)
      : documentMetaTitle(siteForMeta.value, title.value)
  })

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
    const tw = twitterImage ?? ogImage
    useSeoMeta({ ogImage, twitterImage: tw })
  }

  useHead(
    computed(() => {
      const link = [{ rel: 'canonical' as const, key: 'canonical' as const, href: canonicalUrl.value }]
      if (input.titleTemplate !== undefined) {
        return { link, titleTemplate: String(toValue(input.titleTemplate)) }
      }
      if (bareHomeSeo.value) {
        return { link, titleTemplate: '%s' }
      }
      return { link }
    })
  )

  return {
    canonicalUrl
  }
}
