import type { Chat } from './Chat'

export interface ChatRepository {
  find(id: string): Chat | undefined
  save(chat: Chat): void
  list(): Chat[]
  subscribe(listener: () => void): () => void
}
