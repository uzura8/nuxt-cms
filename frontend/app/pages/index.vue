<script setup lang="ts">
// app/pages/index.vue

import config from '@/configs/config.json'
import { buttonClass } from '@/utils/buttonStyles'
import { linkClass } from '@/utils/styles'
import type { PostPublic } from '@/types/Post'
import { computed, ref, toValue, type ComputedRef, type Ref } from 'vue'

defineOptions({ name: 'TopPage' })
usePageSeo()

const { t } = useI18n()
const title = t('site.name')
const description = t('site.description')
const serviceId = config.post.serviceId

/** `PostList` の `defineExpose`（見出しを親で出すための表示判定） */
type PostListExposed = {
  isLoading: boolean | Ref<boolean>
  posts: PostPublic[] | Ref<PostPublic[]> | ComputedRef<PostPublic[]>
}

const recentListRef = ref<PostListExposed | null>(null)

const showRecentSection = computed(() => {
  const p = recentListRef.value
  if (!p) return false
  return toValue(p.isLoading) || (toValue(p.posts)?.length ?? 0) > 0
})
</script>

<template>
  <div>
    <div class="text-center">
      <BaseHeading
        tag="h1"
        class="tracking-tight text-heading"
        text-size="text-4xl  md:text-5xl lg:text-6xl"
      >
        {{ title }}
      </BaseHeading>
      <p class="mt-8 text-lg font-normal text-body lg:text-xl sm:px-16 xl:px-48">
        {{ description }}
      </p>
      <NuxtLink
        to="/about"
        :class="buttonClass({ variant: 'brand', size: 'md' })"
        class="mt-6"
      >
        {{ t('common.showMore') }}
      </NuxtLink>
      <div class="mt-12">
        <NuxtImg
          src="/images/km-001.JPG"
          alt="コムギの写真"
          width="300"
          sizes="300px"
          class="mx-auto"
        />
      </div>
    </div>

    <ClientOnly>
      <section
        v-show="showRecentSection"
        class="mt-16 max-w-3xl mx-auto px-4"
      >
        <BaseHeading
          tag="h2"
          class="mb-6 text-heading"
        >
          {{ t('page.top.recentPosts') }}
        </BaseHeading>
        <PostList
          ref="recentListRef"
          :service-id="serviceId"
          :count="3"
          hide-more-link
          async-data-key="post-list-home"
        />
        <div class="text-center mt-4">
          <NuxtLink
            to="/posts"
            :class="linkClass()"
            class="text-lg lg:text-xl inline-block py-2"
          >
            {{ t('common.showMore') }}
          </NuxtLink>
        </div>
      </section>
    </ClientOnly>
  </div>
</template>
