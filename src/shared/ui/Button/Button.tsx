import { clsx } from 'clsx'
import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  shape?: 'default' | 'circle'
}

export function Button({
  variant = 'primary',
  shape = 'default',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={clsx(styles.button, styles[variant], styles[shape], className)}
    />
  )
}
