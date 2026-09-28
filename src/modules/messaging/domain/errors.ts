import { DomainError } from '@/shared/domain/DomainError'

export class InvalidPhoneNumberError extends DomainError {
  constructor() {
    super('Введите номер России или Беларуси, например +7 999 123-45-67')
  }
}

export class RecipientNotFoundError extends DomainError {
  constructor() {
    super('Этот номер не зарегистрирован в MAX')
  }
}

export class QuotaExceededError extends DomainError {
  constructor() {
    super('Исчерпан лимит тарифа GREEN-API — подробности в личном кабинете')
  }
}

export class RateLimitedError extends DomainError {
  constructor() {
    super('Слишком много запросов — подождите немного и попробуйте снова')
  }
}

export class AccessRevokedError extends DomainError {
  constructor() {
    super('Доступ к инстансу отозван — войдите заново')
  }
}
