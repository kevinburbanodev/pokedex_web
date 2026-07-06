<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCatalogStore } from '@/features/pokemon/presentation/catalog.store'

const ACCENT = '#DC3B4B'

const router = useRouter()
const catalog = useCatalogStore()

function onQueryInput(event: Event) {
  void catalog.setQuery((event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-4 py-7 pb-5">
    <button
      type="button"
      class="flex cursor-pointer items-center gap-3.25 border-none bg-none p-0"
      @click="router.push('/')"
    >
      <div
        class="flex h-11.5 w-11.5 items-center justify-center rounded-2xl border-[3px] border-ink shadow-[0_6px_16px_rgba(220,59,69,0.35)]"
        :style="{ background: ACCENT }"
      >
        <div class="h-4 w-4 rounded-full bg-white shadow-[inset_0_0_0_3px_#2A2024]"></div>
      </div>
      <div class="text-left">
        <div class="font-display text-[29px] leading-none font-bold tracking-[-0.5px] text-ink">Pokédex</div>
        <div class="text-[11px] font-extrabold tracking-[2.5px] uppercase" :style="{ color: ACCENT }">
          índice viviente
        </div>
      </div>
    </button>
    <div class="flex-1"></div>
    <div class="flex flex-wrap items-center gap-2.5">
      <div class="relative">
        <input
          :value="catalog.query"
          placeholder="Buscar por nombre o nº…"
          class="w-62.5 max-w-[60vw] rounded-2xl border-2 border-line bg-white py-3 pr-4 pl-10 text-[15px] font-extrabold text-ink outline-none focus:border-[color:var(--color-accent)]"
          @input="onQueryInput"
        />
        <span class="absolute top-1/2 left-3.5 -translate-y-1/2 text-[17px] text-sand">⌕</span>
      </div>
      <button
        type="button"
        class="flex cursor-pointer items-center gap-1.75 rounded-2xl border-none bg-ink px-4.5 py-3 font-display text-[15px] font-semibold text-white hover:bg-[#3a2c30]"
        @click="router.push('/compare')"
      >
        ⚔ Comparar
      </button>
    </div>
  </div>
</template>
