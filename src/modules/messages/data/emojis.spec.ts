import { describe, expect, it } from 'vitest'

import { pushRecent } from '../composables/useRecentEmojis'
import { ALL_EMOJIS, EMOJI_CATEGORIES, searchEmojis } from './emojis'

describe('emoji data', () => {
  it('has no duplicate characters across categories', () => {
    const chars = ALL_EMOJIS.map((emoji) => emoji.char)
    expect(new Set(chars).size).toBe(chars.length)
  })

  it('every category has items and an icon', () => {
    for (const category of EMOJI_CATEGORIES) {
      expect(category.items.length).toBeGreaterThan(0)
      expect(category.icon).toBeTruthy()
    }
  })
})

describe('searchEmojis', () => {
  it('matches by keyword, all terms required', () => {
    expect(searchEmojis('heart').some((emoji) => emoji.char === '❤️')).toBe(true)
    expect(searchEmojis('red heart').map((emoji) => emoji.char)).toContain('❤️')
    expect(searchEmojis('red heart').map((emoji) => emoji.char)).not.toContain('💙')
  })

  it('returns nothing for blank or unknown queries', () => {
    expect(searchEmojis('   ')).toEqual([])
    expect(searchEmojis('zzzzqq')).toEqual([])
  })
})

describe('pushRecent', () => {
  it('moves a reused emoji to the front without duplicating', () => {
    expect(pushRecent(['😀', '❤️'], '❤️')).toEqual(['❤️', '😀'])
  })

  it('caps the list at 16', () => {
    const many = Array.from({ length: 20 }, (_, i) => String(i))
    expect(pushRecent(many, 'x')).toHaveLength(16)
  })
})
