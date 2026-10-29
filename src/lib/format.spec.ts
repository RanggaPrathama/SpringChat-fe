import { describe, expect, it } from 'vitest'

import { dayLabel } from './format'

describe('dayLabel', () => {
  const now = new Date('2026-10-09T12:00:00')

  it('labels today and yesterday', () => {
    expect(dayLabel('2026-10-09T08:00:00', now)).toBe('Today')
    expect(dayLabel('2026-10-08T23:00:00', now)).toBe('Yesterday')
  })

  it('uses a date for older days', () => {
    expect(dayLabel('2026-10-01T09:00:00', now)).toMatch(/Oct 1/)
  })
})
