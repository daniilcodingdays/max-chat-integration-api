import { memo } from 'react'
import { formatTime } from '@/shared/lib/formatDate'
import { Text } from '@/shared/ui/Text'
import type { Message } from '../../domain/Message'
import { DELIVERY_STATUS_VIEW } from './constants'
import styles from './MessageBubble.module.scss'

interface MessageBubbleProps {
  message: Message
  isFresh: boolean
  onRetry: (messageId: string) => void
}

export const MessageBubble = memo(function ({
  message,
  isFresh,
  onRetry,
}: MessageBubbleProps) {
  const status = message.direction === 'outgoing' ? message.status : undefined
  const isFailed = status === 'failed'

  return (
    <li
      className={styles.bubble}
      data-direction={message.direction}
      data-status={status}
      data-fresh={isFresh}
    >
      <Text as="p" className={styles.text}>
        {message.text}
      </Text>
      <Text variant="micro" tone={isFailed ? 'danger' : 'secondary'} className={styles.meta}>
        <time>{formatTime(message.sentAt)}</time>
        {status && (
          <span title={DELIVERY_STATUS_VIEW[status].label}>
            {DELIVERY_STATUS_VIEW[status].mark}
          </span>
        )}
      </Text>
      {isFailed && (
        <Text
          as="button"
          variant="micro"
          tone="danger"
          className={styles.retry}
          onClick={() => onRetry(message.id)}
        >
          Не отправлено. Повторить
        </Text>
      )}
    </li>
  )
})
