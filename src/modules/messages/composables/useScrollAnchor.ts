import { nextTick, type Ref } from 'vue'

const NEAR_BOTTOM_PX = 120

export function useScrollAnchor(container: Ref<HTMLElement | null>) {
  let heightBeforePrepend = 0
  let topBeforePrepend = 0

  function isNearBottom(): boolean {
    const el = container.value
    if (!el) return true
    return el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX
  }

  async function scrollToBottom(smooth = false) {
    await nextTick()
    const el = container.value
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ top: el.scrollHeight, behavior: smooth && !reduce ? 'smooth' : 'auto' })
  }

  function captureBeforePrepend() {
    const el = container.value
    if (!el) return
    heightBeforePrepend = el.scrollHeight
    topBeforePrepend = el.scrollTop
  }

  async function restoreAfterPrepend() {
    await nextTick()
    const el = container.value
    if (!el) return
    el.scrollTop = topBeforePrepend + (el.scrollHeight - heightBeforePrepend)
  }

  return { isNearBottom, scrollToBottom, captureBeforePrepend, restoreAfterPrepend }
}
