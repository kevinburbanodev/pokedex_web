export const STAT_LABELS: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
}

const MAX_STAT_REFERENCE = 160

/** Scales a base stat onto a 4-100% bar width, matching the mockup's own
 * reference ceiling (255 is the true max but 160 keeps typical stats readable). */
export function statPercent(value: number): number {
  return Math.max(4, Math.min(100, Math.round((value / MAX_STAT_REFERENCE) * 100)))
}
