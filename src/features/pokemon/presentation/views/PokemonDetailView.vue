<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDetailStore } from '../detail.store'
import { gradientForTypes } from '../../domain/gradient'
import { colorForType } from '../../domain/type-colors'
import { STAT_LABELS, statPercent } from '../../domain/stat-labels'
import { dexNumber } from '@/shared/lib/format'
import TypeBadge from '../components/TypeBadge.vue'
import StatBar from '../components/StatBar.vue'
import EvolutionChainView from '../components/EvolutionChainView.vue'
import MovesList from '../components/MovesList.vue'
import Spinner from '@/shared/ui/Spinner.vue'

const ACCENT = '#DC3B4B'

const route = useRoute()
const router = useRouter()
const detailStore = useDetailStore()

const id = computed(() => Number(route.params.id))

function load() {
  if (Number.isFinite(id.value)) void detailStore.load(id.value)
}
onMounted(load)
watch(id, load)

const pokemon = computed(() => detailStore.bundle?.pokemon ?? null)
const species = computed(() => detailStore.bundle?.species ?? null)

const parallax = ref({ x: 0, y: 0 })
function onHeroMove(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  parallax.value = {
    x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
    y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
  }
}
function onHeroLeave() {
  parallax.value = { x: 0, y: 0 }
}

const gradient = computed(() => (pokemon.value ? gradientForTypes(pokemon.value.types) : ''))
const orbColor = computed(() => colorForType(pokemon.value?.types[0]?.slug ?? 'normal'))
const orbImage = computed(() => {
  if (!pokemon.value) return null
  return detailStore.shiny ? pokemon.value.shinyArtworkUrl : pokemon.value.artworkUrl
})
const statTotal = computed(() => pokemon.value?.stats.reduce((sum, s) => sum + s.value, 0) ?? 0)

function goBack() {
  router.back()
}
</script>

