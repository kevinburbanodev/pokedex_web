export interface PokemonTypeSlot {
  slug: string
  name: string
  color: string
}

export interface StatEntry {
  slug: string
  label: string
  value: number
}

export interface Pokemon {
  id: number
  name: string
  types: PokemonTypeSlot[]
  spriteUrl: string | null
  artworkUrl: string | null
  shinyArtworkUrl: string | null
  cryUrl: string | null
  heightM: number
  weightKg: number
  stats: StatEntry[]
  speciesUrl: string
  moveNames: string[]
}

export interface NameEntry {
  id: number
  name: string
}
