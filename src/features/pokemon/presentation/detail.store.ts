import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Pokemon } from '../domain/pokemon.entity'
import type { SpeciesInfo } from '../domain/species.entity'
import type { EvolutionChain } from '../domain/evolution.entity'
import type { MoveInfo } from '../domain/move.entity'
import { pokemonRepository as repository } from '../infrastructure/pokeapi-pokemon.repository'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface DetailBundle {
  pokemon: Pokemon
  species: SpeciesInfo
  evolutionChain: EvolutionChain
  moves: MoveInfo[]
}

const FEATURED_MOVE_COUNT = 4

export const useDetailStore = defineStore('pokemonDetail', () => {
  const status = ref<Status>('idle')
  const currentId = ref<number | null>(null)
  const bundle = ref<DetailBundle | null>(null)
  const shiny = ref(false)
  const cryPlaying = ref(false)

  const cache = new Map<number, DetailBundle>()
  let loadToken = 0
  let audio: HTMLAudioElement | null = null

  async function load(id: number) {
    currentId.value = id
    shiny.value = false
    const cached = cache.get(id)
    if (cached) {
      bundle.value = cached
      status.value = 'success'
      return
    }
    status.value = 'loading'
    bundle.value = null
    const token = ++loadToken
    try {
      const pokemon = await repository.getPokemon(id)
      const species = await repository.getSpecies(pokemon.speciesUrl)
      const evolutionChain = species.evolutionChainUrl
        ? await repository.getEvolutionChain(species.evolutionChainUrl)
        : []
      const featuredMoves = [...new Set(pokemon.moveNames)].slice(0, FEATURED_MOVE_COUNT)
      const moves = await repository.getMoveDetails(featuredMoves)
      if (token !== loadToken) return
      const result: DetailBundle = { pokemon, species, evolutionChain, moves }
      cache.set(id, result)
      bundle.value = result
      status.value = 'success'
    } catch {
      if (token === loadToken) status.value = 'error'
    }
  }

  function toggleShiny() {
    shiny.value = !shiny.value
  }

  function playCry() {
    const url = bundle.value?.pokemon.cryUrl
    if (!url) return
    audio?.pause()
    audio = new Audio(url)
    cryPlaying.value = true
    void audio.play().catch(() => {})
    audio.onended = () => {
      cryPlaying.value = false
    }
    setTimeout(() => {
      cryPlaying.value = false
    }, 700)
  }

  return { status, currentId, bundle, shiny, cryPlaying, load, toggleShiny, playCry }
})
