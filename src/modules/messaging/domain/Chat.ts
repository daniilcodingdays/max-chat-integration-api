import type { Message, OutgoingMessage } from './Message'

export interface Chat {
  id: string
  title: string
  messages: Message[]
  activeAt: number
}

type OutgoingPatch = Partial<Pick<OutgoingMessage, 'status' | 'serverId'>>

export function createChat(id: string, title: string): Chat {
  return { id, title, messages: [], activeAt: Date.now() }
}

export function addMessage(chat: Chat, message: Message): Chat {
  if (chat.messages.some(({ id }) => id === message.id)) return chat

  return {
    ...chat,
    messages: [...chat.messages, message],
    activeAt: Math.max(chat.activeAt, message.sentAt),
  }
}

export function updateOutgoing(chat: Chat, messageId: string, patch: OutgoingPatch): Chat {
  return {
    ...chat,
    messages: chat.messages.map((message) =>
      message.id === messageId && message.direction === 'outgoing'
        ? { ...message, ...patch }
        : message,
    ),
  }
}

export function mergeHistory(chat: Chat, history: Message[]): Chat {
  const known = new Set(chat.messages.flatMap(messageKeys))
  const missing = history.filter((message) => !messageKeys(message).some((key) => known.has(key)))
  if (!missing.length) return chat

  const messages = [...chat.messages, ...missing].sort((a, b) => a.sentAt - b.sentAt)

  return {
    ...chat,
    messages,
    activeAt: Math.max(chat.activeAt, messages.at(-1)!.sentAt),
  }
}

const messageKeys = (message: Message) =>
  message.direction === 'outgoing' && message.serverId
    ? [message.id, message.serverId]
    : [message.id]
