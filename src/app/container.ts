import { MessagingService } from '@/modules/messaging/application/MessagingService'
import { GreenApiMessenger } from '@/modules/messaging/infrastructure/GreenApiMessenger'
import { LocalStorageChatRepository } from '@/modules/messaging/infrastructure/LocalStorageChatRepository'
import { SessionService } from '@/modules/session/application/SessionService'
import type { Credentials } from '@/modules/session/domain/Credentials'
import { GreenApiInstanceGateway } from '@/modules/session/infrastructure/GreenApiInstanceGateway'
import { LocalStorageCredentialsRepository } from '@/modules/session/infrastructure/LocalStorageCredentialsRepository'
import { GreenApiClient } from '@/shared/green-api/GreenApiClient'

export const sessionService = new SessionService(
  new GreenApiInstanceGateway(),
  new LocalStorageCredentialsRepository(),
)

export function createMessagingService(credentials: Credentials): MessagingService {
  return new MessagingService(
    new GreenApiMessenger(new GreenApiClient(credentials)),
    new LocalStorageChatRepository(credentials.idInstance),
  )
}
