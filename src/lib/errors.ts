import { AxiosError } from 'axios'

export type AppErrorKind =
  | 'validation'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'rate_limited'
  | 'server'
  | 'offline'
  | 'unknown'

export interface AppError {
  kind: AppErrorKind
  message: string
  status?: number
}

const STATUS_MAP: Record<number, AppErrorKind> = {
  400: 'validation',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not_found',
  409: 'conflict',
  422: 'validation',
  429: 'rate_limited',
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return { kind: 'offline', message: 'Network unavailable. Check your connection.' }
    }

    const status = error.response.status
    const kind = STATUS_MAP[status] ?? (status >= 500 ? 'server' : 'unknown')

    return {
      kind,
      status,
      message: error.response.data?.message ?? error.message,
    }
  }

  return { kind: 'unknown', message: 'Something went wrong. Please try again.' }
}
