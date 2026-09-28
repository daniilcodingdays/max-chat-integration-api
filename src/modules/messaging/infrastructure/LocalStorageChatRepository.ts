import type { Chat } from '../domain/Chat'
import { HISTORY_SIZE } from '../domain/constants'
import type { Message } from '../domain/Message'
import { InMemoryChatRepository } from './InMemoryChatRepository'
import { CHATS_STORAGE_KEY, PERSIST_DELAY_MS } from './constants'

export class LocalStorageChatRepository extends InMemoryChatRepository {
  readonly #key: string
  #pendingWrite: ReturnType<typeof setTimeout> | undefined

  constructor(idInstance: string) {
    const key = `${CHATS_STORAGE_KEY}:${idInstance}`
    super(restore(key))
    this.#key = key
    window.addEventListener('pagehide', this.#flush)
  }

  override save(chat: Chat): void {
    super.save(chat)
    this.#pendingWrite ??= setTimeout(this.#flush, PERSIST_DELAY_MS)
  }

  #flush = () => {
    if (this.#pendingWrite === undefined) return
    clearTimeout(this.#pendingWrite)
    this.#pendingWrite = undefined

    const snapshot = this.list().map((chat) => ({
      ...chat,
      messages: chat.messages.slice(-HISTORY_SIZE),
    }))

    try {
      localStorage.setItem(this.#key, JSON.stringify(snapshot))
    } catch {
    }
  }
}

function restore(key: string): Chat[] {
  try {
    const chats: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    if (!Array.isArray(chats)) return []

    return chats.map((chat: Chat) => ({ ...chat, messages: chat.messages.map(settleDelivery) }))
  } catch {
    return []
  }
}

function settleDelivery(message: Message): Message {
  return message.direction === 'outgoing' && message.status === 'pending'
    ? { ...message, status: 'failed' }
    : message
}
