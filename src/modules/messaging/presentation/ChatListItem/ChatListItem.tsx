import { memo } from 'react'
import { formatShortDate } from '@/shared/lib/formatDate'
import { Avatar } from '@/shared/ui/Avatar'
import { Text } from '@/shared/ui/Text'
import type { Chat } from '../../domain/Chat'
import styles from './ChatListItem.module.scss'

interface ChatListItemProps {
  chat: Chat
  isActive: boolean
  onSelect: (id: string) => void
}

export const ChatListItem = memo(function ({
  chat,
  isActive,
  onSelect,
}: ChatListItemProps) {
  const lastMessage = chat.messages.at(-1)

  return (
    <li className={styles.item}>
      <button
        type="button"
        className={styles.button}
        data-active={isActive}
        onClick={() => onSelect(chat.id)}
      >
        <Avatar name={chat.title} seed={chat.id} />
        <span className={styles.summary}>
          <Text variant="title" truncate>
            {chat.title}
          </Text>
          <Text variant="caption" tone="secondary" truncate className={styles.muted}>
            {lastMessage?.text ?? 'Нет сообщений'}
          </Text>
        </span>
        {lastMessage && (
          <Text as="time" variant="micro" tone="secondary" className={styles.time}>
            {formatShortDate(lastMessage.sentAt)}
          </Text>
        )}
      </button>
    </li>
  )
})
