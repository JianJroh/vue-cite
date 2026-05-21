import type { PositionInfo } from 'vite-plugin-vue-tracer/client/listeners'

const HISTORY_KEY = 'vite-plugin-vue-cite:history'
const HISTORY_MAX = 50

export interface HistoryEntry {
  id: string
  text: string
  message: string
  tag: string
  filepath: string
  pos: PositionInfo
  timestamp: number
}

/** Fields a caller provides; the store stamps `id` and `timestamp` itself. */
export type NewEntry = Omit<HistoryEntry, 'id' | 'timestamp'>

export interface HistoryStore {
  /** Entries newest-first. */
  list: () => HistoryEntry[]
  /** Stamp id + timestamp, trim to max, persist; return the new (newest-first) list. */
  add: (entry: NewEntry) => HistoryEntry[]
  /** Drop the entry with this id; return the new list. */
  remove: (id: string) => HistoryEntry[]
  /** Drop everything; return the (empty) list. */
  clear: () => HistoryEntry[]
}

export interface HistoryStoreOptions {
  /** Where to persist. Defaults to localStorage; inject an in-memory fake in tests. */
  storage?: Pick<Storage, 'getItem' | 'setItem'>
  /** Maximum entries retained. Defaults to 50; pass a small value for cheap cap tests. */
  max?: number
}

export function createHistoryStore(options: HistoryStoreOptions = {}): HistoryStore {
  const { storage = localStorage, max = HISTORY_MAX } = options

  // On-disk format is an oldest-first array (unchanged from earlier versions), so
  // existing history survives. `list()` reverses a copy to present newest-first.
  let entries = read()

  function read(): HistoryEntry[] {
    try {
      const raw = storage.getItem(HISTORY_KEY)
      if (!raw)
        return []
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed))
        return []
      return parsed
    }
    catch {
      return []
    }
  }

  function write(): void {
    try {
      storage.setItem(HISTORY_KEY, JSON.stringify(entries))
    }
    catch {
      // ignore — storage may be disabled or full
    }
  }

  function list(): HistoryEntry[] {
    return entries.slice().reverse()
  }

  function add(entry: NewEntry): HistoryEntry[] {
    entries.push({
      ...entry,
      id: makeId(),
      timestamp: Date.now(),
    })
    if (entries.length > max)
      entries = entries.slice(-max)
    write()
    return list()
  }

  function remove(id: string): HistoryEntry[] {
    entries = entries.filter(en => en.id !== id)
    write()
    return list()
  }

  function clear(): HistoryEntry[] {
    entries = []
    write()
    return list()
  }

  return { list, add, remove, clear }
}

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
