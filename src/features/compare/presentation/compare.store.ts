import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { NameEntry, Pokemon } from '@/features/pokemon/domain/pokemon.entity'
import { pokemonRepository } from '@/features/pokemon/infrastructure/pokeapi-pokemon.repository'
import { buildCompareRows, buildVerdict } from '../domain/compare-row'

type Status = 'idle' | 'loading' | 'success' | 'error'

const DEFAULT_A = 6
const DEFAULT_B = 9

export const useCompareStore = defineStore('compare', () => {
  const status = ref<Status>('idle')
  const names = ref<NameEntry[]>([])
  const idA = ref(DEFAULT_A)
  const idB = ref(DEFAULT_B)
  const pokemonA = ref<Pokemon | null>(null)
  const pokemonB = ref<Pokemon | null>(null)

  const cache = new Map<number, Pokemon>()

  async function fetchPokemon(id: number): Promise<Pokemon> {
    const cached = cache.get(id)
    if (cached) return cached
    const pokemon = await pokemonRepository.getPokemon(id)
    cache.set(id, pokemon)
    return pokemon
  }

  async function init() {
    status.value = 'loading'
    try {
      names.value = await pokemonRepository.listAllNames()
      await Promise.all([selectA(idA.value), selectB(idB.value)])
      status.value = 'success'
    } catch {
      status.value = 'error'
    }
  }

  async function selectA(id: number) {
    idA.value = id
    pokemonA.value = await fetchPokemon(id)
  }

  async function selectB(id: number) {
    idB.value = id
    pokemonB.value = await fetchPokemon(id)
  }

  const rows = computed(() =>
    pokemonA.value && pokemonB.value ? buildCompareRows(pokemonA.value, pokemonB.value) : [],
  )
  const verdict = computed(() =>
    pokemonA.value && pokemonB.value ? buildVerdict(pokemonA.value, pokemonB.value) : '',
  )

  return { status, names, idA, idB, pokemonA, pokemonB, rows, verdict, init, selectA, selectB }
})
