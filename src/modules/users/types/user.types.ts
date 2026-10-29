export type ID = number

export interface User {
  id: ID
  username: string
  displayName: string
  avatarUrl: string | null
}

export interface UpdateProfileRequest {
  displayName?: string
  avatarUrl?: string | null
}
