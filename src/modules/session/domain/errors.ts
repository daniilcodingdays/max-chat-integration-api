import { DomainError } from '@/shared/domain/DomainError'

export class WrongCredentialsError extends DomainError {
  constructor() {
    super('Неверный idInstance или apiTokenInstance')
  }
}

export class InstanceNotAuthorizedError extends DomainError {
  constructor() {
    super('Инстанс не авторизован в MAX — завершите авторизацию в личном кабинете GREEN-API')
  }
}

export class InstanceStartingError extends DomainError {
  constructor() {
    super('Инстанс запускается — попробуйте через минуту')
  }
}

export class InstanceBlockedError extends DomainError {
  constructor() {
    super('Аккаунт MAX заблокирован')
  }
}
