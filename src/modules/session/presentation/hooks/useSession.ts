import { useState } from 'react'
import type { SessionService } from '../../application/SessionService'

export function useSession(service: SessionService) {
  const [credentials, setCredentials] = useState(() => service.restore())

  const signIn = async (idInstance: string, apiTokenInstance: string) => {
    setCredentials(await service.signIn(idInstance, apiTokenInstance))
  }

  const signOut = () => {
    service.signOut()
    setCredentials(null)
  }

  return { credentials, signIn, signOut }
}
