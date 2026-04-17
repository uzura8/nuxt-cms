// app/composables/useHtmlSanitizer.ts
//
// Lambda（Node）では isomorphic-dompurify → jsdom 連鎖が CJS/ESM 混在で落ちるため、
// サーバ・クライアント共通で sanitize-html を使う。

import sanitizeHtmlLib from 'sanitize-html'
import type { IOptions } from 'sanitize-html'

function attrsForPostBodyTag(tag: string): string[] {
  const base = ['class', 'id'] as const
  switch (tag) {
    case 'a':
      return ['href', 'target', 'rel', 'title', ...base]
    case 'img':
      return ['alt', 'class', 'src', 'height', 'width', 'decoding', 'loading', 'title', ...base]
    case 'td':
    case 'th':
      return ['colspan', 'rowspan', 'scope', ...base]
    case 'col':
    case 'colgroup':
      return ['span', ...base]
    default:
      return [...base]
  }
}

const POST_BODY_TAGS = [
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
] as const

function buildPostBodyAllowedAttributes(): IOptions['allowedAttributes'] {
  const out: NonNullable<IOptions['allowedAttributes']> = {}
  for (const tag of POST_BODY_TAGS) {
    out[tag] = attrsForPostBodyTag(tag)
  }
  return out
}

/** フッター等の短い HTML 向け */
export const HTML_SANITIZE_FOOTER_OPTIONS = {
  allowedTags: ['a', 'br', 'span', 'strong', 'em'],
  allowedAttributes: {
    a: ['href', 'target', 'rel', 'class'],
    br: [],
    span: ['class'],
    strong: ['class'],
    em: ['class']
  }
} satisfies IOptions

/** CMS 投稿本文（HTML）向け。一覧・フッター用より広いタグを許可 */
export const HTML_SANITIZE_POST_BODY_OPTIONS = {
  allowedTags: [...POST_BODY_TAGS],
  allowedAttributes: buildPostBodyAllowedAttributes()
} satisfies IOptions

/** @deprecated 互換名。新規は HTML_SANITIZE_FOOTER_OPTIONS を参照 */
export const DOMPURIFY_DEFAULT_OPTIONS = HTML_SANITIZE_FOOTER_OPTIONS

/** @deprecated 互換名。新規は HTML_SANITIZE_POST_BODY_OPTIONS を参照 */
export const DOMPURIFY_POST_BODY_OPTIONS = HTML_SANITIZE_POST_BODY_OPTIONS

export function sanitizeHtml(html: string, options: IOptions = HTML_SANITIZE_FOOTER_OPTIONS) {
  return sanitizeHtmlLib(html, options)
}

export function sanitizePostBodyHtml(html: string) {
  return sanitizeHtmlLib(html, HTML_SANITIZE_POST_BODY_OPTIONS)
}
