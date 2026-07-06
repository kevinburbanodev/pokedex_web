export interface NamedApiResource {
  name: string
  url: string
}

export interface PokeApiListResponse {
  count: number
  results: NamedApiResource[]
}

export interface PokeApiPokemonRaw {
  id: number
  name: string
  height: number
  weight: number
  types: { slot: number; type: NamedApiResource }[]
  stats: { base_stat: number; stat: NamedApiResource }[]
  sprites: {
    front_default: string | null
    front_shiny: string | null
    other?: {
      'official-artwork'?: { front_default: string | null; front_shiny: string | null }
    }
  }
  cries?: { latest?: string | null; legacy?: string | null }
  species: NamedApiResource
  moves: { move: NamedApiResource; version_group_details: { level_learned_at: number; move_learn_method: NamedApiResource }[] }[]
}

export interface PokeApiSpeciesRaw {
  genera: { genus: string; language: NamedApiResource }[]
  flavor_text_entries: { flavor_text: string; language: NamedApiResource }[]
  generation: NamedApiResource
  evolution_chain: { url: string } | null
}

export interface PokeApiEvolutionDetailRaw {
  min_level: number | null
  trigger: NamedApiResource
  item: NamedApiResource | null
}

export interface PokeApiChainLinkRaw {
  species: NamedApiResource
  evolution_details: PokeApiEvolutionDetailRaw[]
  evolves_to: PokeApiChainLinkRaw[]
}

export interface PokeApiEvolutionChainRaw {
  chain: PokeApiChainLinkRaw
}

export interface PokeApiTypeRaw {
  pokemon: { pokemon: NamedApiResource; slot: number }[]
}

export interface PokeApiGenerationRaw {
  pokemon_species: NamedApiResource[]
}

export interface PokeApiMoveRaw {
  name: string
  power: number | null
  type: NamedApiResource
  names: { name: string; language: NamedApiResource }[]
}
