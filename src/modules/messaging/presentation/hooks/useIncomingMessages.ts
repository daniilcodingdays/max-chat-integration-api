import { useEffect, useEffectEvent } from 'react'
import type { MessagingService } from '../../application/MessagingService'

export function useIncomingMessages(service: MessagingService, onAccessRevoked: () => void) {
  const handleAccessRevoked = useEffectEvent(onAccessRevoked)

  useEffect(() => {
    const controller = new AbortController()
    service.listenIncoming(controller.signal).catch(handleAccessRevoked)
    return () => controller.abort()
  }, [service])
}
