import type { CategoryPublic } from './Category'
import type { Tag } from './Tag'

/** 投稿に紐づくファイル（API は caption 省略のことがある） */
export interface PostFile {
  fileId: string
  mimeType: string
  caption?: string
}

/** 投稿に紐づくリンク（API は label 省略のことがある） */
export interface PostLink {
  url: string
  label?: string
  id?: number
}

export interface PagerKey {
  postId: string
  serviceId: string
  statusPublishAt: string
}

export type BodyFormat = 'html' | 'text' | 'markdown' | 'json'

/**
 * 公開投稿（一覧・詳細で共通。API の 1 件形に揃える）
 * category は API がネストを返す場合のみ存在。未設定のときは undefined。
 */
export interface PostPublic {
  postId: string
  slug: string
  serviceId: string
  title: string
  bodyFormat: BodyFormat
  body: string
  bodyHtml: string
  bodyText: string
  createdAt: string
  publishAt: string
  updatedAt?: string
  statusPublishAt: string
  categorySlug: string
  categoryPath?: string
  postStatus?: string
  category?: CategoryPublic
  images: PostFile[]
  files: PostFile[]
  links: PostLink[]
  bodyJson?: unknown
  tags?: Tag[]
}

/** 投稿一覧 API のレスポンス */
export interface PostsListApiResponse {
  items: PostPublic[]
  pageToken?: string | null
  pagerKey?: PagerKey | null
  meta?: {
    category?: CategoryPublic
  }
}

export interface PostsApiResult {
  items: PostPublic[]
  pagerKey?: PagerKey
  pageToken?: string
  meta?: {
    category?: CategoryPublic
  }
}
