import type { Credentials } from './Credentials'

export interface CredentialsRepository {
  load(): Credentials | null
  save(credentials: Credentials): void
  clear(): void
}
