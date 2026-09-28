import type { Credentials } from '../domain/Credentials'
import type { CredentialsRepository } from '../domain/CredentialsRepository'
import type { InstanceGateway } from '../domain/InstanceGateway'

export class SessionService {
  readonly #gateway: InstanceGateway
  readonly #repository: CredentialsRepository

  constructor(gateway: InstanceGateway, repository: CredentialsRepository) {
    this.#gateway = gateway
    this.#repository = repository
  }

  restore(): Credentials | null {
    return this.#repository.load()
  }

  async signIn(idInstance: string, apiTokenInstance: string): Promise<Credentials> {
    const credentials: Credentials = { idInstance, apiTokenInstance }
    await this.#gateway.assertAuthorized(credentials)
    this.#repository.save(credentials)
    return credentials
  }

  signOut(): void {
    this.#repository.clear()
  }
}
