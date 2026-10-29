import { describe, expect, it } from 'vitest'

import { groupSchema } from './group.schemas'

describe('groupSchema', () => {
  it('accepts a named group with at least two members', () => {
    expect(groupSchema.safeParse({ name: ' Hikers ', memberIds: [2, 3] }).success).toBe(true)
  })

  it('rejects blank names and too few members', () => {
    expect(groupSchema.safeParse({ name: '  ', memberIds: [2, 3] }).success).toBe(false)
    expect(groupSchema.safeParse({ name: 'x', memberIds: [2] }).success).toBe(false)
  })
})
