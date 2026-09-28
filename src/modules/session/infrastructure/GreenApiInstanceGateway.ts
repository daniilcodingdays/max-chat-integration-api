import { GreenApiClient } from '@/shared/green-api/GreenApiClient'
import { GreenApiError } from '@/shared/green-api/GreenApiError'
import { RESOURCE_NAMES_MAP } from '@/shared/green-api/resources.ts'
import type { Credentials } from '../domain/Credentials'
import {
  InstanceBlockedError,
  InstanceNotAuthorizedError,
  InstanceStartingError,
  WrongCredentialsError,
} from '../domain/errors'
import type { InstanceGateway } from '../domain/InstanceGateway'
import type { StateInstanceResponse } from './types'

export class GreenApiInstanceGateway implements InstanceGateway {
  async assertAuthorized(credentials: Credentials): Promise<void> {
    const { stateInstance } = await new GreenApiClient(credentials)
      .get<StateInstanceResponse>(RESOURCE_NAMES_MAP.GET_STATE_INSTANCE)
      .catch((error: unknown) => {
        if (error instanceof GreenApiError && isRejectedByClient(error.status)) {
          throw new WrongCredentialsError()
        }
        throw error
      })

    switch (stateInstance) {
      case 'authorized':
        return
      case 'starting':
        throw new InstanceStartingError()
      case 'blocked':
        throw new InstanceBlockedError()
      default:
        throw new InstanceNotAuthorizedError()
    }
  }
}

const isRejectedByClient = (status: number) => status >= 400 && status < 500 && status !== 429
