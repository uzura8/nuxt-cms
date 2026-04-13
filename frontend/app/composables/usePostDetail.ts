import { toValue, type MaybeRefOrGetter } from 'vue'

import { fetchPostDetail } from '@/lib/apis'
import type { PostPublic } from '@/types/Post'

export type UsePostDetailOptions = {
  serviceId: MaybeRefOrGetter<string>
  slug: MaybeRefOrGetter<string>
}

export function usePostDetail(options: UsePostDetailOptions) {
  const asyncKey = computed(
    () => `post-detail:${toValue(options.serviceId)}:${toValue(options.slug)}`
  )

  const {
    data,
    pending: isLoading,
    error,
    refresh
  } = useAsyncData(
    asyncKey,
    async (): Promise<PostPublic | null> => {
      const sid = toValue(options.serviceId)
      const slug = toValue(options.slug)
      if (!sid || !slug) return null
      return await fetchPostDetail(sid, slug)
    },
    {
      server: true,
      watch: [() => toValue(options.serviceId), () => toValue(options.slug)]
    }
  )

  const post = computed<PostPublic | null>(() => data.value ?? null)

  return {
    post,
    isLoading,
    error,
    refresh
  }
}
