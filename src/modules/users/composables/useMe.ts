import { useQuery } from '@tanstack/vue-query'

import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/modules/auth/store/auth.store'

import { usersService } from '../services/users.service'

export function useMe() {
  const authStore = useAuthStore()

  return useQuery({
    queryKey: queryKeys.me,
    queryFn: usersService.getMe,
    initialData: authStore.user ?? undefined,
    staleTime: 60_000,
  })
}
