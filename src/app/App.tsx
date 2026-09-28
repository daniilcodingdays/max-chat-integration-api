import { useMemo } from 'react'
import { MessengerPage } from '@/modules/messaging/presentation/MessengerPage'
import { SignInPage } from '@/modules/session/presentation/SignInPage'
import { useSession } from '@/modules/session/presentation/hooks/useSession'
import { createMessagingService, sessionService } from './container'

export function App() {
  const { credentials, signIn, signOut } = useSession(sessionService)
  const messaging = useMemo(() => credentials && createMessagingService(credentials), [credentials])

  return messaging ? (
    <MessengerPage service={messaging} onSignOut={signOut} />
  ) : (
    <SignInPage onSignIn={signIn} />
  )
}
