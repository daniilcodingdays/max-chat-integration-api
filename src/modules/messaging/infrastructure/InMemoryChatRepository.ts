import type { Chat } from '../domain/Chat'
import type { ChatRepository } from '../domain/ChatRepository'

export class InMemoryChatRepository implements ChatRepository {
  readonly #chats = new Map<string, Chat>()
  readonly #listeners = new Set<() => void>()
  #sorted: Chat[] | null = null

  constructor(initial: Chat[] = []) {
    for (const chat of initial) this.#chats.set(chat.id, chat)
  }

  find(id: string): Chat | undefined {
    return this.#chats.get(id)
  }

  save(chat: Chat): void {
    this.#chats.set(chat.id, chat)
    this.#sorted = null
    this.#listeners.forEach((listener) => listener())
  }

  list(): Chat[] {
    this.#sorted ??= [...this.#chats.values()].sort((a, b) => b.activeAt - a.activeAt)
    return this.#sorted
  }

  subscribe(listener: () => void): () => void {
    this.#listeners.add(listener)
    return () => {
      this.#listeners.delete(listener)
    }
  }
}
