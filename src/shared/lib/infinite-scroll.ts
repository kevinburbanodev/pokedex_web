import { onMounted, onUnmounted } from 'vue'

/** Calls `onNearBottom` while scrolling once the viewport gets within
 * `thresholdPx` of the document's end — drives the catalog's infinite scroll. */
export function useInfiniteScroll(onNearBottom: () => void, thresholdPx = 520) {
  function handleScroll() {
    const el = document.documentElement
    if (el.scrollTop + window.innerHeight >= el.scrollHeight - thresholdPx) {
      onNearBottom()
    }
  }

  onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
}
