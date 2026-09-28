import { useState, useTransition } from 'react'
import { DomainError } from '@/shared/domain/DomainError'

const UNEXPECTED_ERROR_MESSAGE =
  'Не удалось связаться с GREEN-API — проверьте подключение и попробуйте ещё раз'

export function useAsyncAction() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const run = (action: () => Promise<void>) => {
    setError(null)
    startTransition(async () => {
      try {
        await action()
      } catch (reason) {
        setError(reason instanceof DomainError ? reason.message : UNEXPECTED_ERROR_MESSAGE)
      }
    })
  }

  return { run, isPending, error }
}
