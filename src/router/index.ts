import { createRouter, createWebHistory } from 'vue-router'
import PokedexGridView from '@/features/pokemon/presentation/views/PokedexGridView.vue'
import PokemonDetailView from '@/features/pokemon/presentation/views/PokemonDetailView.vue'
import CompareView from '@/features/compare/presentation/views/CompareView.vue'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'grid', component: PokedexGridView },
    { path: '/pokemon/:id', name: 'pokemon-detail', component: PokemonDetailView },
    { path: '/compare', name: 'compare', component: CompareView },
  ],
})
