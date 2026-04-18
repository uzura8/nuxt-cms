<script setup lang="ts">
// app/pages/posts/index.vue

import config from '@/configs/config.json'

defineOptions({ name: 'PostListPage' })

const { t } = useI18n()
const pageTitle = computed(() => t('page.posts.list.title'))

usePageSeo({
  title: pageTitle,
  description: () => t('page.posts.list.description')
})

const serviceId = config.post.serviceId

const route = useRoute()

// `?count=3` のように正の整数のときだけ API の count に渡す
const listCount = computed((): number | undefined => {
  const raw = route.query.count
  const s = Array.isArray(raw) ? raw[0] : raw
  if (s == null || s === '') return undefined
  const n = Number.parseInt(String(s), 10)
  if (!Number.isFinite(n) || n < 1) return undefined
  return n
})
</script>

<template>
  <div>
    <BaseHeading>{{ pageTitle }}</BaseHeading>

    <PostList
      :service-id="serviceId"
      :count="listCount"
      class="mt-12"
    />
  </div>
</template>
