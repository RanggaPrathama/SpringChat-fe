import { AxiosError, type AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'

import { authErrorMessage } from './useAuth'

function httpError(status: number) {
  return new AxiosError('failed', 'ERR_BAD_REQUEST', undefined, undefined, { status, data: {} } as AxiosResponse)
}

describe('authErrorMessage', () => {
  it('uses a neutral message for 401 without revealing which credential failed', () => {
    const message = authErrorMessage(httpError(401), 'login')
    expect(message).toBe('Email or password is incorrect.')
  })

  it('explains duplicate accounts on 409', () => {
    expect(authErrorMessage(httpError(409), 'register')).toMatch(/already exists/i)
  })

  it('reports offline when there is no response', () => {
    const error = new AxiosError('Network Error', 'ERR_NETWORK')
    expect(authErrorMessage(error, 'login')).toMatch(/network/i)
  })

  it('falls back to a generic message', () => {
    expect(authErrorMessage(new Error('boom'), 'register')).toMatch(/could not create your account/i)
  })
})
