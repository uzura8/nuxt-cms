// utils/styles.ts

type ClassValue = string | false | null | undefined
const cx = (...values: ClassValue[]) => values.filter(Boolean).join(' ')

/**
 * Link
 */
export type LinkClassOptions = {
  underline?: boolean
  disabled?: boolean
}

export function linkClass(opts: LinkClassOptions = {}) {
  return cx(
    'font-medium text-fg-brand',
    opts.underline !== false && 'hover:underline',
    opts.disabled && 'pointer-events-none opacity-50',
    !opts.disabled && 'cursor-pointer'
  )
}
