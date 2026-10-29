import { ref } from 'vue'

const STORAGE_KEY = 'springchat:recent-emojis'
const MAX_RECENT = 16

function read(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

export function pushRecent(list: string[], char: string): string[] {
  return [char, ...list.filter((item) => item !== char)].slice(0, MAX_RECENT)
}

// Per-viewer convenience only: storage can be blocked, so every access is guarded.
export function useRecentEmojis() {
  const recent = ref<string[]>(read())

  function add(char: string) {
    recent.value = pushRecent(recent.value, char)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.value))
    } catch {
      // ignore: recents just will not persist
    }
  }

  return { recent, add }
}
