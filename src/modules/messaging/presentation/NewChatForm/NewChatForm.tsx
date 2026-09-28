import { useState, type SubmitEvent } from 'react'
import { useAsyncAction } from '@/shared/hooks/useAsyncAction'
import { Button } from '@/shared/ui/Button'
import { FormError } from '@/shared/ui/FormError'
import { Input } from '@/shared/ui/Input'
import { formatPhoneNumber } from '../../domain/PhoneNumber'
import styles from './NewChatForm.module.scss'

interface NewChatFormProps {
  onCreate: (phone: string) => Promise<void>
}

export function NewChatForm({ onCreate }: NewChatFormProps) {
  const [phone, setPhone] = useState('')
  const { run, isPending, error } = useAsyncAction()

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    run(async () => {
      await onCreate(phone)
      setPhone('')
    })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <Input
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+7 999 123-45-67"
          value={phone}
          format={formatPhoneNumber}
          onChange={(event) => setPhone(event.target.value)}
          required
        />
        <Button type="submit" disabled={isPending}>
          Создать чат
        </Button>
      </div>
      <FormError>{error}</FormError>
    </form>
  )
}
