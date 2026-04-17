<script setup lang="ts">
import config from '@/configs/config.json'

import type { PostPublic } from '@/types/Post'
import { truncateText } from '@/utils/string'
import { linkClass } from '@/utils/styles'

const props = withDefaults(
  defineProps<{
    post: PostPublic
    /** 一覧先頭など LCP になりやすい 1 件だけ true */
    preloadLcp?: boolean
  }>(),
  { preloadLcp: false }
)

const imageSize = computed((): string => {
  return config.post.listImageSize
})
</script>

<template>
  <div
    v-if="post"
    class="bg-white overflow-hidden rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3"
  >
    <div
      v-if="(post.images?.length ?? 0) > 0 && post.images[0]?.fileId && post.images[0]?.mimeType"
      class="relative col-span-2 md:col-span-1"
    >
      <RouterLink :to="`/posts/${post.slug}`">
        <MediaImage
          :service-id="post.serviceId"
          :file-id="post.images[0]?.fileId"
          :mime-type="post.images[0]?.mimeType"
          :size="imageSize"
          :preload="preloadLcp"
        />
      </RouterLink>
    </div>
    <div class="p-6 col-span-1 sm:col-span-2">
      <BaseHeading
        tag="h2"
        class="mb-4 text-xl lg:text-2xl"
      >
        <RouterLink
          :to="`/posts/${post.slug}`"
          :class="linkClass()"
        >
          {{ post.title }}
        </RouterLink>
      </BaseHeading>
      <p
        v-if="post.bodyText"
        class="text-gray-500 leading-relaxed mb-4"
      >
        {{ truncateText(post.bodyText, 300, { suffix: '…' }) }}
      </p>
      <RouterLink
        :to="`/posts/${post.slug}`"
        :class="linkClass()"
        class="text-sm"
      >
        {{ $t('common.showMore') }}
      </RouterLink>
    </div>
  </div>
</template>
