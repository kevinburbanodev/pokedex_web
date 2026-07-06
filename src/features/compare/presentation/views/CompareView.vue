<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCompareStore } from '../compare.store'
import { gradientForTypes } from '@/features/pokemon/domain/gradient'
import { colorForType } from '@/features/pokemon/domain/type-colors'
import { dexNumber, toTitleCase } from '@/shared/lib/format'
import { statTotal } from '../../domain/compare-row'
import Spinner from '@/shared/ui/Spinner.vue'

const ACCENT = '#DC3B4B'

const router = useRouter()
const compare = useCompareStore()

onMounted(() => {
  void compare.init()
})

const options = computed(() =>
  compare.names
    .slice()
    .sort((a, b) => a.id - b.id)
    .map((entry) => ({ id: entry.id, label: `${dexNumber(entry.id)}  ${toTitleCase(entry.name)}` })),
)

function onSelectA(event: Event) {
  void compare.selectA(Number((event.target as HTMLSelectElement).value))
}
function onSelectB(event: Event) {
  void compare.selectB(Number((event.target as HTMLSelectElement).value))
}
</script>

<template>
  <div class="animate-pop">
    <button
      type="button"
      class="mb-2 cursor-pointer rounded-[13px] border-2 border-line bg-white px-4.5 py-2.5 font-display text-[15px] font-semibold text-ink hover:border-[color:var(--color-accent)]"
      @click="router.push('/')"
    >
      ← Volver
    </button>
    <h1 class="my-1 text-center font-display text-[42px] font-bold">Comparador ⚔</h1>

    <div v-if="compare.status === 'loading' && !compare.pokemonA" class="flex justify-center py-20">
      <Spinner :size="32" />
    </div>

    <template v-else-if="compare.pokemonA && compare.pokemonB">
      <div class="grid grid-cols-1 items-stretch gap-4.5 sm:grid-cols-2">
        <div
          class="rounded-[24px] p-5.5 shadow-[0_10px_26px_rgba(80,50,20,0.14)]"
          :style="{ background: gradientForTypes(compare.pokemonA.types) }"
        >
          <select
            :value="compare.idA"
            class="mb-4 w-full cursor-pointer rounded-xl border-none bg-white/92 px-3 py-2.5 text-[15px] font-extrabold text-ink"
            @change="onSelectA"
          >
            <option v-for="opt in options" :key="opt.id" :value="opt.id">{{ opt.label }}</option>
          </select>
          <div class="flex flex-col items-center text-white">
            <div
              class="animate-breathe h-30 w-30 rounded-full shadow-[inset_-10px_-12px_20px_rgba(0,0,0,0.22)]"
              :style="{
                background: `radial-gradient(circle at 34% 30%, rgba(255,255,255,.92), transparent 46%), ${colorForType(compare.pokemonA.types[0]?.slug ?? 'normal')}`,
              }"
            ></div>
            <div class="mt-3 font-display text-[26px] font-bold" style="text-shadow: 0 2px 0 rgba(0, 0, 0, 0.12)">
              {{ compare.pokemonA.name }}
            </div>
            <div class="font-extrabold opacity-90">Total {{ statTotal(compare.pokemonA) }}</div>
          </div>
        </div>
        <div
          class="rounded-[24px] p-5.5 shadow-[0_10px_26px_rgba(80,50,20,0.14)]"
          :style="{ background: gradientForTypes(compare.pokemonB.types) }"
        >
          <select
            :value="compare.idB"
            class="mb-4 w-full cursor-pointer rounded-xl border-none bg-white/92 px-3 py-2.5 text-[15px] font-extrabold text-ink"
            @change="onSelectB"
          >
            <option v-for="opt in options" :key="opt.id" :value="opt.id">{{ opt.label }}</option>
          </select>
          <div class="flex flex-col items-center text-white">
            <div
              class="animate-breathe h-30 w-30 rounded-full shadow-[inset_-10px_-12px_20px_rgba(0,0,0,0.22)]"
              style="animation-delay: 0.4s"
              :style="{
                background: `radial-gradient(circle at 34% 30%, rgba(255,255,255,.92), transparent 46%), ${colorForType(compare.pokemonB.types[0]?.slug ?? 'normal')}`,
              }"
            ></div>
            <div class="mt-3 font-display text-[26px] font-bold" style="text-shadow: 0 2px 0 rgba(0, 0, 0, 0.12)">
              {{ compare.pokemonB.name }}
            </div>
            <div class="font-extrabold opacity-90">Total {{ statTotal(compare.pokemonB) }}</div>
          </div>
        </div>
      </div>

      <div class="mt-5 rounded-[24px] bg-white px-6 py-6.5 shadow-[0_8px_22px_rgba(80,50,20,0.09)]">
        <div v-for="row in compare.rows" :key="row.label" class="mb-3.5 grid grid-cols-[1fr_96px_1fr] items-center gap-3">
          <div class="flex justify-end">
            <div
              class="h-3.75 rounded-lg transition-[width] duration-600"
              :style="{
                width: `${row.aPercent}%`,
                background: colorForType(compare.pokemonA.types[0]?.slug ?? 'normal'),
                opacity: row.aLeads ? 1 : 0.4,
              }"
            ></div>
          </div>
          <div class="text-center">
            <div class="text-[11px] font-extrabold tracking-wide text-sand">{{ row.label }}</div>
            <div class="font-display text-[15px] font-semibold">
              <span :style="{ color: row.aWinsStrictly ? ACCENT : '#2A2024' }">{{ row.aValue }}</span>
              <span class="text-[#D9CDBB]"> · </span>
              <span :style="{ color: row.bWinsStrictly ? ACCENT : '#2A2024' }">{{ row.bValue }}</span>
            </div>
          </div>
          <div class="flex justify-start">
            <div
              class="h-3.75 rounded-lg transition-[width] duration-600"
              :style="{
                width: `${row.bPercent}%`,
                background: colorForType(compare.pokemonB.types[0]?.slug ?? 'normal'),
                opacity: row.bLeads ? 1 : 0.4,
              }"
            ></div>
          </div>
        </div>
        <div class="mt-5 text-center font-display text-lg font-semibold" :style="{ color: ACCENT }">
          {{ compare.verdict }}
        </div>
      </div>
    </template>
  </div>
</template>
