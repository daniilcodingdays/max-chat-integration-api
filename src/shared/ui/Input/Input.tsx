import { clsx } from 'clsx'
import type { ChangeEvent, InputHTMLAttributes } from 'react'
import { Text } from '../Text'
import styles from './Input.module.scss'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  format?: (value: string) => string
}

export function Input({ label, format, onChange, className, ...props }: InputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isDeletion = (event.nativeEvent as InputEvent).inputType?.startsWith('delete')

    if (format && !isDeletion) {
      const formatted = format(event.target.value)
      if (formatted !== event.target.value) {
        event.target.value = formatted
      }
    }

    onChange?.(event)
  }

  const input = (
    <input {...props} onChange={handleChange} className={clsx(styles.input, className)} />
  )

  if (!label) return input

  return (
    <label className={styles.field}>
      <Text variant="caption" tone="secondary">
        {label}
      </Text>
      {input}
    </label>
  )
}
