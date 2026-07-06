import type { PokemonTypeSlot } from './pokemon.entity'

export interface MoveInfo {
  name: string
  power: number | null
  type: PokemonTypeSlot
}
