/** Title-cases a PokeAPI slug, e.g. "mr-mime" -> "Mr Mime", "ho-oh" -> "Ho Oh". */
export function toTitleCase(value?: string | null): string {
  if (!value) return ''
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/** Formats a national dex number, e.g. 25 -> "#025". */
export function dexNumber(id: number): string {
  return '#' + String(id).padStart(3, '0')
}
