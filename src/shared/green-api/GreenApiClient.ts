import { GreenApiError } from './GreenApiError'
import type { InstanceAccess, RequestOptions } from './types'

export class GreenApiClient {
  readonly #instanceUrl: string
  readonly #token: string

  constructor({ idInstance, apiTokenInstance }: InstanceAccess) {
    this.#instanceUrl = `https://${idInstance.slice(0, 4)}.api.green-api.com/waInstance${idInstance}`
    this.#token = apiTokenInstance
  }

  get<T>(method: string, options?: RequestOptions): Promise<T> {
    return this.#request('GET', method, options)
  }

  post<T = unknown>(method: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.#request('POST', method, { ...options, body })
  }

  delete<T = unknown>(method: string, options?: RequestOptions): Promise<T> {
    return this.#request('DELETE', method, options)
  }

  async #request<T>(
    httpMethod: string,
    method: string,
    { body, path, query, signal }: RequestOptions = {},
  ): Promise<T> {
    const url = new URL(`${this.#instanceUrl}/${method}/${this.#token}${path ? `/${path}` : ''}`)
    url.search = new URLSearchParams(query).toString()

    const response = await fetch(url, {
      method: httpMethod,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })

    if (!response.ok) throw new GreenApiError(method, response.status)

    const text = await response.text()
    return (text ? JSON.parse(text) : null) as T
  }
}
