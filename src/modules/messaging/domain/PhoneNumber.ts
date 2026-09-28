import { InvalidPhoneNumberError } from './errors'

interface Country {
  code: string
  mask: string
}

/** Номер телефона получателя в международном формате: 11 или 12 цифр:
 * Допускается использовать только номера телефонов для РФ и РБ с кодами "7" и "375" соответственно.
 * */
const COUNTRIES: Country[] = [
  { code: '375', mask: '+375 ## ###-##-##' },
  { code: '7', mask: '+7 ### ###-##-##' },
]

/** E.164 формат: максимальная длина номера **/
const MAX_DIGITS = 15

const isSlot = (char: string) => char === '#' || (char >= '0' && char <= '9')

function toDigits(input: string): string {
  const digits = input.replace(/\D/g, '')
  return digits.startsWith('8') ? `7${digits.slice(1)}` : digits
}

const countryOf = (digits: string) =>
  COUNTRIES.find(({ code }) => digits.startsWith(code) || code.startsWith(digits))

function applyMask(mask: string, digits: string): string {
  let result = ''
  let position = 0

  for (const char of mask) {
    if (position === digits.length) break
    result += isSlot(char) ? digits[position++] : char
  }

  return result
}

export function formatPhoneNumber(input: string): string {
  const digits = toDigits(input)
  if (!digits) return ''

  const country = countryOf(digits)
  return country ? applyMask(country.mask, digits) : `+${digits.slice(0, MAX_DIGITS)}`
}

export function parsePhoneNumber(input: string): string {
  const digits = toDigits(input)
  const country = countryOf(digits)
  const length = country && [...country.mask].filter(isSlot).length

  if (digits.length !== length) throw new InvalidPhoneNumberError()

  return digits
}
