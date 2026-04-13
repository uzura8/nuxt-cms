/**
 * 末尾スラッシュなしを正とする（`/about/` → `/about`）。
 * ルート `/` はそのまま。
 */
export default defineNuxtRouteMiddleware((to) => {
  const path = to.path
  if (path === '/' || !path.endsWith('/')) return
  const normalized = path.replace(/\/+$/, '') || '/'
  if (normalized === path) return
  return navigateTo(
    {
      path: normalized,
      query: to.query,
      hash: to.hash
    },
    { redirectCode: 301 }
  )
})
