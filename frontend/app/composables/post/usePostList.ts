import { toValue, type MaybeRefOrGetter } from 'vue'

import { fetchPostsList, withListServiceId, type PostsListQuery } from '@/lib/apis'
import type { CategoryPublic } from '@/types/Category'
import type { PostPublic, PostsListApiResponse } from '@/types/Post'

export type UsePostListOptions = {
  serviceId: MaybeRefOrGetter<string>
  categorySlug?: MaybeRefOrGetter<string | undefined>
  tagLabel?: MaybeRefOrGetter<string | undefined>
  count?: MaybeRefOrGetter<number | undefined>
  /** レスポンス meta.category があるときに呼ぶ */
  onMetaCategory?: (category: CategoryPublic) => void
}

export function usePostList(options: UsePostListOptions) {
  const postsListQuery = (pageToken?: string | null): PostsListQuery => ({
    pageToken: pageToken ?? undefined,
    categorySlug: toValue(options.categorySlug) || undefined,
    tagLabel: toValue(options.tagLabel) || undefined,
    count: toValue(options.count) || undefined
  })

  const {
    data: fetchData,
    pending: isLoading,
    error
  } = useAsyncData(
    'post-list-current',
    async (): Promise<PostsListApiResponse | null> => {
      const sid = toValue(options.serviceId)
      if (!sid) return null
      return await fetchPostsList(sid, postsListQuery())
    },
    {
      server: true,
      watch: [
        () => toValue(options.serviceId),
        () => toValue(options.categorySlug),
        () => toValue(options.tagLabel),
        () => toValue(options.count)
      ]
    }
  )

  const extraPosts = ref<PostPublic[]>([])
  const nextPageToken = ref<string | null>(null)
  const isAppending = ref(false)

  watch(
    () => fetchData.value,
    (raw) => {
      extraPosts.value = []
      if (!raw) {
        nextPageToken.value = null
        return
      }
      nextPageToken.value = raw.pageToken ?? null
      if (raw.meta?.category) {
        options.onMetaCategory?.(raw.meta.category)
      }
    },
    { immediate: true }
  )

  const posts = computed(() => {
    const sid = toValue(options.serviceId)
    const baseItems = withListServiceId(fetchData.value?.items ?? [], sid)
    return [...baseItems, ...extraPosts.value]
  })

  const hasNext = computed(() => Boolean(nextPageToken.value))

  async function loadMore(): Promise<void> {
    const sid = toValue(options.serviceId)
    const token = nextPageToken.value
    if (!sid || !token || isAppending.value) return
    isAppending.value = true
    try {
      const raw = await fetchPostsList(sid, postsListQuery(token))
      extraPosts.value.push(...withListServiceId(raw.items, sid))
      nextPageToken.value = raw.pageToken ?? null
    } finally {
      isAppending.value = false
    }
  }

  return {
    posts,
    hasNext,
    isLoading,
    isAppending,
    error,
    loadMore
  }
}
