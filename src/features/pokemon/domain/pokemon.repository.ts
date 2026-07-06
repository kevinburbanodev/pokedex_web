import type { NameEntry, Pokemon } from './pokemon.entity'
import type { SpeciesInfo } from './species.entity'
import type { EvolutionChain } from './evolution.entity'
import type { MoveInfo } from './move.entity'

export interface PokemonRepository {
  /** Every national-dex entry's id + name, fetched once and cached — powers
   * name/number search and the comparator's dropdowns without per-item fetches. */
  listAllNames(): Promise<NameEntry[]>
  /** National-dex ids belonging to a type, straight from `/type/{slug}`. */
  listIdsByType(typeSlug: string): Promise<number[]>
  /** National-dex ids belonging to a generation, straight from `/generation/{slug}`. */
  listIdsByGeneration(generationSlug: string): Promise<number[]>
  getPokemon(id: number): Promise<Pokemon>
  /** Takes the species URL (`pokemon.speciesUrl`), not the Pokémon's own id —
   * alternate forms (mega evolutions, regional forms, …) have a Pokémon id
   * that differs from their species id, e.g. Mega Blaziken is pokemon/10050
   * but pokemon-species/257 (base Blaziken). */
  getSpecies(speciesUrl: string): Promise<SpeciesInfo>
  getEvolutionChain(url: string): Promise<EvolutionChain>
  getMoveDetails(moveNames: string[]): Promise<MoveInfo[]>
}
