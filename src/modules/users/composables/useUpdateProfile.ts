import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/modules/auth/store/auth.store'

import { usersService } from '../services/users.service'
import type { UpdateProfileRequest } from '../types/user.types'

export function useUpdateProfile() {
  const authStore = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdateProfileRequest) => usersService.updateMe(request),
    onSuccess: (user) => {
      authStore.setUser(user)
      queryClient.setQueryData(queryKeys.me, user)
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations })
    },
  })
}
