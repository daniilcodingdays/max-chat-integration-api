import { clsx } from 'clsx'
import type { TextareaHTMLAttributes } from 'react'
import { Text } from '../Text'
import styles from './Textarea.module.scss'

const COUNTER_THRESHOLD = 0.9

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string
  maxLength: number
}

export function Textarea({ value, maxLength, className, ...props }: TextareaProps) {
  const isCounterVisible = value.length >= maxLength * COUNTER_THRESHOLD

  return (
    <div className={clsx(styles.wrapper, className)}>
      <textarea {...props} value={value} maxLength={maxLength} className={styles.textarea} />
      {isCounterVisible && (
        <Text
          variant="micro"
          tone={value.length === maxLength ? 'danger' : 'secondary'}
          className={styles.counter}
        >
          {value.length} / {maxLength}
        </Text>
      )}
    </div>
  )
}
