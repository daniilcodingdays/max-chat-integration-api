import { useState, type KeyboardEvent, type MouseEvent } from 'react'
import { SendIcon } from '@/shared/assets'
import { Button } from '@/shared/ui/Button'
import { Textarea } from '@/shared/ui/Textarea'
import { MAX_MESSAGE_LENGTH } from '../../domain/constants'
import styles from './Composer.module.scss'

interface ComposerProps {
  onSend: (text: string) => void
}

export function Composer({ onSend }: ComposerProps) {
  const [draft, setDraft] = useState('')
  const text = draft.trim()

  const send = () => {
    if (!text) return
    onSend(text)
    setDraft('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) return
    event.preventDefault()
    send()
  }

  // Сохранять клавиатуру открытой на мобилке после отправки сообщения
  const keepFocus = (event: MouseEvent) => event.preventDefault()

  return (
    <form className={styles.composer} action={send}>
      <Textarea
        name="message"
        className={styles.input}
        value={draft}
        maxLength={MAX_MESSAGE_LENGTH}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Сообщение"
        enterKeyHint="send"
        autoComplete="off"
        rows={1}
      />
      <Button
        type="submit"
        shape="circle"
        className={styles.send}
        disabled={!text}
        title="Отправить"
        onMouseDown={keepFocus}
      >
        <SendIcon />
      </Button>
    </form>
  )
}
