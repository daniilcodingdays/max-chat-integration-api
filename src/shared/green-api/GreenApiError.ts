export class GreenApiError extends Error {
  readonly status: number

  constructor(method: string, status: number) {
    super(`GREEN-API ${method} responded with ${status}`)
    this.name = 'GreenApiError'
    this.status = status
  }
}
