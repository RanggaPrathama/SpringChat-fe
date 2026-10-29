import type { InfiniteData } from '@tanstack/vue-query'

import type { MessagePage } from '../types/message.types'

/**
 * Fold the freshly fetched newest page into cached infinite-query data.
 * Only the first page grows; older pages and their cursors stay untouched, so
 * polling never opens a gap between pages. Items stay newest-first.
 */
export function mergeLatest(
  old: InfiniteData<MessagePage, string | undefined>,
  latest: MessagePage,
): InfiniteData<MessagePage, string | undefined> {
  const [first, ...rest] = old.pages
  if (!first) return old

  const seen = new Set<number>()
  const items = [...latest.items, ...first.items]
    .filter((item) => (seen.has(item.id) ? false : (seen.add(item.id), true)))
    .sort((a, b) => b.id - a.id)

  const unchanged = items.length === first.items.length
  if (unchanged) return old

  return { ...old, pages: [{ ...first, items }, ...rest] }
}
