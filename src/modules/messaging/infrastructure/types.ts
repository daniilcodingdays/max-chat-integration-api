export interface CheckAccountResponse {
  exist: boolean
  chatId?: string
}

export interface SendMessageResponse {
  idMessage: string
}

export interface Notification {
  receiptId: number
  body: NotificationBody
}

export interface NotificationBody {
  typeWebhook: string
}

export interface MessageData {
  typeMessage: string
  textMessageData?: { textMessage: string }
  extendedTextMessageData?: { text: string }
}

export interface IncomingMessageReceived extends NotificationBody {
  typeWebhook: 'incomingMessageReceived'
  idMessage: string
  timestamp: number
  senderData: { chatId: string; senderName?: string }
  messageData: MessageData
}

export interface HistoryItem {
  type: 'incoming' | 'outgoing'
  idMessage: string
  timestamp: number
  typeMessage: string
  textMessage?: string
  extendedTextMessage?: { text: string }
  statusMessage?: string
  isDeleted?: boolean
}
