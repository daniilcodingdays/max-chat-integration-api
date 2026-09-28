import { Text } from '@/shared/ui/Text'
import type { Chat } from '../../domain/Chat'
import { ChatListItem } from '../ChatListItem'
import styles from './ChatList.module.scss'

interface ChatListProps {
  chats: Chat[]
  activeChatId: string | null
  onSelect: (id: string) => void
}

export function ChatList({ chats, activeChatId, onSelect }: ChatListProps) {
  if (!chats.length) {
    return (
      <Text as="p" tone="secondary" className={styles.empty}>
        Здесь появятся ваши чаты
      </Text>
    )
  }

  return (
    <ul className={styles.list}>
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === activeChatId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  )
}
