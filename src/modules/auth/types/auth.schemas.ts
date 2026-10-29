import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
})

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(24, 'Username must be at most 24 characters.')
    .regex(/^[a-zA-Z0-9._]+$/, 'Use letters, numbers, dots and underscores only.'),
  email: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

export type FieldErrors<T extends string> = Partial<Record<T, string>>

export function toFieldErrors<T extends string>(error: z.ZodError): FieldErrors<T> {
  const flat = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>
  const result: Record<string, string> = {}
  for (const [key, messages] of Object.entries(flat)) {
    if (messages?.[0]) result[key] = messages[0]
  }
  return result as FieldErrors<T>
}
