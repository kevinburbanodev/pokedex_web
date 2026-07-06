<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 18 })
</script>

<template>
  <div
    class="animate-spin-slow rounded-full border-[3px] border-cream"
    style="border-top-color: var(--color-accent)"
    :style="{ width: `${size}px`, height: `${size}px` }"
  ></div>
</template>
