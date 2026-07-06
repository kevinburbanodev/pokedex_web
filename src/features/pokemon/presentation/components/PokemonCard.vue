<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Pokemon } from '../../domain/pokemon.entity'
import { gradientForTypes } from '../../domain/gradient'
import { colorForType } from '../../domain/type-colors'
import { dexNumber } from '@/shared/lib/format'
import TypeBadge from './TypeBadge.vue'

const props = defineProps<{ pokemon: Pokemon }>()
const router = useRouter()

const hovering = ref(false)
const pointer = ref({ px: 0.5, py: 0.5, rx: 0, ry: 0 })

function onMove(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const px = (event.clientX - rect.left) / rect.width
  const py = (event.clientY - rect.top) / rect.height
  pointer.value = { px, py, rx: (px - 0.5) * 2, ry: (py - 0.5) * 2 }
  hovering.value = true
}
function onLeave() {
  hovering.value = false
}

const gradient = computed(() => gradientForTypes(props.pokemon.types))
const orbColor = computed(() => colorForType(props.pokemon.types[0]?.slug ?? 'normal'))
const transform = computed(() =>
  hovering.value
    ? `perspective(820px) rotateX(${-pointer.value.ry * 9}deg) rotateY(${pointer.value.rx * 11}deg) translateY(-10px) scale(1.05)`
    : 'perspective(820px) translateY(0)',
)
const glossStyle = computed(
  () =>
    `radial-gradient(240px circle at ${pointer.value.px * 100}% ${pointer.value.py * 100}%, rgba(255,255,255,.6), transparent 60%)`,
)

function open() {
  void router.push(`/pokemon/${props.pokemon.id}`)
}
</script>

<template>
  <div
    class="relative cursor-pointer overflow-hidden rounded-[22px] px-4 pt-4 pb-3.5 shadow-[0_10px_24px_rgba(80,50,20,0.15)] transition-shadow duration-150 will-change-transform"
    :style="{ background: gradient, transform, zIndex: hovering ? 5 : 1 }"
    @click="open"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <div
      class="pointer-events-none absolute inset-0 transition-opacity duration-200 mix-blend-soft-light"
      :style="{ background: glossStyle, opacity: hovering ? 1 : 0 }"
    ></div>
    <div class="absolute top-1 right-3.5 font-display text-[36px] font-bold text-white/38">
      {{ dexNumber(pokemon.id) }}
    </div>
    <div class="flex justify-center px-0 pt-4 pb-2.5">
      <div class="relative h-26 w-24">
        <div
          class="animate-shadow-pulse absolute bottom-0.5 left-1/2 h-3 w-16 -translate-x-1/2 rounded-full bg-black/28 blur-[3px]"
        ></div>
        <div
          class="animate-breathe h-24 w-24 rounded-full shadow-[inset_-8px_-10px_16px_rgba(0,0,0,0.22),0_4px_10px_rgba(0,0,0,0.16)]"
          :style="{
            background: `radial-gradient(circle at 34% 30%, rgba(255,255,255,.92), transparent 46%), ${orbColor}`,
          }"
        ></div>
        <img
          v-if="pokemon.spriteUrl"
          :src="pokemon.spriteUrl"
          alt=""
          class="absolute inset-0 h-24 w-24 object-contain"
          loading="lazy"
        />
      </div>
    </div>
    <div class="relative rounded-2xl bg-white/93 px-3.25 py-2.75">
      <div class="mb-2.25 font-display text-[19px] leading-none font-semibold text-ink">
        {{ pokemon.name }}
      </div>
      <div class="flex flex-wrap gap-1.5">
        <TypeBadge v-for="type in pokemon.types" :key="type.slug" :type="type" />
      </div>
    </div>
  </div>
</template>
