<script setup lang="ts">
// app/pages/posts/[slug].vue

import config from '@/configs/config.json'
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

usePageSeo({
  title: metaTitle,
  description: metaDescription,
  ogType: metaOgType,
  ogImage: metaOgImage
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
        <span>{{ $t('common.back') }}</span>
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
