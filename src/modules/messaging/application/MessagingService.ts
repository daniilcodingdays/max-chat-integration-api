import { delay } from '@/shared/lib/delay'
import { addMessage, createChat, mergeHistory, updateOutgoing, type Chat } from '../domain/Chat'
import type { ChatRepository } from '../domain/ChatRepository'
import { AccessRevokedError } from '../domain/errors'
import type { OutgoingMessage } from '../domain/Message'
import type { InboundMessage, Messenger } from '../domain/Messenger'
import { formatPhoneNumber, parsePhoneNumber } from '../domain/PhoneNumber'
import { INITIAL_RETRY_DELAY_MS, MAX_RETRY_DELAY_MS } from './constants'

export class MessagingService {
  readonly #messenger: Messenger
  readonly #chats: ChatRepository
  readonly #synced = new Set<string>()

  constructor(messenger: Messenger, chats: ChatRepository) {
    this.#messenger = messenger
    this.#chats = chats
  }

  subscribe = (listener: () => void) => this.#chats.subscribe(listener)
  listChats = () => this.#chats.list()

  async startChat(phoneInput: string): Promise<string> {
    const phone = parsePhoneNumber(phoneInput)
    const chatId = await this.#messenger.resolveChatId(phone)
    if (!this.#chats.find(chatId)) this.#chats.save(createChat(chatId, formatPhoneNumber(phone)))
    return chatId
  }

  async syncHistory(chatId: string): Promise<void> {
    if (this.#synced.has(chatId)) return

    const history = await this.#messenger.loadHistory(chatId)
    this.#synced.add(chatId)
    this.#update(chatId, (chat) => mergeHistory(chat, history))
  }

  async sendMessage(chatId: string, text: string): Promise<void> {
    const message: OutgoingMessage = {
      id: crypto.randomUUID(),
      direction: 'outgoing',
      text,
      sentAt: Date.now(),
      status: 'pending',
    }
    this.#update(chatId, (chat) => addMessage(chat, message))
    await this.#deliver(chatId, message)
  }

  async resendMessage(chatId: string, messageId: string): Promise<void> {
    const message = this.#chats.find(chatId)?.messages.find(({ id }) => id === messageId)
    if (message?.direction !== 'outgoing' || message.status !== 'failed') return

    this.#update(chatId, (chat) => updateOutgoing(chat, messageId, { status: 'pending' }))
    await this.#deliver(chatId, message)
  }

  async listenIncoming(signal: AbortSignal): Promise<void> {
    let retryDelay = INITIAL_RETRY_DELAY_MS

    while (!signal.aborted) {
      try {
        const delivery = await this.#messenger.receive(signal)
        if (delivery) {
          if (delivery.inbound) this.#receive(delivery.inbound)
          await this.#messenger.acknowledge(delivery.receiptId)
        }
        retryDelay = INITIAL_RETRY_DELAY_MS
      } catch (error) {
        if (error instanceof AccessRevokedError) throw error
        await delay(retryDelay, signal)
        retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY_MS)
      }
    }
  }

  async #deliver(chatId: string, { id, text }: OutgoingMessage): Promise<void> {
    const patch = await this.#messenger.send(chatId, text).then(
      (serverId) => ({ status: 'sent' as const, serverId }),
      () => ({ status: 'failed' as const }),
    )
    this.#update(chatId, (chat) => updateOutgoing(chat, id, patch))
  }

  #receive({ chatId, senderName, message }: InboundMessage): void {
    const chat = this.#chats.find(chatId) ?? createChat(chatId, senderName || chatId)
    const updated = addMessage(chat, message)
    if (updated !== chat) this.#chats.save(updated)
  }

  #update(chatId: string, change: (chat: Chat) => Chat): void {
    const chat = this.#chats.find(chatId)
    if (!chat) throw new Error(`Chat ${chatId} does not exist`)

    const updated = change(chat)
    if (updated !== chat) this.#chats.save(updated)
  }
}
