import { describe, expect, it } from 'vitest'

import { loginSchema, registerSchema, toFieldErrors } from './auth.schemas'

describe('loginSchema', () => {
  it('accepts a valid email and password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.co', password: 'secret' }).success).toBe(true)
  })

  it('reports per-field errors', () => {
    const result = loginSchema.safeParse({ email: 'nope', password: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = toFieldErrors<'email' | 'password'>(result.error)
      expect(errors.email).toBeTruthy()
      expect(errors.password).toBeTruthy()
    }
  })
})

describe('registerSchema', () => {
  const valid = { username: 'jane.doe', email: 'jane@example.com', password: 'longenough' }

  it('accepts valid input', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true)
  })

  it.each([
    ['short username', { ...valid, username: 'ab' }, 'username'],
    ['bad characters', { ...valid, username: 'bad name!' }, 'username'],
    ['long username', { ...valid, username: 'a'.repeat(25) }, 'username'],
    ['bad email', { ...valid, email: 'x' }, 'email'],
    ['short password', { ...valid, password: '1234567' }, 'password'],
  ])('rejects %s', (_name, input, field) => {
    const result = registerSchema.safeParse(input)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(toFieldErrors<string>(result.error)[field]).toBeTruthy()
    }
  })
})
