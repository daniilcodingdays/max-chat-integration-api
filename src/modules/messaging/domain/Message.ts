export type DeliveryStatus = 'pending' | 'sent' | 'failed'

interface MessageBase {
  id: string
  text: string
  sentAt: number
}

export interface IncomingMessage extends MessageBase {
  direction: 'incoming'
}

export interface OutgoingMessage extends MessageBase {
  direction: 'outgoing'
  status: DeliveryStatus
  serverId?: string
}

export type Message = IncomingMessage | OutgoingMessage
