<script setup lang="ts">
import type { MoveInfo } from '../../domain/move.entity'
import TypeBadge from './TypeBadge.vue'

defineProps<{ moves: MoveInfo[] }>()
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
    <div
      v-for="move in moves"
      :key="move.name"
      class="flex items-center justify-between gap-2.5 rounded-2xl border-2 border-cream px-3.75 py-3.25"
    >
      <div>
        <div class="mb-1.25 font-display text-[15px] font-semibold">{{ move.name }}</div>
        <TypeBadge :type="move.type" />
      </div>
      <div class="text-right">
        <div class="font-display text-xl font-semibold text-ink">{{ move.power ?? '—' }}</div>
        <div class="text-[9px] font-extrabold tracking-wide text-sand">POTENCIA</div>
      </div>
    </div>
  </div>
</template>
