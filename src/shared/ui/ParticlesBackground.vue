<script setup lang="ts">
// Floating decorative dots, ported from the mockup's fixed particle field.
const PARTICLES = [
  { left: '5%', top: '18%', size: 16, color: 'rgba(95,191,87,.45)', duration: 6, delay: 0 },
  { left: '14%', top: '70%', size: 10, color: 'rgba(75,144,217,.4)', duration: 7.5, delay: 0.6 },
  { left: '26%', top: '34%', size: 22, color: 'rgba(240,128,60,.32)', duration: 9, delay: 1.1 },
  { left: '40%', top: '80%', size: 12, color: 'rgba(244,92,140,.4)', duration: 6.8, delay: 0.3 },
  { left: '52%', top: '12%', size: 18, color: 'rgba(240,198,60,.4)', duration: 8.2, delay: 1.6 },
  { left: '63%', top: '60%', size: 9, color: 'rgba(108,92,168,.4)', duration: 7, delay: 0.9 },
  { left: '74%', top: '26%', size: 20, color: 'rgba(75,144,217,.3)', duration: 9.4, delay: 0.2 },
  { left: '85%', top: '74%', size: 14, color: 'rgba(95,191,87,.38)', duration: 6.4, delay: 1.3 },
  { left: '92%', top: '40%', size: 11, color: 'rgba(240,128,60,.36)', duration: 8, delay: 0.5 },
  { left: '34%', top: '6%', size: 8, color: 'rgba(238,153,214,.45)', duration: 7.2, delay: 1.9 },
  { left: '8%', top: '48%', size: 13, color: 'rgba(240,198,60,.32)', duration: 8.6, delay: 0.8 },
  { left: '68%', top: '90%', size: 16, color: 'rgba(75,144,217,.34)', duration: 6.9, delay: 1.4 },
]
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    <div
      v-for="(particle, index) in PARTICLES"
      :key="index"
      class="absolute animate-drift rounded-full"
      :style="{
        left: particle.left,
        top: particle.top,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        background: particle.color,
        animationDuration: `${particle.duration}s`,
        animationDelay: `${particle.delay}s`,
      }"
    ></div>
  </div>
</template>
