import type { Credentials } from './Credentials'

export interface InstanceGateway {
  assertAuthorized(credentials: Credentials): Promise<void>
}
