<script setup lang="ts">
import config from '@/configs/config.json'
import type { CategoryPublic } from '@/types/Category'
import { linkClass } from '@/utils/styles'

const props = withDefaults(
  defineProps<{
    serviceId: string
    categorySlug?: string
    tagLabel?: string
    /** 1 ページあたり件数。未指定なら `config.common.pagerCount` */
    count?: number
  }>(),
  {
    serviceId: '',
    categorySlug: '',
    tagLabel: '',
    count: config.common.pagerCount
  }
)

const emits = defineEmits<{
  (e: 'updateCategory', category: CategoryPublic): void
}>()

const { posts, hasNext, isLoading, isAppending, error, loadMore } = usePostsList({
  serviceId: () => props.serviceId,
  categorySlug: () => props.categorySlug,
  tagLabel: () => props.tagLabel,
  count: () => props.count,
  onMetaCategory: (category) => emits('updateCategory', category)
})
</script>

<template>
  <div>
    <p
      v-if="error"
      class="text-red-600 text-center text-sm mb-4"
    >
      {{ $t('message.fetchFailed') }}
    </p>

    <BaseLoading
      v-else-if="isLoading && posts.length === 0"
      is-active
    />

    <div
      v-else-if="posts.length"
      class="grid grid-cols-1 gap-6"
    >
      <PostListItem
        v-for="(post, index) in posts"
        :key="post.postId"
        :post="post"
        :preload-lcp="index === 0"
      />
      <div
        v-if="hasNext"
        class="relative text-center"
      >
        <button
          type="button"
          :disabled="isAppending"
          :class="linkClass()"
          class="text-lg lg:text-xl relative z-0 block w-full py-2 hover:bg-gray-50"
          @click="loadMore"
        >
          <span :class="{ invisible: isAppending }">{{ $t('common.showMore') }}</span>
        </button>
        <BaseLoading
          :is-active="isAppending"
          fit="parent"
          spinner-size="sm"
        />
      </div>
    </div>

    <div v-else-if="!isLoading">
      <p class="text-gray-500 text-center">{{ $t('message.noData') }}</p>
    </div>
  </div>
</template>
