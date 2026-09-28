import styles from './Avatar.module.scss'

const TONES_COUNT = 6

interface AvatarProps {
  name: string
  seed: string
}

export function Avatar({ name, seed }: AvatarProps) {
  const initial = name.trim()[1]?.toUpperCase() ?? '?'

  return (
    <span className={styles.avatar} data-tone={toneOf(seed)}>
      {initial}
    </span>
  )
}

function toneOf(seed: string): number {
  let sum = 0
  for (let i = 0; i < seed.length; i++) {
    sum += seed.charCodeAt(i)
  }
  return sum % TONES_COUNT
}
