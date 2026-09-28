import { useState, useSyncExternalStore } from 'react'
import { Button } from '@/shared/ui/Button'
import { Pill } from '@/shared/ui/Pill'
import { Text } from '@/shared/ui/Text'
import type { MessagingService } from '../../application/MessagingService'
import { ChatList } from '../ChatList'
import { ChatWindow } from '../ChatWindow'
import { useIncomingMessages } from '../hooks/useIncomingMessages'
import { NewChatForm } from '../NewChatForm'
import styles from './MessengerPage.module.scss'

interface MessengerPageProps {
  service: MessagingService
  onSignOut: () => void
}

export function MessengerPage({ service, onSignOut }: MessengerPageProps) {
  const chats = useSyncExternalStore(service.subscribe, service.listChats)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const activeChat = chats.find(({ id }) => id === activeChatId)

  useIncomingMessages(service, onSignOut)

  const startChat = async (phone: string) => {
    setActiveChatId(await service.startChat(phone))
  }

  return (
    <div className={styles.layout} data-chat-open={Boolean(activeChat)}>
      <aside className={styles.sidebar}>
        <header className={styles.header}>
          <Text as="h1" variant="heading">
            Чаты
          </Text>
          <Button variant="ghost" onClick={onSignOut}>
            Выйти
          </Button>
        </header>
        <NewChatForm onCreate={startChat} />
        <ChatList chats={chats} activeChatId={activeChatId} onSelect={setActiveChatId} />
      </aside>

      {activeChat ? (
        <ChatWindow
          key={activeChat.id}
          chat={activeChat}
          service={service}
          onBack={() => setActiveChatId(null)}
        />
      ) : (
        <div className={styles.placeholder}>
          <Pill>Выберите чат или начните новый по номеру телефона</Pill>
        </div>
      )}
    </div>
  )
}