<template>
  <div class="animate-pop">
    <button
      type="button"
      class="mb-4.5 cursor-pointer rounded-[13px] border-2 border-line bg-white px-4.5 py-2.5 font-display text-[15px] font-semibold text-ink hover:border-[color:var(--color-accent)]"
      @click="goBack"
    >
      ← Volver
    </button>

    <div v-if="detailStore.status === 'loading'" class="flex justify-center py-24">
      <Spinner :size="32" />
    </div>

    <div v-else-if="detailStore.status === 'error'" class="py-24 text-center font-display text-xl text-sand">
      No se pudo cargar esta ficha 😕
    </div>

    <div v-else-if="pokemon && species">
      <div
        class="relative mb-5.5 overflow-hidden rounded-[32px] p-7 sm:p-11"
        :style="{ background: gradient, boxShadow: '0 22px 54px rgba(80,50,20,0.24)' }"
        @mousemove="onHeroMove"
        @mouseleave="onHeroLeave"
      >
        <div
          class="absolute -top-32.5 -left-17.5 h-90 w-90 rounded-full bg-white/16 transition-transform duration-200"
          :style="{ transform: `translate(${parallax.x * 24}px, ${parallax.y * 24}px)` }"
        ></div>
        <div
          class="absolute -right-5.5 -bottom-25 h-60 w-60 rounded-full bg-white/12 transition-transform duration-200"
          :style="{ transform: `translate(${parallax.x * -18}px, ${parallax.y * -18}px)` }"
        ></div>
        <div class="absolute top-5.5 right-8.5 font-display text-[78px] font-bold text-white/28">
          {{ dexNumber(pokemon.id) }}
        </div>
        <div class="relative flex flex-wrap items-center gap-11">
          <div class="relative h-59 w-55 flex-none">
            <div
              class="animate-shadow-pulse absolute bottom-1 left-1/2 h-6 w-37.5 -translate-x-1/2 rounded-full bg-black/22 blur-[6px]"
            ></div>
            <div
              class="animate-floaty h-55 w-55 rounded-full shadow-[inset_-16px_-20px_34px_rgba(0,0,0,0.24),0_10px_24px_rgba(0,0,0,0.2)]"
              :style="{
                background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,.92), transparent 46%), ${orbColor}`,
              }"
            ></div>
            <img
              v-if="orbImage"
              :src="orbImage"
              alt=""
              class="absolute inset-0 h-55 w-55 object-contain"
              :class="{ 'hue-rotate-[150deg] saturate-150 brightness-105': detailStore.shiny }"
            />
          </div>
          <div class="min-w-62.5 flex-1 text-white">
            <div class="mb-2.5 flex flex-wrap gap-2">
              <TypeBadge v-for="type in pokemon.types" :key="type.slug" :type="type" variant="outline" />
            </div>
            <h1 class="mb-3 font-display text-[54px] leading-none font-bold" style="text-shadow: 0 3px 0 rgba(0, 0, 0, 0.14)">
              {{ pokemon.name }}
            </h1>
            <p class="mb-5 max-w-115 text-base leading-[1.45] font-semibold opacity-96">
              {{ species.flavorText }}
            </p>
            <div class="flex flex-wrap gap-2.5">
              <button
                type="button"
                class="flex cursor-pointer items-center gap-2 rounded-[13px] border-none bg-white px-5 py-2.75 font-display text-[15px] font-semibold text-ink hover:-translate-y-0.5"
                @click="detailStore.toggleShiny"
              >
                ✦ {{ detailStore.shiny ? 'Normal' : 'Shiny' }}
              </button>
              <button
                type="button"
                class="flex cursor-pointer items-center gap-2 rounded-[13px] border-2 border-white/70 bg-white/16 px-5 py-2.75 font-display text-[15px] font-semibold text-white hover:bg-white/28"
                @click="detailStore.playCry"
              >
                ♪ Escuchar grito
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
        <div class="rounded-[24px] bg-white p-6 shadow-[0_8px_22px_rgba(80,50,20,0.09)]">
          <h3 class="mb-4.5 font-display text-xl font-semibold">Estadísticas base</h3>
          <StatBar
            v-for="stat in pokemon.stats"
            :key="stat.slug"
            :label="STAT_LABELS[stat.slug] ?? stat.label"
            :value="stat.value"
            :percent="statPercent(stat.value)"
            :color="orbColor"
          />
          <div class="mt-4 flex justify-between border-t-2 border-dashed border-cream pt-3.5 font-display text-[17px] font-semibold">
            <span>Total</span>
            <span :style="{ color: ACCENT }">{{ statTotal }}</span>
          </div>
        </div>

        <div class="rounded-[24px] bg-white p-6 shadow-[0_8px_22px_rgba(80,50,20,0.09)]">
          <h3 class="mb-4.5 font-display text-xl font-semibold">Ficha</h3>
          <div class="mb-5 flex gap-3">
            <div class="flex-1 rounded-2xl bg-paper p-3.5 text-center">
              <div class="font-display text-[22px] font-semibold">{{ pokemon.heightM.toFixed(1) }} m</div>
              <div class="text-[11px] font-extrabold tracking-wide text-sand">ALTURA</div>
            </div>
            <div class="flex-1 rounded-2xl bg-paper p-3.5 text-center">
              <div class="font-display text-[22px] font-semibold">{{ pokemon.weightKg }} kg</div>
              <div class="text-[11px] font-extrabold tracking-wide text-sand">PESO</div>
            </div>
            <div class="flex-1 rounded-2xl bg-paper p-3.5 text-center">
              <div class="font-display text-[22px] font-semibold">{{ species.generationLabel.replace('Generación ', '') }}</div>
              <div class="text-[11px] font-extrabold tracking-wide text-sand">GEN</div>
            </div>
          </div>
          <div class="rounded-2xl border-2 border-dashed border-line p-4 text-center">
            <img
              v-if="pokemon.artworkUrl"
              :src="pokemon.artworkUrl"
              alt=""
              class="mx-auto mb-2 block h-30 w-30 object-contain"
            />
            <div class="text-xs font-extrabold text-sand">{{ species.genus }}</div>
          </div>
        </div>
      </div>

      <div class="mt-5 rounded-[24px] bg-white p-6 shadow-[0_8px_22px_rgba(80,50,20,0.09)]">
        <h3 class="mb-5 font-display text-xl font-semibold">Cadena de evolución</h3>
        <EvolutionChainView
          v-if="detailStore.bundle"
          :chain="detailStore.bundle.evolutionChain"
          :current-id="pokemon.id"
          :accent="ACCENT"
        />
      </div>

      <div class="mt-5 rounded-[24px] bg-white p-6 shadow-[0_8px_22px_rgba(80,50,20,0.09)]">
        <h3 class="mb-4 font-display text-xl font-semibold">Movimientos</h3>
        <MovesList v-if="detailStore.bundle" :moves="detailStore.bundle.moves" />
      </div>
    </div>
  </div>
</template>
