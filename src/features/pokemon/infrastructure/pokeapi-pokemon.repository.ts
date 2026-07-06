import { pokeApiHttp } from '@/shared/lib/http'
import { toTitleCase } from '@/shared/lib/format'
import { colorForType, nameForType } from '../domain/type-colors'
import type { PokemonRepository } from '../domain/pokemon.repository'
import type { NameEntry, Pokemon, PokemonTypeSlot } from '../domain/pokemon.entity'
import type { SpeciesInfo } from '../domain/species.entity'
import type { EvolutionChain, EvolutionNode, EvolutionStage } from '../domain/evolution.entity'
import type { MoveInfo } from '../domain/move.entity'
import type {
  NamedApiResource,
  PokeApiChainLinkRaw,
  PokeApiEvolutionChainRaw,
  PokeApiGenerationRaw,
  PokeApiListResponse,
  PokeApiMoveRaw,
  PokeApiPokemonRaw,
  PokeApiSpeciesRaw,
  PokeApiTypeRaw,
} from './pokeapi.types'

const GENERATION_LABELS: Record<string, string> = {
  'generation-i': 'Generación I',
  'generation-ii': 'Generación II',
  'generation-iii': 'Generación III',
  'generation-iv': 'Generación IV',
  'generation-v': 'Generación V',
  'generation-vi': 'Generación VI',
  'generation-vii': 'Generación VII',
  'generation-viii': 'Generación VIII',
  'generation-ix': 'Generación IX',
}

function idFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/)
  return match ? parseInt(match[1]!, 10) : 0
}

function typeSlotOf(name: string): PokemonTypeSlot {
  return { slug: name, name: nameForType(name), color: colorForType(name) }
}

function toPokemon(raw: PokeApiPokemonRaw): Pokemon {
  const artwork = raw.sprites.other?.['official-artwork']
  return {
    id: raw.id,
    name: toTitleCase(raw.name),
    types: raw.types.sort((a, b) => a.slot - b.slot).map((t) => typeSlotOf(t.type.name)),
    spriteUrl: raw.sprites.front_default,
    artworkUrl: artwork?.front_default ?? raw.sprites.front_default,
    shinyArtworkUrl: artwork?.front_shiny ?? raw.sprites.front_shiny,
    cryUrl: raw.cries?.latest ?? raw.cries?.legacy ?? null,
    heightM: raw.height / 10,
    weightKg: raw.weight / 10,
    stats: raw.stats.map((s) => ({ slug: s.stat.name, label: s.stat.name, value: s.base_stat })),
    speciesUrl: raw.species.url,
    moveNames: raw.moves.map((m) => m.move.name),
  }
}

function cleanFlavorText(text: string): string {
  return text.replace(/[\n\f\r]+/g, ' ').trim()
}

function toSpecies(raw: PokeApiSpeciesRaw): SpeciesInfo {
  const genus = raw.genera.find((g) => g.language.name === 'es')?.genus ?? ''
  const flavor = raw.flavor_text_entries.find((f) => f.language.name === 'es')?.flavor_text
  return {
    genus,
    flavorText: flavor ? cleanFlavorText(flavor) : '',
    generationLabel: GENERATION_LABELS[raw.generation.name] ?? toTitleCase(raw.generation.name),
    evolutionChainUrl: raw.evolution_chain?.url ?? null,
  }
}

// PokeAPI's evolution items/triggers are a small, closed vocabulary — covering
// the common ones here avoids an extra per-item API request just for a label.
// Anything outside this map falls back to a title-cased English slug.
const ITEM_LABELS: Record<string, string> = {
  'thunder-stone': 'Piedra Trueno',
  'fire-stone': 'Piedra Fuego',
  'water-stone': 'Piedra Agua',
  'leaf-stone': 'Piedra Planta',
  'moon-stone': 'Piedra Lunar',
  'sun-stone': 'Piedra Solar',
  'shiny-stone': 'Piedra Alba',
  'dusk-stone': 'Piedra Noche',
  'dawn-stone': 'Piedra Día',
  'ice-stone': 'Piedra Hielo',
  'oval-stone': 'Piedra Oval',
  everstone: 'Piedra Eterna',
  'kings-rock': 'Roca Real',
  'metal-coat': 'Recub. Metálico',
  'dragon-scale': 'Escama Dragón',
  'upgrade': 'Actualización',
  'protector': 'Protector',
  'razor-claw': 'Garra Filo',
  'razor-fang': 'Colmillo Filo',
  'prism-scale': 'Escama Prisma',
  'whipped-dream': 'Postre Batido',
  'sachet': 'Saquito Aroma',
}
const TRIGGER_LABELS: Record<string, string> = {
  'level-up': 'Subir de nivel',
  trade: 'Intercambio',
  shed: 'Muda',
  spin: 'Giro',
  'take-damage': 'Recibir daño',
  other: 'Especial',
}

