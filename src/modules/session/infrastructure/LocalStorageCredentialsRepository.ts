import type { Credentials } from '../domain/Credentials'
import type { CredentialsRepository } from '../domain/CredentialsRepository'
import { CREDENTIALS_STORAGE_KEY } from './constants'

export class LocalStorageCredentialsRepository implements CredentialsRepository {
  load(): Credentials | null {
    try {
      return JSON.parse(localStorage.getItem(CREDENTIALS_STORAGE_KEY) ?? 'null')
    } catch {
    }

    this.clear()
    return null
  }

  save(credentials: Credentials): void {
    localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(credentials))
  }

  clear(): void {
    localStorage.removeItem(CREDENTIALS_STORAGE_KEY)
  }
}
