import type { DeliveryStatus } from '../../domain/Message'

export const DELIVERY_STATUS_VIEW: Record<DeliveryStatus, { mark: string; label: string }> = {
  pending: { mark: '…', label: 'Отправляется' },
  sent: { mark: '✓', label: 'Отправлено' },
  failed: { mark: '!', label: 'Не отправлено' },
}
