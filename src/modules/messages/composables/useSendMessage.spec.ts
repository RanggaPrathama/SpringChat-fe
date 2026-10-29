import { describe, expect, it } from 'vitest'

import { MAX_MESSAGE_LENGTH, validateMessage } from './useSendMessage'

describe('validateMessage', () => {
  it('trims content', () => {
    expect(validateMessage('  hello  ')).toBe('hello')
  })

  it('rejects blank input', () => {
    expect(validateMessage('   \n ')).toBeNull()
  })

  it('rejects content over the limit but accepts exactly the limit', () => {
    expect(validateMessage('a'.repeat(MAX_MESSAGE_LENGTH))).not.toBeNull()
    expect(validateMessage('a'.repeat(MAX_MESSAGE_LENGTH + 1))).toBeNull()
  })
})
