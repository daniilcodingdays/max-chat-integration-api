import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { BackIcon } from '@/shared/assets'
import { formatDay, isSameDay } from '@/shared/lib/formatDate'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { Pill } from '@/shared/ui/Pill'
import { Text } from '@/shared/ui/Text'
import type { MessagingService } from '../../application/MessagingService'
import type { Chat } from '../../domain/Chat'
import { Composer } from '../Composer'
import { MessageBubble } from '../MessageBubble'
import styles from './ChatWindow.module.scss'

interface ChatWindowProps {
  chat: Chat
  service: MessagingService
  onBack: () => void
}

export function ChatWindow({ chat, service, onBack }: ChatWindowProps) {
  const { id: chatId, title, messages } = chat
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [openedAt] = useState(Date.now)
  const [isSyncing, setIsSyncing] = useState(true)

  useEffect(() => {
    service
      .syncHistory(chatId)
      .catch(() => {})
      .finally(() => setIsSyncing(false))
  }, [service, chatId])

  const send = (text: string) => {
    void service.sendMessage(chatId, text)
    scrollerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const retry = useCallback(
    (messageId: string) => void service.resendMessage(chatId, messageId),
    [service, chatId],
  )

  return (
    <section className={styles.window}>
      <header className={styles.header}>
        <Button
          variant="ghost"
          shape="circle"
          className={styles.back}
          onClick={onBack}
          title="Назад"
        >
          <BackIcon />
        </Button>
        <Avatar name={title} seed={chatId} />
        <Text as="h2" variant="title" truncate>
          {title}
        </Text>
      </header>

      {messages.length ? (
        <div ref={scrollerRef} className={styles.scroller}>
          <ol className={styles.messages}>
            {messages.map((message, index) => {
              const { sentAt, id } = message
              const previous = messages[index - 1]
              const startsDay = !previous || !isSameDay(previous.sentAt, sentAt)

              return (
                <Fragment key={id}>
                  {startsDay && (
                    <li className={styles.day}>
                      <Pill>{formatDay(sentAt)}</Pill>
                    </li>
                  )}
                  <MessageBubble
                    message={message}
                    isFresh={sentAt > openedAt}
                    onRetry={retry}
                  />
                </Fragment>
              )
            })}
          </ol>
        </div>
      ) : (
        <div className={styles.empty}>
          <Pill>{isSyncing ? 'Загружаем историю…' : 'Сообщений пока нет'}</Pill>
        </div>
      )}

      <Composer onSend={send} />
    </section>
  )
}
