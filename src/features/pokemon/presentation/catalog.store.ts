import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { NameEntry, Pokemon } from '../domain/pokemon.entity'
import { pokemonRepository as repository } from '../infrastructure/pokeapi-pokemon.repository'

type Status = 'idle' | 'loading' | 'success' | 'error'

const PAGE_SIZE = 24

export const useCatalogStore = defineStore('catalog', () => {
  const status = ref<Status>('idle')
  const allNames = ref<NameEntry[]>([])
  const query = ref('')
  const typeFilter = ref('all')
  const generationFilter = ref('all')
  const visibleCount = ref(PAGE_SIZE)
  const loadedPokemon = ref(new Map<number, Pokemon>())
  const cardsLoading = ref(false)

  const typeIdCache = new Map<string, number[]>()
  const generationIdCache = new Map<string, number[]>()
  const inFlight = new Set<number>()

  async function init() {
    if (status.value !== 'idle') return
    status.value = 'loading'
    try {
      allNames.value = await repository.listAllNames()
      status.value = 'success'
      await ensureVisibleLoaded()
    } catch {
      status.value = 'error'
    }
  }

  async function idsForType(slug: string): Promise<number[]> {
    if (slug === 'all') return []
    const cached = typeIdCache.get(slug)
    if (cached) return cached
    const ids = await repository.listIdsByType(slug)
    typeIdCache.set(slug, ids)
    return ids
  }

  async function idsForGeneration(slug: string): Promise<number[]> {
    if (slug === 'all') return []
    const cached = generationIdCache.get(slug)
    if (cached) return cached
    const ids = await repository.listIdsByGeneration(slug)
    generationIdCache.set(slug, ids)
    return ids
  }

  const typeIdSet = ref<Set<number> | null>(null)
  const generationIdSet = ref<Set<number> | null>(null)

  async function refreshFilterSets() {
    const [typeIds, generationIds] = await Promise.all([
      idsForType(typeFilter.value),
      idsForGeneration(generationFilter.value),
    ])
    typeIdSet.value = typeFilter.value === 'all' ? null : new Set(typeIds)
    generationIdSet.value = generationFilter.value === 'all' ? null : new Set(generationIds)
  }

  const filteredIds = computed(() => {
    const q = query.value.trim().toLowerCase()
    return allNames.value
      .filter((entry) => {
        if (typeIdSet.value && !typeIdSet.value.has(entry.id)) return false
        if (generationIdSet.value && !generationIdSet.value.has(entry.id)) return false
        if (q && !entry.name.includes(q) && !String(entry.id).includes(q)) return false
        return true
      })
      .map((entry) => entry.id)
  })

  const visibleIds = computed(() => filteredIds.value.slice(0, visibleCount.value))
  const cards = computed(() =>
    visibleIds.value.map((id) => loadedPokemon.value.get(id)).filter((p): p is Pokemon => !!p),
  )
  const hasMore = computed(() => visibleCount.value < filteredIds.value.length)
  const isEmpty = computed(() => status.value === 'success' && filteredIds.value.length === 0)

  async function ensureVisibleLoaded() {
    const toFetch = visibleIds.value.filter((id) => !loadedPokemon.value.has(id) && !inFlight.has(id))
    if (toFetch.length === 0) return
    cardsLoading.value = true
    toFetch.forEach((id) => inFlight.add(id))
    try {
      const results = await Promise.all(
        toFetch.map(async (id) => {
          try {
            return await repository.getPokemon(id)
          } catch {
            return null
          }
        }),
      )
      results.forEach((pokemon) => {
        if (pokemon) loadedPokemon.value.set(pokemon.id, pokemon)
      })
    } finally {
      toFetch.forEach((id) => inFlight.delete(id))
      cardsLoading.value = false
    }
  }

  async function setQuery(value: string) {
    query.value = value
    visibleCount.value = PAGE_SIZE
    await ensureVisibleLoaded()
  }

  async function setType(slug: string) {
    typeFilter.value = slug
    visibleCount.value = PAGE_SIZE
    await refreshFilterSets()
    await ensureVisibleLoaded()
  }

  async function setGeneration(slug: string) {
    generationFilter.value = slug
    visibleCount.value = PAGE_SIZE
    await refreshFilterSets()
    await ensureVisibleLoaded()
  }

  async function loadMore() {
    if (!hasMore.value) return
    visibleCount.value += PAGE_SIZE
    await ensureVisibleLoaded()
  }

  return {
    status,
    query,
    typeFilter,
    generationFilter,
    cards,
    cardsLoading,
    hasMore,
    isEmpty,
    total: computed(() => allNames.value.length),
    matchCount: computed(() => filteredIds.value.length),
    init,
    setQuery,
    setType,
    setGeneration,
    loadMore,
  }
})
