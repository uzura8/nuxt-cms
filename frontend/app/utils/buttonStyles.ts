type ClassValue = string | false | null | undefined

const cx = (...values: ClassValue[]) => values.filter(Boolean).join(' ')

export type ButtonVariant = 'brand' | 'light' | 'success' | 'danger' | 'warning' | 'dark'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl'

export type ButtonClassOptions = {
  variant?: ButtonVariant
  isOutline?: boolean
  size?: ButtonSize
  isRound?: boolean
  disabled?: boolean
}

const baseClass =
  'inline-flex items-center justify-center box-border font-medium focus:outline-none cursor-pointer rounded-base'

function buttonSizeClass(size: ButtonSize, isOutline: boolean): string {
  const s = size === 'base' ? 'md' : size

  if (isOutline && s === 'sm') return 'leading-5 text-xs px-3 py-2'

  switch (s) {
    case 'xs':
      return 'leading-5 text-xs px-3 py-1.5'
    case 'sm':
      return 'leading-5 text-sm px-3 py-2'
    case 'md':
      return 'leading-5 text-sm px-4 py-2.5'
    case 'lg':
      return 'text-base px-5 py-3'
    case 'xl':
      return 'text-base px-6 py-3.5'
    default:
      return 'leading-5 text-sm px-4 py-2.5'
  }
}

const filledByVariant: Record<ButtonVariant, string> = {
  brand:
    'text-white bg-brand border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs',
  light:
    'text-body bg-neutral-secondary-medium border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs',
  success:
    'text-white bg-success border border-transparent hover:bg-success-strong focus:ring-4 focus:ring-success-medium shadow-xs',
  danger:
    'text-white bg-danger border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs',
  warning:
    'text-white bg-warning border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-warning-medium shadow-xs',
  dark: 'text-white bg-dark border border-transparent hover:bg-dark-strong focus:ring-4 focus:ring-neutral-tertiary shadow-xs'
}

const outlineByVariant: Record<ButtonVariant, string> = {
  brand:
    'text-fg-brand bg-neutral-primary border border-brand hover:bg-brand hover:text-white focus:ring-4 focus:ring-brand-subtle',
  light:
    'text-body bg-neutral-primary border border-default hover:bg-neutral-secondary-soft hover:text-heading focus:ring-4 focus:ring-neutral-tertiary',
  success:
    'text-success bg-neutral-primary border border-success hover:bg-success hover:text-white focus:ring-4 focus:ring-neutral-tertiary',
  danger:
    'text-danger bg-neutral-primary border border-danger hover:bg-danger hover:text-white focus:ring-4 focus:ring-neutral-tertiary',
  warning:
    'text-warning bg-neutral-primary border border-warning hover:bg-warning hover:text-white focus:ring-4 focus:ring-neutral-tertiary',
  dark: 'text-dark bg-neutral-primary border border-dark hover:bg-dark hover:text-white focus:ring-4 focus:ring-neutral-tertiary'
}

const disabledClass =
  'text-fg-disabled bg-disabled border border-default-medium shadow-xs cursor-not-allowed'

/**
 * BaseButton と同じ見た目の Tailwind クラス文字列（NuxtLink 等に付与する用途）
 */
export function buttonClass(opts: ButtonClassOptions = {}) {
  const {
    variant = 'brand',
    isOutline = false,
    size = 'md',
    isRound = false,
    disabled = false
  } = opts

  const variantClass = isOutline ? outlineByVariant[variant] : filledByVariant[variant]
  const roundClass = isRound ? 'rounded-full' : 'rounded-base'

  return cx(
    baseClass,
    buttonSizeClass(size, isOutline),
    variantClass,
    roundClass,
    disabled && disabledClass
  )
}
