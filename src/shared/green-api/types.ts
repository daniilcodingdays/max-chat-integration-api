export interface InstanceAccess {
  idInstance: string
  apiTokenInstance: string
}

export interface RequestOptions {
  body?: unknown
  path?: string
  query?: Record<string, string>
  signal?: AbortSignal
}
