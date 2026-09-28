import type { IncomingMessage, Message } from './Message'

export interface InboundMessage {
  chatId: string
  senderName: string
  message: IncomingMessage
}

export interface Delivery {
  receiptId: number
  inbound: InboundMessage | null
}

export interface Messenger {
  resolveChatId(phone: string): Promise<string>
  send(chatId: string, text: string): Promise<string>
  loadHistory(chatId: string): Promise<Message[]>
  receive(signal: AbortSignal): Promise<Delivery | null>
  acknowledge(receiptId: number): Promise<void>
}
