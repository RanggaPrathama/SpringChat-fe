import { onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Keep one element exactly as tall as the *visible* viewport so a docked
 * composer is never hidden behind a mobile keyboard. Scoped to the element (not
 * :root) and rAF-throttled so scrolling elsewhere never pays for it.
 */
export function useVisualViewportHeight(target: Ref<HTMLElement | null>): void {
  let frame = 0

  function apply() {
    frame = 0
    const viewport = window.visualViewport
    const el = target.value
    if (!viewport || !el) return
    // Pinch-zoom also resizes the visual viewport; do not reflow the layout for that.
    if (viewport.scale !== 1) return
    el.style.height = `${viewport.height}px`
    if (viewport.offsetTop > 0) window.scrollTo(0, 0)
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(apply)
  }

  onMounted(() => {
    window.visualViewport?.addEventListener('resize', schedule)
    window.visualViewport?.addEventListener('scroll', schedule)
    apply()
  })

  onUnmounted(() => {
    window.visualViewport?.removeEventListener('resize', schedule)
    window.visualViewport?.removeEventListener('scroll', schedule)
    if (frame) cancelAnimationFrame(frame)
  })
}
