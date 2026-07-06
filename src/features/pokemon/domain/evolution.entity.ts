import type { PokemonTypeSlot } from './pokemon.entity'

export interface EvolutionNode {
  id: number
  name: string
  types: PokemonTypeSlot[]
  spriteUrl: string | null
  /** How this node evolved from its parent (e.g. "Nv. 16", "Piedra Trueno"), null for the base form. */
  trigger: string | null
}

/** One depth level of an evolution tree — usually one member, but can hold
 * several siblings for branching chains like Eevee's eeveelutions. */
export interface EvolutionStage {
  nodes: EvolutionNode[]
}

export type EvolutionChain = EvolutionStage[]
