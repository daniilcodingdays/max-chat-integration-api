import { Text } from '../Text'

export function FormError({ children }: { children: string | null }) {
  if (!children) return null

  return (
    <Text as="p" variant="caption" tone="danger">
      {children}
    </Text>
  )
}