function triggerLabel(detail: PokeApiChainLinkRaw['evolution_details'][number]): string {
  if (detail.min_level) return `Nv. ${detail.min_level}`
  if (detail.item) return ITEM_LABELS[detail.item.name] ?? toTitleCase(detail.item.name)
  return TRIGGER_LABELS[detail.trigger.name] ?? toTitleCase(detail.trigger.name)
}

export class PokeApiPokemonRepository implements PokemonRepository {
  private nameCache: NameEntry[] | null = null

  async listAllNames(): Promise<NameEntry[]> {
    if (this.nameCache) return this.nameCache
    const { data } = await pokeApiHttp.get<PokeApiListResponse>('/pokemon', {
      params: { limit: 100000, offset: 0 },
    })
    this.nameCache = data.results.map((entry) => ({ id: idFromUrl(entry.url), name: entry.name }))
    return this.nameCache
  }

  async listIdsByType(typeSlug: string): Promise<number[]> {
    const { data } = await pokeApiHttp.get<PokeApiTypeRaw>(`/type/${typeSlug}`)
    return data.pokemon.map((entry) => idFromUrl(entry.pokemon.url))
  }

  async listIdsByGeneration(generationSlug: string): Promise<number[]> {
    const { data } = await pokeApiHttp.get<PokeApiGenerationRaw>(`/generation/${generationSlug}`)
    return data.pokemon_species.map((entry) => idFromUrl(entry.url))
  }

  async getPokemon(id: number): Promise<Pokemon> {
    const { data } = await pokeApiHttp.get<PokeApiPokemonRaw>(`/pokemon/${id}`)
    return toPokemon(data)
  }

  async getSpecies(speciesUrl: string): Promise<SpeciesInfo> {
    // `speciesUrl` is already a full absolute URL — axios uses it verbatim
    // and ignores `baseURL` when given one.
    const { data } = await pokeApiHttp.get<PokeApiSpeciesRaw>(speciesUrl)
    return toSpecies(data)
  }

  async getEvolutionChain(url: string): Promise<EvolutionChain> {
    // `url` is already a full absolute URL from the species response — axios
    // uses it verbatim and ignores `baseURL` when given one.
    const { data } = await pokeApiHttp.get<PokeApiEvolutionChainRaw>(url)
    const stages: EvolutionStage[] = []

    let currentLevel: { link: PokeApiChainLinkRaw; trigger: string | null }[] = [
      { link: data.chain, trigger: null },
    ]

    while (currentLevel.length > 0) {
      const ids = currentLevel.map(({ link }) => idFromUrl(link.species.url))
      const pokemons = await Promise.all(ids.map((id) => this.getPokemon(id)))
      stages.push({
        nodes: currentLevel.map(({ trigger }, index): EvolutionNode => {
          const pokemon = pokemons[index]!
          return {
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.types,
            spriteUrl: pokemon.spriteUrl,
            trigger,
          }
        }),
      })

      currentLevel = currentLevel.flatMap(({ link }) =>
        link.evolves_to.map((next) => ({
          link: next,
          trigger: next.evolution_details[0] ? triggerLabel(next.evolution_details[0]) : null,
        })),
      )
    }

    return stages
  }

  async getMoveDetails(moveNames: string[]): Promise<MoveInfo[]> {
    const results = await Promise.all(
      moveNames.map(async (name) => {
        const { data } = await pokeApiHttp.get<PokeApiMoveRaw>(`/move/${name}`)
        return moveInfoOf(data)
      }),
    )
    return results
  }
}

// Shared singleton — every store imports this instance rather than
// constructing its own, so the cached name index (~1350 entries, one request)
// and type/generation id lookups are only ever fetched once per session.
export const pokemonRepository = new PokeApiPokemonRepository()

function moveInfoOf(raw: PokeApiMoveRaw): MoveInfo {
  const esName = raw.names.find((n: { name: string; language: NamedApiResource }) => n.language.name === 'es')?.name
  return {
    name: esName ?? toTitleCase(raw.name),
    power: raw.power,
    type: typeSlotOf(raw.type.name),
  }
}
