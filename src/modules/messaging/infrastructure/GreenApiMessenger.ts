import type { GreenApiClient } from '@/shared/green-api/GreenApiClient'
import { GreenApiError } from '@/shared/green-api/GreenApiError'
import { RESOURCE_NAMES_MAP } from '@/shared/green-api/resources.ts'
import { HISTORY_SIZE } from '../domain/constants'
import {
  AccessRevokedError,
  QuotaExceededError,
  RateLimitedError,
  RecipientNotFoundError,
} from '../domain/errors'
import type { Message } from '../domain/Message'
import type { Delivery, Messenger } from '../domain/Messenger'
import { RECEIVE_TIMEOUT_SECONDS } from './constants'
import { toHistoryMessage, toInboundMessage } from './mappers'
import type { CheckAccountResponse, HistoryItem, Notification, SendMessageResponse } from './types'

export class GreenApiMessenger implements Messenger {
  readonly #api: GreenApiClient

  constructor(api: GreenApiClient) {
    this.#api = api
  }

  async resolveChatId(phone: string): Promise<string> {
    const { exist, chatId } = await this.#api
      .post<CheckAccountResponse>(RESOURCE_NAMES_MAP.CHECK_ACCOUNT, { phoneNumber: Number(phone) })
      .catch(toDomainError)
    if (!exist || !chatId) throw new RecipientNotFoundError()

    return chatId
  }

  async send(chatId: string, text: string): Promise<string> {
    const { idMessage } = await this.#api
      .post<SendMessageResponse>(RESOURCE_NAMES_MAP.SEND_MESSAGE, { chatId, message: text })
      .catch(toDomainError)

    return idMessage
  }

  async loadHistory(chatId: string): Promise<Message[]> {
    const items = await this.#api
      .post<HistoryItem[]>(RESOURCE_NAMES_MAP.GET_CHAT_HISTORY, { chatId, count: HISTORY_SIZE })
      .catch(toDomainError)

    return items.toReversed().flatMap((item) => toHistoryMessage(item) ?? [])
  }

  async receive(signal: AbortSignal): Promise<Delivery | null> {
    const notification = await this.#api
      .get<Notification | null>(RESOURCE_NAMES_MAP.RECEIVE_NOTIFICATION, {
        query: { receiveTimeout: String(RECEIVE_TIMEOUT_SECONDS) },
        signal,
      })
      .catch(toDomainError)

    return (
      notification && {
        receiptId: notification.receiptId,
        inbound: toInboundMessage(notification.body),
      }
    )
  }

  async acknowledge(receiptId: number): Promise<void> {
    await this.#api.delete(RESOURCE_NAMES_MAP.DELETE_NOTIFICATION, { path: String(receiptId) }).catch(toDomainError)
  }
}

function toDomainError(error: unknown): never {
  if (error instanceof GreenApiError) {
    if (error.status === 401 || error.status === 403) throw new AccessRevokedError()
    if (error.status === 429) throw new RateLimitedError()
    if (error.status === 466 || error.status === 469) throw new QuotaExceededError()
  }
  throw error
}
