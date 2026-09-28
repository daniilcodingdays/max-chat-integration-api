import { clsx } from 'clsx'
import type { ElementType, HTMLAttributes } from 'react'
import styles from './Text.module.scss'

type TextVariant = 'heading' | 'title' | 'body' | 'caption' | 'micro'
type TextTone = 'primary' | 'secondary' | 'danger' | 'inherit'

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  variant?: TextVariant
  tone?: TextTone
  truncate?: boolean
}

export function Text({
  as: Component = 'span',
  variant = 'body',
  tone = 'inherit',
  truncate = false,
  className,
  ...props
}: TextProps) {
  return (
    <Component
      {...props}
      className={clsx(styles[variant], styles[tone], truncate && styles.truncate, className)}
    />
  )
}
