// Shared motion presets. Components import these instead of repeating numbers, so the
// feel stays consistent: snappy springs for "stickers", quick ease-out for text.
export const springPop = { type: 'spring', stiffness: 380, damping: 18 } as const

export const easeOutQuick = { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as const

export const fadeUpHidden = { opacity: 0, y: 28 } as const
export const fadeUpShown = { opacity: 1, y: 0 } as const

export const REVEAL_VIEWPORT = { once: true, amount: 0.25 } as const

/** Staggered delay for the n-th item of a group (seconds). */
export function stagger(index: number, step = 0.08, base = 0): number {
  return base + index * step
}
