import { z } from 'zod'

const httpUrl = z
  .string()
  .trim()
  .refine((value) => {
    try {
      const { protocol } = new URL(value)
      return protocol === 'http:' || protocol === 'https:'
    } catch {
      return false
    }
  }, 'Enter a valid http(s) image URL.')

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'Display name is required.')
    .max(40, 'Display name must be at most 40 characters.'),
  avatarUrl: z.union([z.literal(''), httpUrl]),
})
