/**
 * S3 REST（OAI）向け: Nitro prerender の `dir/index.html` と URL パスを一致させる。
 * - `/` `/about/` → 末尾に `index.html`
 * - `/about` のように拡張子のないパス → `/about/index.html`
 * 拡張子付き（`/_nuxt/*.js` 等）は変更しない。
 */
function handler(event) {
  var request = event.request
  var uri = request.uri

  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html'
    return request
  }

  var slash = uri.lastIndexOf('/')
  var tail = slash === -1 ? uri : uri.substring(slash)
  if (tail.indexOf('.') === -1) {
    request.uri = uri + '/index.html'
  }

  return request
}
