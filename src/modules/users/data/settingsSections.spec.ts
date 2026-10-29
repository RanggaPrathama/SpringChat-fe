import { describe, expect, it } from 'vitest'

import { filterSections, SETTINGS_SECTIONS } from './settingsSections'

describe('settings sections', () => {
  it('lists working sections first and marks the rest as soon', () => {
    const working = SETTINGS_SECTIONS.filter((section) => !section.soon).map(
      (section) => section.key,
    )
    expect(working).toEqual(['profile', 'account', 'about'])
    expect(SETTINGS_SECTIONS.filter((section) => section.soon)).toHaveLength(3)
  })

  it('has unique keys and route names', () => {
    expect(new Set(SETTINGS_SECTIONS.map((section) => section.key)).size).toBe(
      SETTINGS_SECTIONS.length,
    )
    expect(new Set(SETTINGS_SECTIONS.map((section) => section.routeName)).size).toBe(
      SETTINGS_SECTIONS.length,
    )
  })
})

describe('filterSections', () => {
  it('returns everything for a blank query', () => {
    expect(filterSections(SETTINGS_SECTIONS, '  ')).toHaveLength(SETTINGS_SECTIONS.length)
  })

  it('matches label and description, case-insensitive', () => {
    expect(filterSections(SETTINGS_SECTIONS, 'ACC').map((section) => section.key)).toEqual([
      'account',
    ])
    expect(filterSections(SETTINGS_SECTIONS, 'wallpaper').map((section) => section.key)).toEqual([
      'chat',
    ])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterSections(SETTINGS_SECTIONS, 'zzzz')).toEqual([])
  })
})
