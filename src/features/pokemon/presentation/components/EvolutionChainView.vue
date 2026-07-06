<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { EvolutionChain } from '../../domain/evolution.entity'
import { colorForType } from '../../domain/type-colors'
import { dexNumber } from '@/shared/lib/format'

defineProps<{ chain: EvolutionChain; currentId: number; accent: string }>()
const router = useRouter()

function open(id: number) {
  void router.push(`/pokemon/${id}`)
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-3.5">
    <template v-for="(stage, stageIndex) in chain" :key="stageIndex">
      <div v-if="stageIndex > 0" class="text-center text-[26px] leading-none text-[#C9B79E]">→</div>
      <div class="flex flex-col gap-3.5">
        <button
          v-for="member in stage.nodes"
          :key="member.id"
          type="button"
          class="cursor-pointer border-none bg-none text-center transition-transform duration-150 hover:-translate-y-1.25"
          @click="open(member.id)"
        >
          <div class="relative mx-auto h-22 w-22">
            <div
              class="h-22 w-22 rounded-full shadow-[inset_-6px_-8px_12px_rgba(0,0,0,0.2)]"
              :style="{
                background: `radial-gradient(circle at 34% 30%, rgba(255,255,255,.9), transparent 46%), ${colorForType(member.types[0]?.slug ?? 'normal')}`,
                border: `3px solid ${member.id === currentId ? accent : '#EFE6D8'}`,
              }"
            ></div>
            <img
              v-if="member.spriteUrl"
              :src="member.spriteUrl"
              alt=""
              class="absolute inset-0 h-22 w-22 object-contain p-1"
              loading="lazy"
            />
          </div>
          <div
            class="mt-2 font-display text-[15px] font-semibold"
            :style="{ color: member.id === currentId ? accent : '#2A2024' }"
          >
            {{ member.name }}
          </div>
          <div class="text-[11px] font-extrabold text-sand">{{ dexNumber(member.id) }}</div>
          <div v-if="member.trigger" class="mt-0.5 text-[10px] font-extrabold text-sand">
            {{ member.trigger }}
          </div>
        </button>
      </div>
    </template>
  </div>
</template>
