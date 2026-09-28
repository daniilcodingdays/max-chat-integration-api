import type { ReactNode } from 'react'
import { Text } from '../Text'
import styles from './Pill.module.scss'

export function Pill({ children }: { children: ReactNode }) {
  return (
    <Text variant="caption" tone="secondary" className={styles.pill}>
      {children}
    </Text>
  )
}
