export const queryKeys = {
  me: ['me'] as const,
  users: (search: string) => ['users', search] as const,
  conversations: ['conversations'] as const,
  conversation: (id: number) => ['conversation', id] as const,
  messages: (id: number) => ['messages', id] as const,
}
