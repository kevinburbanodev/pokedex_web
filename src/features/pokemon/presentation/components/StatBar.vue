<script setup lang="ts">
defineProps<{ label: string; value: number; percent: number; color: string }>()
</script>

<template>
  <div class="mb-3.25">
    <div class="mb-1.25 flex justify-between text-[13px] font-extrabold text-brown">
      <span>{{ label }}</span>
      <span class="text-ink">{{ value }}</span>
    </div>
    <div class="h-2.75 overflow-hidden rounded-md bg-cream">
      <div
        class="h-full rounded-md transition-[width] duration-900 ease-[cubic-bezier(.2,.8,.2,1)]"
        :style="{ width: `${percent}%`, background: color }"
      ></div>
    </div>
  </div>
</template>
