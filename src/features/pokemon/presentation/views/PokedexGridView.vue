<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCatalogStore } from '../catalog.store'
import { FILTERABLE_TYPES, colorForType, nameForType } from '../../domain/type-colors'
import { GENERATIONS } from '../../domain/generations'
import { useInfiniteScroll } from '@/shared/lib/infinite-scroll'
import PokemonCard from '../components/PokemonCard.vue'
import Spinner from '@/shared/ui/Spinner.vue'

const ACCENT = '#DC3B4B'

const catalog = useCatalogStore()

onMounted(() => {
  void catalog.init()
})

useInfiniteScroll(() => {
  if (catalog.hasMore && !catalog.cardsLoading) void catalog.loadMore()
})

const typeChips = computed(() => [
  { slug: 'all', label: 'Todos' },
  ...FILTERABLE_TYPES.map((slug) => ({ slug, label: nameForType(slug) })),
])

function chipStyle(active: boolean, color: string) {
  return {
    background: active ? color : '#fff',
    color: active ? '#fff' : '#6B5D4B',
    borderColor: active ? color : '#E7DCCB',
  }
}
</script>

<template>
  <div class="animate-pop">
    <div class="mb-2.5 flex flex-wrap gap-2">
      <button
        v-for="chip in typeChips"
        :key="chip.slug"
        type="button"
        class="cursor-pointer rounded-full border-2 px-3.75 py-1.75 text-[13px] font-extrabold transition-transform duration-100 hover:-translate-y-0.5"
        :style="chipStyle(catalog.typeFilter === chip.slug, chip.slug === 'all' ? ACCENT : colorForType(chip.slug))"
        @click="catalog.setType(chip.slug)"
      >
        {{ chip.label }}
      </button>
    </div>
    <div class="mb-6 flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="cursor-pointer rounded-xl border-2 px-3.5 py-1.5 text-[13px] font-extrabold"
        :style="chipStyle(catalog.generationFilter === 'all', '#2A2024')"
        @click="catalog.setGeneration('all')"
      >
        Todas
      </button>
      <button
        v-for="gen in GENERATIONS"
        :key="gen.slug"
        type="button"
        class="cursor-pointer rounded-xl border-2 px-3.5 py-1.5 text-[13px] font-extrabold"
        :style="chipStyle(catalog.generationFilter === gen.slug, '#2A2024')"
        @click="catalog.setGeneration(gen.slug)"
      >
        {{ gen.label }}
      </button>
      <div class="flex-1"></div>
      <div class="text-[13px] font-extrabold text-sand">{{ catalog.matchCount }} / {{ catalog.total }}</div>
    </div>

    <div class="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-4.5">
      <PokemonCard v-for="pokemon in catalog.cards" :key="pokemon.id" :pokemon="pokemon" />
    </div>

    <div
      v-if="catalog.cardsLoading || catalog.hasMore"
      class="flex items-center justify-center gap-2.5 py-8.5 text-sm font-extrabold text-sand"
    >
      <Spinner />
      Desliza para cargar más…
    </div>
    <div v-if="catalog.isEmpty" class="py-15 text-center font-display text-[22px] text-sand">
      Sin resultados 🔍
    </div>
  </div>
</template>
