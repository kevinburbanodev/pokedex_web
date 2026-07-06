<script setup lang="ts">
import type { PokemonTypeSlot } from '../../domain/pokemon.entity'

withDefaults(defineProps<{ type: PokemonTypeSlot; variant?: 'solid' | 'outline' }>(), {
  variant: 'solid',
})
</script>

<template>
  <span
    v-if="variant === 'solid'"
    class="rounded-[11px] px-2.5 py-1 text-[11px] font-extrabold tracking-[0.3px] text-white"
    :style="{ background: type.color }"
  >
    {{ type.name }}
  </span>
  <span
    v-else
    class="rounded-[13px] border-2 px-3.5 py-1.25 text-[13px] font-extrabold text-white"
    style="background: rgba(255, 255, 255, 0.22); border-color: rgba(255, 255, 255, 0.55)"
  >
    {{ type.name }}
  </span>
</template>
