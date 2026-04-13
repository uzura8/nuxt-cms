// app/composables/useHtmlSanitizer.ts

import DOMPurify from 'isomorphic-dompurify'

/** `dompurify` を直接依存にせず、`isomorphic-dompurify` の API から型を取る */
type DOMPurifySanitizeConfig = NonNullable<Parameters<typeof DOMPurify.sanitize>[1]>

export const DOMPURIFY_DEFAULT_OPTIONS = {
  ALLOWED_TAGS: ['a', 'br', 'span', 'strong', 'em'],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  FORBID_ATTR: ['style']
} satisfies DOMPurifySanitizeConfig

/** CMS 投稿本文（HTML）向け。一覧・フッター用より広いタグを許可 */
export const DOMPURIFY_POST_BODY_OPTIONS = {
  ALLOWED_TAGS: [
    'a',
    'b',
    'blockquote',
    'br',
    'caption',
    'code',
    'col',
    'colgroup',
    'dd',
    'div',
    'dl',
    'dt',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'i',
    'img',
    'kbd',
    'li',
    'ol',
    'p',
    'pre',
    's',
    'samp',
    'span',
    'strong',
    'sub',
    'sup',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'tr',
    'u',
    'ul'
  ],
  ALLOWED_ATTR: [
    'alt',
    'class',
    'colspan',
    'decoding',
    'height',
    'href',
    'id',
    'loading',
    'rel',
    'rowspan',
    'scope',
    'src',
    'target',
    'title',
    'width'
  ],
  FORBID_ATTR: ['style']
} satisfies DOMPurifySanitizeConfig

export function sanitizeHtml(html: string, options = DOMPURIFY_DEFAULT_OPTIONS) {
  return DOMPurify.sanitize(html, options)
}

export function sanitizePostBodyHtml(html: string) {
  return sanitizeHtml(html, DOMPURIFY_POST_BODY_OPTIONS)
}
