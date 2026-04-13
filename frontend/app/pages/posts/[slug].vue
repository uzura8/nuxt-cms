<script setup lang="ts">
import config from '@/configs/config.json'
import { documentMetaTitle } from '@/lib/siteHead'
import { mediaUrl } from '@/lib/media'
import { checkSlug, truncateText } from '@/utils/string'
import { linkClass } from '@/utils/styles'

defineOptions({ name: 'PostPage' })
definePageMeta({
  validate: async (route) => {
    return checkSlug(route.params.slug as string)
  }
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()

const siteUrlBase = computed(() => String(runtimeConfig.public.siteUrl || '').replace(/\/$/, ''))
const canonicalUrl = computed(() => `${siteUrlBase.value}${route.path}`)

const slug = computed(() => route.params.slug as string)
const serviceId = config.post.serviceId

const { post, isLoading, error } = usePostDetail({
  serviceId,
  slug
})

const metaTitle = computed(() =>
  post.value ? post.value.title : t('page.posts.detail.loadingTitle')
)

const metaDescription = computed(() =>
  post.value
    ? truncateText(post.value.bodyText, 160, { suffix: '…' })
    : t('page.posts.detail.loadingDescription')
)

const metaOgTitle = computed(() => documentMetaTitle(config.site, metaTitle.value))

const metaOgImage = computed((): string | false => {
  const p = post.value
  if (!p) return false
  const first = p.images?.[0]
  const rawOgImage =
    first?.fileId && first?.mimeType
      ? mediaUrl(serviceId, 'image', first.fileId, first.mimeType, config.post.ogpImageSize)
      : ''
  return rawOgImage.trim() ? rawOgImage : false
})

const metaOgType = computed(() => (post.value ? 'article' : 'website'))

useSeoMeta({
  title: metaTitle,
  description: metaDescription,
  ogTitle: metaOgTitle,
  ogDescription: metaDescription,
  ogUrl: canonicalUrl,
  ogType: metaOgType,
  ogImage: metaOgImage,
  twitterImage: metaOgImage
})

useHead({
  link: [{ rel: 'canonical', key: 'canonical', href: canonicalUrl }]
})

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div>
    <div class="mb-12">
      <button
        type="button"
        @click="goBack"
        :class="linkClass()"
      >
        <FontAwesomeIcon
          icon="angle-left"
          class="me-2"
        />
        <span>{{ $t('page.posts.list.title') }}</span>
      </button>
    </div>

    <BaseHeading v-if="post?.title">{{ post.title }}</BaseHeading>
    <PostDetail
      :post="post"
      :is-loading="isLoading"
      :error="error"
    />
  </div>
</template>
