/**
 * `config.site.name` と `caption` を「title - caption」形式で連結（どちらか一方のみでも可）
 */
export function siteHeadTitleLine(site: { name?: string; caption?: string }): string {
  const t = (site.name ?? '').trim()
  const c = (site.caption ?? '').trim()
  if (t && c) return `${t} - ${c}`
  return t || c
}

/**
 * `<title>` / `og:title` 用の完全文字列。
 * トップなどページ固有タイトルが無いときは suffix のみ。
 */
export function documentMetaTitle(site: { name?: string; caption?: string }, pageTitle?: string | null): string {
  const suffix = siteHeadTitleLine(site)
  const p = (pageTitle ?? '').trim()
  if (!p) return suffix
  return suffix ? `${p} | ${suffix}` : p
}
