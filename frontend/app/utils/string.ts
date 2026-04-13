// utils/truncateText.ts
export type TruncateOptions = {
  /** 末尾につける文字（デフォ: …） */
  suffix?: string
  /** 末尾の空白を trim する（デフォ: true） */
  trimEnd?: boolean
}

export function truncateText(
  input: string | null | undefined,
  max: number,
  opts: TruncateOptions = {}
): string {
  const s = input ?? ''
  const suffix = opts.suffix ?? '…'
  const trimEnd = opts.trimEnd ?? true

  // max が不正/小さすぎるケースは安全に返す
  if (!Number.isFinite(max) || max <= 0) return ''
  if (s.length <= max) return s

  // suffix だけで max を超えるなら suffix 自体を切る
  if (suffix.length >= max) return suffix.slice(0, max)

  const cutLen = max - suffix.length
  const sliced = s.slice(0, cutLen)
  const base = trimEnd ? sliced.trimEnd() : sliced

  return base + suffix
}

export function checkSlug(input: string): boolean {
  const regexp = /^[0-9a-zA-Z\-_]+$/
  return regexp.test(input)
}
