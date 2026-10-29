import { describe, expect, it } from 'vitest'

import { profileSchema } from './user.schemas'

describe('profileSchema', () => {
  it('accepts a name with an empty or http(s) avatar', () => {
    expect(profileSchema.safeParse({ displayName: 'Jo', avatarUrl: '' }).success).toBe(true)
    expect(
      profileSchema.safeParse({ displayName: 'Jo', avatarUrl: 'https://x.test/a.png' }).success,
    ).toBe(true)
  })

  it('rejects empty names, long names and non-http avatar URLs', () => {
    expect(profileSchema.safeParse({ displayName: ' ', avatarUrl: '' }).success).toBe(false)
    expect(profileSchema.safeParse({ displayName: 'a'.repeat(41), avatarUrl: '' }).success).toBe(
      false,
    )
    expect(
      profileSchema.safeParse({ displayName: 'Jo', avatarUrl: 'javascript:alert(1)' }).success,
    ).toBe(false)
  })
})
