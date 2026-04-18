/**
 * サイト名とキャプションを「title - caption」形式で連結（どちらか一方のみでも可）。
 * 文言は i18n の `site.name` / `site.caption` などから組み立てたオブジェクトを渡す想定。
 */
export function siteHeadTitleLine(site: { name?: string; caption?: string }): string {
  const namePart = (site.name ?? '').trim()
  const captionPart = (site.caption ?? '').trim()
  if (namePart && captionPart) return `${namePart} - ${captionPart}`
  return namePart || captionPart
}

/**
 * `<title>` / `og:title` 用の完全文字列（`ページ | site.name - site.caption` 形式）。
 * トップなどページ固有タイトルが無いときは suffix のみ。
 */
export function documentMetaTitle(site: { name?: string; caption?: string }, pageTitle?: string | null): string {
  const suffix = siteHeadTitleLine(site)
  const p = (pageTitle ?? '').trim()
  if (!p) return suffix
  return suffix ? `${p} | ${suffix}` : p
}
