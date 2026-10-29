import { z } from 'zod'

export const MIN_GROUP_MEMBERS = 2

export const groupSchema = z.object({
  name: z.string().trim().min(1, 'Give your group a name.').max(50, 'Group name must be at most 50 characters.'),
  memberIds: z.array(z.number()).min(MIN_GROUP_MEMBERS, 'Pick at least 2 other people.'),
})
