import { colorForType } from './type-colors'
import type { PokemonTypeSlot } from './pokemon.entity'

/** Builds the diagonal card/hero gradient from a Pokémon's primary type,
 * matching the mockup's own `color-mix()`-based gradient. */
export function gradientForTypes(types: PokemonTypeSlot[]): string {
  const primary = types[0] ? colorForType(types[0].slug) : colorForType('normal')
  return `linear-gradient(150deg, color-mix(in srgb, ${primary} 70%, #ffffff), color-mix(in srgb, ${primary} 96%, #000000))`
}
