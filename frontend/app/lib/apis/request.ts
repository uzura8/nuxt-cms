import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

/**
 * CMS API 向けの共通 fetch。
 * ヘッダ・タイムアウト・エラー処理を後からここに集約する。
 *
 * Nuxt の $fetch は ofetch の FetchOptions より厳しい NitroFetchOptions を要求するため、第2引数はそれに合わせる。
 */
export async function cmsFetch<T>(
  url: NitroFetchRequest,
  options?: NitroFetchOptions<NitroFetchRequest, 'get'>
): Promise<T> {
  return await $fetch<T>(url, options)
}
