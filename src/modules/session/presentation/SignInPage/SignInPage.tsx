import type { SubmitEvent } from 'react'
import { useAsyncAction } from '@/shared/hooks/useAsyncAction'
import { Button } from '@/shared/ui/Button'
import { FormError } from '@/shared/ui/FormError'
import { Input } from '@/shared/ui/Input'
import { Text } from '@/shared/ui/Text'
import styles from './SignInPage.module.scss'

const FIELD = {
  idInstance: 'idInstance',
  apiTokenInstance: 'apiTokenInstance',
} as const

const keepDigits = (value: string) => value.replace(/\D/g, '')

interface SignInPageProps {
  onSignIn: (idInstance: string, apiTokenInstance: string) => Promise<void>
}

export function SignInPage({ onSignIn }: SignInPageProps) {
  const { run, isPending, error } = useAsyncAction()

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const read = (field: string) => String(form.get(field) ?? '').trim()

    run(() => onSignIn(read(FIELD.idInstance), read(FIELD.apiTokenInstance)))
  }

  return (
    <main className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <span className={styles.logo}>M</span>
        <hgroup className={styles.intro}>
          <Text as="h1" variant="heading">
            Вход в MAX
          </Text>
          <Text as="p" tone="secondary">
            Данные инстанса из личного кабинета GREEN‑API
          </Text>
        </hgroup>

        <Input
          label="idInstance"
          name={FIELD.idInstance}
          inputMode="numeric"
          autoComplete="username"
          format={keepDigits}
          required
        />
        <Input
          label="apiTokenInstance"
          name={FIELD.apiTokenInstance}
          type="password"
          autoComplete="current-password"
          required
        />

        <FormError>{error}</FormError>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Проверяем…' : 'Войти'}
        </Button>
      </form>
    </main>
  )
}
