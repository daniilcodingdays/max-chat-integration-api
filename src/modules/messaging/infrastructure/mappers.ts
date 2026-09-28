import type { Message } from '../domain/Message'
import type { InboundMessage } from '../domain/Messenger'
import type { HistoryItem, IncomingMessageReceived, MessageData, NotificationBody } from './types'

const TEXT_TYPES = new Set(['textMessage', 'extendedTextMessage', 'quotedMessage'])

export function toInboundMessage(body: NotificationBody): InboundMessage | null {
  if (!isIncomingMessage(body)) return null

  const text = extractText(body.messageData)
  if (text === undefined) return null

  return {
    chatId: body.senderData.chatId,
    senderName: body.senderData.senderName ?? '',
    message: {
      id: body.idMessage,
      direction: 'incoming',
      text,
      sentAt: body.timestamp * 1000,
    },
  }
}

export function toHistoryMessage(item: HistoryItem): Message | null {
  if (item.isDeleted || !TEXT_TYPES.has(item.typeMessage)) return null

  const text = item.textMessage ?? item.extendedTextMessage?.text
  if (text === undefined) return null

  const base = { id: item.idMessage, text, sentAt: item.timestamp * 1000 }

  return item.type === 'incoming'
    ? { ...base, direction: 'incoming' }
    : {
        ...base,
        direction: 'outgoing',
        status: item.statusMessage === 'failed' ? 'failed' : 'sent',
      }
}

function isIncomingMessage(body: NotificationBody): body is IncomingMessageReceived {
  return body.typeWebhook === 'incomingMessageReceived'
}

function extractText({ typeMessage, textMessageData, extendedTextMessageData }: MessageData) {
  if (!TEXT_TYPES.has(typeMessage)) return undefined

  return typeMessage === 'textMessage'
    ? textMessageData?.textMessage
    : extendedTextMessageData?.text
}
