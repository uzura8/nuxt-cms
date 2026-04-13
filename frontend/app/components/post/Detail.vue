<script setup lang="ts">
// app/components/post/Detail.vue

import type { PostPublic } from '@/types/Post'
import { linkClass } from '@/utils/styles'
import { formatDate } from '@/utils/date'

defineProps<{
  post: PostPublic | null
  isLoading: boolean
  error: unknown
}>()
</script>

<template>
  <div>
    <p
      v-if="error"
      class="text-red-600 text-center text-sm mb-4"
    >
      {{ $t('message.fetchFailed') }}
    </p>

    <p
      v-else-if="isLoading && !post"
      class="text-gray-500 text-center py-8"
    >
      {{ $t('common.loading') }}
    </p>

    <div
      v-else-if="post"
      class="mx-auto mt-12"
    >
      <PostDetailBody
        v-if="post.bodyHtml"
        :body="post.bodyHtml"
        class="mb-12"
      />

      <dl class="space-y-4">
        <div
          v-if="post.publishAt"
          class="sm:flex sm:items-center"
        >
          <dt class="w-24 font-medium text-gray-500 dark:text-white">
            {{ $t('common.publishAt') }}
          </dt>
          <dd class="text-lg dark:text-white sm:flex-1">
            <time
              itemprop="datepublished"
              :datetime="formatDate(post.publishAt)"
            >
              {{ formatDate(post.publishAt) }}
            </time>
          </dd>
        </div>
        <div
          v-if="post && post.category"
          class="sm:flex sm:items-center"
        >
          <dt class="w-24 font-medium text-gray-500 dark:text-white">
            {{ $t('common.category') }}
          </dt>
          <dd class="text-lg dark:text-white sm:flex-1">
            <RouterLink
              :to="`/categories/${post.category.slug}/posts`"
              :class="linkClass()"
            >
              {{ post.category.label }}
            </RouterLink>
          </dd>
        </div>
        <div
          v-if="post && post.tags"
          class="sm:flex sm:items-center"
        >
          <dt class="w-24 font-medium text-gray-500 dark:text-white">
            {{ $t('common.tagsShort') }}
          </dt>
          <dd class="text-lg dark:text-white sm:flex-1">
            <ul class="flex flex-wrap">
              <li
                v-for="tag in post.tags"
                :key="tag.id ?? tag.label"
                class="mb-1"
              >
                <BaseBadge
                  variant="brand"
                  class="me-1"
                  :to="`/tags/${tag.label}/posts`"
                >
                  {{ tag.label }}
                </BaseBadge>
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>

    <div v-else-if="!isLoading">
      <p class="text-gray-500 text-center">{{ $t('message.noData') }}</p>
    </div>
  </div>
</template>
