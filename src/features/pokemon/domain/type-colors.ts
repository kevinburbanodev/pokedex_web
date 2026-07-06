// Colors and Spanish display names for every Pokémon type, ported from the
// Claude Design mockup's own palette (all 18 canonical types are covered).
export const TYPE_COLORS: Record<string, string> = {
  grass: '#5FBF57',
  fire: '#F0803C',
  water: '#4B90D9',
  electric: '#F0C63C',
  psychic: '#F45C8C',
  ice: '#74CEC0',
  dragon: '#6A5CE0',
  dark: '#5A5366',
  fairy: '#EE99D6',
  fighting: '#D4463E',
  poison: '#A552CC',
  ground: '#E0B457',
  rock: '#B49B57',
  bug: '#9DB84B',
  ghost: '#6C5CA8',
  steel: '#8FA9B8',
  flying: '#8FB4E8',
  normal: '#9C9C7E',
}

export const TYPE_NAMES_ES: Record<string, string> = {
  grass: 'Planta',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  psychic: 'Psíquico',
  ice: 'Hielo',
  dragon: 'Dragón',
  dark: 'Siniestro',
  fairy: 'Hada',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  rock: 'Roca',
  bug: 'Bicho',
  ghost: 'Fantasma',
  steel: 'Acero',
  flying: 'Volador',
  normal: 'Normal',
}

const FALLBACK_TYPE_COLOR = '#A9B197'

export function colorForType(slug: string): string {
  return TYPE_COLORS[slug] || FALLBACK_TYPE_COLOR
}

export function nameForType(slug: string): string {
  return TYPE_NAMES_ES[slug] || slug
}

/** All 18 canonical types, for the catalog's type filter chips. Excludes the
 * API's non-playable extras (stellar/unknown/shadow — formes and past-gen
 * curiosities with no real filter value here). */
export const FILTERABLE_TYPES = Object.keys(TYPE_COLORS)
