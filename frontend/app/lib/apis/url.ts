import config from '@/configs/config.json'

/**
 * CMS API の絶対 URL を組み立てる。
 * @param path - basePath 以降（先頭 `/` あり・なしどちらでも可）。例: `/posts/:serviceId`
 * @param query - 値が undefined / null / 空文字のキーはクエリに含めない
 */
export function buildApiUrl(
  path: string,
  query?: Record<string, string | undefined | null>
): string {
  const base = String(config.api.basePath ?? '').replace(/\/$/, '') || ''
  const segment = path.startsWith('/') ? path : `/${path}`
  const pathname = `${base}${segment}`
  const u = new URL(pathname, config.api.origin)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value != null && value !== '') u.searchParams.set(key, value)
    }
  }
  return u.toString()
}
