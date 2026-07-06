<script setup lang="ts">
import ParticlesBackground from '@/shared/ui/ParticlesBackground.vue'
import AppHeader from '@/shared/layout/AppHeader.vue'
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden">
    <ParticlesBackground />
    <div class="relative z-1 mx-auto max-w-[1200px] px-5 pb-22.5">
      <AppHeader />
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
