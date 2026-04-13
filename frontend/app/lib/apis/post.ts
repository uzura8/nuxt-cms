import type { PostPublic, PostsListApiResponse } from '@/types/Post'

import { cmsFetch } from './request'
import { buildApiUrl } from './url'

export type PostsListQuery = {
  pageToken?: string | null
  categorySlug?: string
  tagLabel?: string
  count?: number
}

/** GET /api/posts/:serviceId */
export function buildPostsListUrl(serviceId: string, query?: PostsListQuery): string {
  const encodedId = encodeURIComponent(serviceId)
  return buildApiUrl(`/posts/${encodedId}`, {
    pageToken: query?.pageToken ?? undefined,
    categorySlug: query?.categorySlug,
    tagLabel: query?.tagLabel,
    count: query?.count != null ? String(query.count) : undefined
  })
}

/** 投稿一覧を取得 */
export async function fetchPostsList(
  serviceId: string,
  query?: PostsListQuery
): Promise<PostsListApiResponse> {
  return cmsFetch<PostsListApiResponse>(buildPostsListUrl(serviceId, query))
}

/** GET /api/posts/:serviceId/:slug */
export function buildPostDetailUrl(serviceId: string, slug: string): string {
  const encodedServiceId = encodeURIComponent(serviceId)
  const encodedSlug = encodeURIComponent(slug)
  return buildApiUrl(`/posts/${encodedServiceId}/${encodedSlug}`)
}

/** 公開投稿 1 件を取得 */
export async function fetchPostDetail(serviceId: string, slug: string): Promise<PostPublic> {
  return cmsFetch<PostPublic>(buildPostDetailUrl(serviceId, slug))
}

/** 一覧コンテキストの serviceId を補完（API が空のときのフォールバック） */
export function withListServiceId(items: PostPublic[], fallbackServiceId: string): PostPublic[] {
  if (!fallbackServiceId) return items
  return items.map((p) => (p.serviceId ? p : { ...p, serviceId: fallbackServiceId }))
}
