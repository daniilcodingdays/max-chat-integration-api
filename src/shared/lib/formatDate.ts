const LOCALE = 'ru-RU'
const DAY_MS = 86_400_000

const timeFormat = new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit' })
const shortDateFormat = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
})
const dayFormat = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long' })
const fullDayFormat = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export const formatTime = (timestamp: number) => timeFormat.format(timestamp)

export function isSameDay(a: number, b: number): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

export function formatShortDate(timestamp: number, now = Date.now()): string {
  return isSameDay(timestamp, now) ? formatTime(timestamp) : shortDateFormat.format(timestamp)
}

export function formatDay(timestamp: number, now = Date.now()): string {
  if (isSameDay(timestamp, now)) return 'Сегодня'
  if (isSameDay(timestamp, now - DAY_MS)) return 'Вчера'

  const isThisYear = new Date(timestamp).getFullYear() === new Date(now).getFullYear()
  return (isThisYear ? dayFormat : fullDayFormat).format(timestamp)
}
